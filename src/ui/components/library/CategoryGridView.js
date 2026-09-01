import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import DashboardBtn from './DashboardBtn';
import {
  TWELVE_QUALITIES,
  PLANT_TYPE_OPTIONS,
  COLOR_ATTRIBUTE_OPTIONS,
  FRAGRANCE_OPTIONS,
  FLOWERING_SEASON_OPTIONS,
  BLOOM_TIME_OPTIONS,
  YOGA_CATEGORIES,
  RELATION_TO_THE_DIVINE_ATTRIBUTES,
  RELATION_TO_DIVINE_THEMES,
  YOGA_THEMES,
  HUMAN_PSYCHOLOGY_CATEGORIES,
  HUMAN_PSYCHOLOGY_MAIN_GROUPS,
  HIGHER_HEMISPHERE_PLANES,
  LOWER_HEMISPHERE_PLANES,
  PARTS_OF_BEING_INSTRUMENTS,
  HUMAN_DIFFICULTIES_CATEGORIES,
  NATURE_SUBSECTIONS,
  EDIBLE_FLORA_SUBSECTIONS,
  NEW_CREATION_SUBSECTIONS
} from './libraryConstants';

import localFlowerData from '../../../../assets/data/flower_data.json';
const commonIndianFlowers = (localFlowerData || []).filter(f => f.regional_names);

