import flowerGroups from '../../../../data/models/flower_groups.json';
import localFlowerData from '../../../../../assets/data/flower_data.json';
import indianCommonNames225 from '../../../../../assets/data/indian_common_names_225.json';

const commonFlowerGroups = [];

// Build strict 225 rank map from indian_common_names_225.json
const RANK_225_MAP = new Map();
if (Array.isArray(indianCommonNames225)) {
  indianCommonNames225.forEach((item, idx) => {
    const fid = String(item?.flower_id || '').trim();
    const fidPadded = fid.padStart(3, '0');
    const fidClean = fid.replace(/^0+/, '');
    const rank = idx + 1;
    if (!RANK_225_MAP.has(fid)) RANK_225_MAP.set(fid, rank);
    if (!RANK_225_MAP.has(fidPadded)) RANK_225_MAP.set(fidPadded, rank);
    if (!RANK_225_MAP.has(fidClean)) RANK_225_MAP.set(fidClean, rank);
  });
}

export function filterCommonAndGenus(
  database,
  exploreView,
  selectedQuality,
  selectedGenusCategory,
  selectedCommonName,
  flowerScope,
  commonFlowerIdsSet,
  englishCommonNamesList,
  regionalCommonNamesList,
  englishCommonNamesIndex
) {
  if (!database || !selectedQuality) return [];

  if (exploreView === 'view_flowers' || exploreView === 'all') {
    if (selectedQuality === 'COMMON_FLOWERS' || (exploreView === 'view_flowers' && flowerScope === 'common')) {
      const commonList = database.filter(f => {
        const fid = String(f.id).trim();
        const paddedFid = fid.padStart(3, '0');
        const cleanFid = fid.replace(/^0+/, '');
        return RANK_225_MAP.has(fid) || RANK_225_MAP.has(paddedFid) || RANK_225_MAP.has(cleanFid);
      });

      return commonList.sort((a, b) => {
        const idA = String(a.id).trim();
        const paddedA = idA.padStart(3, '0');
        const cleanA = idA.replace(/^0+/, '');
        const rankA = RANK_225_MAP.get(idA) ?? RANK_225_MAP.get(paddedA) ?? RANK_225_MAP.get(cleanA) ?? 9999;

        const idB = String(b.id).trim();
        const paddedB = idB.padStart(3, '0');
        const cleanB = idB.replace(/^0+/, '');
        const rankB = RANK_225_MAP.get(idB) ?? RANK_225_MAP.get(paddedB) ?? RANK_225_MAP.get(cleanB) ?? 9999;

        return rankA - rankB;
      });
    }

    if (selectedQuality === 'ALL_FLOWERS' || selectedQuality === 'ID_RANGES') {
      return [];
    }

    if (selectedQuality.startsWith('ID_RANGE_')) {
      const parts = selectedQuality.replace('ID_RANGE_', '').split('_');
      const minId = parseInt(parts[0], 10);
      const maxId = parseInt(parts[1], 10);

      return database.filter(f => {
        const numId = parseInt(f.id, 10);
        return !isNaN(numId) && numId >= minId && numId <= maxId;
      }).sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
    }

    let targetDb = database;
    if (selectedQuality.startsWith('COMMON_LETTER_')) {
      targetDb = database.filter(f => {
        const fid = String(f.id);
        const fid3 = fid.padStart(3, '0');
        return commonFlowerIdsSet.has(fid) || commonFlowerIdsSet.has(fid3);
      });
    }

    const letter = selectedQuality.replace(/^COMMON_LETTER_|^LETTER_/, '').toUpperCase();

    return targetDb.filter(f => {
      const name = f.mothers_name || '';
      return name.trim().toUpperCase().startsWith(letter);
    }).sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
  }

  if (exploreView === 'genus') {
    const gName = (selectedQuality || '').replace(/^GENUS_/, '');
    const groupSource = selectedGenusCategory === 'common' ? commonFlowerGroups : flowerGroups;
    let group = groupSource.find(g => g.genus === selectedQuality || g.genus === gName);
    if (!group && selectedGenusCategory === 'common') {
      group = flowerGroups.find(g => g.genus === selectedQuality || g.genus === gName);
    }
    if (!group) return [];

    const groupIdsSet = new Set(group.flower_ids.flatMap(id => {
      const fid = String(id);
      const fid3 = fid.padStart(3, '0');
      const fidClean = fid.replace(/^0+/, '');
      return [fid, fid3, fidClean];
    }));
    const gGenus = (group.genus || '').toLowerCase();

    let flowers = database.filter(f => {
      const fid = String(f.id);
      const fid3 = fid.padStart(3, '0');
      const fidClean = fid.replace(/^0+/, '');
      const fGenus = (f.botanical_name || '').split(' ')[0].toLowerCase();
      if (selectedGenusCategory === 'common') {
        return groupIdsSet.has(fid) || groupIdsSet.has(fid3) || groupIdsSet.has(fidClean);
      }
      return groupIdsSet.has(fid) || groupIdsSet.has(fid3) || groupIdsSet.has(fidClean) || (fGenus && fGenus === gGenus);
    });

    if (selectedGenusCategory === 'common') {
      flowers = flowers.filter(f => {
        const fid = String(f.id);
        const fid3 = fid.padStart(3, '0');
        const fidClean = fid.replace(/^0+/, '');
        return commonFlowerIdsSet.has(fid) || commonFlowerIdsSet.has(fid3) || commonFlowerIdsSet.has(fidClean);
      });
    }

    return flowers.sort((a, b) => {
      const nameA = a.mothers_name || a.botanical_name || '';
      const nameB = b.mothers_name || b.botanical_name || '';
      return nameA.localeCompare(nameB);
    });
  }

  if (exploreView === 'common_languages') {
    if (!selectedCommonName) return [];

    if (selectedQuality === 'English') {
      const found = englishCommonNamesList.find(x => x.name.toLowerCase() === selectedCommonName.toLowerCase());
      if (found && found.flowers && found.flowers.length > 0) return found.flowers;

      const nameMap = englishCommonNames500Ids?.name_to_flower_ids || {};
      const ids = nameMap[selectedCommonName] || [];
      const refIds = new Set(ids.map(r => String(r).replace(/^0+/, '')));
      return database.filter(f => refIds.has(String(f.id).replace(/^0+/, ''))).sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
    }

    const found = regionalCommonNamesList.find(x => 
      (x.name && x.name.toLowerCase() === selectedCommonName.toLowerCase()) ||
      (x.key && x.key.toLowerCase() === selectedCommonName.toLowerCase())
    );
    if (found && found.flowers && found.flowers.length > 0) return found.flowers;

    return [];
  }

  return database.filter(f => 
    (f.mothers_name || f.spiritual_name || f.common_name || f.name || '').toLowerCase().includes(selectedQuality.toLowerCase())
  ).sort((a, b) => (a.mothers_name || '').localeCompare(b.mothers_name || ''));
}
