import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../context/UserContext';
import { TransactionContext } from '../context/TransactionContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../utils/theme';

const { height } = Dimensions.get('window');
const TOPBAR_OFFSET = height * 0.02;

export default function DashboardScreen({ navigation }) {
  const { user } = useContext(UserContext); // user profile from 'profiles'
  const { transactions, totalBalance } = useContext(TransactionContext);

  const dashboardItems = [
    { name: 'Add Money', icon: 'add-circle-outline', action: () => navigation.navigate('AddMoney') },
    { name: 'Send Money', icon: 'send-outline', action: () => navigation.navigate('SendMoney') },
    { name: 'Pay Bills', icon: 'card-outline', action: () => navigation.navigate('PayBillsStack', { screen: 'PayBillsHome' }) },
    { name: 'Transaction History', icon: 'list-circle-outline', action: () => navigation.navigate('TransactionHistory') },
    { name: 'Buy Airtime', icon: 'phone-portrait-outline', action: () => navigation.navigate('Airtime') },
    { name: 'Buy Data', icon: 'wifi-outline', action: () => navigation.navigate('Data') },
  ];

  const lastTransactions = transactions.slice(-4).reverse();

  const formatNaira = (amount) =>
    `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.txTitle}>{item.title}</Text>
      <Text style={[styles.txAmount, item.type === 'Add Money' ? styles.income : styles.expense]}>
        {item.type === 'Add Money' ? '+' : '-'}{formatNaira(item.amount)}
      </Text>
    </View>
  );

  // Use actual profile data from UserContext
  const fullName = user?.full_name || 'User';
  const profileImage = user?.profile_pic ? { uri: user.profile_pic } : require('../assets/default-profile.jpg');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }} edges={['top', 'right', 'bottom', 'left']}>
      <FlatList
        data={lastTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        ListHeaderComponent={
          <>
            <View style={[styles.topBar, { marginTop: -TOPBAR_OFFSET }]}>
              <Text style={styles.welcomeText}>Hello, {fullName}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Image source={profileImage} style={styles.profileImage} />
              </TouchableOpacity>
            </View>

            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Text style={styles.balanceAmount}>{formatNaira(totalBalance)}</Text>
            </View>

            <View style={styles.actionContainer}>
              {dashboardItems.map((item, index) => (
                <TouchableOpacity key={index} style={styles.actionButton} onPress={item.action}>
                  <Ionicons name={item.icon} size={32} color="#fff" />
                  <Text style={styles.actionText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Recent Transactions</Text>
          </>
        }
        contentContainerStyle={{ padding: SIZES.padding }}
        ListEmptyComponent={<Text style={styles.noTxText}>No transactions yet</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  welcomeText: { fontSize: SIZES.fontLarge, fontWeight: 'bold', color: COLORS.textPrimary },
  profileImage: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: COLORS.primary },
  balanceCard: { backgroundColor: COLORS.primary, padding: 20, borderRadius: SIZES.radius, alignItems: 'center', marginBottom: 30, elevation: 4 },
  balanceLabel: { color: '#fff', fontSize: SIZES.font, marginBottom: 10 },
  balanceAmount: { color: '#fff', fontSize: SIZES.fontLarge, fontWeight: 'bold' },
  actionContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 30 },
  actionButton: { width: '48%', backgroundColor: COLORS.primary, paddingVertical: 20, borderRadius: SIZES.radius, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 3 },
  actionText: { color: '#fff', fontSize: SIZES.font, fontWeight: 'bold', marginTop: 8 },
  sectionTitle: { fontSize: SIZES.fontLarge, fontWeight: 'bold', marginBottom: 10, color: COLORS.textPrimary },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  txTitle: { fontSize: SIZES.font, color: COLORS.textPrimary },
  txAmount: { fontSize: SIZES.font, fontWeight: 'bold' },
  income: { color: COLORS.success },
  expense: { color: COLORS.danger },
  noTxText: { textAlign: 'center', color: COLORS.textSecondary, marginVertical: 10 },
});
