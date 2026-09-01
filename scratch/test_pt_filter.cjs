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

function filterMultiAttributes(database, filters = {}, flowerScope = 'all', commonFlowerIdsSet = null) {
  if (!database || !Array.isArray(database)) return [];
  let results = database;

  if (flowerScope === 'common' && commonFlowerIdsSet) {
    results = results.filter(f => {
      const fid = String(f.id || '');
      const fid3 = fid.padStart(3, '0');
      const fidClean = fid.replace(/^0+/, '');
      return commonFlowerIdsSet.has(fid) || commonFlowerIdsSet.has(fid3) || commonFlowerIdsSet.has(fidClean);
    });
  }

  const { plantType } = filters;

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

  return results;
}

const plantTypes = [
  'Tree',
  'Small Tree',
  'Shrub / Small Tree',
  'Shrub',
  'Herb',
  'Vine / Climber',
  'Aquatic',
  'Succulent',
  'Epiphyte',
  'Grass / Grass-like'
];

console.log('--- FILTER MULTI ATTRIBUTES TEST (225 SCOPE) ---');
plantTypes.forEach(pt => {
  const res = filterMultiAttributes(localFlowerData, { plantType: pt }, 'common', commonFlowerIdsSet);
  console.log(`${pt}: ${res.length} items`);
});