export default function CategoryGridView({
  exploreView,
  selectedQuality,
  selectedPsychologyCategory,
  selectedAttributeCategory,
  selectedGenusCategory,
  onSelectPsychologyCategory,
  onSelectAttributeCategory,
  onSelectGenusCategory,
  onSelectQuality,
  allFlowerLetters,
  sortedGenusGroups,
  database,
  flowerScope = 'all'
}) {
  const commonSet = React.useMemo(() => new Set((commonIndianFlowers || []).map(cf => String(cf.id).padStart(3, '0'))), []);

  if (exploreView === 'nature' && !selectedQuality) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.twoColGrid}>
          {NATURE_SUBSECTIONS.map(sub => (
            <TouchableOpacity 
              key={sub.label} 
              style={[
                styles.plantTypeBtn,
                {
                  backgroundColor: sub.bgColor || '#1f2937',
                  borderColor: sub.borderColor || '#4FD1C5',
                  width: '100%',
                  marginBottom: 10,
                  minHeight: 60,
                  paddingHorizontal: 16
                }
              ]} 
              onPress={() => onSelectQuality(sub.label)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBadge, { borderColor: (sub.borderColor || '#4FD1C5') + '66' }]}>
                <Text style={styles.iconEmoji}>{sub.icon}</Text>
              </View>
              <Text style={[styles.plantTypeBtnText, { color: sub.color || '#F3F4F6', fontSize: 16, fontWeight: '700' }]} numberOfLines={1}>
                {sub.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  if (exploreView === 'nature' && selectedQuality === 'Edible Flora') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.twoColGrid}>
          {EDIBLE_FLORA_SUBSECTIONS.map(sub => (
            <TouchableOpacity 
              key={sub.label} 
              style={[
                styles.plantTypeBtn,
                {
                  backgroundColor: sub.bgColor || '#1f2937',
                  borderColor: sub.borderColor || '#4FD1C5',
                  width: '100%',
                  marginBottom: 12,
                  minHeight: 64,
                  paddingHorizontal: 16
                }
              ]} 
              onPress={() => onSelectQuality(sub.label)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBadge, { borderColor: (sub.borderColor || '#4FD1C5') + '66', width: 38, height: 38 }]}>
                <Text style={[styles.iconEmoji, { fontSize: 20 }]}>{sub.icon}</Text>
              </View>
              <Text style={[styles.plantTypeBtnText, { color: sub.color || '#F3F4F6', fontSize: 16, fontWeight: '700' }]} numberOfLines={1}>
                {sub.label} ({sub.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  if ((exploreView === 'new_creation' || exploreView === 'new_world') && !selectedQuality) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.twoColGrid}>
          {NEW_CREATION_SUBSECTIONS.map(sub => (
            <TouchableOpacity 
              key={sub.label} 
              style={[
                styles.plantTypeBtn,
                {
                  backgroundColor: sub.bgColor || '#1f2937',
                  borderColor: sub.borderColor || '#4FD1C5',
                  width: '100%',
                  marginBottom: 12,
                  minHeight: 64,
                  paddingHorizontal: 16
                }
              ]} 
              onPress={() => onSelectQuality(sub.label)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBadge, { borderColor: (sub.borderColor || '#4FD1C5') + '66', width: 38, height: 38 }]}>
                <Text style={[styles.iconEmoji, { fontSize: 20 }]}>{sub.icon}</Text>
              </View>
              <Text style={[styles.plantTypeBtnText, { color: sub.color || '#F3F4F6', fontSize: 15, fontWeight: '700' }]} numberOfLines={1}>
                {sub.label} ({sub.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  const getColorCount = (label) => {
    const list = Array.isArray(database) && database.length > 0 ? database : (localFlowerData || []);
    if (!Array.isArray(list)) return 0;
    const l = label.trim().toLowerCase();
    return list.filter(f => {
      const fid = String(f.id || '').padStart(3, '0');
      if (flowerScope === 'common' && !commonSet.has(fid)) return false;
      const localMatch = (localFlowerData || []).find(lm => String(lm.id || '').padStart(3, '0') === fid);
      const pColor = (f.primary_color || (localMatch ? localMatch.primary_color : '')).trim().toLowerCase();
      return pColor === l;
    }).length;
  };

  const getFragranceCount = (label) => {
    const list = Array.isArray(database) && database.length > 0 ? database : (localFlowerData || []);
    if (!Array.isArray(list)) return 0;
    const l = label.trim().toLowerCase();
    return list.filter(f => {
      const fid = String(f.id || '').padStart(3, '0');
      if (flowerScope === 'common' && !commonSet.has(fid)) return false;
      const localMatch = (localFlowerData || []).find(lm => String(lm.id || '').padStart(3, '0') === fid);
      const fragrance = (f.fragrance || (localMatch ? localMatch.fragrance : '') || '').trim().toLowerCase();
      return fragrance === l;
    }).length;
  };

  const getSeasonCount = (label) => {
    const list = Array.isArray(database) && database.length > 0 ? database : (localFlowerData || []);
    if (!Array.isArray(list)) return 0;
    const l = label.trim().toLowerCase();
    return list.filter(f => {
      const fid = String(f.id || '').padStart(3, '0');
      if (flowerScope === 'common' && !commonSet.has(fid)) return false;
      const localMatch = (localFlowerData || []).find(lm => String(lm.id || '').padStart(3, '0') === fid);
      const rawSeason = (f.flowering_season || (localMatch ? localMatch.flowering_season : '') || '').trim().toLowerCase();
      const seasonAbbr = rawSeason
        .replace(/\bjanuary\b/g, 'jan')
        .replace(/\bfebruary\b/g, 'feb')
        .replace(/\bmarch\b/g, 'mar')
        .replace(/\bapril\b/g, 'apr')
        .replace(/\bmay\b/g, 'may')
        .replace(/\bjune\b/g, 'jun')
        .replace(/\bjuly\b/g, 'jul')
        .replace(/\baugust\b/g, 'aug')
        .replace(/\bseptember\b/g, 'sep')
        .replace(/\boctober\b/g, 'oct')
        .replace(/\bnovember\b/g, 'nov')
        .replace(/\bdecember\b/g, 'dec');
      return rawSeason.includes(l) || seasonAbbr.includes(l);
    }).length;
  };

  const getBloomTimeCount = (label) => {
    const list = Array.isArray(database) && database.length > 0 ? database : (localFlowerData || []);
    if (!Array.isArray(list)) return 0;
    const l = label.trim().toLowerCase();
    return list.filter(f => {
      const fid = String(f.id || '').padStart(3, '0');
      if (flowerScope === 'common' && !commonSet.has(fid)) return false;
      const localMatch = (localFlowerData || []).find(lm => String(lm.id || '').padStart(3, '0') === fid);
      const bloom = (f.bloom_time || (localMatch ? localMatch.bloom_time : '') || '').trim().toLowerCase();
      return bloom.includes(l);
    }).length;
  };
  if (exploreView === 'twelve_qualities') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>SELECT A QUALITY</Text>
        <View style={styles.grid}>
          {TWELVE_QUALITIES.map(quality => (
            <DashboardBtn 
              key={quality} 
              title={quality} 
              onPress={() => onSelectQuality(quality)} 
              color="#4FD1C5" 
            />
          ))}
        </View>
      </ScrollView>
    );
  }

  if (exploreView === 'human_psychology' || exploreView === 'psychology' || exploreView === 'positive_attributes') {
    const rowPalette = [
      { text: '#4ADE80', arrow: '#00FFA3' }, // Green
      { text: '#38BDF8', arrow: '#00F0FF' }, // Blue
      { text: '#FB923C', arrow: '#FF8800' }, // Orange
      { text: '#C084FC', arrow: '#E879F9' }  // Mauve
    ];

    if (!selectedPsychologyCategory) {
      let itemIdxCounter = 0;
      return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {HUMAN_PSYCHOLOGY_MAIN_GROUPS.map((group, gIdx) => (
            <View key={gIdx} style={styles.groupedCardBox}>
              <View style={styles.groupedCardBody}>
                {group.items.map((item, iIdx) => {
                  const rowColor = rowPalette[itemIdxCounter % rowPalette.length];
                  itemIdxCounter++;
                  return (
                    <TouchableOpacity
                      key={item.categoryKey}
                      style={[
                        styles.groupedRowItem,
                        iIdx < group.items.length - 1 && styles.groupedRowBorder
                      ]}
                      onPress={() => onSelectPsychologyCategory(item.categoryKey)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.groupedRowText, { color: rowColor.text, fontSize: 15.5 }]}>{item.label}</Text>
                      <Text style={[styles.groupedRowArrow, { color: rowColor.arrow }]}>➔</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      );
    }

    const currentCategory = HUMAN_PSYCHOLOGY_CATEGORIES.find(c => c.title.toLowerCase() === selectedPsychologyCategory.toLowerCase());
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {currentCategory?.subsections ? (
          currentCategory.subsections.map((sub, sIdx) => {
            const isLighterBox = selectedPsychologyCategory === 'Emotions';
            const boxStyle = isLighterBox ? { backgroundColor: '#1A2636', borderColor: '#D97706', borderWidth: 1.5 } : { backgroundColor: '#131C2A', borderColor: '#D97706', borderWidth: 1.5 };
            const headerStyle = isLighterBox ? { backgroundColor: '#0F172A', borderBottomColor: '#D97706' } : { borderBottomColor: '#D97706' };
            return (
              <View key={sIdx} style={[styles.groupedCardBox, boxStyle]}>
                {!!sub.title && (
                  <View style={[styles.groupedCardHeader, headerStyle]}>
                    <Text style={styles.groupedCardTitle}>{sub.title}</Text>
                  </View>
                )}
                <View style={styles.groupedCardBody}>
                  {sub.attributes.map((attribute, aIdx) => {
                    const rowColor = rowPalette[(sIdx * 3 + aIdx) % rowPalette.length];
                    return (
                      <TouchableOpacity
                        key={attribute}
                        style={[
                          styles.groupedRowItem,
                          aIdx < sub.attributes.length - 1 && styles.groupedRowBorder
                        ]}
                        onPress={() => onSelectQuality(attribute)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.groupedRowText, { color: rowColor.text, fontSize: 15.5 }]}>{attribute}</Text>
                        <Text style={[styles.groupedRowArrow, { color: rowColor.arrow }]}>➔</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })
        ) : (
          <View>
            <View style={styles.grid}>
              {currentCategory?.attributes?.map(attribute => (
                <DashboardBtn 
                  key={attribute} 
                  title={attribute} 
                  onPress={() => onSelectQuality(attribute)} 
                  color="#4FD1C5" 
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    );
  }

  if (exploreView === 'human_difficulties') {
    const currentCategory = HUMAN_PSYCHOLOGY_CATEGORIES.find(c => c.title === 'Difficulties');
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {currentCategory?.attributes?.map(attribute => (
            <DashboardBtn 
              key={attribute} 
              title={attribute} 
              onPress={() => onSelectQuality(attribute)} 
              color="#FC8181" 
            />
          ))}
        </View>
      </ScrollView>
    );
  }

  if (exploreView === 'higher_hemisphere') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {HIGHER_HEMISPHERE_PLANES.map(plane => (
            <DashboardBtn 
              key={plane} 
              title={plane} 
              onPress={() => onSelectQuality(plane)} 
              color="#9F7AEA" 
            />
          ))}
        </View>
      </ScrollView>
    );
  }

  if (exploreView === 'lower_hemisphere') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {LOWER_HEMISPHERE_PLANES.map(plane => (
            <DashboardBtn 
              key={plane} 
              title={plane} 
              onPress={() => onSelectQuality(plane)} 
              color="#ED8936" 
            />
          ))}
        </View>
      </ScrollView>
    );
  }

  if (exploreView === 'parts_of_being') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {PARTS_OF_BEING_INSTRUMENTS.map(part => (
            <DashboardBtn 
              key={part} 
              title={part} 
              onPress={() => onSelectQuality(part)} 
              color="#4299E1" 
            />
          ))}
        </View>
      </ScrollView>
    );
  }

  if (exploreView === 'human_being') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {['Mind', 'Vital', 'Physical', 'Psychic'].map(part => (
            <DashboardBtn 
              key={part} 
              title={part} 
              onPress={() => onSelectQuality(part)} 
              color="#319795" 
            />
          ))}
        </View>
      </ScrollView>
    );
  }

  if (exploreView === 'relation_to_divine') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.twoColGrid}>
          {RELATION_TO_THE_DIVINE_ATTRIBUTES.map(attr => {
            const theme = RELATION_TO_DIVINE_THEMES[attr] || { bgColor: '#1f2937', borderColor: '#4FD1C5', textColor: '#F3F4F6', borderWidth: 1.5 };
            return (
              <TouchableOpacity 
                key={attr} 
                style={[
                  styles.twoColBtn, 
                  { 
                    backgroundColor: theme.bgColor, 
                    borderColor: theme.borderColor, 
                    borderWidth: theme.borderWidth 
                  }
                ]} 
                onPress={() => onSelectQuality(attr)}
                activeOpacity={0.7}
              >
                <Text style={[styles.twoColBtnText, { color: theme.textColor }]}>{attr}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  if (exploreView === 'union_with_divine') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>UNION WITH THE DIVINE</Text>
        <View style={styles.grid}>
          {YOGA_CATEGORIES[0].attributes.map(attr => (
            <DashboardBtn 
              key={attr} 
              title={attr} 
              onPress={() => onSelectQuality(attr)} 
              color="#ECC94B" 
            />
          ))}
        </View>
      </ScrollView>
    );
  }

  if (exploreView === 'yoga') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {YOGA_CATEGORIES.map((cat, cIdx) => (
          <View key={cIdx}>
            <Text style={[styles.sectionHeader, cIdx === 0 && { marginTop: 12 }]}>{cat.title}</Text>
            <View style={styles.twoColGrid}>
              {cat.attributes.map(attr => {
                const theme = YOGA_THEMES[attr] || { bgColor: '#1f2937', borderColor: '#4FD1C5', textColor: '#F3F4F6', borderWidth: 1.5 };
                return (
                  <TouchableOpacity 
                    key={attr} 
                    style={[
                      styles.twoColBtn, 
                      { 
                        backgroundColor: theme.bgColor, 
                        borderColor: theme.borderColor, 
                        borderWidth: theme.borderWidth 
                      }
                    ]} 
                    onPress={() => onSelectQuality(attr)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.twoColBtnText, { color: theme.textColor }]}>{attr}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }

  if (exploreView === 'view_flowers') {
    if (!selectedQuality) {
      return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeader}>VIEW FLOWERS</Text>
          
          <TouchableOpacity 
            style={[styles.dashBtn, { borderColor: '#F687B3', backgroundColor: '#2D3748', borderWidth: 1.5, alignItems: 'center', marginBottom: 12 }]} 
            onPress={() => onSelectQuality('ALL_FLOWERS')} 
            activeOpacity={0.7}
          >
            <Text style={[styles.twoColBtnText, { color: '#F687B3', fontWeight: '700', fontSize: 13.5 }]}>
              View Flowers A to Z - (898)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dashBtn, { borderColor: '#9F7AEA', backgroundColor: '#2D3748', borderWidth: 1.5, alignItems: 'center' }]} 
            onPress={() => onSelectQuality('ID_RANGES')} 
            activeOpacity={0.7}
          >
            <Text style={[styles.twoColBtnText, { color: '#9F7AEA', fontWeight: '700', fontSize: 13.5 }]}>
              View Flowers 001 to 898
            </Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    if (selectedQuality === 'ID_RANGES') {
      const ranges = [
        { label: '001 to 100', id: 'ID_RANGE_001_100', color: '#F687B3' },
        { label: '101 to 200', id: 'ID_RANGE_101_200', color: '#4FD1C5' },
        { label: '201 to 300', id: 'ID_RANGE_201_300', color: '#FAF089' },
        { label: '301 to 400', id: 'ID_RANGE_301_400', color: '#9F7AEA' },
        { label: '401 to 500', id: 'ID_RANGE_401_500', color: '#ED8936' },
        { label: '501 to 600', id: 'ID_RANGE_501_600', color: '#48BB78' },
        { label: '601 to 700', id: 'ID_RANGE_601_700', color: '#63B3ED' },
        { label: '701 to 800', id: 'ID_RANGE_701_800', color: '#F6AD55' },
        { label: '801 to 907', id: 'ID_RANGE_801_907', color: '#FC8181' }
      ];

      return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeader}>SELECT FLOWER ID RANGE</Text>
          <View style={styles.twoColGrid}>
            {ranges.map(range => (
              <TouchableOpacity 
                key={range.id} 
                style={[
                  styles.twoColBtn, 
                  { borderColor: range.color, backgroundColor: '#2D3748', borderWidth: 1.5 }
                ]} 
                onPress={() => onSelectQuality(range.id)} 
                activeOpacity={0.7}
              >
                <Text style={[styles.twoColBtnText, { color: range.color, fontWeight: '700' }]}>{range.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      );
    }

    if (selectedQuality === 'ALL_FLOWERS') {
      return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeader}>ALL FLOWERS BY ALPHABET</Text>
          <View style={styles.alphabetGrid}>
            {allFlowerLetters.map(letter => (
              <TouchableOpacity 
                key={letter} 
                style={styles.alphabetBox} 
                onPress={() => onSelectQuality(`LETTER_${letter}`)} 
                activeOpacity={0.7}
              >
                <View style={styles.alphabetBoxInner}>
                  <Text style={styles.alphabetBoxText}>{letter}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      );
    }

    if (selectedQuality === 'COMMON_FLOWERS') {
      return null;
    }
  }

  if (exploreView === 'all') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>ALL FLOWERS BY ALPHABET</Text>
        <View style={styles.alphabetGrid}>
          {allFlowerLetters.map(letter => (
            <TouchableOpacity 
              key={letter} 
              style={styles.alphabetBox} 
              onPress={() => onSelectQuality(`LETTER_${letter}`)} 
              activeOpacity={0.7}
            >
              <View style={styles.alphabetBoxInner}>
                <Text style={styles.alphabetBoxText}>{letter}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  if (exploreView === 'genus') {
    const commonCount = commonIndianFlowers ? commonIndianFlowers.length : 200;
    const activeGenusCat = selectedGenusCategory || (flowerScope === 'common' ? 'common' : 'all');

    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>
          {activeGenusCat === 'common' ? `GENUS GROUPS (${commonCount})` : 'GENUS GROUPS - ALL FLOWERS (898)'}
        </Text>
        <View style={styles.grid}>
          {sortedGenusGroups.map(genus => {
            const genusName = genus.genus || genus.name;
            return (
              <DashboardBtn 
                key={genusName} 
                title={`${genusName} (${genus.count})`} 
                onPress={() => onSelectQuality(`GENUS_${genusName}`)} 
                color={activeGenusCat === 'common' ? "#48BB78" : "#F6AD55"} 
              />
            );
          })}
        </View>
      </ScrollView>
    );
  }

  if (exploreView === 'attributes') {
    if (!selectedAttributeCategory) {
      return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeader}>ATTRIBUTES</Text>
          <View style={styles.twoColGrid}>
            <DashboardBtn 
              title="Search by Plant Type" 
              onPress={() => onSelectAttributeCategory('plant_type')} 
              color="#4FD1C5" 
            />
            <DashboardBtn 
              title="Search by Color" 
              onPress={() => onSelectAttributeCategory('color')} 
              color="#F687B3" 
            />
            <DashboardBtn 
              title="Fragrance" 
              onPress={() => onSelectAttributeCategory('fragrance')} 
              color="#FAF089" 
            />
            <DashboardBtn 
              title="Flowering Season" 
              onPress={() => onSelectAttributeCategory('flowering_season')} 
              color="#68D391" 
            />
            <DashboardBtn 
              title="Bloom time" 
              onPress={() => onSelectAttributeCategory('bloom_time')} 
              color="#ED8936" 
            />
          </View>
        </ScrollView>
      );
    }

    if (selectedAttributeCategory === 'plant_type' && !selectedQuality) {
      return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeader}>SEARCH BY PLANT TYPE</Text>
          <View style={styles.twoColGrid}>
            {PLANT_TYPE_OPTIONS.map(pt => {
              const label = typeof pt === 'string' ? pt : pt.label;
              const icon = typeof pt === 'object' ? pt.icon : null;
              const borderColor = pt.borderColor || '#4FD1C5';
              const bgColor = pt.bgColor || '#1f2937';
              const color = pt.color || '#F3F4F6';
              const count = Array.isArray(database)
                ? database.filter(f => {
                    const fid = String(f.id || '').padStart(3, '0');
                    if (flowerScope === 'common' && !commonSet.has(fid)) return false;
                    return (f.plant_type || '').trim().toLowerCase() === label.toLowerCase();
                  }).length
                : 0;
              return (
                <TouchableOpacity 
                  key={label} 
                  style={[
                    styles.plantTypeBtn,
                    {
                      backgroundColor: bgColor,
                      borderColor: borderColor,
                    }
                  ]} 
                  onPress={() => onSelectQuality(label)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconBadge, { borderColor: borderColor + '66' }]}>
                    <Text style={styles.iconEmoji}>{icon}</Text>
                  </View>
                  <Text style={[styles.plantTypeBtnText, { color: color }]} numberOfLines={2}>
                    {label} {database ? `(${count})` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      );
    }

    if (selectedAttributeCategory === 'color' && !selectedQuality) {
      return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeader}>SEARCH BY COLOR</Text>
          <View style={styles.twoColGrid}>
            {COLOR_ATTRIBUTE_OPTIONS.map(c => {
              const count = getColorCount(c.label);
              return (
                <TouchableOpacity 
                  key={c.label} 
                  style={[
                    styles.twoColBtn,
                    {
                      backgroundColor: c.bgColor || '#2D3748',
                      borderColor: c.borderColor || c.color,
                      borderWidth: 1.5,
                    }
                  ]} 
                  onPress={() => onSelectQuality(c.label)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.twoColBtnText, { color: c.textColor || c.color, fontWeight: '700' }]}>
                    {c.label} {database ? `(${count})` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      );
    }

    if (selectedAttributeCategory === 'fragrance' && !selectedQuality) {
      return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeader}>SEARCH BY FRAGRANCE</Text>
          <View style={styles.twoColGrid}>
            {FRAGRANCE_OPTIONS.map(opt => {
              const count = getFragranceCount(opt.label);
              return (
                <TouchableOpacity 
                  key={opt.label} 
                  style={[
                    styles.plantTypeBtn,
                    {
                      backgroundColor: opt.bgColor || '#1f2937',
                      borderColor: opt.borderColor || '#FAF089',
                    }
                  ]} 
                  onPress={() => onSelectQuality(opt.label)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconBadge, { borderColor: (opt.borderColor || '#FAF089') + '66' }]}>
                    <Text style={styles.iconEmoji}>{opt.icon}</Text>
                  </View>
                  <Text style={[styles.plantTypeBtnText, { color: opt.color || '#F3F4F6' }]} numberOfLines={2}>
                    {opt.label} {database ? `(${count})` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      );
    }

    if (selectedAttributeCategory === 'flowering_season' && !selectedQuality) {
      return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeader}>SEARCH BY FLOWERING SEASON</Text>
          <View style={styles.twoColGrid}>
            {FLOWERING_SEASON_OPTIONS.map(opt => {
              const count = getSeasonCount(opt.label);
              return (
                <TouchableOpacity 
                  key={opt.label} 
                  style={[
                    styles.plantTypeBtn,
                    {
                      backgroundColor: opt.bgColor || '#1f2937',
                      borderColor: opt.borderColor || '#68D391',
                    }
                  ]} 
                  onPress={() => onSelectQuality(opt.label)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconBadge, { borderColor: (opt.borderColor || '#68D391') + '66' }]}>
                    <Text style={styles.iconEmoji}>{opt.icon}</Text>
                  </View>
                  <Text style={[styles.plantTypeBtnText, { color: opt.color || '#F3F4F6' }]} numberOfLines={2}>
                    {opt.label} {database ? `(${count})` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      );
    }

    if (selectedAttributeCategory === 'bloom_time' && !selectedQuality) {
      return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeader}>SEARCH BY BLOOM TIME</Text>
          <View style={styles.twoColGrid}>
            {BLOOM_TIME_OPTIONS.map(opt => {
              const count = getBloomTimeCount(opt.label);
              return (
                <TouchableOpacity 
                  key={opt.label} 
                  style={[
                    styles.plantTypeBtn,
                    {
                      backgroundColor: opt.bgColor || '#1f2937',
                      borderColor: opt.borderColor || '#ED8936',
                    }
                  ]} 
                  onPress={() => onSelectQuality(opt.label)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconBadge, { borderColor: (opt.borderColor || '#ED8936') + '66' }]}>
                    <Text style={styles.iconEmoji}>{opt.icon}</Text>
                  </View>
                  <Text style={[styles.plantTypeBtnText, { color: opt.color || '#F3F4F6' }]} numberOfLines={2}>
                    {opt.label} {database ? `(${count})` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      );
    }
  }

  if (exploreView === 'plant_type') {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>PLANT TYPE</Text>
        <Text style={styles.emptyText}>Plant Type classification will be available in an upcoming update.</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { paddingBottom: 40 },
  groupedCardBox: {
    backgroundColor: '#131C2A',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D97706',
    marginBottom: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  groupedCardHeader: {
    backgroundColor: '#182232',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  groupedCardTitle: {
    color: '#FDE047',
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  groupedCardBody: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  groupedRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
  },
  groupedRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
  },
  groupedRowText: {
    color: '#F687B3',
    fontSize: 15.5,
    fontWeight: '700',
    flex: 1,
  },
  groupedRowArrow: {
    color: '#4FD1C5',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionHeader: { color: '#FDE047', fontSize: 13, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12, marginTop: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  alphabetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 24,
    columnGap: 8,
    marginTop: 16,
    marginBottom: 24,
    justifyContent: 'flex-start',
  },
  alphabetBox: {
    width: '14.8%',
    aspectRatio: 1,
    backgroundColor: '#2D3748',
    borderColor: '#38A169',
    borderWidth: 1.5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  alphabetBoxInner: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphabetBoxText: {
    color: '#38A169',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  twoColGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  twoColBtn: {
    width: '48.2%',
    backgroundColor: '#1f2937',
    borderWidth: 1.5,
    borderColor: '#4FD1C5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  plantTypeBtn: {
    width: '48.2%',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    gap: 8,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#00000033',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 17,
  },
  plantTypeBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    flex: 1,
    lineHeight: 17,
  },
  twoColBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F3F4F6',
    textAlign: 'center',
  },
  dashBtn: { 
    width: '100%',
    backgroundColor: '#1f2937', 
    paddingVertical: 16, 
    paddingHorizontal: 20, 
    borderRadius: 12, 
    borderWidth: 1,
    justifyContent: 'center'
  },
  dashBtnText: { fontSize: 16, fontWeight: '700' },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  emptyTitle: {
    color: '#4FD1C5',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
