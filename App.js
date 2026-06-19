import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import WelcomeScreen from './src/ui/components/WelcomeScreen';
import CameraHomeScreen from './src/ui/components/CameraHomeScreen';
import FlowerDetailCard from './src/ui/components/FlowerDetailCard.js';
import databaseRaw from './src/data/test_flowers_database.json' with { type: 'json' };
import { enrichDatabase } from './src/logic/visionProcessor.js';

const database = enrichDatabase(databaseRaw);

export default function App() {
  const [screen, setScreen] = useState('WELCOME');
  const [initialTab, setInitialTab] = useState(0);
  const [snapshotResult, setSnapshotResult] = useState(null);
  const [showCard, setShowCard] = useState(false);

  const handleSnapshotProcessed = (uri, result) => {
    setSnapshotResult({ ...result, photoUri: uri });
    setShowCard(true);
  };

  const handleReset = () => {
    setSnapshotResult(null);
    setShowCard(false);
    setScreen('WELCOME');
  };

  const handleSelectFlower = (flower) => {
    setSnapshotResult({ matchedFlower: flower });
    setShowCard(true);
  };

  const handleWelcomeNavigate = (tabIndex) => {
    setInitialTab(tabIndex);
    setScreen('APP');
  };

  return (
    <SafeAreaView style={styles.container}>
      {screen === 'WELCOME' ? (
        <WelcomeScreen onNavigate={handleWelcomeNavigate} />
      ) : !showCard ? (
        <CameraHomeScreen 
          database={database} 
          initialTab={initialTab}
          onSnapshotProcessed={handleSnapshotProcessed} 
          onSelectFlower={handleSelectFlower}
          onGoHome={handleReset}
        />
      ) : (
        <View style={styles.cardContainer}>
          <FlowerDetailCard flower={snapshotResult?.matchedFlower} photoUri={snapshotResult?.photoUri} />
          <TouchableOpacity style={styles.btnBack} onPress={handleReset}>
            <Text style={styles.btnText}>Scan Another Flower</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a202c' },
  cardContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  btnBack: { marginTop: 24, backgroundColor: '#319795', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  btnText: { color: '#ffffff', fontWeight: '600', fontSize: 15 }
});
