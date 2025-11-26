import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { TransactionContext } from '../context/TransactionContext';
import { COLORS, SIZES } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const datePart = date.toLocaleDateString(undefined, options);
  const timePart = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true, });
  return `${datePart} | ${timePart}`;
};

export default function TransactionHistoryScreen({ navigation }) {
  const { transactions } = useContext(TransactionContext);
  const [filter, setFilter] = useState('All'); // All, Income, Expense

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'All') return true;
    if (filter === 'Income') return tx.type === 'Add Money';
    if (filter === 'Expense') return tx.type !== 'Add Money';
  });

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const groupedTransactions = { Today: [], Yesterday: [], Earlier: [] };
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  sortedTransactions.forEach((tx) => {
    const txDate = new Date(tx.date).toDateString();
    if (txDate === today) groupedTransactions.Today.push(tx);
    else if (txDate === yesterdayStr) groupedTransactions.Yesterday.push(tx);
    else groupedTransactions.Earlier.push(tx);
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('TransactionDetail', {
          transaction: {
            ...item,
            date: item.date.toString(), 
          },
        })
      }
    >
      <View style={styles.itemContainer}>
        <View style={styles.itemLeft}>
          <View style={styles.titleRow}>
            <Ionicons
              name={item.type === 'Add Money' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
              size={20}
              color={item.type === 'Add Money' ? 'green' : 'red'}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.title}>{item.title}</Text>
          </View>
          {item.recipient && <Text style={styles.recipient}>To: {item.recipient}</Text>}
          {item.network && <Text style={styles.recipient}>Network: {item.network}</Text>}
          {item.plan && <Text style={styles.recipient}>Plan: {item.plan}</Text>}
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.itemRight}>
          <Text style={[styles.amount, item.type === 'Add Money' ? styles.income : styles.expense]}>
            {item.type === 'Add Money' ? '+' : '-'}₦{item.amount.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (title, data) =>
    data.length > 0 && (
      <View key={title}>
        <Text
          style={[
            styles.sectionHeader,
            title === 'Today' && { color: COLORS.primary, fontWeight: '700' },
          ]}
        >
          {title}
        </Text>
        <FlatList
          data={data}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : `${item.type}-${item.date}-${index}`
          }
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    );

  const renderFilterHeader = () => (
    <View style={styles.filterContainer}>
      {['All', 'Income', 'Expense'].map((type) => (
        <TouchableOpacity
          key={type}
          style={[styles.filterButton, filter === type && { backgroundColor: COLORS.primary }]}
          onPress={() => setFilter(type)}
        >
          <Text style={[styles.filterText, filter === type && { color: '#fff' }]}>{type}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {sortedTransactions.length === 0 ? (
        <>
          {renderFilterHeader()}
          <Text style={styles.emptyText}>No transactions yet</Text>
        </>
      ) : (
        <FlatList
          data={['Today', 'Yesterday', 'Earlier']}
          keyExtractor={(item) => item}
          renderItem={({ item }) => renderSection(item, groupedTransactions[item])}
          ListHeaderComponent={renderFilterHeader}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  emptyText: { textAlign: 'center', marginTop: 20, color: COLORS.textSecondary },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#E0E0E0' },
  filterText: { fontWeight: '600', color: COLORS.textPrimary },
  sectionHeader: { fontSize: SIZES.font, fontWeight: 'bold', color: COLORS.textSecondary, marginVertical: 8 },
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderRadius: SIZES.radius, marginBottom: 12, backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  itemLeft: {},
  itemRight: { alignItems: 'flex-end' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: SIZES.font, fontWeight: 'bold', color: COLORS.textPrimary },
  recipient: { fontSize: SIZES.fontSmall, color: COLORS.textSecondary },
  date: { fontSize: SIZES.fontSmall, color: COLORS.textSecondary, marginTop: 2 },
  amount: { fontSize: SIZES.font, fontWeight: 'bold' },
  income: { color: 'green' },
  expense: { color: 'red' },
  backButton: { backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: SIZES.radius, alignItems: 'center', marginTop: 10 },
  backButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: SIZES.font },
});
