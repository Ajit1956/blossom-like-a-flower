import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CustomSelect from './CustomSelect';

export default function ModeSelector({ onModeChange }) {
  const [mainMode, setMainMode] = useState('common'); // common, botanical, mothers
  const [subMode, setSubMode] = useState('mothers_alpha'); // mothers_alpha, mothers_any

  useEffect(() => {
    if (mainMode === 'mothers') {
      onModeChange(subMode);
    } else {
      onModeChange(mainMode);
    }
  }, [mainMode, subMode, onModeChange]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, mainMode === 'common' && styles.activeTab]} 
          onPress={() => setMainMode('common')}
        >
          <Text style={[styles.tabText, mainMode === 'common' && styles.activeTabText]}>Common Name</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, mainMode === 'botanical' && styles.activeTab]} 
          onPress={() => setMainMode('botanical')}
        >
          <Text style={[styles.tabText, mainMode === 'botanical' && styles.activeTabText]}>Botanical Name</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, mainMode === 'mothers' && styles.activeTab]} 
          onPress={() => setMainMode('mothers')}
        >
          <Text style={[styles.tabText, mainMode === 'mothers' && styles.activeTabText]}>Mother's Name</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, mainMode === 'color' && styles.activeTab]} 
          onPress={() => setMainMode('color')}
        >
          <Text style={[styles.tabText, mainMode === 'color' && styles.activeTabText]}>Color</Text>
        </TouchableOpacity>
      </ScrollView>

      {mainMode === 'mothers' && (
        <View style={styles.subContainer}>
          <CustomSelect 
            options={[
              { label: "Alphabetical", value: 'mothers_alpha' },
              { label: "Any Word", value: 'mothers_any' }
            ]}
            selectedValue={subMode}
            onSelect={setSubMode}
            placeholder="Select search type"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#2d3748',
  },
  activeTab: {
    backgroundColor: '#134e4a',
  },
  tabText: {
    color: '#a0aec0',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#ffffff',
  },
  subContainer: {
    marginTop: 8,
  }
});
