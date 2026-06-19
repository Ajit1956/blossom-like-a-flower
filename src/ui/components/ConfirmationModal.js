import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

const TRAITS = ["spiraled petals", "trumpet shape", "star rotate", "cupped rosette", "contrasting center", "solid center", "solid monochrome", "shaded margins", "single layer", "double layer", "multi layered", "large single focal", "extra large focal", "small clustered", "medium focal", "dense bunch", "isolated solitary", "loose clusters", "broad and rounded", "serrate margins", "pointed ovate", "compound pinnate"];

export default function ConfirmationModal({ isOpen, database = [], autoMatchedFlower, onConfirm, onCancel, photoUri }) {
  const [selected, setSelected] = useState({});
  const [showGrid, setShowGrid] = useState(false);

  if (!isOpen) return null;
  if (!database?.length || !photoUri) {
    return (
      <Modal visible={isOpen} transparent>
        <View style={styles.spinner}><ActivityIndicator size="large" color="#319795" /></View>
      </Modal>
    );
  }

  const toggle = (t) => setSelected(p => { const n = { ...p }; if (n[t]) delete n[t]; else n[t] = true; return n; });
  const filtered = database.filter(item => Object.keys(selected).every(t => [item.criteria_form_shape, item.criteria_color_layering, item.criteria_petal_count, item.criteria_size_scale, item.criteria_growth_pattern, item.criteria_leaf_shape].includes(t)));

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.topHalf}>
          {photoUri && <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFillObject} contentFit="cover" />}
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}><Text style={styles.cancelText}>✕ Close</Text></TouchableOpacity>
          <View style={styles.topOverlay}><Text style={styles.overlayText}>Confirm Snap Match</Text></View>
        </View>
        {!showGrid && autoMatchedFlower ? (
          <View style={styles.bottomHalf}>
            <ScrollView contentContainerStyle={styles.profileContainer}>
              <Text style={styles.profileTitle}>{autoMatchedFlower.mothers_name}</Text>
              <Text style={styles.profileSub}>{autoMatchedFlower.botanical_name} — {autoMatchedFlower.common_name}</Text>
              <View style={styles.sigBox}>
                <Text style={styles.sigLabel}>Spiritual Significance</Text>
                <Text style={styles.sigText}>"{autoMatchedFlower.significance}"</Text>
              </View>
              <TouchableOpacity style={styles.confirmBtn} onPress={() => onConfirm(autoMatchedFlower)}><Text style={styles.confirmBtnText}>Confirm & Reveal Profile</Text></TouchableOpacity>
              <TouchableOpacity style={styles.overrideBtn} onPress={() => setShowGrid(true)}><Text style={styles.overrideBtnText}>Wrong Match? Let me pick</Text></TouchableOpacity>
            </ScrollView>
          </View>
        ) : (
          <View style={styles.bottomHalf}>
            <View style={styles.chipBar}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                {TRAITS.map(t => (
                  <TouchableOpacity key={t} onPress={() => toggle(t)} style={[styles.chip, !!selected[t] && styles.chipActive]}><Text style={[styles.chipText, !!selected[t] && styles.chipTextActive]}>{t.toUpperCase()}</Text></TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <ScrollView contentContainerStyle={styles.grid}>
              {filtered.map(item => (
                <TouchableOpacity key={item.id} style={styles.card} onPress={() => onConfirm(item)}>
                  <Image source={{ uri: item.localImagePath }} style={styles.cardImg} contentFit="cover" />
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.mothers_name}</Text>
                  <Text style={styles.cardSub} numberOfLines={1}>{item.botanical_name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  topHalf: { flex: 1, position: 'relative', justifyContent: 'flex-end' },
  cancelBtn: { position: 'absolute', top: 40, right: 20, backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, zIndex: 10 },
  cancelText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 }, topOverlay: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 12 },
  overlayText: { color: '#ffffff', fontSize: 14, fontWeight: '700', textAlign: 'center', letterSpacing: 1 },
  bottomHalf: { flex: 1, backgroundColor: '#f7fafc', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  profileContainer: { padding: 24, alignItems: 'center' }, profileTitle: { fontSize: 22, fontWeight: '800', color: '#1a202c', textAlign: 'center', marginBottom: 6 },
  profileSub: { fontSize: 13, color: '#4a5568', fontStyle: 'italic', marginBottom: 20 },
  sigBox: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#edf2f7', borderLeftWidth: 4, borderLeftColor: '#319795', width: '100%', marginBottom: 24 },
  sigLabel: { fontSize: 9, textTransform: 'uppercase', color: '#a0aec0', fontWeight: '700', letterSpacing: 0.8, marginBottom: 4 }, sigText: { fontSize: 14, fontStyle: 'italic', color: '#2d3748', lineHeight: 20 },
  confirmBtn: { backgroundColor: '#319795', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 12 },
  confirmBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 }, overrideBtn: { paddingVertical: 10 },
  overrideBtnText: { color: '#319795', fontWeight: '600', fontSize: 13, textDecorationLine: 'underline' },
  chipBar: { height: 50, borderBottomWidth: 1, borderBottomColor: '#edf2f7', backgroundColor: '#ffffff', justifyContent: 'center' },
  chipScroll: { paddingHorizontal: 12, alignItems: 'center', gap: 8 }, chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: '#edf2f7', borderWidth: 1, borderColor: '#e2e8f0' },
  chipActive: { backgroundColor: '#319795', borderColor: '#319795' }, chipText: { fontSize: 9, fontWeight: '700', color: '#4a5568' }, chipTextActive: { color: '#ffffff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12, justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#ffffff', borderRadius: 12, padding: 8, marginBottom: 12, borderWidth: 1, borderColor: '#edf2f7' },
  cardImg: { width: '100%', height: 110, borderRadius: 8, marginBottom: 8 }, cardTitle: { fontSize: 13, fontWeight: '700', color: '#2d3748' },
  cardSub: { fontSize: 10, color: '#718096', fontStyle: 'italic', marginTop: 2 }, spinner: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a202c' }
});
