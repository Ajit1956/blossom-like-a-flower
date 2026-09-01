import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';

import { balanceText } from './textUtils';

export default function VarietiesModal({ varieties, onPushScreen, onPopScreen, onGoHome }) {
  if (!varieties || varieties.length === 0) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onPopScreen} style={styles.btnBackArrow}>
              <Text style={styles.btnBackArrowText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>All Varieties ({varieties.length})</Text>
            <TouchableOpacity onPress={onGoHome || onPopScreen} style={styles.btnHome}>
              <Text style={styles.btnHomeText}>🏠 Home</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            {varieties.map((item, index) => (
              <TouchableOpacity 
                key={item.id || index} 
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => onPushScreen && onPushScreen('FLOWER', { flower: item, isFromVariety: true })}
              >
                <Image 
                  source={{ uri: item.image_url }} 
                  style={styles.image}
                  contentFit="cover"
                  transition={500}
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.mothersName}>{balanceText(item.mothers_name)}</Text>
                  <Text style={styles.botanicalName}>{item.botanical_name}</Text>
                  {item.common_names && item.common_names.length > 0 && (
                    <Text style={styles.commonName} numberOfLines={1}>
                      {item.common_names[0]}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justify: 'center',
    alignItems: 'center',
    padding: 12,
    zIndex: 9999,
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
  },
  modalContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'web' ? 14 : 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    backgroundColor: '#111827',
  },
  headerTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '700',
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
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4FD1C5',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#374151',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  mothersName: {
    color: '#FDE047',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  botanicalName: {
    color: '#9ca3af',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  commonName: {
    color: '#6b7280',
    fontSize: 12,
  },
  btnBackArrow: { padding: 4, width: 36 },
  btnBackArrowText: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  btnHome: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12 },
  btnHomeText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
});
