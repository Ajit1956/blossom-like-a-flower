const localFlowerData = require('../assets/data/flower_data.json');
const englishCommonNamesIndex = require('../assets/data/english_common_names_index.json');
const indianCommonNames225 = require('../assets/data/indian_common_names_225.json');

console.log('Total flowers in flower_data.json:', localFlowerData.length);

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

let countWithPrimaryName = 0;
let countWithCommonNames = 0;
let countWithCommonName = 0;
let countWithEnglishCommonName = 0;

localFlowerData.forEach(f => {
  const fid = String(f.id).trim();
  const fid3 = fid.padStart(3, '0');
  const fidClean = fid.replace(/^0+/, '');
  const item225 = itemMap225.get(fid) || itemMap225.get(fid3) || itemMap225.get(fidClean);

  const rawEng = item225?.english_common_name || f.common_names || f.common_name || f.english_common_name;
  if (rawEng) countWithPrimaryName++;
  if (f.common_names) countWithCommonNames++;
  if (f.common_name) countWithCommonName++;
  if (f.english_common_name) countWithEnglishCommonName++;
});

console.log('Flowers with common_names:', countWithCommonNames);
console.log('Flowers with common_name:', countWithCommonName);
console.log('Flowers with english_common_name:', countWithEnglishCommonName);
console.log('Total flowers with any English common name field:', countWithPrimaryName);

// Check english_common_names_index.json
if (englishCommonNamesIndex?.name_index) {
  console.log('Unique names in english_common_names_index.json:', Object.keys(englishCommonNamesIndex.name_index).length);
}
