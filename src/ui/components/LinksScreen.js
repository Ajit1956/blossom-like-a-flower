import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const links = [
  {
    title: 'The Mother on Flowers',
    description: 'Read the original book by The Mother containing the spiritual significance of various flowers.',
    url: 'https://motherandsriaurobindo.in/The-Mother/spiritual-significance-of-flowers'
  },
  {
    title: 'Blossom Like a Flower Website',
    description: 'A comprehensive resource exploring the spiritual meanings given by The Mother to flowers.',
    url: 'https://blossomlikeaflower.blogspot.com'
  },
  {
    title: 'Flowersong',
    description: 'Messages of the flowers and spiritual insights.',
    url: 'https://flowersong.in/messages-of-the-flowers/'
  },
  {
    title: 'Auroville Botanical Gardens',
    description: 'Information about the flora in Auroville and preserving the spiritual heritage of plants.',
    url: 'https://auroville-botanical-gardens.org/'
  }
];

export default function LinksScreen({ onGoHome }) {
  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoHome} style={styles.btnBack}>
          <Text style={styles.btnBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resources & Links</Text>
        <TouchableOpacity onPress={onGoHome} style={styles.btnHome}>
          <Text style={styles.btnHomeText}>🏠 Home</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageDescription}>
          Explore these external resources to learn more about the spiritual significance of flowers as given by The Mother.
        </Text>

        {links.map((link, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => openLink(link.url)}>
            <Text style={styles.cardTitle}>{link.title}</Text>
            <Text style={styles.cardDesc}>{link.description}</Text>
            <Text style={styles.cardLink}>Tap to open link →</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#134e4a' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3748',
    paddingHorizontal: 16,
  },
  btnBack: { padding: 4, width: 40 },
  btnBackText: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  btnHome: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  btnHomeText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    padding: 24,
  },
  pageDescription: {
    color: '#a0aec0',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4FD1C5',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDesc: {
    color: '#a0aec0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardLink: {
    color: '#4FD1C5',
    fontSize: 13,
    fontWeight: '600',
  }
});
