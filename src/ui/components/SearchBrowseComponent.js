import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';

export default function SearchBrowseComponent({ 
  value, 
  onChangeText, 
  onSubmitEditing, 
  placeholder, 
  editable,
  onClear
}) {
  const hasText = value && value.trim().length > 0;
  
  return (
    <View style={styles.wrapper}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.searchInput, !editable && { opacity: 0.5 }]}
          placeholder={placeholder}
          placeholderTextColor="#a0aec0"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          editable={editable}
          onSubmitEditing={onSubmitEditing}
        />
        
        <View style={styles.rightActionContainer}>
          {hasText && (
            <>
              <TouchableOpacity onPress={onClear} style={styles.actionBtn}>
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSubmitEditing} style={styles.searchBtnRound}>
                <Text style={styles.searchBtnText}>🔍</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  inputWrapper: { position: 'relative' },
  searchInput: { 
    backgroundColor: '#2d3748', 
    color: '#ffffff', 
    borderRadius: 10, 
    paddingHorizontal: 16, 
    paddingRight: 80, 
    paddingVertical: 12, 
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)'
  },
  rightActionContainer: { position: 'absolute', right: 4, top: 0, bottom: 0, flexDirection: 'row', alignItems: 'center' },
  actionBtn: { width: 36, height: '100%', justifyContent: 'center', alignItems: 'center' },
  clearBtnText: { color: '#a0aec0', fontSize: 18, fontWeight: '700' },
  searchBtnRound: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center', marginLeft: 4, marginRight: 4 },
  searchBtnText: { fontSize: 14, color: '#1a202c' }
});
