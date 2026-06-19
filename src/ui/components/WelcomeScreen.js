import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';

export default function WelcomeScreen({ onNavigate }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Welcome to</Text>
        <Text style={styles.title}>Blossom Like a Flower (v2)</Text>
        <Image 
          source={require('../../../assets/lotus_painting.png')} 
          style={styles.image}
          contentFit="contain"
          transition={1000}
        />
        <Text style={styles.tagline}>"Let your life blossom like a flower..."</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.btn} onPress={() => onNavigate(0)}>
          <Text style={styles.btnText}>IDENTIFY FLOWER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => onNavigate(1)}>
          <Text style={[styles.btnText, styles.btnOutlineText]}>LIBRARY SEARCH</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a202c', justifyContent: 'space-between', padding: 24 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  subtitle: { color: '#319795', fontSize: 14, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 24, letterSpacing: 0.5 },
  image: { width: '85%', height: 260, borderRadius: 24, marginBottom: 24 },
  tagline: { color: '#a0aec0', fontSize: 15, fontStyle: 'italic', textAlign: 'center', lineHeight: 22, paddingHorizontal: 16 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginBottom: 20 },
  btn: { flex: 1, backgroundColor: '#319795', paddingVertical: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#319795', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#319795' },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 13, letterSpacing: 1 },
  btnOutlineText: { color: '#319795' }
});
