import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

export default function WelcomeScreen({ onNavigate }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Blossom Like a Flower</Text>
        <Image 
          source={require('../../../assets/lotus_painting.png')} 
          style={styles.image}
          contentFit="fill"
          transition={1000}
        />
        <Text style={styles.tagline}>"Let your life blossom like a flower..."</Text>
      </View>
      <View style={styles.buttonsWrapper}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.btn, styles.btnGames]} onPress={() => onNavigate(3)}>
            <Text style={[styles.btnText, styles.textGames]}>GAMES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnSearch]} onPress={() => onNavigate(1, 'explore')}>
            <Text style={[styles.btnText, styles.textSearch]}>EXPLORE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnLinks]} onPress={() => onNavigate(2)}>
            <Text style={[styles.btnText, styles.textLinks]}>LINKS</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.btn, styles.btnCamera]} onPress={() => onNavigate(0)}>
            <Text style={[styles.btnText, styles.textCamera]} numberOfLines={1}>IDENTIFY FLOWERS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnThemes]} onPress={() => onNavigate(1, 'themes')}>
            <Text style={[styles.btnText, styles.textThemes]} numberOfLines={1}>THEMES</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#051b1a', justifyContent: 'space-between', paddingTop: 24, paddingBottom: 5, paddingHorizontal: 10 },
  content: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 20 },
  subtitle: { color: '#1a202c', fontSize: 14, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  title: { color: '#F5E8C7', fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 44, letterSpacing: 0.5, marginTop: -20 },
  image: { width: '66%', height: 336, borderRadius: 24, marginBottom: 18, marginTop: 0 },
  tagline: { color: '#a0aec0', fontSize: 15, fontStyle: 'italic', textAlign: 'center', lineHeight: 22, paddingHorizontal: 16 },
  buttonsWrapper: { gap: 12, marginBottom: 0 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, backgroundColor: 'transparent', paddingVertical: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  btnText: { fontWeight: '800', fontSize: 12, letterSpacing: 0.8 },
  
  btnLinks: { borderColor: '#FFD700' },
  textLinks: { color: '#FFD700' },
  
  btnGames: { borderColor: '#F687B3' },
  textGames: { color: '#F687B3' },
  
  btnCamera: { borderColor: '#4FD1C5' },
  textCamera: { color: '#4FD1C5' },

  btnThemes: { borderColor: '#9F7AEA' },
  textThemes: { color: '#9F7AEA' },
  
  btnSearch: { borderColor: '#63B3ED' },
  textSearch: { color: '#63B3ED' },
  cameraBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
