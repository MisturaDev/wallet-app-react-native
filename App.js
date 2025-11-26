import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TransactionProvider } from './context/TransactionContext';
import { UserProvider } from './context/UserContext';
import { COLORS } from './utils/theme';

// Screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import AddMoneyScreen from './screens/AddMoneyScreen';
import SendMoneyScreen from './screens/SendMoneyScreen';
import AirtimeScreen from './screens/AirtimeScreen';
import DataScreen from './screens/DataScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import TransactionDetailScreen from './screens/TransactionDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import PayBillsStack from './screens/PayBillsStack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <TransactionProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerStyle: { backgroundColor: COLORS.primary }, // header background
              headerTintColor: '#fff', // title & back button color
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            {/* Hide header for Login and Signup */}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />

            {/* Screens with headers */}
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
            <Stack.Screen name="AddMoney" component={AddMoneyScreen} options={{ title: 'Add Money' }} />
            <Stack.Screen name="SendMoney" component={SendMoneyScreen} options={{ title: 'Send Money' }} />
            <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} options={{ title: 'Transactions' }} />
            <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} options={{ title: 'Transaction Detail'}}/>
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Change Password' }} />

            {/* Nested stack */}
            <Stack.Screen name="PayBillsStack" component={PayBillsStack} options={{ headerShown: false }} />

            <Stack.Screen name="Airtime" component={AirtimeScreen} options={{ title: 'Buy Airtime' }} />
            <Stack.Screen name="Data" component={DataScreen} options={{ title: 'Buy Data' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </TransactionProvider>
    </UserProvider>
  );
}
