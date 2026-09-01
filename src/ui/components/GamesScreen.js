import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GamesScreen({ onGoHome }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoHome} style={styles.btnBack}>
          <Text style={styles.btnBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Games</Text>
        <TouchableOpacity onPress={onGoHome} style={styles.btnHome}>
          <Text style={styles.btnHomeText}>🏠 Home</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Games Coming Soon!</Text>
        <Text style={styles.subtitle}>
          This is where we'll build interactive games with the flower database.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#134e4a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 44, paddingHorizontal: 16, marginTop: 8 },
  btnBack: { padding: 4, width: 40 },
  btnBackText: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  headerTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  btnHome: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12 },
  btnHomeText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  content: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#F5E8C7', fontSize: 24, fontWeight: '800', marginBottom: 12 },
  subtitle: { color: '#a0aec0', fontSize: 16, textAlign: 'center', lineHeight: 24 }
});
