export const formatFlowerName = (text) => {
  if (!text) return '';
  return text
    .replace(/\bsupramentalised\b/gi, 'Supramentalised')
    .replace(/\bsupramental\b/gi, 'Supramental')
    .replace(/\bsupermind\b/gi, 'Supermind')
    .replace(/\bspiritualised\b/gi, 'Spiritualised')
    .replace(/\bspirituality\b/gi, 'Spirituality')
    .replace(/\bspiritual\b/gi, 'Spiritual')
    .replace(/\bpsychic\b/gi, 'Psychic');
};

export const balanceText = (text, maxLineChars = 28) => {
  if (!text) return '';
  const formatted = formatFlowerName(text);
  const words = formatted.trim().split(/\s+/);
  // If the title is short enough to fit on a single line or has <= 2 words, keep it on 1 line!
  if (formatted.length <= maxLineChars || words.length <= 2) {
    return formatted;
  }

  // Calculate minimum lines needed so no line exceeds maxLineChars
  const minLines = Math.max(1, Math.ceil(formatted.length / maxLineChars));

  let bestPartition = null;
  let bestScore = Infinity;

  const evaluatePartition = (lines) => {
    // Check if any line exceeds maxLineChars
    const hasOverflow = lines.some(l => l.length > maxLineChars);
    if (hasOverflow) return Infinity;

    // Prefer fewer lines if they fit comfortably
    const lineCountPenalty = lines.length * 30;

    // Penalize hanging single words (orphans) if there are enough words
    let orphanPenalty = 0;
    if (words.length >= 3) {
      lines.forEach((l) => {
        const wCount = l.split(/\s+/).length;
        if (wCount === 1 && l.length < 10) {
          // If a single word is short (e.g. "world", "divine", "mind", "vital")
          orphanPenalty += 1000;
        }
      });
    }

    // Variance between line lengths (encourage equal line lengths)
    const lengths = lines.map(l => l.length);
    const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((acc, l) => acc + Math.pow(l - avgLen, 2), 0);

    return variance + orphanPenalty + lineCountPenalty;
  };

  const findPartitions = (wordIdx, currentLines, targetLines) => {
    if (targetLines === 1) {
      const line = words.slice(wordIdx).join(' ');
      const allLines = [...currentLines, line];
      const score = evaluatePartition(allLines);
      if (score < bestScore) {
        bestScore = score;
        bestPartition = allLines;
      }
      return;
    }

    for (let nextIdx = wordIdx + 1; nextIdx <= words.length - targetLines + 1; nextIdx++) {
      const line = words.slice(wordIdx, nextIdx).join(' ');
      findPartitions(nextIdx, [...currentLines, line], targetLines - 1);
    }
  };

  for (let testN = Math.max(2, minLines); testN <= Math.min(words.length, Math.max(2, minLines) + 1); testN++) {
    findPartitions(0, [], testN);
  }

  return bestPartition ? bestPartition.join('\n') : formatted;
};

