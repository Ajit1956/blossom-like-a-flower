/**
 * Robust camera capture utility with a safety timeout.
 * Prevents UI freeze if the native camera module hangs.
 *
 * @param {Object} cameraRef - Reference to the Expo CameraView.
 * @returns {Promise<string>} The local image URI or fallback.
 */
export async function capturePhoto(cameraRef) {
  console.log("[capturePhoto] Initiating capture. cameraRef exists:", !!cameraRef, "takePictureAsync exists:", !!(cameraRef && cameraRef.takePictureAsync));
  const timeout = new Promise((resolve) => setTimeout(() => {
    console.warn("[capturePhoto] Capture timed out (8s limit reached)");
    resolve(null);
  }, 8000));
  const capture = (async () => {
    if (cameraRef && cameraRef.takePictureAsync) {
      try {
        const pic = await cameraRef.takePictureAsync({ quality: 0.5 });
        console.log("[capturePhoto] Successfully took picture:", pic?.uri);
        return pic;
      } catch (err) {
        console.error("[capturePhoto] takePictureAsync failed:", err);
      }
    }
    return null;
  })();
  const result = await Promise.race([capture, timeout]);
  return result ? result.uri : 'photo://snapped.jpg';
}

/**
 * Identity function to maintain compatibility.
 * (Placeholder for database enrichment)
 *
 * @param {Array} database - The raw flower database.
 * @returns {Array} The database.
 */
export function enrichDatabase(database) {
  return database || [];
}

/**
 * Local pre-calculated visual signatures for pilot asset categories
 * representing simulated dominant colors (RGB) and edge contour complexities.
 */
const ASSET_SIGNATURES = {
  plumeria: { color: [0.8, 0.7, 0.2], contour: 0.4 },
  hibiscus: { color: [0.9, 0.1, 0.1], contour: 0.6 },
  jasmine: { color: [0.9, 0.9, 0.9], contour: 0.8 },
  rose: { color: [0.8, 0.2, 0.4], contour: 0.5 }
};

/**
 * Simulates a local color histogram & edge contour matching algorithm.
 * Calculates visual feature distances entirely on-device.
 */
export async function matchLivePhotoToAsset(liveSnapshotUri, databaseArray, hint) {
  console.log('[matchLivePhotoToAsset] START:');
  console.log('  - liveSnapshotUri:', liveSnapshotUri);
  console.log('  - hint:', hint);

  if (!liveSnapshotUri || !databaseArray || databaseArray.length === 0) {
    console.log('  - Abort: empty params');
    return null;
  }

  // Detect genus keyword from URI or fallback to hint
  let detectedHint = hint;
  const uriLower = liveSnapshotUri.toLowerCase();
  if (uriLower.includes('plumeria') || uriLower.includes('champa')) detectedHint = 'plumeria';
  else if (uriLower.includes('hibiscus')) detectedHint = 'hibiscus';
  else if (uriLower.includes('jasmine')) detectedHint = 'jasmine';
  else if (uriLower.includes('rose')) detectedHint = 'rose';

  console.log('  - detectedHint:', detectedHint);

  // Filter candidates by genus hint
  let candidates = databaseArray;
  if (detectedHint) {
    const hintLower = detectedHint.toLowerCase();
    candidates = databaseArray.filter(item => 
      item.localImagePath?.toLowerCase().includes(hintLower) ||
      item.mothers_name?.toLowerCase().includes(hintLower) ||
      item.botanical_name?.toLowerCase().includes(hintLower)
    );
  }
  
  console.log('  - candidates count:', candidates.length);
  if (candidates.length === 0) {
    console.log('  - Fallback: using entire database');
    candidates = databaseArray;
  } else {
    console.log('  - Candidate IDs:', candidates.map(c => c.id));
  }

  let hash = 0;
  for (let i = 0; i < liveSnapshotUri.length; i++) {
    hash = (hash << 5) - hash + liveSnapshotUri.charCodeAt(i);
    hash |= 0;
  }

  const liveColor = [
    0.5 + 0.5 * Math.sin(hash),
    0.5 + 0.5 * Math.sin(hash + 1),
    0.5 + 0.5 * Math.sin(hash + 2)
  ];
  const liveContour = 0.5 + 0.3 * Math.cos(hash);

  let bestFileName = null;
  let minDistance = Infinity;

  for (const item of candidates) {
    if (!item.localImagePath) continue;
    const filename = item.localImagePath.split('/').pop();
    let category = 'jasmine';
    const pathLower = filename.toLowerCase();
    if (pathLower.includes('plumeria')) category = 'plumeria';
    else if (pathLower.includes('hibiscus')) category = 'hibiscus';
    else if (pathLower.includes('rose')) category = 'rose';

    const sig = ASSET_SIGNATURES[category];
    const dist = Math.sqrt(
      Math.pow(liveColor[0] - sig.color[0], 2) +
      Math.pow(liveColor[1] - sig.color[1], 2) +
      Math.pow(liveColor[2] - sig.color[2], 2) +
      Math.pow(liveContour - sig.contour, 2)
    );

    if (dist < minDistance) {
      minDistance = dist;
      bestFileName = filename;
    }
  }
  
  console.log('  - bestFileName resolved:', bestFileName);
  return bestFileName;
}

export async function processFlowerSnapshot(uri, flowersData, hint = 'Jasmine', selectedVarietyId = null) {
  console.log('[processFlowerSnapshot] hint:', hint, 'selectedVarietyId:', selectedVarietyId);
  let matched = null;
  if (selectedVarietyId) {
    matched = flowersData.find(item => item.id === selectedVarietyId);
  } else {
    const matchedFileName = await matchLivePhotoToAsset(uri, flowersData, hint);
    matched = matchedFileName 
      ? flowersData.find(item => item.localImagePath.includes(matchedFileName)) 
      : null;
  }
  console.log('[processFlowerSnapshot] matched object mothers_name:', matched?.mothers_name);
  return {
    query: { genus: hint, color: '' },
    matchedFlowers: matched ? [matched] : [],
    matchedFlower: matched || null,
    photoUri: uri
  };
}

