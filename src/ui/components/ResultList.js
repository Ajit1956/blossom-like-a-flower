import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { formatFlowerName } from './textUtils';

export default function ResultList({ results, searchQuery, onSelectFlower, errorMessage }) {
  const renderItem = ({ item }) => {
    const remoteImage = item.image_url ? { uri: item.image_url } : null;
    return (
      <View>
        {item.section_title && (typeof item.section_title !== 'string' || !String(item.section_title).toLowerCase().includes('letter')) && (
          <View style={styles.sectionBanner}>
            <Text style={styles.sectionBannerText} numberOfLines={1}>{item.section_title}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.card} onPress={() => onSelectFlower(item)}>

          {remoteImage ? (
            <Image source={remoteImage} style={styles.thumbnail} contentFit="cover" />
          ) : (
            <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
          <View style={styles.cardInfo}>
            <Text style={styles.mothersName} numberOfLines={1}>
              {item.id ? `#${String(item.id).padStart(3, '0')} ` : ''}{formatFlowerName(item.mothers_name)}
            </Text>
            <Text style={[styles.botanicalName, item.edible_crop_name && { color: '#38BDF8', fontWeight: '600', fontStyle: 'normal' }]} numberOfLines={1}>
              {item.edible_crop_name || item.botanical_name}
            </Text>
            {!item.edible_crop_name && (
              <Text style={styles.commonName} numberOfLines={1}>
                {Array.isArray(item.common_names) ? item.common_names.join(', ') : item.common_name}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {results && results.length > 0 && (
        <Text style={styles.resultsCountText}>
          Flowers - {results.length}
        </Text>
      )}
      <FlatList
        data={results}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          errorMessage ? (
            <Text style={styles.emptyText}>{errorMessage}</Text>
          ) : (searchQuery && searchQuery.length > 0) ? (
            <Text style={styles.emptyText}>No flowers found matching "{searchQuery}"</Text>
          ) : (
            <Text style={styles.emptyText}>Start typing to search our flower database.</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultsCountText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  placeholderThumbnail: {
    backgroundColor: '#4a5568',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#a0aec0',
    fontSize: 10,
  },
  cardInfo: {
    flex: 1,
  },
  mothersName: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  botanicalName: {
    color: '#e2e8f0',
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  commonName: {
    color: '#a0aec0',
    fontSize: 12,
  },
  emptyText: {
    color: '#a0aec0',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
  sectionBanner: {
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    backgroundColor: '#1E293B',
    borderRadius: 8,
  },
  sectionBannerText: {
    color: '#4ADE80',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
