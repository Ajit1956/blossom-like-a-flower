import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Keyboard, StyleSheet } from 'react-native';
import SearchBrowseComponent from './SearchBrowseComponent';

export default function ExploreInputs({
  idQuery, handleIdChange,
  commonQuery, handleCommonChange,
  mothersQuery, handleMothersChange,
  localQuery, handleLocalChange,
  colorQuery, handleColorChange,
  showColorDropdown, setShowColorDropdown,
  isApiSearching,
  handleSearch,
  onSelectFlower,
  database,
  activeMode,
  specificView
}) {
  return (
    <>
      {(!specificView || specificView === 'id') && (
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.searchInput, activeMode === 'viewAll' && { opacity: 0.5 }]}
            placeholder="search flower ID (e.g. 001, 055, 574)..."
            placeholderTextColor="#a0aec0"
            value={idQuery}
            onChangeText={handleIdChange}
            keyboardType="number-pad"
            autoCapitalize="none"
            autoCorrect={false}
            editable={activeMode === 'searchBy'}
            onSubmitEditing={handleSearch}
          />
          {idQuery.length > 0 && activeMode === 'searchBy' && (
            <View style={styles.rightActionContainer}>
              <TouchableOpacity onPress={() => handleIdChange('')} style={styles.actionBtn}>
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSearch} style={styles.searchBtnRound}>
                <Text style={styles.searchBtnText}>🔍</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {(!specificView || specificView === 'common') && (
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.searchInput, activeMode === 'viewAll' && { opacity: 0.5 }]}
            placeholder="search common name..."
            placeholderTextColor="#a0aec0"
            value={commonQuery}
            onChangeText={handleCommonChange}
            autoCapitalize="none"
            autoCorrect={false}
            editable={activeMode === 'searchBy'}
            onSubmitEditing={handleSearch}
          />
          {commonQuery.length > 0 && activeMode === 'searchBy' && (
            <View style={styles.rightActionContainer}>
              <TouchableOpacity onPress={() => handleCommonChange('')} style={styles.actionBtn}>
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSearch} style={styles.searchBtnRound}>
                <Text style={styles.searchBtnText}>🔍</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      
      {(!specificView || specificView === 'keyword') && (
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.searchInput, activeMode === 'viewAll' && { opacity: 0.5 }]}
            placeholder="search Mother's name..."
            placeholderTextColor="#a0aec0"
            value={mothersQuery}
            onChangeText={handleMothersChange}
            autoCapitalize="none"
            autoCorrect={false}
            editable={activeMode === 'searchBy'}
            onSubmitEditing={handleSearch}
          />
          {mothersQuery.length > 0 && activeMode === 'searchBy' && (
            <View style={styles.rightActionContainer}>
              <TouchableOpacity onPress={() => handleMothersChange('')} style={styles.actionBtn}>
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSearch} style={styles.searchBtnRound}>
                <Text style={styles.searchBtnText}>🔍</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      
      {(!specificView || specificView === 'color') && (
      <View style={styles.inputWrapper}>
        <View style={{ position: 'relative' }}>
          <TextInput
            style={[styles.searchInput, activeMode === 'viewAll' && { opacity: 0.5 }]}
            placeholder="color (e.g. yellow)..."
            placeholderTextColor="#a0aec0"
            value={colorQuery}
            onChangeText={handleColorChange}
            onFocus={() => activeMode === 'searchBy' && setShowColorDropdown(true)}
            autoCapitalize="none"
            autoCorrect={false}
            editable={activeMode === 'searchBy'}
            onSubmitEditing={handleSearch}
          />
          <View style={styles.rightActionContainer}>
            {isApiSearching && colorQuery.length > 0 ? (
              <View style={styles.actionBtn}>
                <ActivityIndicator size="small" color="#FFD700" />
              </View>
            ) : colorQuery.length > 0 ? (
              <TouchableOpacity onPress={() => handleColorChange('')} style={styles.actionBtn}>
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => activeMode === 'searchBy' && setShowColorDropdown(!showColorDropdown)} style={styles.actionBtn}>
                <Text style={[styles.clearBtnText, { fontSize: 14, transform: [{ rotate: showColorDropdown ? '180deg' : '0deg' }] }]}>▼</Text>
              </TouchableOpacity>
            )}
            {colorQuery.length > 0 && activeMode === 'searchBy' && !isApiSearching && (
              <TouchableOpacity onPress={handleSearch} style={styles.searchBtnRound}>
                <Text style={styles.searchBtnText}>🔍</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {showColorDropdown && (
          <View style={styles.dropdownMenu}>
            {['blue', 'blue violet', 'golden yellow', 'green', 'lavender', 'magenta', 'maroon', 'mauve', 'orange', 'pink', 'purple', 'red', 'rose', 'violet', 'white', 'yellow'].map((color) => (
              <TouchableOpacity 
                key={color} 
                style={styles.dropdownItem}
                onPress={() => {
                  handleColorChange(color);
                  setShowColorDropdown(false);
                  Keyboard.dismiss();
                }}
              >
                <View style={[styles.colorCircle, { backgroundColor: color === 'mixed' ? 'transparent' : color }]} />
                <Text style={styles.dropdownItemText}>{color.charAt(0).toUpperCase() + color.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  inputWrapper: { position: 'relative', marginBottom: 8 },
  searchInput: { backgroundColor: '#2d3748', color: '#ffffff', borderRadius: 10, paddingHorizontal: 16, paddingRight: 80, paddingVertical: 12, fontSize: 16, fontWeight: '500', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.4)' },
  clearBtnText: { color: '#a0aec0', fontSize: 18, fontWeight: '700' },
  rightActionContainer: { position: 'absolute', right: 4, top: 0, bottom: 0, flexDirection: 'row', alignItems: 'center' },
  actionBtn: { width: 36, height: '100%', justifyContent: 'center', alignItems: 'center' },
  searchBtnRound: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center', marginLeft: 4, marginRight: 4 },
  searchBtnText: { fontSize: 14, color: '#1a202c' },
  dropdownMenu: { backgroundColor: '#2d3748', borderRadius: 10, marginTop: 4, paddingVertical: 4 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  colorCircle: { width: 16, height: 16, borderRadius: 8, marginRight: 12, borderWidth: 1, borderColor: '#4a5568' },
  dropdownItemText: { color: '#ffffff', fontSize: 15 },
});
