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

// Filter database for 225 set
const common225Flowers = localFlowerData.filter(f => {
  const fid = String(f.id || '');
  const fid3 = fid.padStart(3, '0');
  const fidClean = fid.replace(/^0+/, '');
  return commonFlowerIdsSet.has(fid) || commonFlowerIdsSet.has(fid3) || commonFlowerIdsSet.has(fidClean);
});

const groups = {};

common225Flowers.forEach(f => {
  const pt = (f.plant_type || 'Unspecified').trim();
  if (!groups[pt]) groups[pt] = [];
  groups[pt].push(f);
});

console.log('# 225 COMMON FLOWERS DATASET - PLANT TYPE BREAKDOWN AUDIT\n');
console.log(`Total Matched Flowers: ${common225Flowers.length}\n`);

Object.keys(groups).sort().forEach(pt => {
  console.log(`## ${pt} (${groups[pt].length} Flowers)`);
  groups[pt].sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || '')).forEach((f, idx) => {
    const fid = String(f.id || '').padStart(3, '0');
    console.log(`${idx + 1}. #${fid} - ${f.mothers_name || 'Flower'} (${f.botanical_name || ''})`);
  });
  console.log('');
});
