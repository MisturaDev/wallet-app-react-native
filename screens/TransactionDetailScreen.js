import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { COLORS, SIZES } from '../utils/theme';

export default function TransactionDetailScreen({ route }) {
  
  const transaction = {
    ...route.params.transaction,
    date: typeof route.params.transaction.date === 'string'
      ? route.params.transaction.date
      : route.params.transaction.date.toString()
  };

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>No transaction data available</Text>
      </SafeAreaView>
    );
  }

  // Convert string to Date object for formatting
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + 
           ' | ' + 
           date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const isIncome = transaction.type === 'Add Money';
  const formattedAmount = `${isIncome ? '+' : '-'}₦${transaction.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

  const copyToClipboard = (value, label) => {
    Clipboard.setStringAsync(value);
    Alert.alert('Copied', `${label} copied to clipboard!`);
  };

  const detailFields = [
    { label: 'Amount', value: formattedAmount, isColored: true, copyable: true },
    { label: 'Type', value: transaction.type },
    { label: 'Network', value: transaction.network, copyable: true },
    { label: 'Plan', value: transaction.plan, copyable: true },
    { label: 'Recipient', value: transaction.recipient, copyable: true },
    { label: 'Note', value: transaction.note },
    { label: 'Payment Method', value: transaction.paymentMethod },
    { label: 'Date', value: formatDate(transaction.date) },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {/* Top Banner */}
          <View style={[styles.banner, { backgroundColor: isIncome ? COLORS.success : COLORS.danger }]}>
            <Ionicons
              name={isIncome ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
              size={28}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.bannerText}>{isIncome ? 'Income' : 'Expense'}</Text>
          </View>

          <Text style={styles.title}>{transaction.title}</Text>

          {/* Transaction Details */}
          {detailFields.map((detail, index) =>
            detail.value ? (
              <View key={index}>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>{detail.label}:</Text>
                  <View style={styles.valueRow}>
                    <Text style={[styles.value, detail.isColored ? (isIncome ? styles.income : styles.expense) : null]}>
                      {detail.value}
                    </Text>
                    {detail.copyable && (
                      <TouchableOpacity
                        onPress={() => copyToClipboard(detail.value.toString(), detail.label)}
                        style={{ marginLeft: 8 }}
                      >
                        <Ionicons name="copy-outline" size={20} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {index !== detailFields.length - 1 && <View style={styles.divider} />}
              </View>
            ) : null
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding, paddingBottom: 40 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  bannerText: {
    fontSize: SIZES.font,
    color: '#fff',
    fontWeight: '700',
  },

  title: {
    fontSize: SIZES.fontLarge,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.textPrimary,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  valueRow: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  label: { fontSize: SIZES.font, fontWeight: '600', color: COLORS.textSecondary, width: '35%' },
  value: { fontSize: SIZES.font, color: COLORS.textPrimary, width: '65%', textAlign: 'right', flexShrink: 1 },

  divider: { borderBottomWidth: 1, borderBottomColor: '#EEE', marginVertical: 4 },

  income: { color: '#4CAF50', fontWeight: '700' },
  expense: { color: '#F44336', fontWeight: '700' },

  emptyText: { textAlign: 'center', marginTop: 50, color: COLORS.textSecondary },
});
