import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { COMMON_NAME_LANGUAGES } from './libraryConstants';

export default function CommonNamesExplorerView({
  selectedQuality,
  flowerScope = 'all',
  onSelectLanguage,
  displayedCommonNames,
  commonNameFilter,
  onChangeFilter,
  onSelectCommonName
}) {
  const activeQuality = selectedQuality || (flowerScope === 'all' ? 'English' : null);

  if (!activeQuality && flowerScope === 'common') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>SELECT A LANGUAGE</Text>
        <View style={styles.twoColumnGrid}>
          {COMMON_NAME_LANGUAGES.map(lang => (
            <TouchableOpacity 
              key={lang} 
              style={styles.twoColumnBtn}
              onPress={() => onSelectLanguage(lang)}
              activeOpacity={0.7}
            >
              <Text style={styles.twoColumnBtnText}>{lang}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  const displayLang = activeQuality || 'English';

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.commonSearchInputWrapper}>
        <TextInput
          style={styles.commonSearchInput}
          placeholder={`Search ${displayLang} common names...`}
          placeholderTextColor="#9ca3af"
          value={commonNameFilter}
          onChangeText={onChangeFilter}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>
      <Text style={styles.sectionHeader}>
        {displayLang.toUpperCase()} COMMON NAMES ({displayedCommonNames.length})
      </Text>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {displayedCommonNames.length === 0 ? (
          <View style={styles.emptyCommonContainer}>
            <Text style={styles.emptyCommonText}>No common names matching "{commonNameFilter}"</Text>
          </View>
        ) : (
          displayedCommonNames.map((item, idx) => (
            <TouchableOpacity
              key={`${item.key || item.name}_${idx}`}
              style={styles.commonNameCard}
              onPress={() => onSelectCommonName(item.name || item.key)}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.commonNameCardTitle}>{item.name}</Text>
                {item.transliteration ? (
                  <Text style={styles.commonNameCardTranslit}>{item.transliteration}</Text>
                ) : null}
              </View>
              <View style={styles.commonNameBadge}>
                <Text style={styles.commonNameBadgeText}>
                  {item.count} {item.count === 1 ? 'flower' : 'flowers'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    color: '#FDE047',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  twoColumnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  twoColumnBtn: {
    width: '48%',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#48BB78',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  twoColumnBtnText: {
    color: '#48BB78',
    fontSize: 14,
    fontWeight: '700',
  },
  commonSearchInputWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  commonSearchInput: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 14,
  },
  commonNameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  commonNameCardTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  commonNameCardTranslit: {
    color: '#4FD1C5',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 2,
  },
  commonNameBadge: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#48BB78',
  },
  commonNameBadgeText: {
    color: '#48BB78',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCommonContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyCommonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
