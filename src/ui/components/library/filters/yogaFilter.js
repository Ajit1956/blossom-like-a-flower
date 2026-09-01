export function filterYoga(database, exploreView, selectedQuality) {
  if (!database || !selectedQuality) return [];

  const sq = (selectedQuality || '').toLowerCase();

  if (exploreView === 'relation_to_divine') {
    return database.filter(f => {
      const fullString = (f.mothers_name || f.spiritual_name || f.common_name || f.name || '').toLowerCase();
      const fid = String(f.id).padStart(3, '0');
      const fidClean = String(f.id).replace(/^0+/, '');
      if (sq === 'love for the divine') {
        return (fullString.includes('love') && (fullString.includes('divine') || fullString.includes('psychic'))) || fid === '089' || fid === '093';
      }
      if (sq === 'humility in the love for the divine' || sq === 'humility') {
        return fullString.includes('humility') || fid === '093';
      }
      if (sq === 'joy of union with the divine' || sq === 'joy of union') {
        return fullString.includes('joy of union') || fid === '142' || fidClean === '142';
      }
      return fullString.includes(sq);
    }).sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  }

  // exploreView === 'union_with_divine' || exploreView === 'yoga'
  return database.filter(f => {
    const fullString = (f.mothers_name || f.spiritual_name || f.common_name || f.name || '').toLowerCase();
    const fid = String(f.id).padStart(3, '0');
    const fidClean = String(f.id).replace(/^0+/, '');
    if (sq === 'aspiration') {
      return fullString.includes('aspiration') || fullString.includes('aspire');
    }
    if (sq === 'rejection') {
      return fullString.includes('reject') || fullString.includes('renunc');
    }
    if (sq === 'surrender') {
      return fullString.includes('surrender') || fid === '160' || fid === '171' || fidClean === '160' || fidClean === '171';
    }
    if (sq.includes('remembrance of sri aurobindo')) {
      return fid === '160' || fidClean === '160' || fullString.includes('remembrance of sri aurobindo');
    }
    if (sq.includes("opening to sri aurobindo's force") || sq.includes("opening to sri aurobindo")) {
      return fid === '171' || fidClean === '171' || fullString.includes("opening to sri aurobindo");
    }
    if (sq === 'entire self-giving') {
      return fullString.includes('entire self-giving');
    }
    return fullString.includes(sq);
  }).sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
}
