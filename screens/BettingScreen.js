import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionContext } from '../context/TransactionContext';
import { COLORS, SIZES } from '../utils/theme';

// Helper function to format Naira
const formatNaira = (amount) =>
  `₦${parseFloat(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

export default function BettingScreen({ navigation }) {
  const { addTransaction } = useContext(TransactionContext);
  const [platform, setPlatform] = useState('Bet9ja');
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');

  const handlePay = () => {
    const amt = parseFloat(amount);
    if (!username || !amount || amt <= 0) {
      Alert.alert('Error', 'Please fill in all fields with a valid amount');
      return;
    }

    addTransaction({
  title: `Betting - ${platform} (${username})`,
  type: 'Pay Bills',
  amount: amt,
  paymentMethod: platform,
  network: platform,
  recipient: username,
  note: `Funded ${platform} account (${username})`,
  date: new Date().toISOString(),
});


    Alert.alert('Success', `You have funded ${platform} account (${username}) with ${formatNaira(amt)}!`);

    setUsername('');
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
            selectedValue={platform}
            onValueChange={(itemValue) => setPlatform(itemValue)}
            mode="dropdown"
            style={styles.picker}
          >
            <Picker.Item label="Bet9ja" value="Bet9ja" />
            <Picker.Item label="Nairabet" value="Nairabet" />
            <Picker.Item label="SportyBet" value="SportyBet" />
            <Picker.Item label="1xBet" value="1xBet" />
            <Picker.Item label="BetKing" value="BetKing" />
            <Picker.Item label="NaijaBet" value="NaijaBet" />
          </Picker>
        </View>

        <TextInput
          placeholder="Account Number"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          placeholder="Amount"
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>Fund Account</Text>
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
