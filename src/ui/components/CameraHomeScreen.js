import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TextInput, ScrollView, Dimensions, Animated } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { processFlowerSnapshot, capturePhoto } from '../../logic/visionProcessor.js';
import { filterFlowers } from '../../logic/searchEngine';
import ConfirmationModal from './ConfirmationModal';

const { width } = Dimensions.get('window');

export default function CameraHomeScreen({ database: flowersData, onSnapshotProcessed, onSelectFlower, onGoHome, initialTab = 0 }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false); const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab); const [hint, setHint] = useState('Jasmine');
  const [selectedVariety, setSelectedVariety] = useState(null); const [confirmOpen, setConfirmOpen] = useState(false);
  const [photoUri, setPhotoUri] = useState(''); const [matchedFlower, setMatchedFlower] = useState(null);
  const slideAnim = useRef(new Animated.Value(initialTab)).current; const cameraRef = useRef(null);

  useEffect(() => { setActiveTab(initialTab); Animated.timing(slideAnim, { toValue: initialTab, duration: 0, useNativeDriver: true }).start(); }, [initialTab]);

  const handleCapture = async () => {
    setIsProcessing(true);
    try {
      const uri = await capturePhoto(cameraRef.current);
      const res = await processFlowerSnapshot(uri, flowersData, hint, selectedVariety?.id);
      setPhotoUri(uri); setMatchedFlower(res.matchedFlower); setConfirmOpen(true);
    } catch (e) { console.error(e); } finally { setIsProcessing(false); }
  };

  const renderCamera = () => {
    if (!permission) return <View style={styles.center}><ActivityIndicator size="large" color="#319795" /></View>;
    if (!permission.granted) return <View style={styles.center}><Text style={{ fontSize: 14, color: '#4a5568', textAlign: 'center', marginBottom: 16 }}>Camera access is required.</Text><TouchableOpacity style={{ backgroundColor: '#319795', padding: 12, borderRadius: 10 }} onPress={requestPermission}><Text style={{ color: '#ffffff', fontWeight: '600' }}>Grant Permission</Text></TouchableOpacity></View>;
    const varieties = flowersData.filter(f => f.localImagePath?.toLowerCase().includes(hint.toLowerCase()));
    return (
      <View style={{ flex: 1 }}><CameraView style={{ flex: 4 }} ref={cameraRef}>
        <View style={styles.overlay}><View style={styles.focalBox}><View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#319795', opacity: 0.8 }} /></View>
          <Text style={{ color: '#ffffff', fontSize: 13, marginTop: 16, fontWeight: '500' }}>Center the flower blossom within the box</Text>
        </View></CameraView>
        <View style={styles.shutterBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 30, marginBottom: 8 }} contentContainerStyle={{ gap: 6, paddingHorizontal: 12 }}>
            <TouchableOpacity onPress={() => setSelectedVariety(null)} style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10, backgroundColor: !selectedVariety ? '#319795' : '#2d3748' }}><Text style={{ color: '#ffffff', fontSize: 9, fontWeight: '700' }}>AUTO MATCH</Text></TouchableOpacity>
            {varieties.map(v => (
              <TouchableOpacity key={v.id} onPress={() => setSelectedVariety(v)} style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10, backgroundColor: selectedVariety?.id === v.id ? '#319795' : '#2d3748' }}><Text style={{ color: '#ffffff', fontSize: 9, fontWeight: '700' }}>{v.mothers_name.toUpperCase().substring(0, 16)}...</Text></TouchableOpacity>
            ))}
          </ScrollView>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
            {['Jasmine', 'Hibiscus', 'Plumeria'].map(h => (
              <TouchableOpacity key={h} onPress={() => { setHint(h); setSelectedVariety(null); }} style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, backgroundColor: hint === h ? '#319795' : '#2d3748' }}><Text style={{ color: '#ffffff', fontSize: 10, fontWeight: '600' }}>{h.toUpperCase()}</Text></TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.shutterButton} onPress={handleCapture} disabled={isProcessing}><View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#e53e3e' }} /></TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoHome} style={styles.homeBtn}><Text style={styles.homeBtnText}>Home</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>{activeTab === 0 ? "Camera Viewfinder" : "Spiritual Search"}</Text>
        <View style={{ width: 50 }} />
      </View>
      {activeTab === 0 ? renderCamera() : (
        <View style={styles.searchView}><TextInput style={styles.searchInput} placeholder="Search spiritual, common, or botanical..." placeholderTextColor="#a0aec0" value={searchQuery} onChangeText={setSearchQuery} />
          <ScrollView contentContainerStyle={styles.gridContainer}>
            {filterFlowers(searchQuery, flowersData).slice(0, 40).map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.card} onPress={() => onSelectFlower && onSelectFlower(item)}>
                <Image source={{ uri: item.localImagePath }} style={{ width: '100%', height: 100 }} />
                <View style={{ padding: 8 }}><Text style={{ fontSize: 13, fontWeight: '700', color: '#4A2E80' }} numberOfLines={1}>{item.mothers_name}</Text>
                  <Text style={{ fontSize: 11, fontStyle: 'italic', color: '#718096', marginTop: 2 }} numberOfLines={1}>{item.botanical_name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      <View style={styles.navBar}>
        <Animated.View style={[styles.indicator, { transform: [{ translateX: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, width / 2] }) }] }]} />
        <TouchableOpacity style={styles.navBtn} onPress={() => { setActiveTab(0); Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(); }}><Text style={[{ color: '#718096', fontWeight: '600', fontSize: 13 }, activeTab === 0 && { color: '#319795' }]}>CAMERA</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => { setActiveTab(1); Animated.timing(slideAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start(); }}><Text style={[{ color: '#718096', fontWeight: '600', fontSize: 13 }, activeTab === 1 && { color: '#319795' }]}>LIBRARY SEARCH</Text></TouchableOpacity>
      </View>
      <ConfirmationModal isOpen={confirmOpen} database={flowersData} autoMatchedFlower={matchedFlower} photoUri={photoUri} onConfirm={(item) => { setConfirmOpen(false); onSnapshotProcessed(photoUri, { matchedFlower: item }); }} onCancel={() => setConfirmOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a202c' }, center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7fafc', padding: 24 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }, focalBox: { width: 220, height: 220, borderWidth: 3, borderColor: '#319795', borderRadius: 24, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(49, 151, 149, 0.05)' },
  shutterBar: { flex: 1, backgroundColor: '#1a202c', justifyContent: 'center', alignItems: 'center' }, shutterButton: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  searchView: { flex: 1, backgroundColor: '#f7fafc', padding: 16 }, searchInput: { backgroundColor: '#ffffff', color: '#2d3748', padding: 12, borderRadius: 10, marginBottom: 16, fontSize: 15, borderWidth: 1, borderColor: '#cbd5e0' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 24 }, card: { width: '48%', backgroundColor: '#ffffff', borderRadius: 12, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#edf2f7' },
  navBar: { flexDirection: 'row', height: 60, borderTopWidth: 1, borderTopColor: '#edf2f7', backgroundColor: '#ffffff', position: 'relative' }, navBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  indicator: { position: 'absolute', top: 0, left: 0, width: '50%', height: 3, backgroundColor: '#319795', zIndex: 1 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50, borderBottomWidth: 1, borderBottomColor: '#2d3748', backgroundColor: '#1a202c', paddingHorizontal: 16 },
  homeBtn: { backgroundColor: '#2d3748', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 }, homeBtnText: { color: '#a0aec0', fontSize: 13, fontWeight: '600' }, headerTitle: { color: '#ffffff', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 }
});
