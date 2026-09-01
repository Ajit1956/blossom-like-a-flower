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

console.log('Total 225 flowers matched in flower_data.json:', common225Flowers.length);

const breakdown = {};
const breakdownNormalized = {};

common225Flowers.forEach(f => {
  const ptRaw = (f.plant_type || 'Unspecified').trim();
  const ptNorm = ptRaw.toLowerCase();

  if (!breakdown[ptRaw]) breakdown[ptRaw] = [];
  breakdown[ptRaw].push(f);

  if (!breakdownNormalized[ptNorm]) breakdownNormalized[ptNorm] = [];
  breakdownNormalized[ptNorm].push(f);
});

console.log('\n--- RAW PLANT TYPE BREAKDOWN ---');
Object.keys(breakdown).sort().forEach(pt => {
  console.log(`${pt}: ${breakdown[pt].length} flowers`);
});

console.log('\n--- NORMALIZED PLANT TYPE BREAKDOWN ---');
Object.keys(breakdownNormalized).sort().forEach(pt => {
  console.log(`${pt}: ${breakdownNormalized[pt].length} flowers`);
});
