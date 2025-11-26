import React, { useState, useContext, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { TransactionContext } from '../context/TransactionContext';
import { COLORS, SIZES } from '../utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context'; 

// Helper function to format amounts in Naira
const formatNaira = (amount) => `₦${parseFloat(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

export default function AddMoneyScreen({ navigation }) {
  const { addTransaction, totalBalance } = useContext(TransactionContext);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card'); 
  const [note, setNote] = useState('');

  const quickAmounts = [500, 1000, 2000, 5000];

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Add Money' });
  }, [navigation]);

  const handleAddMoney = () => {
    const amt = parseFloat(amount);

    if (!amount || amt <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    addTransaction({
      title: 'Wallet Top-up',
      amount: amt,
      type: 'Add Money',
      paymentMethod,
      note,
      date: new Date(),
    });

    Alert.alert('Success', `Added ${formatNaira(amount)} to your wallet`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);

    setAmount('');
    setNote('');
    setPaymentMethod('Card');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView style={styles.container}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>{formatNaira(totalBalance)}</Text>
        </View>

        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Quick Add */}
        <View style={styles.quickAddContainer}>
          {quickAmounts.map((amt) => (
            <TouchableOpacity
              key={amt}
              style={styles.quickAddButton}
              onPress={() => setAmount(amt.toString())}
            >
              <Text style={styles.quickAddText}>{formatNaira(amt)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Method */}
        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.paymentContainer}>
          {['Card', 'Bank Transfer', 'USSD'].map((method) => (
            <TouchableOpacity
              key={method}
              style={[styles.paymentButton, paymentMethod === method && styles.paymentButtonSelected]}
              onPress={() => setPaymentMethod(method)}
            >
              <Text
                style={[
                  styles.paymentText,
                  paymentMethod === method && { color: '#fff', fontWeight: 'bold' },
                ]}
              >
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Note */}
        <Text style={styles.label}>Note (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Add a note"
          value={note}
          onChangeText={setNote}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddMoney}>
          <Text style={styles.addButtonText}>Add Money</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SIZES.padding },
  balanceCard: { backgroundColor: COLORS.primary, padding: 20, borderRadius: SIZES.radius, alignItems: 'center', marginBottom: 25, elevation: 4 },
  balanceLabel: { color: '#fff', fontSize: SIZES.font, marginBottom: 8 },
  balanceAmount: { color: '#fff', fontSize: SIZES.fontLarge, fontWeight: 'bold' },
  label: { fontSize: SIZES.font, fontWeight: 'bold', marginBottom: 6, color: COLORS.textPrimary },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 14, borderRadius: SIZES.radius, marginBottom: 15, backgroundColor: '#fff', fontSize: SIZES.font },
  quickAddContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  quickAddButton: { flex: 1, backgroundColor: '#64B5F6', paddingVertical: 12, borderRadius: SIZES.radius, alignItems: 'center', marginHorizontal: 5 },
  quickAddText: { color: '#fff', fontWeight: 'bold' },
  paymentContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  paymentButton: { flex: 1, paddingVertical: 12, marginHorizontal: 5, borderWidth: 1, borderColor: COLORS.primary, borderRadius: SIZES.radius, alignItems: 'center', backgroundColor: '#fff' },
  paymentButtonSelected: { backgroundColor: COLORS.primary },
  paymentText: { color: COLORS.primary },
  addButton: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: SIZES.radius, alignItems: 'center', marginBottom: 20 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: SIZES.font },
});
