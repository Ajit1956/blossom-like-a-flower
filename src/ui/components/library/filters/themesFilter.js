const EXCLUDED_RICHES_IDS = ['513', '552', '772'];

export function filterThemes(database, exploreView) {
  if (!database) return [];

  if (exploreView === 'divine_being') {
    const aspectsList = database.filter(f => {
      const lowerName = (f.mothers_name || '').toLowerCase();
      const fid = String(f.id).padStart(3, '0');
      return fid === '001' || fid === '002' || fid === '005' || fid === '010' || fid === '014' || fid === '581' ||
             lowerName.includes("sri aurobindo's compassion") ||
             lowerName.includes("eternal smile") ||
             lowerName === 'presence' ||
             lowerName.startsWith('divine') ||
             lowerName.includes('unmanifest divine love');
    });

    return aspectsList.sort((a, b) => {
      const getPriority = (flower) => {
        const fid = String(flower.id).padStart(3, '0');
        const name = (flower.mothers_name || '').toLowerCase();
        if (fid === '001' || name.startsWith('aditi')) return 1;
        if (fid === '002' || name.startsWith('avatar')) return 2;
        if (fid === '014' || name.includes("sri aurobindo's compassion")) return 3;
        if (fid === '581' || name.includes("eternal smile")) return 4;
        return 10;
      };
      const pA = getPriority(a);
      const pB = getPriority(b);
      if (pA !== pB) return pA - pB;
      return (a.mothers_name || '').localeCompare(b.mothers_name || '');
    });
  }

  if (exploreView === 'auroville') {
    return database.filter(f => {
      const full = [
        f.mothers_name,
        f.spiritual_name,
        f.significance,
        f.mothers_significance,
        f.common_names,
        f.quotes
      ].join(' ').toLowerCase();
      return full.includes('auroville');
    }).sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  }

  if (exploreView === 'joy') {
    const matches = database.filter(f => {
      const name = (f.mothers_name || '').toLowerCase();
      return name.includes('joy') || name.includes('cheerful') || name.includes('glad');
    });
    return sortPrefixFirst(matches, ['joy']);
  }

  if (exploreView === 'beauty') {
    const matches = database.filter(f => (f.mothers_name || '').toLowerCase().includes('beauty'));
    return sortPrefixFirst(matches, ['beauty']);
  }

  if (exploreView === 'love') {
    const matches = database.filter(f => (f.mothers_name || '').toLowerCase().includes('love'));
    return sortPrefixFirst(matches, ['love']);
  }

  if (exploreView === 'riches') {
    return database.filter(f => {
      const fid = String(f.id);
      if (EXCLUDED_RICHES_IDS.includes(fid)) return false;
      const name = (f.mothers_name || '').toLowerCase();
      return name.includes('riches') || name.includes('wealth') || name.includes('abundance') || name.includes('prosperity') || name.includes('fortune');
    }).sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  }

  return [];
}

function sortPrefixFirst(list, prefixes) {
  const pList = (Array.isArray(prefixes) ? prefixes : [prefixes]).map(p => p.trim().toLowerCase());
  return [...list].sort((a, b) => {
    const nameA = (a.mothers_name || a.spiritual_name || a.common_name || a.name || '').trim();
    const nameB = (b.mothers_name || b.spiritual_name || b.common_name || b.name || '').trim();
    const lowA = nameA.toLowerCase();
    const lowB = nameB.toLowerCase();
    const aStarts = pList.some(p => lowA.startsWith(p));
    const bStarts = pList.some(p => lowB.startsWith(p));
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return nameA.localeCompare(nameB);
  });
}
