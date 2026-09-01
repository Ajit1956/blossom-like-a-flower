import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, TouchableWithoutFeedback } from 'react-native';

export default function CustomSelect({ options, selectedValue, onSelect, placeholder = "Select..." }) {
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find(opt => opt.value === selectedValue);

  const handleSelect = (item) => {
    onSelect(item.value);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selector} onPress={() => setVisible(true)}>
        <Text style={selectedOption ? styles.text : styles.placeholder}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.icon}>▼</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.dropdown}>
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.option} onPress={() => handleSelect(item)}>
                    <Text style={[styles.optionText, item.value === selectedValue && styles.selectedOptionText]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  selector: {
    backgroundColor: '#2d3748',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a5568',
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
  },
  placeholder: {
    color: '#a0aec0',
    fontSize: 14,
  },
  icon: {
    color: '#a0aec0',
    fontSize: 12,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 24,
  },
  dropdown: {
    backgroundColor: '#1a202c',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4a5568',
    maxHeight: 200,
    overflow: 'hidden',
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3748',
  },
  optionText: {
    color: '#e2e8f0',
    fontSize: 14,
  },
  selectedOptionText: {
    color: '#134e4a',
    fontWeight: 'bold',
  }
});
