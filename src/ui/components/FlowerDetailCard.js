import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Image } from 'expo-image';

export default function FlowerDetailCard({ flower, photoUri }) {
  if (!flower) return null;

  return (
    <ScrollView style={styles.card} contentContainerStyle={styles.content}>
      <Image 
        source={{ uri: photoUri || flower.localImagePath }} 
        style={styles.image}
        contentFit="cover"
        transition={1000}
      />
      <View style={styles.headerRow}>
        <Text style={styles.header}>{flower.mothers_name}</Text>
      </View>
      <Text style={styles.botanical}>
        {flower.botanical_name} — {flower.common_name}
      </Text>
      <View style={styles.significanceBox}>
        <Text style={styles.label}>Spiritual Significance</Text>
        <Text style={styles.significance}>"{flower.significance}"</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#ffffff', borderRadius: 16, overflow: 'hidden', width: '100%', maxWidth: 400 },
  content: { padding: 20 },
  image: { width: '100%', height: 250, borderRadius: 12, marginBottom: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  header: { fontSize: 22, fontWeight: '700', color: '#1a202c', flex: 1 },
  botanical: { fontStyle: 'italic', color: '#4a5568', fontSize: 14, marginBottom: 16 },
  significanceBox: { backgroundColor: '#f7fafc', padding: 16, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#319795', marginBottom: 16 },
  label: { fontSize: 9, textTransform: 'uppercase', color: '#a0aec0', fontWeight: '700', letterSpacing: 0.8, marginBottom: 6 },
  significance: { fontSize: 15, fontStyle: 'italic', color: '#2d3748', lineHeight: 22 }
});
