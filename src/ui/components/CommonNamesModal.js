import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import localFlowerData from '../../../assets/data/flower_data.json';
import englishIndexAll from '../../../assets/data/english_common_names_index.json';
import indianCommonNames225 from '../../../assets/data/indian_common_names_225.json';

const LANGUAGES = [
  { key: 'English', label: 'English', icon: '🌐' },
  { key: 'French', label: 'French', icon: '🇫🇷' },
  { key: 'Bengali', label: 'Bengali', icon: '🇮🇳' },
  { key: 'Gujarati', label: 'Gujarati', icon: '🇮🇳' },
  { key: 'Hindi', label: 'Hindi', icon: '🇮🇳' },
  { key: 'Kannada', label: 'Kannada', icon: '🇮🇳' },
  { key: 'Malayalam', label: 'Malayalam', icon: '🇮🇳' },
  { key: 'Marathi', label: 'Marathi', icon: '🇮🇳' },
  { key: 'Odia', label: 'Odia', icon: '🇮🇳' },
  { key: 'Tamil', label: 'Tamil', icon: '🇮🇳' },
  { key: 'Telugu', label: 'Telugu', icon: '🇮🇳' }
];

export default function CommonNamesModal({ onClose, onGoHome, flower, isCommonFlower, localMatch }) {
  const [selectedLanguage, setSelectedLanguage] = useState(isCommonFlower ? null : 'English');

  if (!flower) return null;

  const cleanFid = String(flower.id || '').replace(/^0+/, '');
  const targetFlower = (cleanFid && (localMatch || (localFlowerData || []).find(lm => String(lm.id || '').replace(/^0+/, '') === cleanFid))) || flower;
  const motherName = (targetFlower?.mothers_name || flower?.mothers_name || flower?.mothersName || '').toLowerCase().trim();
  const botanicalName = (targetFlower?.botanical_name || flower?.botanical_name || flower?.botanicalName || '').toLowerCase().trim();

  // Extract true English common names (excluding Mother's Name & Botanical Name)
  const getEnglishCommonNames = () => {
    const namesSet = new Set();

    const addRaw = (raw) => {
      if (!raw) return;
      if (Array.isArray(raw)) {
        raw.forEach(n => {
          if (n && typeof n === 'string') {
            const cleaned = n.trim();
            if (cleaned && cleaned.toLowerCase() !== motherName && cleaned.toLowerCase() !== botanicalName) {
              namesSet.add(cleaned);
            }
          }
        });
      } else if (typeof raw === 'string') {
        const parts = raw.split(/;\s*|,\s*/);
        parts.forEach(p => {
          const cleaned = p.trim();
          if (cleaned && cleaned.toLowerCase() !== motherName && cleaned.toLowerCase() !== botanicalName) {
            namesSet.add(cleaned);
          }
        });
      }
    };

    addRaw(flower.common_names);
    addRaw(flower.common_name);
    addRaw(flower.commonNames);
    if (localMatch) addRaw(localMatch.common_names);

    [englishIndexAll].forEach(idx => {
      if (idx && idx.name_index && cleanFid) {
        Object.keys(idx.name_index).forEach(cName => {
          const list = idx.name_index[cName];
          if (Array.isArray(list) && list.some(item => String(item.id || '').replace(/^0+/, '') === cleanFid)) {
            const cleaned = cName.trim();
            if (cleaned && cleaned.toLowerCase() !== motherName && cleaned.toLowerCase() !== botanicalName) {
              namesSet.add(cleaned);
            }
          }
        });
      }
    });

    return Array.from(namesSet);
  };

  const englishNamesList = getEnglishCommonNames();

  const getRegionalRecord = () => {
    if (targetFlower && targetFlower.regional_names) {
      return targetFlower;
    }
    if (cleanFid && Array.isArray(indianCommonNames225)) {
      const match = indianCommonNames225.find(r => String(r.flower_id || r.id || '').replace(/^0+/, '') === cleanFid);
      if (match) return match;
    }
    return null;
  };

  const regionalRecord = getRegionalRecord();

  const renderLanguageContent = () => {
    if (!selectedLanguage) {
      return (
        <View style={styles.promptBox}>
          <Text style={styles.promptIcon}>💡</Text>
          <Text style={styles.promptText}>Tap any language button above to view common names</Text>
        </View>
      );
    }

    if (selectedLanguage === 'English') {
      return (
        <View style={styles.contentBox}>
          <Text style={styles.langTitle}>ENGLISH COMMON NAMES</Text>
          {englishNamesList.length > 0 ? (
            englishNamesList.map((name, idx) => (
              <View key={idx} style={styles.nameCard}>
                <Text style={styles.primaryText}>{name}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.noDataText}>No English common name recorded for this flower.</Text>
            </View>
          )}
        </View>
      );
    }

    if (selectedLanguage === 'French') {
      const frenchName = targetFlower?.french_common_name || targetFlower?.french_name || flower?.french_common_name || flower?.french_name || regionalRecord?.french_common_name || null;
      return (
        <View style={styles.contentBox}>
          <Text style={styles.langTitle}>FRENCH COMMON NAME</Text>
          {frenchName ? (
            <View style={styles.nameCard}>
              <Text style={styles.primaryText}>{frenchName}</Text>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.noDataText}>No French common name recorded for this flower.</Text>
            </View>
          )}
        </View>
      );
    }

    // Regional languages
    const langKey = selectedLanguage ? selectedLanguage.toLowerCase() : '';
    const langData = regionalRecord?.regional_names?.[langKey] || regionalRecord?.[langKey] || null;

    let primaryName = langData?.primary || langData?.primary_name || langData?.primaryName || langData?.name || '';
    let primaryTransliteration = langData?.transliteration || langData?.primary_transliteration || langData?.primaryTransliteration || '';
    
    let alt1Name = langData?.alt1 || langData?.alt_name_1 || langData?.altName1 || langData?.alternate1 || langData?.alternate_1 || '';
    let alt1Transliteration = langData?.alt1_transliteration || langData?.alt_name_1_transliteration || langData?.alt1Transliteration || langData?.alternate1Transliteration || langData?.alternate_1_transliteration || '';
    
    let alt2Name = langData?.alt2 || langData?.alt_name_2 || langData?.altName2 || langData?.alternate2 || langData?.alternate_2 || '';
    let alt2Transliteration = langData?.alt2_transliteration || langData?.alt_name_2_transliteration || langData?.alt2Transliteration || langData?.alternate2Transliteration || langData?.alternate_2_transliteration || '';

    if (!primaryName && !primaryTransliteration && regionalRecord) {
      primaryName = regionalRecord[`${selectedLanguage} Primary Name`] || '';
      primaryTransliteration = regionalRecord[`${selectedLanguage} Primary Transliteration`] || '';
      alt1Name = regionalRecord[`${selectedLanguage} Alternate Name 1`] || '';
      alt1Transliteration = regionalRecord[`${selectedLanguage} Alternate Name 1 Transliteration`] || '';
      alt2Name = regionalRecord[`${selectedLanguage} Alternate Name 2`] || '';
      alt2Transliteration = regionalRecord[`${selectedLanguage} Alternate Name 2 Transliteration`] || '';
    }

    const hasPrimary = !!(primaryName || primaryTransliteration);
    const hasAlt1 = !!(alt1Name || alt1Transliteration);
    const hasAlt2 = !!(alt2Name || alt2Transliteration);

    if (!hasPrimary && !hasAlt1 && !hasAlt2) {
      return (
        <View style={styles.contentBox}>
          <Text style={styles.langTitle}>{selectedLanguage.toUpperCase()} NAMES</Text>
          <View style={styles.emptyCard}>
            <Text style={styles.noDataText}>No {selectedLanguage} translation recorded.</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.contentBox}>
        <Text style={styles.langTitle}>{selectedLanguage.toUpperCase()} NAMES</Text>
        
        {/* Primary Name */}
        {hasPrimary && (
          <View style={styles.nameCard}>
            <Text style={styles.scriptLabel}>PRIMARY NAME</Text>
            {!!primaryName && <Text style={styles.nativeScript}>{primaryName}</Text>}
            {!!primaryTransliteration && (
              <Text style={styles.transliteration}>{primaryTransliteration}</Text>
            )}
          </View>
        )}

        {/* Alternate Name 1 */}
        {hasAlt1 && (
          <View style={styles.nameCard}>
            <Text style={styles.scriptLabel}>ALTERNATE NAME 1</Text>
            {!!alt1Name && <Text style={styles.nativeScript}>{alt1Name}</Text>}
            {!!alt1Transliteration && (
              <Text style={styles.transliteration}>{alt1Transliteration}</Text>
            )}
          </View>
        )}

        {/* Alternate Name 2 */}
        {hasAlt2 && (
          <View style={styles.nameCard}>
            <Text style={styles.scriptLabel}>ALTERNATE NAME 2</Text>
            {!!alt2Name && <Text style={styles.nativeScript}>{alt2Name}</Text>}
            {!!alt2Transliteration && (
              <Text style={styles.transliteration}>{alt2Transliteration}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const availableLanguages = isCommonFlower ? LANGUAGES : LANGUAGES.filter(l => l.key === 'English');

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        
        {/* Header: Golden Yellow Mother's Name on Top, 'Common names' below */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.btnBackArrow}>
            <Text style={styles.btnBackArrowText}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, paddingHorizontal: 8 }}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {targetFlower.mothers_name || flower.mothers_name || flower.mothersName || 'Flower Details'}
            </Text>
            <Text style={styles.flowerSub}>
              Common names
            </Text>
          </View>
          <TouchableOpacity onPress={onGoHome || onClose} style={styles.btnHome}>
            <Text style={styles.btnHomeText}>🏠 Home</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Language Selection Section */}
          <Text style={styles.sectionHeader}>SELECT A LANGUAGE:</Text>
          <View style={styles.gridContainer}>
            {availableLanguages.map(item => {
              const isSelected = selectedLanguage === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.langBtn, isSelected && styles.langBtnSelected]}
                  onPress={() => setSelectedLanguage(item.key)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.langIcon}>{item.icon}</Text>
                  <Text style={[styles.langBtnText, isSelected && styles.langBtnTextSelected]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected Language Content Section */}
          {renderLanguageContent()}

        </ScrollView>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
    zIndex: 9999,
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
  },
  modalContainer: {
    backgroundColor: '#1f2937',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    height: '92%',
    overflow: 'hidden',
    borderTopWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'web' ? 14 : 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    backgroundColor: '#111827',
  },
  headerTitle: {
    color: '#FDE047',
    fontSize: 18,
    fontWeight: '800',
  },
  flowerSub: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    backgroundColor: '#374151',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  scrollArea: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
    minWidth: '28%',
    justifyContent: 'center',
  },
  langBtnSelected: {
    backgroundColor: '#4FD1C5',
    borderColor: '#4FD1C5',
  },
  langIcon: {
    fontSize: 14,
  },
  langBtnText: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '700',
  },
  langBtnTextSelected: {
    color: '#0f172a',
    fontWeight: '800',
  },
  promptBox: {
    backgroundColor: '#111827',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
    marginTop: 10,
  },
  promptIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  promptText: {
    color: '#9ca3af',
    fontSize: 13.5,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  contentBox: {
    gap: 12,
  },
  langTitle: {
    color: '#FDE047',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  nameCard: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4FD1C5',
  },
  emptyCard: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6b7280',
  },
  scriptLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  nativeScript: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  transliteration: {
    color: '#4FD1C5',
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  primaryText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    color: '#9ca3af',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
