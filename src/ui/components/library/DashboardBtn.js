import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function DashboardBtn({ title, onPress, color = '#a0aec0', bgColor, borderColor, textColor, borderWidth }) {
  return (
    <TouchableOpacity 
      style={[
        styles.dashBtn, 
        { 
          borderColor: borderColor || color,
          borderWidth: borderWidth !== undefined ? borderWidth : 1,
          backgroundColor: bgColor || '#1f2937' 
        }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.dashBtnText, { color: textColor || color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dashBtn: { 
    width: '100%',
    backgroundColor: '#1f2937', 
    paddingVertical: 16, 
    paddingHorizontal: 20, 
    borderRadius: 12, 
    borderWidth: 1,
    justifyContent: 'center'
  },
  dashBtnText: { fontSize: 16, fontWeight: '700' },
});
