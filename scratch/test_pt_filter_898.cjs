const localFlowerData = require('../assets/data/flower_data.json');

function filterMultiAttributes(database, filters = {}, flowerScope = 'all') {
  if (!database || !Array.isArray(database)) return [];
  let results = database;

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

console.log('--- FILTER MULTI ATTRIBUTES TEST (ALL 898 FLOWERS SCOPE) ---');
plantTypes.forEach(pt => {
  const res = filterMultiAttributes(localFlowerData, { plantType: pt }, 'all');
  console.log(`${pt}: ${res.length} items`);
});
