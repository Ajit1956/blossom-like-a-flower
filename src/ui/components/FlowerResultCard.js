import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
export default function FlowerResultCard({ flower, database, onConfirmMatch }) {
  if (!flower) return null;

  // The 'flower' prop is now the full API payload
  const mainMatch = flower.matchedFlower || flower;
  const alternatives = flower.alternativeFlowers || [];
  
  // Combine all matches and deduplicate by ID so we never render the same flower twice
  const combined = [mainMatch, ...alternatives];
  const gallery = [];
  const seenIds = new Set();
  
  for (const match of combined) {
    if (match && match.id && !seenIds.has(match.id)) {
      seenIds.add(match.id);
      gallery.push(match);
    }
  }
  
  // Keep only Top 5 to give the user more options for tricky flowers
  gallery.splice(5);

  const handleSelectMatch = (match) => {
    if (onConfirmMatch) {
      onConfirmMatch(match);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
        {gallery.map((match, idx) => {
          const name = match.mothers_name || match.flower_name || match.name;
          return (
            <TouchableOpacity 
              key={match.id} 
              style={styles.galleryCard}
              activeOpacity={0.8}
              onPress={() => handleSelectMatch(match)}
            >
              {match.image_url ? (
                <Image source={{ uri: match.image_url }} style={styles.galleryImage} resizeMode="contain" />
              ) : (
                <View style={[styles.galleryImage, { backgroundColor: '#374151', justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{color: '#9ca3af'}}>No Image</Text>
                </View>
              )}
              <View style={styles.cardContent}>
                <Text style={styles.matchName} numberOfLines={2}>{name}</Text>
                <View style={styles.badgeRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{idx === 0 ? 'Best Match' : `Alt #${idx}`}</Text>
                  </View>
                  <Text style={styles.idText}>ID: {match.id}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Text style={styles.galleryTitle}>Select the correct match</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
    alignItems: 'flex-start',
  },
  galleryTitle: {
    color: '#a0aec0',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    alignSelf: 'center',
  },
  galleryScroll: {
    paddingRight: 20,
    paddingBottom: 20,
  },
  galleryCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    width: 220,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 12,
  },
  matchName: {
    color: '#FDE047',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    minHeight: 40,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(79, 209, 197, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 197, 0.4)',
  },
  badgeText: {
    color: '#4FD1C5',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  idText: {
    color: '#a0aec0',
    fontSize: 12,
    fontWeight: '600',
  },
  noMatchCard: {
    borderColor: '#ef4444',
    backgroundColor: '#1a1d24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMatchIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  noMatchIcon: {
    color: '#ef4444',
    fontSize: 24,
    fontWeight: 'bold',
  },
  noMatchTitle: {
    color: '#f87171',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  noMatchSubtitle: {
    color: '#9ca3af',
    fontSize: 11,
    textAlign: 'center',
  }
});
