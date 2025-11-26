import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../utils/theme';
import { TransactionContext } from '../context/TransactionContext';

// Helper function to format Naira
const formatNaira = (amount) =>
  `₦${parseFloat(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

export default function ElectricityScreen({ navigation }) {
  const { addTransaction } = useContext(TransactionContext);
  const [serviceType, setServiceType] = useState('Prepaid');
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handlePay = () => {
    const amt = parseFloat(amount);
    if (!meterNumber || !amount || amt <= 0) {
      Alert.alert('Error', 'Please fill in all fields with a valid amount');
      return;
    }

    addTransaction({
  title: `Electricity Bill - ${serviceType} (${meterNumber})`,
  type: 'Pay Bills',
  amount: parseFloat(amount),
  paymentMethod: serviceType,
  network: serviceType,
  recipient: meterNumber,
  note: `Paid for electricity - ${serviceType} meter ${meterNumber}`,
  date: new Date().toISOString(),
});


    Alert.alert('Success', `You have paid ${formatNaira(amt)} for ${serviceType} electricity!`);
    setMeterNumber('');
    setAmount('');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Select Biller</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={serviceType}
            onValueChange={(itemValue) => setServiceType(itemValue)}
            mode="dropdown"
            style={styles.picker}
          >
            <Picker.Item label="Prepaid" value="Prepaid" />
            <Picker.Item label="Postpaid" value="Postpaid" />
          </Picker>
        </View>

        <TextInput
          placeholder="Meter Number"
          style={styles.input}
          value={meterNumber}
          onChangeText={setMeterNumber}
          keyboardType="numeric"
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SIZES.padding, paddingTop: SIZES.padding * 2, paddingBottom: 40 },
  label: { fontSize: SIZES.font, marginBottom: 6, color: COLORS.textPrimary },
  pickerWrapper: { borderWidth: 1, borderColor: '#CCC', borderRadius: 12, marginBottom: 20, backgroundColor: '#fff', overflow: 'hidden' },
  picker: { height: Platform.OS === 'ios' ? 180 : 50, width: '100%' },
  input: { borderWidth: 1, borderColor: '#CCC', padding: 14, borderRadius: 12, marginBottom: 15, fontSize: 16, backgroundColor: '#fff' },
  payButton: { backgroundColor: COLORS.primary, paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  payButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
