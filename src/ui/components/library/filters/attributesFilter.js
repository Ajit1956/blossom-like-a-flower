import localFlowerData from '../../../../../assets/data/flower_data.json';

export function filterAttributes(database, selectedQuality, flowerScope, commonFlowerIdsSet) {
  if (!database || !selectedQuality) return [];

  const sq = selectedQuality.toLowerCase();
  let attrMatches = [];

  // Color filters matching ground-truth primary_color from flower_observation_attributes.csv
  const primaryMatches = database.filter(f => {
    const fid = String(f.id || '').padStart(3, '0');
    const localMatch = (localFlowerData || []).find(lm => String(lm.id || '').padStart(3, '0') === fid);
    const pColor = (f.primary_color || (localMatch ? localMatch.primary_color : '')).trim().toLowerCase();
    return pColor === sq;
  });

  if (primaryMatches.length > 0) {
    attrMatches = primaryMatches.sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  } else if (['fragrant', 'highly fragrant', 'lightly fragrant', 'faintly fragrant', 'not fragrant', 'not recorded'].includes(sq)) {
    attrMatches = database.filter(f => {
      const fid = String(f.id || '').padStart(3, '0');
      const localMatch = (localFlowerData || []).find(lm => String(lm.id || '').padStart(3, '0') === fid);
      const frag = (f.fragrance || (localMatch ? localMatch.fragrance : '') || '').trim().toLowerCase();
      return frag === sq;
    }).sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  } else if (sq === 'tree') {
    attrMatches = database.filter(f => (f.plant_type || '').toLowerCase() === 'tree').sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  } else if (sq === 'small tree') {
    attrMatches = database.filter(f => (f.plant_type || '').toLowerCase() === 'small tree').sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  } else if (sq === 'shrub / small tree') {
    attrMatches = database.filter(f => (f.plant_type || '').toLowerCase() === 'shrub / small tree').sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  } else if (sq === 'shrub') {
    attrMatches = database.filter(f => (f.plant_type || '').toLowerCase() === 'shrub').sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  } else if (sq === 'herb') {
    attrMatches = database.filter(f => (f.plant_type || '').toLowerCase() === 'herb').sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  } else if (sq.includes('vine') || sq.includes('climber')) {
    attrMatches = database.filter(f => {
      const pt = (f.plant_type || '').toLowerCase();
      return pt === 'vine / climber' || pt.includes('vine') || pt.includes('climber');
    }).sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  } else if (sq === 'aquatic') {
    attrMatches = database.filter(f => (f.plant_type || '').toLowerCase() === 'aquatic').sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  } else if (sq === 'succulent') {
    attrMatches = database.filter(f => (f.plant_type || '').toLowerCase() === 'succulent').sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  } else if (sq === 'epiphyte') {
    attrMatches = database.filter(f => (f.plant_type || '').toLowerCase() === 'epiphyte').sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  } else if (sq.includes('grass')) {
    attrMatches = database.filter(f => {
      const pt = (f.plant_type || '').toLowerCase();
      return pt.includes('grass');
    }).sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  } else {
    attrMatches = database.filter(f => {
      const fid = String(f.id || '').padStart(3, '0');
      const localMatch = (localFlowerData || []).find(lm => String(lm.id || '').padStart(3, '0') === fid);
      const rawFs = (f.flowering_season || (localMatch ? localMatch.flowering_season : '') || '').toLowerCase();
      const fsAbbr = rawFs
        .replace(/\bjanuary\b/g, 'jan')
        .replace(/\bfebruary\b/g, 'feb')
        .replace(/\bmarch\b/g, 'mar')
        .replace(/\bapril\b/g, 'apr')
        .replace(/\bmay\b/g, 'may')
        .replace(/\bjune\b/g, 'jun')
        .replace(/\bjuly\b/g, 'jul')
        .replace(/\baugust\b/g, 'aug')
        .replace(/\bseptember\b/g, 'sep')
        .replace(/\boctober\b/g, 'oct')
        .replace(/\bnovember\b/g, 'nov')
        .replace(/\bdecember\b/g, 'dec');
      const bt = (f.bloom_time || (localMatch ? localMatch.bloom_time : '') || '').toLowerCase();
      const name = ((f.mothers_name || '') + ' ' + (f.spiritual_name || '') + ' ' + (f.common_name || '') + ' ' + (f.name || '')).toLowerCase();
      return rawFs.includes(sq) || fsAbbr.includes(sq) || bt.includes(sq) || name.includes(sq);
    }).sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  }

  if (flowerScope === 'common') {
    attrMatches = attrMatches.filter(f => {
      const fid = String(f.id);
      const fid3 = fid.padStart(3, '0');
      const fidClean = fid.replace(/^0+/, '');
      return commonFlowerIdsSet.has(fid) || commonFlowerIdsSet.has(fid3) || commonFlowerIdsSet.has(fidClean);
    });
  }

  return attrMatches;
}

