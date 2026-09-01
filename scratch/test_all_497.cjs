const localFlowerData = require('../assets/data/flower_data.json');
const englishCommonNamesIndex = require('../assets/data/english_common_names_index.json');
const indianCommonNames225 = require('../assets/data/indian_common_names_225.json');

const RANK_MAP_225 = new Map();
const ITEM_MAP_225 = new Map();

if (Array.isArray(indianCommonNames225)) {
  indianCommonNames225.forEach((item, idx) => {
    const fid = String(item?.flower_id || item?.id || '').trim();
    const fid3 = fid.padStart(3, '0');
    const fidClean = fid.replace(/^0+/, '');
    const rank = idx + 1;
    if (fid) {
      if (!RANK_MAP_225.has(fid)) RANK_MAP_225.set(fid, rank);
      if (!RANK_MAP_225.has(fid3)) RANK_MAP_225.set(fid3, rank);
      if (!RANK_MAP_225.has(fidClean)) RANK_MAP_225.set(fidClean, rank);

      if (!ITEM_MAP_225.has(fid)) ITEM_MAP_225.set(fid, item);
      if (!ITEM_MAP_225.has(fid3)) ITEM_MAP_225.set(fid3, item);
      if (!ITEM_MAP_225.has(fidClean)) ITEM_MAP_225.set(fidClean, item);
    }
  });
}

const commonFlowerIdsSet = new Set();
indianCommonNames225.forEach(item => {
  const fid = String(item.flower_id || item.id || '').trim();
  if (fid) {
    commonFlowerIdsSet.add(fid);
    commonFlowerIdsSet.add(fid.padStart(3, '0'));
    commonFlowerIdsSet.add(fid.replace(/^0+/, ''));
  }
});

function getEnglishCommonNamesList(database, flowerScope) {
  const targetDb = flowerScope === 'common' 
    ? database.filter(f => {
        const fid = String(f.id);
        return commonFlowerIdsSet.has(fid) || commonFlowerIdsSet.has(fid.padStart(3, '0')) || commonFlowerIdsSet.has(fid.replace(/^0+/, ''));
      })
    : database;

  const dbMap = new Map();
  targetDb.forEach(f => {
    const fid = String(f.id).trim();
    dbMap.set(fid, f);
    dbMap.set(fid.padStart(3, '0'), f);
    dbMap.set(fid.replace(/^0+/, ''), f);
  });

  if (flowerScope === 'common') {
    const nameToDataMap = new Map();
    const getPrimaryName = (raw) => {
      if (!raw) return '';
      let str = '';
      if (Array.isArray(raw)) str = raw[0] || '';
      else if (typeof raw === 'string') str = raw.split(';')[0].split(',')[0];
      return str.trim();
    };

    targetDb.forEach(f => {
      const fid = String(f.id).trim();
      const fid3 = fid.padStart(3, '0');
      const fidClean = fid.replace(/^0+/, '');
      const rank = RANK_MAP_225.get(fid) ?? RANK_MAP_225.get(fid3) ?? RANK_MAP_225.get(fidClean) ?? 9999;
      const item225 = ITEM_MAP_225.get(fid) || ITEM_MAP_225.get(fid3) || ITEM_MAP_225.get(fidClean);

      const mName = (f.mothers_name || f.mothersName || '').toLowerCase().trim();
      const bName = (f.botanical_name || f.botanicalName || '').toLowerCase().trim();

      const primaryEng = getPrimaryName(item225?.english_common_name || f.common_names || f.common_name || f.english_common_name);
      if (primaryEng) {
        const lower = primaryEng.toLowerCase();
        if (lower !== mName && lower !== bName) {
          if (!nameToDataMap.has(primaryEng)) nameToDataMap.set(primaryEng, { flowers: [], rank });
          const entry = nameToDataMap.get(primaryEng);
          if (rank < entry.rank) entry.rank = rank;
          if (!entry.flowers.some(existing => String(existing.id) === String(f.id))) {
            entry.flowers.push(f);
          }
        }
      }
    });

    const set1 = [];
    const set2 = [];
    Array.from(nameToDataMap.entries()).forEach(([name, data]) => {
      const item = { key: name, name, count: data.flowers.length, flowers: data.flowers, rank: data.rank };
      if (data.rank <= 175) set1.push(item);
      else set2.push(item);
    });

    set1.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
    set2.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
    return [...set1, ...set2];
  }

  // flowerScope === 'all'
  const nameToFlowersMap = new Map();

  targetDb.forEach(f => {
    const fid = String(f.id).trim();
    const fid3 = fid.padStart(3, '0');
    const fidClean = fid.replace(/^0+/, '');
    const item225 = ITEM_MAP_225.get(fid) || ITEM_MAP_225.get(fid3) || ITEM_MAP_225.get(fidClean);
    const mName = (f.mothers_name || f.mothersName || '').toLowerCase().trim();
    const bName = (f.botanical_name || f.botanicalName || '').toLowerCase().trim();

    const addName = (rawName) => {
      if (!rawName) return;
      let names = [];
      if (Array.isArray(rawName)) names = rawName;
      else if (typeof rawName === 'string') names = rawName.split(/;\s*|,\s*/);
      names.forEach(n => {
        if (n && typeof n === 'string') {
          const cleaned = n.trim();
          const lower = cleaned.toLowerCase();
          if (cleaned && lower !== mName && lower !== bName) {
            if (!nameToFlowersMap.has(cleaned)) nameToFlowersMap.set(cleaned, []);
            const list = nameToFlowersMap.get(cleaned);
            if (!list.some(existing => String(existing.id) === String(f.id))) list.push(f);
          }
        }
      });
    };

    addName(f.common_names);
    addName(f.common_name);
    addName(f.english_common_name);
    if (item225) addName(item225.english_common_name);
  });

  if (englishCommonNamesIndex?.name_index) {
    Object.keys(englishCommonNamesIndex.name_index).forEach(cName => {
      const refs = englishCommonNamesIndex.name_index[cName] || [];
      refs.forEach(r => {
        const rId = String(r.id).trim();
        const f = dbMap.get(rId) || dbMap.get(rId.padStart(3, '0')) || dbMap.get(rId.replace(/^0+/, ''));
        if (f) {
          const mName = (f.mothers_name || f.mothersName || '').toLowerCase().trim();
          const bName = (f.botanical_name || f.botanicalName || '').toLowerCase().trim();
          const cleaned = cName.trim();
          const lower = cleaned.toLowerCase();
          if (cleaned && lower !== mName && lower !== bName) {
            if (!nameToFlowersMap.has(cleaned)) nameToFlowersMap.set(cleaned, []);
            const list = nameToFlowersMap.get(cleaned);
            if (!list.some(existing => String(existing.id) === String(f.id))) list.push(f);
          }
        }
      });
    });
  }

  const list = Array.from(nameToFlowersMap.entries()).map(([name, flowers]) => ({
    key: name,
    name,
    count: flowers.length,
    flowers
  }));

  return list.sort((a, b) => a.name.localeCompare(b.name));
}

const listCommon = getEnglishCommonNamesList(localFlowerData, 'common');
const listAll = getEnglishCommonNamesList(localFlowerData, 'all');

console.log('Count for Common Flowers 225:', listCommon.length);
console.log('Count for All Flowers 898:', listAll.length);
