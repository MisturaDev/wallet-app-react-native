import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS } from '../utils/theme'; 

const networks = [
  { id: 'mtn', name: 'MTN', logo: require('../assets/mtn.jpg') },
  { id: 'airtel', name: 'Airtel', logo: require('../assets/airtel.png') },
  { id: 'glo', name: 'Glo', logo: require('../assets/glo.jpg') },
  { id: '9mobile', name: '9mobile', logo: require('../assets/9mobile.png') },
];

export default function NetworkSelector({ selectedNetwork, onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Network</Text>
      <View style={styles.networkRow}>
        {networks.map((net) => (
          <TouchableOpacity
            key={net.id}
            style={[
              styles.networkButton,
              selectedNetwork === net.id && styles.selected,
            ]}
            onPress={() => onSelect(net.id)}
          >
            <Image source={net.logo} style={styles.logo} />
            <Text style={styles.name}>{net.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  networkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  networkButton: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    width: '23%',
    backgroundColor: '#fff', 
  },
  selected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightPrimary, 
  },
  logo: {
    width: 35,
    height: 35,
    marginBottom: 6,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
});
