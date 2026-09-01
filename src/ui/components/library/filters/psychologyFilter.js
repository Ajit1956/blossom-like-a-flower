export function filterPsychology(database, exploreView, selectedQuality) {
  if (!database || !selectedQuality) return [];

  const sq = selectedQuality.toLowerCase();

  if (exploreView === 'parts_of_being' || exploreView === 'human_being') {
    const filtered = database.filter(f => {
      const fullString = (f.mothers_name || f.spiritual_name || f.common_name || f.name || '').toLowerCase();
      const sig = (f.mothers_significance || '').toLowerCase();
      const words = fullString.split(/[^a-z0-9]+/).filter(Boolean);

      if (selectedQuality === 'Centers' || selectedQuality === 'Center' || selectedQuality === 'Chakras') {
        return fullString.includes('centre') || fullString.includes('center') || fullString.includes('chakra') ||
               sig.includes('centre') || sig.includes('center') || sig.includes('chakra');
      } else if (selectedQuality === 'Mental') {
        const hasMental = words.some(w => w === 'mental' || w === 'mentalised');
        const isSupramentalOnly = words.some(w => w.startsWith('supramental')) && !words.some(w => w === 'mental');
        return hasMental && !isSupramentalOnly;
      } else if (selectedQuality === 'Vital') {
        return words.some(w => w.startsWith('vital'));
      } else if (selectedQuality === 'Physical' || selectedQuality === 'Body') {
        return words.some(w => w.startsWith('physical')) || words.some(w => w.startsWith('body'));
      } else if (selectedQuality === 'The Psychic' || selectedQuality === 'Psychic') {
        return words.some(w => w.startsWith('psychic'));
      } else {
        return fullString.includes(sq);
      }
    });

    if (selectedQuality === 'The Psychic' || selectedQuality === 'Psychic') {
      return sortPrefixFirst(filtered, ['psychic', 'the psychic']);
    }
    if (selectedQuality === 'Mental') {
      return sortPrefixFirst(filtered, ['mental']);
    }
    if (selectedQuality === 'Vital') {
      return sortPrefixFirst(filtered, ['vital']);
    }
    if (selectedQuality === 'Physical' || selectedQuality === 'Body') {
      return sortPrefixFirst(filtered, ['physical']);
    }

    return filtered.sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  }

  // exploreView === 'human_psychology' | 'psychology' | 'positive_attributes'
  return database.filter(f => {
    const fullString = (f.mothers_name || f.spiritual_name || f.common_name || f.name || '').toLowerCase();
    if (sq === 'calm') return fullString.includes('calm') || fullString.includes('quiet');
    if (sq === 'gladness') return fullString.includes('glad');
    if (sq === 'creativity') return fullString.includes('creat');
    if (sq === 'concentration') return fullString.includes('concentration');
    if (sq === 'never tell a lie') return fullString.includes('never tell a lie') || fullString.includes('lie');
    if (sq === 'psychological perfection') return fullString.includes('psychological perfection') || fullString.includes('radiating psychology');
    return fullString.includes(sq);
  }).sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
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
