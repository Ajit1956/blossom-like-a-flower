
export function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;
  const distance = levenshteinDistance(longer, shorter);
  return (longerLength - distance) / parseFloat(longerLength);
}

/**
 * Extracts unique word vocabulary for the given search mode
 */
export function getVocabulary(database = [], mode = 'mothers') {
  const vocab = new Set();
  database.forEach(f => {
    let text = '';
    if (mode === 'mothers' || mode === 'keyword') {
      text = (f.mothers_name || f.spiritual_name || f.name || '');
    } else {
      const raw = f.common_names || f.common_name || [];
      text = Array.isArray(raw) ? raw.join(' ') : String(raw);
    }
    const words = text.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 1);
    words.forEach(w => vocab.add(w));
  });
  return Array.from(vocab);
}

/**
 * Corrects misspelled query words against vocabulary ONLY when no direct matches exist
 */
export function getCorrectedQueryWords(rawWords = [], database = [], mode = 'mothers') {
  const vocabList = getVocabulary(database, mode);

  const hasDirectMatches = (w) => {
    if (mode === 'mothers' || mode === 'keyword') {
      return database.some(f => {
        const name = (f.mothers_name || f.spiritual_name || f.name || '').toLowerCase();
        return name.includes(w);
      });
    } else {
      return database.some(f => {
        const raw = f.common_names || f.common_name || [];
        const t = Array.isArray(raw) ? raw.join(' ').toLowerCase() : String(raw).toLowerCase();
        return t.includes(w);
      });
    }
  };

  return rawWords.map(qw => {
    // If the word already exists directly as a substring or prefix, keep it strictly as-is
    if (hasDirectMatches(qw)) {
      return qw;
    }
    // If it has 0 direct matches, find the closest typo correction in vocabulary
    const maxAllowed = qw.length <= 4 ? 1 : qw.length <= 7 ? 2 : 3;
    let best = qw;
    let minD = Infinity;
    for (const v of vocabList) {
      const dist = levenshteinDistance(qw, v);
      if (dist < minD && dist <= maxAllowed) {
        minD = dist;
        best = v;
      }
    }
    return best;
  });
}

export function scoreFlower(flower, qWords, rawQuery, mode = 'mothers') {
  if (!flower || !qWords || qWords.length === 0) return 0;
  const q = rawQuery.trim().toLowerCase();

  let targetText = '';
  let primaryName = '';

  if (mode === 'mothers' || mode === 'keyword') {
    targetText = (flower.mothers_name || flower.spiritual_name || flower.name || '').toLowerCase();
    primaryName = targetText;
  } else {
    const raw = flower.common_names || flower.common_name || [];
    const list = (Array.isArray(raw) ? raw : String(raw).split(';')).map(c => String(c).trim().toLowerCase()).filter(Boolean);
    targetText = list.join(' ');
    primaryName = list.length > 0 ? list[0] : '';
  }

  if (!targetText) return 0;

  const targetWords = targetText.split(/[^a-z0-9]+/).filter(w => w.length > 0);

  // All query words must match as whole word or word prefix (e.g. 'mental' matches 'mental'/'mentalised', but not 'supramental')
  const allMatch = qWords.every(qw => {
    return targetWords.some(tw => tw === qw || tw.startsWith(qw));
  });

  if (!allMatch) return 0;

  let score = 50;
  if (primaryName === q || targetText === q) score += 200;
  else if (primaryName.startsWith(q) || targetText.startsWith(q)) score += 150;
  else if (targetText.includes(q)) score += 100;

  return score;
}

export function matchFlowerKeyword(flower, searchQuery) {
  const rawWords = (searchQuery || '').trim().toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return scoreFlower(flower, rawWords, searchQuery, 'mothers') > 0;
}

export function filterFlowers(searchQuery, mode = 'mothers', database = []) {
  if (!searchQuery || !searchQuery.trim() || !Array.isArray(database) || database.length === 0) {
    return [];
  }
  
  const q = searchQuery.trim().toLowerCase();
  const rawWords = q.split(/[^a-z0-9]+/).filter(w => w.length > 0);
  if (rawWords.length === 0) return [];

  const qWords = getCorrectedQueryWords(rawWords, database, mode);
  
  const scored = database
    .map(f => ({ flower: f, score: scoreFlower(f, qWords, q, mode) }))
    .filter(item => item.score > 0)
    .sort((a, b) => {
      if (mode === 'common') {
        const rawA = Array.isArray(a.flower.common_names) ? a.flower.common_names[0] : (a.flower.common_names || '');
        const rawB = Array.isArray(b.flower.common_names) ? b.flower.common_names[0] : (b.flower.common_names || '');
        return b.score - a.score || String(rawA).localeCompare(String(rawB));
      }
      return b.score - a.score || (a.flower.mothers_name || '').localeCompare(b.flower.mothers_name || '');
    });

  return scored.map(item => item.flower);
}

export function filterFlowersById(query, database = []) {
  if (!query || !query.trim() || !Array.isArray(database) || database.length === 0) {
    return [];
  }
  const q = query.trim();
  const num = parseInt(q, 10);
  const padded = isNaN(num) ? q : String(num).padStart(3, '0');

  return database.filter(f => {
    const fIdPadded = String(f.id).padStart(3, '0');
    const fIdRaw = String(f.id);
    return fIdPadded.startsWith(q) || fIdPadded.includes(q) || fIdRaw === q || fIdPadded === padded;
  }).sort((a, b) => {
    const aPadded = String(a.id).padStart(3, '0');
    const bPadded = String(b.id).padStart(3, '0');
    if (aPadded === q || aPadded === padded) return -1;
    if (bPadded === q || bPadded === padded) return 1;
    if (aPadded.startsWith(q) && !bPadded.startsWith(q)) return -1;
    if (!aPadded.startsWith(q) && bPadded.startsWith(q)) return 1;
    const numA = parseInt(a.id, 10) || 0;
    const numB = parseInt(b.id, 10) || 0;
    return numA - numB;
  });
}
