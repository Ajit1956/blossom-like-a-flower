import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import ViewDetailsModal from './ViewDetailsModal';
import { balanceText } from './textUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FlowerDetailCard({ flower, photoUri, database, onPushScreen, isFromVariety, hideImage = false }) {
  const [layout, setLayout] = useState({ width: SCREEN_WIDTH - 40, height: 260 });
  if (!flower) return null;

  const remoteImage = flower.image_url ? { uri: flower.image_url } : null;
  const imageSource = photoUri ? { uri: photoUri } : remoteImage;

  return (
    <ScrollView style={styles.card} contentContainerStyle={styles.content}>
      {!hideImage && imageSource && (
        <View 
          style={styles.imageWrapper}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            if (width > 50 && height > 50) {
              setLayout({ width, height });
            }
          }}
        >
          <Image 
            source={imageSource} 
            style={{ width: layout.width, height: layout.height, borderRadius: 20 }}
            contentFit="cover"
            transition={800}
          />
        </View>
      )}
      
      <View style={styles.headerRow}>
        <Text style={styles.header}>{balanceText(flower.mothers_name || flower.mothersName)}</Text>
      </View>

      <View style={styles.significanceBox}>
        <Text style={styles.label}>Spiritual Significance</Text>
        <Text style={styles.significance}>"{flower.mothers_significance || flower.significance}"</Text>
      </View>

      <TouchableOpacity 
        style={styles.viewDetailsButton} 
        onPress={() => onPushScreen && onPushScreen('DETAILS', { flower, database, isFromVariety })}
        activeOpacity={0.8}
      >
        <Text style={styles.viewDetailsText}>❀ Learn More →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#1f2937', borderRadius: 16, overflow: 'hidden', width: '100%', borderWidth: 1, borderColor: '#374151' },
  content: { padding: 20, flexGrow: 1, justifyContent: 'space-between' },
  imageWrapper: { flex: 1, width: '100%', minHeight: 220, borderRadius: 20, overflow: 'hidden', marginBottom: 16 },
  image: { flex: 1, width: '100%', minHeight: 220, borderRadius: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  header: { fontSize: 18, fontWeight: '800', color: '#FDE047', flex: 1, letterSpacing: 0.5, lineHeight: 24 },
  commonNameRow: { marginBottom: 16 },
  commonName: { fontSize: 16, color: '#9ca3af', fontWeight: '500' },
  significanceBox: { backgroundColor: '#111827', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#4FD1C5', marginBottom: 16 },
  label: { fontSize: 11, textTransform: 'uppercase', color: '#9ca3af', fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  significance: { fontSize: 16, fontWeight: '600', fontStyle: 'italic', color: '#4FD1C5', lineHeight: 24 },
  quoteBox: { backgroundColor: '#111827', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#dd6b20', marginTop: 8, marginBottom: 20 },
  quoteText: { fontSize: 14, fontStyle: 'italic', color: '#e2e8f0', lineHeight: 20, marginBottom: 8 },
  quoteSource: { fontSize: 12, color: '#9ca3af', textAlign: 'right' },
  viewDetailsButton: {
    backgroundColor: '#374151',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  viewDetailsText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700',
  }
});
