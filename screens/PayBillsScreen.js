import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../utils/theme';

export default function PayBillsScreen({ navigation }) {
  const payBillsItems = [
    { name: 'Cable TV', screen: 'CableTVScreen', icon: <Ionicons name="tv-outline" size={28} color={COLORS.primary} /> },
    { name: 'Electricity', screen: 'ElectricityScreen', icon: <MaterialCommunityIcons name="flash" size={28} color={COLORS.primary} /> },
    { name: 'Betting', screen: 'BettingScreen', icon: <FontAwesome5 name="futbol" size={28} color={COLORS.primary} /> },
    { name: 'Education', screen: 'EducationScreen', icon: <Ionicons name="school-outline" size={28} color={COLORS.primary} /> },
    { name: 'Government Collections', screen: 'GovernmentCollectionsScreen', icon: <MaterialCommunityIcons name="bank-outline" size={28} color={COLORS.primary} /> },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
  style={styles.itemContainer}
  onPress={() => navigation.navigate(item.screen)}
  activeOpacity={0.7}   
>
  <View style={styles.iconContainer}>{item.icon}</View>
  <Text style={styles.itemText}>{item.name}</Text>
  <Ionicons name="chevron-forward" size={24} color="#888" />
</TouchableOpacity>

  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={payBillsItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: SIZES.padding }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: SIZES.radius,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  iconContainer: { marginRight: 15 },
  itemText: { flex: 1, fontSize: SIZES.font, color: COLORS.textPrimary, fontWeight: '500' },
  separator: { height: 12 },
});
