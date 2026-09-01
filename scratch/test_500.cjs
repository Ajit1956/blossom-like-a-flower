const localFlowerData = require('../assets/data/flower_data.json');
const englishCommonNames500Ids = require('../assets/data/english_common_names_500_ids.json');

console.log('Total 500 distinct names:', Object.keys(englishCommonNames500Ids.name_to_flower_ids).length);
console.log('Total mapped flower IDs:', Object.keys(englishCommonNames500Ids.id_to_english_common_names).length);

const dbMap = new Map();
localFlowerData.forEach(f => {
  const fid = String(f.id).trim();
  dbMap.set(fid, f);
  dbMap.set(fid.padStart(3, '0'), f);
  dbMap.set(fid.replace(/^0+/, ''), f);
});

let matchedNamesCount = 0;
let totalFlowersMatched = 0;

Object.keys(englishCommonNames500Ids.name_to_flower_ids).forEach(cName => {
  const ids = englishCommonNames500Ids.name_to_flower_ids[cName] || [];
  const flowers = ids.map(id => dbMap.get(String(id).trim()) || dbMap.get(String(id).padStart(3, '0')) || dbMap.get(String(id).replace(/^0+/, ''))).filter(Boolean);
  if (flowers.length > 0) {
    matchedNamesCount++;
    totalFlowersMatched += flowers.length;
  }
});

console.log(`Matched names count: ${matchedNamesCount} / 500`);
console.log(`Total flowers matched: ${totalFlowersMatched}`);
