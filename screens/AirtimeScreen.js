import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NetworkSelector from '../components/NetworkSelector';
import ConfirmModal from '../components/ConfirmModal';
import { TransactionContext } from '../context/TransactionContext';
import { COLORS, SIZES } from '../utils/theme';

const { height } = Dimensions.get('window');
const TOPBAR_OFFSET = height * 0.05; // 5% screen height

export default function AirtimeScreen({ navigation }) {
  const { addTransaction } = useContext(TransactionContext);

  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const details = {
    network: selectedNetwork,
    phone: phoneNumber,
    amount: amount ? parseInt(amount) : null,
  };

  const handleConfirm = () => {
    addTransaction({
      title: `Airtime Purchase - ${selectedNetwork.toUpperCase()}`,
      type: 'Pay Bills',
      amount: parseInt(amount),
      paymentMethod: 'Wallet',
      note: `Airtime purchase for ${phoneNumber}`,
      date: new Date().toISOString(),
      network: selectedNetwork,
      recipient: phoneNumber,
    });

    setModalVisible(false);
    alert(`Airtime Purchase Successful!`);

    setSelectedNetwork('');
    setPhoneNumber('');
    setAmount('');

    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'right', 'bottom', 'left']}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Move top bar slightly up */}
        <View style={{ marginTop: -TOPBAR_OFFSET }} />

        <NetworkSelector selectedNetwork={selectedNetwork} onSelect={setSelectedNetwork} />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.label}>Amount (₦)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity
          style={styles.payButton}
          onPress={() => {
            if (!selectedNetwork || !phoneNumber || !amount) {
              alert('Please fill all fields.');
              return;
            }
            setModalVisible(true);
          }}
        >
          <Text style={styles.payButtonText}>Buy Airtime</Text>
        </TouchableOpacity>

        <ConfirmModal
          visible={modalVisible}
          details={details}
          onClose={() => setModalVisible(false)}
          onConfirm={handleConfirm}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SIZES.padding, paddingBottom: 40 },
  label: { fontSize: SIZES.font, marginBottom: 6, color: COLORS.textPrimary },
  input: { borderWidth: 1, borderColor: '#CCC', padding: 14, borderRadius: 12, marginBottom: 15, fontSize: 16, backgroundColor: '#fff' },
  payButton: { backgroundColor: COLORS.primary, paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  payButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
