import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import PayBillsScreen from './PayBillsScreen';
import CableTVScreen from './CableTVScreen';
import ElectricityScreen from './ElectricityScreen';
import BettingScreen from './BettingScreen';
import EducationScreen from './EducationScreen';
import GovernmentCollectionsScreen from './GovernmentCollectionsScreen';
import { COLORS } from '../utils/theme';

const Stack = createNativeStackNavigator();

export default function PayBillsStack() {
  return (
    <Stack.Navigator
      initialRouteName="PayBillsHome"
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        animation: 'slide_from_right',
      }}
    >
      {/* PayBills Home */}
      <Stack.Screen
        name="PayBillsHome"
        component={PayBillsScreen}
        options={({ navigation }) => ({
          title: 'Pay Bills',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />

      {/* Nested screens */}
      <Stack.Screen name="CableTVScreen" component={CableTVScreen} options={{ title: 'Cable TV' }} />
      <Stack.Screen name="ElectricityScreen" component={ElectricityScreen} options={{ title: 'Electricity' }} />
      <Stack.Screen name="BettingScreen" component={BettingScreen} options={{ title: 'Betting' }} />
      <Stack.Screen name="EducationScreen" component={EducationScreen} options={{ title: 'Education' }} />
      <Stack.Screen name="GovernmentCollectionsScreen" component={GovernmentCollectionsScreen} options={{ title: 'Government Collections' }} />
    </Stack.Navigator>
  );
}
