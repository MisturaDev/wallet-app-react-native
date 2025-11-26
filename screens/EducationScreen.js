import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../utils/theme';
import { TransactionContext } from '../context/TransactionContext';

const formatNaira = (amount) =>
  `₦${parseFloat(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

export default function EducationScreen({ navigation }) {
  const { addTransaction } = useContext(TransactionContext);
  const [examType, setExamType] = useState('JAMB');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handlePay = () => {
    const amt = parseFloat(amount);
    if (!registrationNumber || !amount || amt <= 0) {
      Alert.alert('Error', 'Please fill in all fields with a valid amount');
      return;
    }

    addTransaction({
      title: `Education - ${examType} (${registrationNumber})`,
      type: 'Pay Bills',
      amount: amt,
      paymentMethod: examType,
      network: examType,
      recipient: registrationNumber,
      note: `Paid for ${examType} (${registrationNumber})`,
      date: new Date().toISOString(),
    });

    Alert.alert('Success', `You have paid ${formatNaira(amt)} for ${examType}!`);
    setRegistrationNumber('');
    setAmount('');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Select Biller</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={examType}
              onValueChange={(itemValue) => setExamType(itemValue)}
              mode="dropdown"
              style={styles.picker}
            >
              <Picker.Item label="JAMB" value="JAMB" />
              <Picker.Item label="WAEC" value="WAEC" />
              <Picker.Item label="NECO" value="NECO" />
            </Picker>
          </View>

          <TextInput
            placeholder="Registration Number"
            style={styles.input}
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
          />

          <TextInput
            placeholder="Amount"
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.payButton} onPress={handlePay}>
            <Text style={styles.payButtonText}>Pay</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SIZES.padding, paddingTop: SIZES.padding * 2, paddingBottom: 40 },
  label: { fontSize: SIZES.font, marginBottom: 6, color: COLORS.textPrimary },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: { height: Platform.OS === 'ios' ? 180 : 50, width: '100%' },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  payButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