export function filterMultiAttributes(database, filters = {}, flowerScope = 'all', commonFlowerIdsSet = null) {
  if (!database || !Array.isArray(database)) return [];

  let results = database;

  // Filter for Common Flowers scope (225 set)
  if (flowerScope === 'common' && commonFlowerIdsSet) {
    results = results.filter(f => {
      const fid = String(f.id || '');
      const fid3 = fid.padStart(3, '0');
      const fidClean = fid.replace(/^0+/, '');
      return commonFlowerIdsSet.has(fid) || commonFlowerIdsSet.has(fid3) || commonFlowerIdsSet.has(fidClean);
    });
  }

  const { plantType, color, fragrance, season, bloomTime } = filters;

  // 1. Plant Type Filter
  if (plantType) {
    const ptLower = plantType.toLowerCase();
    results = results.filter(f => {
      const pt = (f.plant_type || '').toLowerCase();
      if (ptLower === 'vine / climber' || ptLower.includes('vine') || ptLower.includes('climber')) {
        return pt === 'vine / climber' || pt.includes('vine') || pt.includes('climber');
      }
      if (ptLower.includes('grass')) return pt.includes('grass');
      return pt === ptLower;
    });
  }

  // 2. Color Filter
  if (color) {
    const colLower = color.toLowerCase();
    results = results.filter(f => {
      const fid = String(f.id || '').padStart(3, '0');
      const localMatch = (localFlowerData || []).find(lm => String(lm.id || '').padStart(3, '0') === fid);
      const pColor = (f.primary_color || (localMatch ? localMatch.primary_color : '') || '').trim().toLowerCase();
      return pColor === colLower || pColor.includes(colLower);
    });
  }

  // 3. Fragrance Filter
  if (fragrance) {
    const fragLower = fragrance.toLowerCase();
    results = results.filter(f => {
      const fid = String(f.id || '').padStart(3, '0');
      const localMatch = (localFlowerData || []).find(lm => String(lm.id || '').padStart(3, '0') === fid);
      const frag = (f.fragrance || (localMatch ? localMatch.fragrance : '') || '').trim().toLowerCase();
      return frag === fragLower || frag.includes(fragLower);
    });
  }

  // 4. Flowering Season Filter
  if (season) {
    const seasonLower = season.toLowerCase();
    results = results.filter(f => {
      const fid = String(f.id || '').padStart(3, '0');
      const localMatch = (localFlowerData || []).find(lm => String(lm.id || '').padStart(3, '0') === fid);
      const rawFs = (f.flowering_season || (localMatch ? localMatch.flowering_season : '') || '').toLowerCase();
      const fsAbbr = rawFs
        .replace(/\bjanuary\b/g, 'jan')
        .replace(/\bfebruary\b/g, 'feb')
        .replace(/\bmarch\b/g, 'mar')
        .replace(/\bapril\b/g, 'apr')
        .replace(/\bmay\b/g, 'may')
        .replace(/\bjune\b/g, 'jun')
        .replace(/\bjuly\b/g, 'jul')
        .replace(/\baugust\b/g, 'aug')
        .replace(/\bseptember\b/g, 'sep')
        .replace(/\boctober\b/g, 'oct')
        .replace(/\bnovember\b/g, 'nov')
        .replace(/\bdecember\b/g, 'dec');
      return rawFs.includes(seasonLower) || fsAbbr.includes(seasonLower);
    });
  }

  // 5. Bloom Time Filter
  if (bloomTime) {
    const btLower = bloomTime.toLowerCase();
    results = results.filter(f => {
      const fid = String(f.id || '').padStart(3, '0');
      const localMatch = (localFlowerData || []).find(lm => String(lm.id || '').padStart(3, '0') === fid);
      const bt = (f.bloom_time || (localMatch ? localMatch.bloom_time : '') || '').toLowerCase();
      return bt.includes(btLower);
    });
  }

  return results.sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
}
