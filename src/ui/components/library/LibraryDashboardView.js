import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import DashboardBtn from './DashboardBtn';

export default function LibraryDashboardView({ mode, onSelectCategory, onSelectPsychologyCategory, onSelectFlowerOfTheDay }) {
  const showThemes = mode === 'themes' || !mode || mode === 'all';
  const showExplore = mode === 'explore' || !mode || mode === 'all';

  return (
    <ScrollView style={[styles.dashboardScroll, mode === 'themes' && { marginTop: -10 }]} contentContainerStyle={styles.dashboardContainer} showsVerticalScrollIndicator={false}>
      {showThemes && (
        <>
          <Text style={[styles.sectionHeader, { marginTop: mode === 'themes' ? 2 : 12 }]}>THE DIVINE</Text>
          <View style={styles.grid}>
            <DashboardBtn title="Aspects" onPress={() => onSelectCategory('divine_being')} color="#9F7AEA" />
          </View>

          <Text style={styles.sectionHeader}>MANIFESTATION</Text>
          <View style={styles.grid}>
            <DashboardBtn title="Higher Hemisphere" onPress={() => onSelectCategory('higher_hemisphere')} color="#ED8936" />
            <DashboardBtn title="Lower Hemisphere" onPress={() => onSelectCategory('lower_hemisphere')} color="#ED8936" />
            <DashboardBtn title="Nature" onPress={() => onSelectCategory('nature')} color="#ED8936" />
            <DashboardBtn title="New Creation" onPress={() => onSelectCategory('new_creation')} color="#ED8936" />
            <DashboardBtn title="Flowers for Auroville" onPress={() => onSelectCategory('auroville')} color="#ED8936" />
          </View>

          <Text style={styles.sectionHeader}>HUMAN BEING</Text>
          <View style={styles.grid}>
            <DashboardBtn title="Relation to the Divine" onPress={() => onSelectCategory('relation_to_divine')} color="#9F7AEA" />
            <DashboardBtn title="Yoga" onPress={() => onSelectCategory('yoga')} color="#48BB78" />
            <DashboardBtn title="Twelve Qualities of the Mother" onPress={() => onSelectCategory('twelve_qualities')} color="#4FD1C5" />
            <DashboardBtn title="Parts of the Being" onPress={() => onSelectCategory('parts_of_being')} color="#F6E05E" />
            <DashboardBtn title="Human psychology" onPress={() => { onSelectPsychologyCategory(null); onSelectCategory('human_psychology'); }} color="#F687B3" />
          </View>

          {/* Row 1 under Difficulties: 3 buttons (Joy, Beauty, Love) */}
          <View style={[styles.threeColRow, { marginTop: 12 }]}>
            <TouchableOpacity style={[styles.threeColBtn, { borderColor: '#F6E05E' }]} onPress={() => onSelectCategory('joy')} activeOpacity={0.7}>
              <Text style={[styles.btnText, { color: '#F6E05E' }]}>Joy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.threeColBtn, { borderColor: '#63B3ED' }]} onPress={() => onSelectCategory('beauty')} activeOpacity={0.7}>
              <Text style={[styles.btnText, { color: '#63B3ED' }]}>Beauty</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.threeColBtn, { borderColor: '#F687B3' }]} onPress={() => onSelectCategory('love')} activeOpacity={0.7}>
              <Text style={[styles.btnText, { color: '#F687B3' }]}>Love</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2 under Difficulties: 2 buttons (Aesthetics, Riches) */}
          <View style={styles.twoColRow}>
            <TouchableOpacity style={[styles.twoColBtn, { borderColor: '#ED8936' }]} onPress={() => onSelectCategory('aesthetics')} activeOpacity={0.7}>
              <Text style={[styles.btnText, { color: '#ED8936' }]}>Aesthetics</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.twoColBtn, { borderColor: '#48BB78' }]} onPress={() => onSelectCategory('riches')} activeOpacity={0.7}>
              <Text style={[styles.btnText, { color: '#48BB78' }]}>Riches</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {showExplore && (
        <>
          <Text style={[styles.sectionHeader, !showThemes && { marginTop: 4 }]}>ALL FLOWERS - 898</Text>
          
          {/* All Flowers Row 1: View Flowers (left) and Attributes (right) */}
          <View style={styles.twoColRow}>
            <TouchableOpacity style={[styles.twoColBtn, { borderColor: '#F687B3' }]} onPress={() => onSelectCategory('view_flowers', 'all')} activeOpacity={0.7}>
              <Text style={[styles.btnText, { color: '#F687B3' }]}>View Flowers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.twoColBtn, { borderColor: '#4FD1C5' }]} onPress={() => onSelectCategory('attributes', 'all')} activeOpacity={0.7}>
              <Text style={[styles.btnText, { color: '#4FD1C5' }]}>Attributes</Text>
            </TouchableOpacity>
          </View>

          {/* All Flowers Row 2: Genus (left) and Common name (right) */}
          <View style={styles.twoColRow}>
            <TouchableOpacity style={[styles.twoColBtn, { borderColor: '#9F7AEA' }]} onPress={() => onSelectCategory('genus', 'all')} activeOpacity={0.7}>
              <Text style={[styles.btnText, { color: '#9F7AEA' }]}>Genus</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.twoColBtn, { borderColor: '#48BB78' }]} onPress={() => onSelectCategory('common_languages', 'all')} activeOpacity={0.7}>
              <Text style={[styles.btnText, { color: '#48BB78' }]}>Common name</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeader}>COMMON FLOWERS - 225</Text>
          
          {/* Common Flowers Row 1: View Flowers (left) and Attributes (right) */}
          <View style={styles.twoColRow}>
            <TouchableOpacity style={[styles.twoColBtn, { borderColor: '#F687B3' }]} onPress={() => onSelectCategory('view_flowers', 'common')} activeOpacity={0.7}>
              <Text style={[styles.btnText, { color: '#F687B3' }]}>View Flowers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.twoColBtn, { borderColor: '#4FD1C5' }]} onPress={() => onSelectCategory('attributes', 'common')} activeOpacity={0.7}>
              <Text style={[styles.btnText, { color: '#4FD1C5' }]}>Attributes</Text>
            </TouchableOpacity>
          </View>

          {/* Common Flowers Row 2: Full-width Common name button */}
          <View style={styles.singleRow}>
            <TouchableOpacity style={[styles.fullWidthBtn, { borderColor: '#48BB78' }]} onPress={() => onSelectCategory('common_languages', 'common')} activeOpacity={0.7}>
              <Text style={[styles.btnText, { color: '#48BB78' }]}>Common name</Text>
            </TouchableOpacity>
          </View>

          {/* Standalone Row: Key word (left) and Flower ID (right) */}
          <View style={styles.twoColRow}>
            <TouchableOpacity style={[styles.twoColBtn, { borderColor: '#FAF089' }]} onPress={() => onSelectCategory('keyword', 'all')} activeOpacity={0.7}>
              <Text style={[styles.btnText, { color: '#FAF089' }]}>Key word</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.twoColBtn, { borderColor: '#FC8181' }]} onPress={() => onSelectCategory('id', 'all')} activeOpacity={0.7}>
              <Text style={[styles.btnText, { color: '#FC8181' }]}>Flower ID</Text>
            </TouchableOpacity>
          </View>

          {/* Flower for the Day Button */}
          <View style={styles.singleRow}>
            <TouchableOpacity style={[styles.fullWidthBtn, { borderColor: '#FDE047' }]} onPress={() => onSelectFlowerOfTheDay && onSelectFlowerOfTheDay()} activeOpacity={0.7}>
              <Text style={[styles.btnText, { color: '#FDE047' }]}>❀ Flower for the Day</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dashboardScroll: { flex: 1 },
  dashboardContainer: { paddingBottom: 40 },
  sectionHeader: { color: '#FDE047', fontSize: 14, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12, marginTop: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  threeColRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  threeColBtn: {
    width: '31.2%',
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  twoColRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  twoColBtn: {
    width: '48.2%',
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  singleRow: {
    marginBottom: 12,
  },
  fullWidthBtn: {
    width: '100%',
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
