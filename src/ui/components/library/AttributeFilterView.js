import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import {
  PLANT_TYPE_OPTIONS,
  COLOR_ATTRIBUTE_OPTIONS,
  FRAGRANCE_OPTIONS,
  FLOWERING_SEASON_OPTIONS,
  BLOOM_TIME_OPTIONS
} from './libraryConstants';
import localFlowerData from '../../../../assets/data/flower_data.json';

export default function AttributeFilterView({
  selectedAttributes = {},
  isFilterApplied = false,
  onApplyFilter,
  onToggleAttribute,
  onResetAll,
  matchingFlowers = [],
  flowerScope = 'all',
  onSelectFlower
}) {
  const activeCount = Object.values(selectedAttributes).filter(Boolean).length;
  const isCommon = flowerScope === 'common';

  const handleApply = () => {
    if (onApplyFilter) onApplyFilter(true);
  };

  const handleReset = () => {
    if (onApplyFilter) onApplyFilter(false);
    if (onResetAll) onResetAll();
  };

  const handleOptionToggle = (catKey, val) => {
    if (onApplyFilter) onApplyFilter(false);
    if (onToggleAttribute) onToggleAttribute(catKey, val);
  };

  // Render single-line header with count number box (e.g. 2) + option value boxes
  const renderSelectedFilterBadges = () => {
    const selectedList = [];
    if (selectedAttributes.plantType) {
      selectedList.push({ val: selectedAttributes.plantType, icon: '🪴', color: '#34D399' });
    }
    if (selectedAttributes.color) {
      selectedList.push({ val: selectedAttributes.color, icon: '🎨', color: '#FBBF24' });
    }
    if (selectedAttributes.fragrance) {
      selectedList.push({ val: selectedAttributes.fragrance, icon: '🌸', color: '#F472B6' });
    }
    if (selectedAttributes.season) {
      selectedList.push({ val: selectedAttributes.season, icon: '🗓️', color: '#38BDF8' });
    }
    if (selectedAttributes.bloomTime) {
      selectedList.push({ val: selectedAttributes.bloomTime, icon: '☀️', color: '#F59E0B' });
    }

    return (
      <View style={styles.singleLineHeaderRow}>
        {/* Count Number Box */}
        <View style={styles.countNumberBadge}>
          <Text style={styles.countNumberText}>{matchingFlowers.length}</Text>
        </View>

        {/* Option Value Boxes in Single Horizontal Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesHorizontalScroll}>
          {selectedList.length === 0 ? (
            <View style={styles.compactBadge}>
              <Text style={styles.compactBadgeVal}>All Attributes</Text>
            </View>
          ) : (
            selectedList.map((item, idx) => (
              <View key={`${item.val}-${idx}`} style={[styles.compactBadge, { borderColor: item.color }]}>
                {item.icon ? <Text style={styles.compactBadgeIcon}>{item.icon}</Text> : null}
                <Text style={[styles.compactBadgeVal, { color: item.color }]}>{item.val}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  };

  const renderChipGroup = (title, categoryKey, options) => {
    const activeValue = selectedAttributes[categoryKey];

    return (
      <View style={styles.categoryContainer}>
        <View style={styles.categoryHeaderRow}>
          <Text style={styles.categoryTitle}>{title}</Text>
          {activeValue ? (
            <Text style={styles.activeValueText}>{activeValue}</Text>
          ) : (
            <Text style={styles.anyValueText}>Any</Text>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScrollContent}>
          {/* "Any" Option */}
          <TouchableOpacity
            style={[
              styles.chip,
              !activeValue && styles.activeChipAny
            ]}
            onPress={() => handleOptionToggle(categoryKey, null)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, !activeValue && styles.activeChipText]}>Any</Text>
          </TouchableOpacity>

          {/* Individual Options */}
          {options.map(opt => {
            const label = typeof opt === 'string' ? opt : opt.label;
            const icon = typeof opt === 'object' && opt.icon ? opt.icon : null;
            const optColor = typeof opt === 'object' && opt.color ? opt.color : '#CBD5E1';
            const isSelected = activeValue === label;

            return (
              <TouchableOpacity
                key={label}
                style={[
                  styles.chip,
                  isSelected && { backgroundColor: '#1E293B', borderColor: optColor, borderWidth: 1.5 }
                ]}
                onPress={() => handleOptionToggle(categoryKey, isSelected ? null : label)}
                activeOpacity={0.7}
              >
                {icon && <Text style={styles.chipIcon}>{icon}</Text>}
                <Text style={[
                  styles.chipText,
                  isSelected && { color: optColor, fontWeight: '700' }
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {isFilterApplied ? (
        /* Results View: Single line header with count number box + option boxes on top + matching flower cards below */
        <View style={styles.resultsOnlySection}>
          {renderSelectedFilterBadges()}

          {matchingFlowers.length === 0 ? (
            <View style={styles.noResultsBox}>
              <Text style={styles.noResultsText}>No flowers match all selected attributes.</Text>
            </View>
          ) : (
            <View style={styles.resultsGrid}>
              {matchingFlowers.map(f => {
                const fid = String(f.id || '').padStart(3, '0');
                const localMatch = (localFlowerData || []).find(lm => String(lm.id || '').padStart(3, '0') === fid);
                const imgUrl = f.image_url || (localMatch ? localMatch.image_url : null);
                const mothersName = f.mothers_name || f.mothersName || f.common_name || 'Flower';
                const botanicalName = f.botanical_name || f.botanicalName || '';
                const flowerIdPadded = f.id ? `#${String(f.id).padStart(3, '0')}` : '';

                return (
                  <TouchableOpacity
                    key={f.id}
                    style={styles.flowerCard}
                    onPress={() => onSelectFlower && onSelectFlower(f)}
                    activeOpacity={0.75}
                  >
                    <View style={styles.imageWrapper}>
                      {imgUrl ? (
                        <Image
                          source={{ uri: imgUrl }}
                          style={styles.cardImage}
                          contentFit="cover"
                          transition={200}
                        />
                      ) : (
                        <View style={styles.placeholderImg}>
                          <Text style={{ fontSize: 24 }}>🌸</Text>
                          <Text style={styles.noImgText}>No Image</Text>
                        </View>
                      )}
                      {flowerIdPadded ? (
                        <View style={styles.idBadge}>
                          <Text style={styles.idBadgeText}>{flowerIdPadded}</Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={styles.cardContent}>
                      <Text style={styles.mothersNameText} numberOfLines={2}>{mothersName}</Text>
                      {botanicalName ? (
                        <Text style={styles.botanicalNameText} numberOfLines={1}>{botanicalName}</Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      ) : (
        /* Filter Controls View: Header, 5 Filter Rows, and Show Flowers Button */
        <View style={styles.filterControlsSection}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.mainTitle}>Attribute Filters</Text>
              <Text style={styles.secondaryTitle}>
                {isCommon ? 'COMMON FLOWERS - 225' : 'ALL FLOWERS - 898'}
              </Text>
            </View>

            <View style={styles.headerRight}>
              {activeCount > 0 && (
                <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.7}>
                  <Text style={styles.resetBtnText}>Reset ({activeCount})</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {renderChipGroup('PLANT TYPE', 'plantType', PLANT_TYPE_OPTIONS)}
          {renderChipGroup('COLOR', 'color', COLOR_ATTRIBUTE_OPTIONS)}
          {renderChipGroup('FRAGRANCE', 'fragrance', FRAGRANCE_OPTIONS)}
          {renderChipGroup('FLOWERING SEASON', 'season', FLOWERING_SEASON_OPTIONS)}
          {renderChipGroup('BLOOM TIME', 'bloomTime', BLOOM_TIME_OPTIONS)}

          {/* Action Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.applyBtn,
                activeCount === 0 && styles.applyBtnDisabled
              ]}
              onPress={handleApply}
              activeOpacity={0.8}
            >
              <Text style={styles.applyBtnIcon}>🔍</Text>
              <Text style={styles.applyBtnText}>
                {activeCount > 0
                  ? `Show Matching Flowers (${activeCount} Filter${activeCount > 1 ? 's' : ''} Selected)`
                  : 'Show Flowers (All Attributes)'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#111827' },
  container: { padding: 14, paddingBottom: 50 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937'
  },
  headerLeft: { flex: 1 },
  mainTitle: { color: '#FDE047', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  secondaryTitle: { color: '#9CA3AF', fontSize: 12, fontWeight: '700', marginTop: 3, letterSpacing: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resetBtn: {
    backgroundColor: '#374151',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12
  },
  resetBtnText: { color: '#F87171', fontSize: 12, fontWeight: '700' },

  filterControlsSection: { marginTop: 4 },
  categoryContainer: { marginBottom: 22 },
  categoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  categoryTitle: { color: '#2563EB', fontSize: 13.5, fontWeight: '800', letterSpacing: 1.2 },
  activeValueText: { color: '#FBBF24', fontSize: 12.5, fontWeight: '700' },
  anyValueText: { color: '#6B7280', fontSize: 12.5, fontWeight: '500' },
  chipScrollContent: { gap: 8, paddingRight: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 13,
    gap: 6
  },
  activeChipAny: { backgroundColor: '#334155', borderColor: '#64748B' },
  chipIcon: { fontSize: 12.5 },
  chipText: { color: '#CBD5E1', fontSize: 12.5, fontWeight: '500' },
  activeChipText: { color: '#FFFFFF', fontWeight: '700' },

  actionContainer: {
    marginTop: 16,
    marginBottom: 12
  },
  applyBtn: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4
  },
  applyBtnDisabled: {
    backgroundColor: '#059669'
  },
  applyBtnIcon: { fontSize: 16 },
  applyBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },

  /* Results View Single-Line Top Header Bar */
  resultsOnlySection: { marginTop: 4 },
  singleLineHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937'
  },
  countNumberBadge: {
    backgroundColor: '#064E3B',
    borderWidth: 1.5,
    borderColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 11
  },
  countNumberText: { color: '#34D399', fontSize: 13, fontWeight: '800' },
  badgesHorizontalScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  compactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 11,
    gap: 6
  },
  compactBadgeIcon: { fontSize: 12 },
  compactBadgeVal: { color: '#FDE047', fontSize: 12.5, fontWeight: '700' },

  noResultsBox: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 10
  },
  noResultsText: { color: '#9CA3AF', fontSize: 14, textAlign: 'center' },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between'
  },
  flowerCard: {
    width: '48%',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    overflow: 'hidden',
    marginBottom: 4
  },
  imageWrapper: { width: '100%', height: 125, backgroundColor: '#111827', position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  placeholderImg: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  noImgText: { color: '#6B7280', fontSize: 10, marginTop: 2 },
  idBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6
  },
  idBadgeText: { color: '#FDE047', fontSize: 10, fontWeight: '700' },
  cardContent: { padding: 10 },
  mothersNameText: { color: '#F3F4F6', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  botanicalNameText: { color: '#9CA3AF', fontSize: 10, fontStyle: 'italic' }
});
