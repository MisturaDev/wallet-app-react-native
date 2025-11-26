import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionContext } from '../context/TransactionContext';
import { COLORS, SIZES } from '../utils/theme';

// Helper function to format Naira
const formatNaira = (amount) =>
  `₦${parseFloat(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

export default function GovernmentCollectionsScreen({ navigation }) {
  const { addTransaction } = useContext(TransactionContext);
  const [service, setService] = useState('Remita');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handlePay = () => {
    const amt = parseFloat(amount);
    if (!referenceNumber || !amount || amt <= 0) {
      Alert.alert('Error', 'Please fill in all fields with a valid amount');
      return;
    }

    addTransaction({
  title: `Govt Payment - ${service} (${referenceNumber})`,
  type: 'Pay Bills',
  amount: amt,
  paymentMethod: service,
  network: service,
  recipient: referenceNumber,
  note: `Paid for ${service} (${referenceNumber})`,
  date: new Date().toISOString(),
});


    Alert.alert('Success', `You have paid ${formatNaira(amt)} to ${service} successfully!`);
    setReferenceNumber('');
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
            selectedValue={service}
            onValueChange={(itemValue) => setService(itemValue)}
            mode="dropdown"
            style={styles.picker}
          >
            <Picker.Item label="Remita" value="Remita" />
          </Picker>
        </View>

        <TextInput
          placeholder="Reference Number"
          style={styles.input}
          value={referenceNumber}
          onChangeText={setReferenceNumber}
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
