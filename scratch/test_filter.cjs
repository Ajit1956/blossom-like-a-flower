const localFlowerData = require('../assets/data/flower_data.json');
const indianCommonNames225 = require('../assets/data/indian_common_names_225.json');

const commonFlowerIdsSet = new Set();
indianCommonNames225.forEach(item => {
  const fid = String(item.flower_id || item.id || '').trim();
  if (fid) {
    commonFlowerIdsSet.add(fid);
    commonFlowerIdsSet.add(fid.padStart(3, '0'));
    commonFlowerIdsSet.add(fid.replace(/^0+/, ''));
  }
});

const rankMap225 = new Map();
indianCommonNames225.forEach((item, idx) => {
  const fid = String(item.flower_id || item.id || '').trim();
  const fid3 = fid.padStart(3, '0');
  const fidClean = fid.replace(/^0+/, '');
  const rank = idx + 1;
  if (!rankMap225.has(fid)) rankMap225.set(fid, rank);
  if (!rankMap225.has(fid3)) rankMap225.set(fid3, rank);
  if (!rankMap225.has(fidClean)) rankMap225.set(fidClean, rank);
});

const itemMap225 = new Map();
indianCommonNames225.forEach(item => {
  const fid = String(item.flower_id || item.id || '').trim();
  const fid3 = fid.padStart(3, '0');
  const fidClean = fid.replace(/^0+/, '');
  if (fid) {
    if (!itemMap225.has(fid)) itemMap225.set(fid, item);
    if (!itemMap225.has(fid3)) itemMap225.set(fid3, item);
    if (!itemMap225.has(fidClean)) itemMap225.set(fidClean, item);
  }
});

const targetDb = localFlowerData.filter(f => {
  const fid = String(f.id);
  const fid3 = fid.padStart(3, '0');
  const fidClean = fid.replace(/^0+/, '');
  return commonFlowerIdsSet.has(fid) || commonFlowerIdsSet.has(fid3) || commonFlowerIdsSet.has(fidClean);
});

// Helper to get first/primary common name
const getPrimaryName = (raw) => {
  if (!raw) return '';
  let str = '';
  if (Array.isArray(raw)) {
    str = raw[0] || '';
  } else if (typeof raw === 'string') {
    str = raw.split(';')[0].split(',')[0];
  }
  return str.trim();
};

// Primary English test
const englishPrimaryMap = new Map();
targetDb.forEach(f => {
  const fid = String(f.id).trim();
  const fid3 = fid.padStart(3, '0');
  const fidClean = fid.replace(/^0+/, '');
  const rank = rankMap225.get(fid) ?? rankMap225.get(fid3) ?? rankMap225.get(fidClean) ?? 9999;
  const item225 = itemMap225.get(fid) || itemMap225.get(fid3) || itemMap225.get(fidClean);

  const primaryEng = getPrimaryName(item225?.english_common_name || f.common_names || f.common_name || f.english_common_name);
  if (primaryEng) {
    const key = primaryEng;
    if (!englishPrimaryMap.has(key)) {
      englishPrimaryMap.set(key, { name: primaryEng, rank, flowers: [] });
    }
    const entry = englishPrimaryMap.get(key);
    if (rank < entry.rank) entry.rank = rank;
    if (!entry.flowers.some(existing => String(existing.id) === String(f.id))) {
      entry.flowers.push(f);
    }
  }
});

const englishList = Array.from(englishPrimaryMap.values());
englishList.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));

console.log('Total Primary English Common Names:', englishList.length);
console.log('Top 10 Primary English Common Names:');
englishList.slice(0, 10).forEach(x => console.log(`  Rank ${x.rank}: ${x.name}`));

// Primary French test
const frenchPrimaryMap = new Map();
targetDb.forEach(f => {
  const fid = String(f.id).trim();
  const fid3 = fid.padStart(3, '0');
  const fidClean = fid.replace(/^0+/, '');
  const rank = rankMap225.get(fid) ?? rankMap225.get(fid3) ?? rankMap225.get(fidClean) ?? 9999;
  const item225 = itemMap225.get(fid) || itemMap225.get(fid3) || itemMap225.get(fidClean);

  const primaryFrench = getPrimaryName(item225?.french_common_name || f.french_common_name || f.french_name);
  if (primaryFrench) {
    const key = primaryFrench;
    if (!frenchPrimaryMap.has(key)) {
      frenchPrimaryMap.set(key, { name: primaryFrench, rank, flowers: [] });
    }
    const entry = frenchPrimaryMap.get(key);
    if (rank < entry.rank) entry.rank = rank;
    if (!entry.flowers.some(existing => String(existing.id) === String(f.id))) {
      entry.flowers.push(f);
    }
  }
});

const frenchList = Array.from(frenchPrimaryMap.values());
frenchList.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));

console.log('\nTotal Primary French Common Names:', frenchList.length);
console.log('Top 10 Primary French Common Names:');
frenchList.slice(0, 10).forEach(x => console.log(`  Rank ${x.rank}: ${x.name}`));
