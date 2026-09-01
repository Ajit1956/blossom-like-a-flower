import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import localFlowerData from '../../../assets/data/flower_data.json';
const commonIndianFlowers = (localFlowerData || []).filter(f => f.regional_names);

export default function ViewDetailsModal({ flower, database, onPushScreen, onPopScreen, onGoHome, isFromVariety }) {
  if (!flower) return null;

  const localMatch = useMemo(() => {
    if (!flower || !flower.id) return null;
    const fid = String(flower.id).padStart(3, '0');
    return (localFlowerData || []).find(lm => String(lm.id || '').padStart(3, '0') === fid);
  }, [flower]);

  const isCommonFlower = useMemo(() => {
    if (!flower || !flower.id) return false;
    const cleanId = String(flower.id).replace(/^0+/, '');
    const fid3 = cleanId.padStart(3, '0');
    return (commonIndianFlowers || []).some(cf => {
      const cfClean = String(cf.id).replace(/^0+/, '');
      const cf3 = cfClean.padStart(3, '0');
      return cfClean === cleanId || cf3 === fid3;
    });
  }, [flower]);

  const { genus, species, plantType, fragrance, floweringSeason, bloomTime, primaryColor, commonNames } = useMemo(() => {
    const rawName = flower.botanical_name || flower.botanicalName || (localMatch ? localMatch.botanical_name : '') || '';
    
    let genusName = 'N/A';
    let speciesName = 'sp.';
    if (rawName) {
      const cleaned = rawName.trim().replace(/^\[|\]$/g, '').replace(/[\\]/g, '');
      const parts = cleaned.split(/\s+/);
      genusName = parts[0] || 'N/A';
      if (parts.length > 1) {
        const second = parts[1].replace(/[,;.]/g, '');
        if (second === 'x' || second === '×') {
          speciesName = (parts[2] ? '× ' + parts[2].replace(/[,;.]/g, '') : 'sp.');
        } else if (!second.startsWith('(') && /^[a-z]/.test(second) && second.length > 1) {
          speciesName = second;
        } else if (second === 'sp' || second === 'sp.' || second === 'spp' || second === 'spp.') {
          speciesName = 'sp.';
        }
      }
    }

    const pType = flower.plant_type || (localMatch ? localMatch.plant_type : '') || 'N/A';
    const frag = flower.fragrance || (localMatch ? localMatch.fragrance : '') || 'N/A';
    const rawSeason = flower.flowering_season || (localMatch ? localMatch.flowering_season : '') || 'N/A';
    const season = rawSeason !== 'N/A' ? rawSeason
      .replace(/\bJanuary\b/gi, 'Jan')
      .replace(/\bFebruary\b/gi, 'Feb')
      .replace(/\bMarch\b/gi, 'Mar')
      .replace(/\bApril\b/gi, 'Apr')
      .replace(/\bMay\b/gi, 'May')
      .replace(/\bJune\b/gi, 'Jun')
      .replace(/\bJuly\b/gi, 'Jul')
      .replace(/\bAugust\b/gi, 'Aug')
      .replace(/\bSeptember\b/gi, 'Sep')
      .replace(/\bOctober\b/gi, 'Oct')
      .replace(/\bNovember\b/gi, 'Nov')
      .replace(/\bDecember\b/gi, 'Dec') : 'N/A';
    const bloom = flower.bloom_time || (localMatch ? localMatch.bloom_time : '') || 'N/A';
    const color = flower.primary_color || (localMatch ? localMatch.primary_color : '') || 'N/A';

    const rawCommon = flower.common_names || flower.common_name || flower.commonNames || (localMatch ? localMatch.common_names : '');
    const cNames = Array.isArray(rawCommon) ? rawCommon.join(', ') : (rawCommon || 'N/A');

    return {
      genus: genusName,
      species: speciesName,
      plantType: pType,
      fragrance: frag,
      floweringSeason: season,
      bloomTime: bloom,
      primaryColor: color,
      commonNames: cNames
    };
  }, [flower, localMatch]);

  // Calculate varieties based on Genus
  const varieties = useMemo(() => {
    const bName = flower.botanical_name || flower.botanicalName || (localMatch ? localMatch.botanical_name : '');
    if (!database || !bName) return [];
    const g = bName.split(' ')[0].toLowerCase();
    return database.filter(f => {
      const fName = f.botanical_name || f.botanicalName;
      return fName && fName.toLowerCase().startsWith(g);
    });
  }, [database, flower, localMatch]);

  const handleSelectVarieties = () => {
    if (onPushScreen) {
      onPushScreen('VARIETIES', { varieties });
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        
        {/* Header Container */}
        <View style={styles.headerContainer}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={onPopScreen} style={styles.btnBackArrow}>
              <Text style={styles.btnBackArrowText}>←</Text>
            </TouchableOpacity>
            <View style={{ flex: 1, paddingHorizontal: 8 }}>
              <Text style={styles.flowerId}>Flower ID: {flower.id || 'N/A'}</Text>
              <Text style={styles.flowerTitle} numberOfLines={1}>
                {flower.mothers_name || flower.mothersName || 'Flower Details'}
              </Text>
            </View>
            <TouchableOpacity onPress={onGoHome || onPopScreen} style={styles.btnHome}>
              <Text style={styles.btnHomeText}>🏠 Home</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Title - Botanical Info */}
          <View style={styles.botanicalCard}>
            <Text style={styles.botanicalTitle}>Botanical Info</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>a) Genus:</Text>
              <Text style={[styles.infoValue, styles.italicHighlight]}>{genus}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>b) Species:</Text>
              <Text style={[styles.infoValue, styles.italicHighlight]}>{species}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>c) Plant type:</Text>
              <Text style={styles.infoValue}>{plantType}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>d) Fragrance:</Text>
              <Text style={styles.infoValue}>{fragrance}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>e) Flowering season:</Text>
              <Text style={styles.infoValue}>{floweringSeason}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>f) Bloom time:</Text>
              <Text style={styles.infoValue}>{bloomTime}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>g) Color:</Text>
              <Text style={styles.infoValue}>{primaryColor}</Text>
            </View>
          </View>

          {/* Standalone Common Names Button */}
          <TouchableOpacity 
            style={styles.standaloneCardBtn} 
            onPress={() => onPushScreen && onPushScreen('COMMON_NAMES', { flower, isCommonFlower, localMatch })}
            activeOpacity={0.8}
          >
            <View style={styles.standaloneBtnContent}>
              <Text style={styles.standaloneBtnTitle}>Common Names ➔</Text>
            </View>
          </TouchableOpacity>

          {/* Standalone View All Varieties Button */}
          {varieties.length > 0 && !isFromVariety && (
            <TouchableOpacity 
              style={styles.varietiesStandaloneBtn} 
              onPress={handleSelectVarieties}
              activeOpacity={0.8}
            >
              <Text style={styles.varietiesStandaloneText}>
                ❀ View all varieties ({varieties.length}) ➔
              </Text>
            </TouchableOpacity>
          )}

          {/* Quotes / Source */}
          {(flower.quotes || flower.quote) && (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>{flower.quotes || flower.quote}</Text>
              {!!flower.source && (
                <Text style={styles.sourceText}>
                  — {flower.source}
                </Text>
              )}
            </View>
          )}

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
    borderTopWidth: 1,
    borderColor: '#374151',
  },
  headerContainer: {
    paddingVertical: Platform.OS === 'web' ? 14 : 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    backgroundColor: '#111827',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flowerId: {
    color: '#a0aec0',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  flowerTitle: {
    color: '#FDE047',
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#374151',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  significanceBox: {
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4FD1C5',
    marginBottom: 16,
  },
  significanceLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    color: '#9ca3af',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  significanceText: {
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#4FD1C5',
    lineHeight: 22,
  },
  botanicalCard: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 14,
  },
  botanicalTitle: {
    color: '#FDE047',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(253, 224, 71, 0.2)',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  infoLabel: {
    color: '#9ca3af',
    fontSize: 13.5,
    fontWeight: '700',
    marginRight: 6,
  },
  infoValue: {
    color: '#e2e8f0',
    fontSize: 13.5,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  italicHighlight: {
    color: '#FDE047',
    fontStyle: 'italic',
    fontWeight: '700',
  },
  standaloneCardBtn: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#374151',
    borderLeftWidth: 4,
    borderLeftColor: '#FDE047',
    marginBottom: 14,
  },
  standaloneBtnContent: {
    flexDirection: 'column',
    gap: 4,
  },
  standaloneBtnTitle: {
    color: '#FDE047',
    fontSize: 15,
    fontWeight: '800',
  },
  standaloneBtnSub: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '500',
  },
  varietiesStandaloneBtn: {
    backgroundColor: 'rgba(79, 209, 197, 0.12)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#4FD1C5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  varietiesStandaloneText: {
    color: '#4FD1C5',
    fontSize: 15,
    fontWeight: '800',
  },
  descriptionBox: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#dd6b20',
  },
  descriptionText: {
    color: '#e2e8f0',
    fontSize: 14.5,
    lineHeight: 22,
  },
  sourceText: {
    color: '#9ca3af',
    fontSize: 13,
    textAlign: 'right',
    marginTop: 8,
    fontStyle: 'italic',
  },
  btnBackArrow: { padding: 4, width: 36 },
  btnBackArrowText: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  btnHome: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12 },
  btnHomeText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
});