import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../utils/theme';

export default function PlanSelector({ selectedPlan, onSelect }) {
  const plans = [
    '500MB – ₦250',
    '1GB – ₦500',
    '2GB – ₦1000',
    '5GB – ₦2500',
    '10GB – ₦5000',
  ];

  return (
    <View style={styles.container}>
      {plans.map((item) => (
        <TouchableOpacity
          key={item}
          style={[styles.planButton, item === selectedPlan && styles.selected]}
          onPress={() => onSelect(item)}
        >
          <Text style={[styles.planText, item === selectedPlan && styles.selectedText]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: SIZES.padding / 2 },
  planButton: {
  paddingVertical: 10,       
  paddingHorizontal: 12,     
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: 12,
  marginBottom: SIZES.padding / 2,
  backgroundColor: COLORS.background,
},
  selected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  planText: {
    fontSize: SIZES.font,
    color: COLORS.textPrimary,
  },
  selectedText: {
    color: '#fff',
  },
});
