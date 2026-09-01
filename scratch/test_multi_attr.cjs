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

function filterMultiAttributes(database, filters = {}, flowerScope = 'all') {
  if (!database || !Array.isArray(database)) return [];
  let results = database;

  if (flowerScope === 'common') {
    results = results.filter(f => {
      const fid = String(f.id || '');
      const fid3 = fid.padStart(3, '0');
      const fidClean = fid.replace(/^0+/, '');
      return commonFlowerIdsSet.has(fid) || commonFlowerIdsSet.has(fid3) || commonFlowerIdsSet.has(fidClean);
    });
  }

  const { plantType, color, fragrance, season, bloomTime } = filters;

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

  if (color) {
    const colLower = color.toLowerCase();
    results = results.filter(f => {
      const pColor = (f.primary_color || '').trim().toLowerCase();
      return pColor === colLower || pColor.includes(colLower);
    });
  }

  if (fragrance) {
    const fragLower = fragrance.toLowerCase();
    results = results.filter(f => {
      const frag = (f.fragrance || '').trim().toLowerCase();
      return frag === fragLower || frag.includes(fragLower);
    });
  }

  return results;
}

const test1 = filterMultiAttributes(localFlowerData, { plantType: 'Tree', color: 'White' }, 'common');
console.log('White Trees in Common Flowers 225:', test1.length);
test1.slice(0, 5).forEach(f => console.log(`  - ${f.mothers_name} (${f.botanical_name})`));

const test2 = filterMultiAttributes(localFlowerData, { plantType: 'Shrub', fragrance: 'Fragrant' }, 'all');
console.log('\nFragrant Shrubs in All Flowers 898:', test2.length);
test2.slice(0, 5).forEach(f => console.log(`  - ${f.mothers_name} (${f.botanical_name})`));
