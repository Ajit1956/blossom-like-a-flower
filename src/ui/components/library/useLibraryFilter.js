import { useMemo } from 'react';
import flowerGroups from '../../../data/models/flower_groups.json';
import englishCommonNamesIndex from '../../../../assets/data/english_common_names_index.json';
import englishCommonNames500Ids from '../../../../assets/data/english_common_names_500_ids.json';
import localFlowerData from '../../../../assets/data/flower_data.json';
import indianCommonNames225 from '../../../../assets/data/indian_common_names_225.json';

const commonIndianFlowers = (localFlowerData || []).filter(f => f.regional_names);
const commonFlowerGroups = [];
import { getRegionalNamesForFlower } from '../../../logic/regionalNamesService.js';

import { filterNature } from './filters/natureFilter.js';
import { filterNewCreation } from './filters/newCreationFilter.js';
import { filterThemes } from './filters/themesFilter.js';
import { filterPsychology } from './filters/psychologyFilter.js';
import { filterYoga } from './filters/yogaFilter.js';
import { filterAttributes } from './filters/attributesFilter.js';
import { filterCommonAndGenus } from './filters/commonNamesFilter.js';

// Static 225 rank & item maps at module scope
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

export default function useLibraryFilter({
  database,
  exploreView,
  selectedQuality,
  selectedGenusCategory,
  selectedCommonName,
  commonNameFilter,
  flowerScope = 'all'
}) {

  const allFlowerLetters = useMemo(() => {
    if (!database) return [];
    const letters = new Set();
    database.forEach(f => {
      const name = f.mothers_name;
      if (name) {
        const firstChar = name.trim().charAt(0).toUpperCase();
        if (/[A-Z]/.test(firstChar)) {
          letters.add(firstChar);
        }
      }
    });
    return Array.from(letters).sort();
  }, [database]);

  const commonFlowerIdsSet = useMemo(() => {
    const set = new Set();
    if (Array.isArray(indianCommonNames225)) {
      indianCommonNames225.forEach(item => {
        if (item.flower_id) {
          const fid = String(item?.flower_id || '').trim();
          const fid3 = fid.padStart(3, '0');
          const fidClean = fid.replace(/^0+/, '');
          set.add(fid);
          set.add(fid3);
          set.add(fidClean);
        }
      });
    }
    return set;
  }, []);

  const sortedGenusGroupsAll = useMemo(() => {
    return [...flowerGroups]
      .map(g => ({
        genus: g.genus,
        name: g.genus,
        count: g.total_flowers || (g.flower_ids ? g.flower_ids.length : 0),
        flower_ids: g.flower_ids
      }))
      .filter(g => g.count > 0)
      .sort((a, b) => b.count - a.count || a.genus.localeCompare(b.genus));
  }, []);

  const sortedGenusGroupsCommon = useMemo(() => {
    return [...commonFlowerGroups]
      .map(g => ({
        genus: g.genus,
        name: g.genus,
        count: g.total_flowers || (g.flower_ids ? g.flower_ids.length : 0),
        flower_ids: g.flower_ids
      }))
      .filter(g => g.count > 0)
      .sort((a, b) => b.count - a.count || a.genus.localeCompare(b.genus));
  }, []);

  const sortedGenusGroups = selectedGenusCategory === 'common' ? sortedGenusGroupsCommon : sortedGenusGroupsAll;

  const targetDb = useMemo(() => {
    if (!database) return [];
    if (flowerScope === 'common') {
      return database.filter(f => {
        const fid = String(f.id);
        const fid3 = fid.padStart(3, '0');
        const fidClean = fid.replace(/^0+/, '');
        return commonFlowerIdsSet.has(fid) || commonFlowerIdsSet.has(fid3) || commonFlowerIdsSet.has(fidClean);
      });
    }
    return database;
  }, [database, flowerScope, commonFlowerIdsSet]);

  const englishCommonNamesList = useMemo(() => {
    if (!targetDb || !targetDb.length) return [];

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
        if (Array.isArray(raw)) {
          str = raw[0] || '';
        } else if (typeof raw === 'string') {
          str = raw.split(';')[0].split(',')[0];
        }
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
            if (!nameToDataMap.has(primaryEng)) {
              nameToDataMap.set(primaryEng, { flowers: [], rank });
            }
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
        const item = {
          key: name,
          name,
          count: data.flowers.length,
          flowers: data.flowers,
          rank: data.rank
        };
        if (data.rank <= 175) {
          set1.push(item);
        } else {
          set2.push(item);
        }
      });

      set1.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
      set2.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));

      return [...set1, ...set2];
    }

    // flowerScope === 'all' -> Use english_common_names_500_ids.json forward mapping name_to_flower_ids
    const nameToFlowersMap = new Map();

    const nameMap = englishCommonNames500Ids?.name_to_flower_ids || {};
    Object.keys(nameMap).forEach(cName => {
      const ids = nameMap[cName] || [];
      const flowers = ids
        .map(id => {
          const sId = String(id).trim();
          return dbMap.get(sId) || dbMap.get(sId.padStart(3, '0')) || dbMap.get(sId.replace(/^0+/, ''));
        })
        .filter(Boolean);

      if (flowers.length > 0) {
        nameToFlowersMap.set(cName.trim(), flowers);
      }
    });

    const list = Array.from(nameToFlowersMap.entries()).map(([name, flowers]) => ({
      key: name,
      name,
      count: flowers.length,
      flowers
    }));

    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [targetDb, flowerScope]);

  const regionalCommonNamesList = useMemo(() => {
    if (!targetDb || !selectedQuality || selectedQuality === 'English') return [];

    const getPrimaryName = (raw) => {
      if (!raw) return '';
      let str = '';
      if (Array.isArray(raw)) {
        str = raw[0] || '';
      } else if (typeof raw === 'string') {
        str = raw.split(';')[0].split(',')[0];
      }
      return str.trim();
    };

    if (selectedQuality === 'French') {
      const nameToDataMap = new Map();
      targetDb.forEach(f => {
        const fid = String(f.id).trim();
        const fid3 = fid.padStart(3, '0');
        const fidClean = fid.replace(/^0+/, '');
        const rank = RANK_MAP_225.get(fid) ?? RANK_MAP_225.get(fid3) ?? RANK_MAP_225.get(fidClean) ?? 9999;
        const item225 = ITEM_MAP_225.get(fid) || ITEM_MAP_225.get(fid3) || ITEM_MAP_225.get(fidClean);

        const primaryFrench = getPrimaryName(item225?.french_common_name || f.french_common_name || f.french_name);
        if (primaryFrench) {
          if (!nameToDataMap.has(primaryFrench)) {
            nameToDataMap.set(primaryFrench, { flowers: [], rank });
          }
          const entry = nameToDataMap.get(primaryFrench);
          if (rank < entry.rank) entry.rank = rank;
          if (!entry.flowers.some(existing => String(existing.id) === String(f.id))) {
            entry.flowers.push(f);
          }
        }
      });

      const set1 = [];
      const set2 = [];
      Array.from(nameToDataMap.entries()).forEach(([name, data]) => {
        const item = {
          key: name,
          name,
          count: data.flowers.length,
          flowers: data.flowers,
          rank: data.rank
        };
        if (data.rank <= 175) {
          set1.push(item);
        } else {
          set2.push(item);
        }
      });

      set1.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
      set2.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));

      return [...set1, ...set2];
    }

    const targetLang = selectedQuality.toLowerCase();
    const set1Map = new Map(); // Traditional Authentic Indian (Ranks 1 to 175)
    const set2Map = new Map(); // Introduced Exotic Garden Flowers (Ranks 176 to 225)

    targetDb.forEach(f => {
      const fid = String(f.id).trim();
      const fid3 = fid.padStart(3, '0');
      const fidClean = fid.replace(/^0+/, '');
      const rank = RANK_MAP_225.get(fid) ?? RANK_MAP_225.get(fid3) ?? RANK_MAP_225.get(fidClean) ?? 999;
      const isSet1 = rank <= 175;

      const item225 = ITEM_MAP_225.get(fid) || ITEM_MAP_225.get(fid3) || ITEM_MAP_225.get(fidClean);
      let regObj = f.regional_names;
      const langData = regObj ? regObj[targetLang] : null;

      let primary = langData ? (langData.primary || langData.primary_name || '') : '';
      let primaryTranslit = langData ? (langData.transliteration || langData.primary_transliteration || '') : '';

      if (!primary && !primaryTranslit && item225) {
        primary = item225[`${selectedQuality} Primary Name`] || '';
        primaryTranslit = item225[`${selectedQuality} Primary Transliteration`] || '';
      }

      let displayName = primary || primaryTranslit;
      let translit = primary ? primaryTranslit : '';

      if (!displayName && !isSet1) {
        const eng = f.common_names || f.common_name || (item225 ? item225.english_common_name : '');
        if (eng) {
          displayName = Array.isArray(eng) ? eng[0] : eng.split(';')[0].split(',')[0].trim();
          translit = 'Introduced Exotic';
        }
      }

      if (!displayName) return;

      const key = displayName + (translit ? ` (${translit})` : '');
      const targetMap = isSet1 ? set1Map : set2Map;

      if (!targetMap.has(key)) {
        targetMap.set(key, { name: displayName, transliteration: translit, flowers: [], rank });
      }
      if (!targetMap.get(key).flowers.some(existing => String(existing.id) === String(f.id))) {
        targetMap.get(key).flowers.push(f);
      }
    });

    const list1 = Array.from(set1Map.entries())
      .map(([key, data]) => ({ key, name: data.name, transliteration: data.transliteration, count: data.flowers.length, flowers: data.flowers, rank: data.rank }))
      .sort((a, b) => a.rank - b.rank || (a.transliteration || a.name).localeCompare(b.transliteration || b.name));

    const list2 = Array.from(set2Map.entries())
      .map(([key, data]) => ({ key, name: data.name, transliteration: data.transliteration, count: data.flowers.length, flowers: data.flowers, rank: data.rank }))
      .sort((a, b) => a.rank - b.rank || (a.transliteration || a.name).localeCompare(b.transliteration || b.name));

    return [...list1, ...list2];
  }, [targetDb, selectedQuality]);

  const activeCommonNamesList = useMemo(() => {
    if (selectedQuality === 'English') {
      return englishCommonNamesList;
    }
    return regionalCommonNamesList;
  }, [selectedQuality, englishCommonNamesList, regionalCommonNamesList]);

  const displayedCommonNames = useMemo(() => {
    if (!commonNameFilter.trim()) return activeCommonNamesList;
    const q = commonNameFilter.trim().toLowerCase();
    return activeCommonNamesList.filter(item => {
      const nameMatch = (item.name || '').toLowerCase().includes(q);
      const translitMatch = item.transliteration && item.transliteration.toLowerCase().includes(q);
      return nameMatch || translitMatch;
    });
  }, [activeCommonNamesList, commonNameFilter]);

  const qualityFilteredResults = useMemo(() => {
    if (!database) return [];

    if (exploreView === 'nature') {
      return filterNature(database, selectedQuality);
    }

    if (exploreView === 'new_creation' || exploreView === 'new_world') {
      return filterNewCreation(database, selectedQuality);
    }

    if (['divine_being', 'auroville', 'joy', 'beauty', 'love', 'riches'].includes(exploreView)) {
      return filterThemes(database, exploreView);
    }

    if (['parts_of_being', 'human_being', 'human_psychology', 'psychology', 'positive_attributes'].includes(exploreView)) {
      return filterPsychology(database, exploreView, selectedQuality);
    }

    if (['relation_to_divine', 'union_with_divine', 'yoga'].includes(exploreView)) {
      return filterYoga(database, exploreView, selectedQuality);
    }

    if (exploreView === 'attributes') {
      return filterAttributes(database, selectedQuality, flowerScope, commonFlowerIdsSet);
    }

    return filterCommonAndGenus(
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
    );
  }, [
    database,
    exploreView,
    selectedQuality,
    selectedGenusCategory,
    selectedCommonName,
    flowerScope,
    commonFlowerIdsSet,
    englishCommonNamesList,
    regionalCommonNamesList
  ]);

  return {
    allFlowerLetters,
    sortedGenusGroups,
    englishCommonNamesList,
    regionalCommonNamesList,
    activeCommonNamesList,
    displayedCommonNames,
    qualityFilteredResults
  };
}
