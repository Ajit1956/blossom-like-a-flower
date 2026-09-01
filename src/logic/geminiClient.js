import { Platform } from 'react-native';
import { referenceImageBase64 } from './referenceImage.js';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { API_BASE_URL } from '../config/api.js';

const API_URL = API_BASE_URL;
const BACKEND_URL = `${API_URL}/api/vertex`;

/**
 * Converts a data: or blob: URI to a Web Blob object safely across all browsers.
 */
async function uriToBlob(uri) {
  if (!uri) throw new Error('Empty URI provided');
  
  if (uri.startsWith('data:')) {
    const parts = uri.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const response = await fetch(uri);
  return await response.blob();
}

export async function fetchEmbeddingFromVertexAI(imageUri, hint) {
  console.log(`[Vertex AI] Forwarding image payload to backend route: ${BACKEND_URL}`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout

    let targetUri = imageUri;
    
    // Attempt resizing/compressing image if manipulator is supported
    try {
      console.log(`[Vertex AI] Resizing image for optimal upload speed...`);
      const manipulatedImage = await manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }],
        { compress: 0.8, format: SaveFormat.JPEG }
      );
      if (manipulatedImage && manipulatedImage.uri) {
        targetUri = manipulatedImage.uri;
      }
    } catch (manipErr) {
      console.warn(`[Vertex AI] Image manipulator fallback:`, manipErr.message);
    }

    const formData = new FormData();

    if (Platform.OS === 'web') {
      console.log(`[Vertex AI Web] Converting URI to binary Blob...`);
      const blob = await uriToBlob(targetUri);
      formData.append('image', blob, 'flower.jpg');
    } else {
      console.log(`[Vertex AI Native] Appending native FormData object...`);
      formData.append('image', {
        uri: targetUri,
        name: 'flower.jpg',
        type: 'image/jpeg'
      });
    }

    console.log(`[Vertex AI] Sending POST request to Cloud Run backend...`);
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error(`[Vertex AI] Backend returned status ${response.status}: ${errText}`);
      return null;
    }

    const data = await response.json();
    console.log(`[Vertex AI] Cloud Run response received successfully:`, data);
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error(`[Vertex AI] Request timed out after 60 seconds.`);
    } else {
      console.error(`[Vertex AI] Error hitting Cloud Run backend:`, err.message || err);
    }
    return null;
  }
}
