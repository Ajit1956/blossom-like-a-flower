const localFlowerData = require('../assets/data/flower_data.json');
const indianCommonNames225 = require('../assets/data/indian_common_names_225.json');

console.log('Total flowers in localFlowerData:', localFlowerData.length);
console.log('Total items in indianCommonNames225:', indianCommonNames225.length);

const commonFlowerIdsSet = new Set();
indianCommonNames225.forEach(item => {
  const fid = String(item.flower_id || item.id || '').trim();
  if (fid) {
    commonFlowerIdsSet.add(fid);
    commonFlowerIdsSet.add(fid.padStart(3, '0'));
    commonFlowerIdsSet.add(fid.replace(/^0+/, ''));
  }
});

const commonFlowers = localFlowerData.filter(f => {
  const fid = String(f.id);
  const fid3 = fid.padStart(3, '0');
  const fidClean = fid.replace(/^0+/, '');
  return commonFlowerIdsSet.has(fid) || commonFlowerIdsSet.has(fid3) || commonFlowerIdsSet.has(fidClean);
});

console.log('Common flowers count in localFlowerData matching 225 set:', commonFlowers.length);

let frenchCount = 0;
commonFlowers.forEach(f => {
  const french = f.french_common_name || f.french_name;
  if (french) frenchCount++;
});
console.log('Common flowers with french name directly in localFlowerData:', frenchCount);

let french225Count = 0;
indianCommonNames225.forEach(item => {
  if (item.french_common_name) french225Count++;
});
console.log('225 items with french_common_name in indianCommonNames225:', french225Count);
