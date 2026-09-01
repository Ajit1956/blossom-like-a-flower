import genuinelyEdibleFlowers from '../../../../../assets/data/genuinely_edible_flowers_master.json';

const ELEMENTS_IDS = ['567', '568', '877', '878', '879', '880', '881', '882', '883'];
const NATURE_MOVEMENTS_IDS = ['521', '842', '843', '844', '845', '846', '848', '849', '850', '851', '852', '853', '856', '857', '858', '859', '860'];

export function filterNature(database, selectedQuality) {
  if (!database) return [];

  const edibleMap = new Map();
  (genuinelyEdibleFlowers || []).forEach(e => {
    const fid = String(e.id).padStart(3, '0');
    const fidClean = String(e.id).replace(/^0+/, '');
    edibleMap.set(fid, e);
    edibleMap.set(fidClean, e);
  });

  const sq = (selectedQuality || '').toLowerCase();

  if (sq === 'movements of nature' || sq === 'nature movements') {
    return database.filter(f => {
      const fid = String(f.id);
      const fid3 = fid.padStart(3, '0');
      const fidClean = fid.replace(/^0+/, '');
      return NATURE_MOVEMENTS_IDS.includes(fid) || NATURE_MOVEMENTS_IDS.includes(fid3) || NATURE_MOVEMENTS_IDS.includes(fidClean);
    }).sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  }

  if (sq === 'elements') {
    return database.filter(f => {
      const fid = String(f.id);
      const fid3 = fid.padStart(3, '0');
      const fidClean = fid.replace(/^0+/, '');
      return ELEMENTS_IDS.includes(fid) || ELEMENTS_IDS.includes(fid3) || ELEMENTS_IDS.includes(fidClean);
    }).sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  }

  if (sq.includes('vegetable') || sq.includes('pod')) {
    return filterEdibleByCategory(database, edibleMap, 'Vegetable');
  }

  if (sq.includes('spice') || sq.includes('herb')) {
    return filterEdibleByCategory(database, edibleMap, 'Spice / Herb');
  }

  if (sq.includes('fruit') || sq.includes('citrus')) {
    return filterEdibleByCategory(database, edibleMap, 'Fruit / Citrus');
  }

  if (sq === 'edible flora' || sq === 'edible') {
    return database.filter(f => {
      const fid = String(f.id);
      const fid3 = fid.padStart(3, '0');
      const fidClean = fid.replace(/^0+/, '');
      return edibleMap.has(fid) || edibleMap.has(fid3) || edibleMap.has(fidClean);
    }).map(f => mapEdibleCropName(f, edibleMap))
      .sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  }

  const allNatureIds = [...ELEMENTS_IDS, ...NATURE_MOVEMENTS_IDS];
  return database.filter(f => {
    const fid = String(f.id);
    const fid3 = fid.padStart(3, '0');
    const fidClean = fid.replace(/^0+/, '');
    return allNatureIds.includes(fid) || allNatureIds.includes(fid3) || allNatureIds.includes(fidClean);
  }).sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
}

function filterEdibleByCategory(database, edibleMap, category) {
  return database.filter(f => {
    const fid = String(f.id);
    const fid3 = fid.padStart(3, '0');
    const fidClean = fid.replace(/^0+/, '');
    const entry = edibleMap.get(fid3) || edibleMap.get(fidClean) || edibleMap.get(fid);
    return entry && entry.category === category;
  }).map(f => mapEdibleCropName(f, edibleMap))
    .sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
}

function mapEdibleCropName(f, edibleMap) {
  const fid = String(f.id);
  const fid3 = fid.padStart(3, '0');
  const fidClean = fid.replace(/^0+/, '');
  const entry = edibleMap.get(fid3) || edibleMap.get(fidClean) || edibleMap.get(fid);
  return {
    ...f,
    edible_crop_name: entry ? entry.edible_crop_name : ''
  };
}
