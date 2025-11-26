import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // Load transactions from storage when the app starts
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await AsyncStorage.getItem('transactions');
        if (data) setTransactions(JSON.parse(data));
      } catch (error) {
        console.log('Error loading transactions:', error);
      }
    };
    loadTransactions();
  }, []);

  // Add a new transaction
  const addTransaction = async (transaction) => {
    try {
      const newTransaction = {
        id: Date.now().toString(),
        ...transaction,
        date: new Date(transaction.date).toISOString(), 
      };
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    } catch (error) {
      console.log('Error adding transaction:', error);
    }
  };

  // Calculate total wallet balance
  const totalBalance = transactions.reduce((acc, t) => {
    if (t.type === 'Add Money') return acc + t.amount;
    else return acc - t.amount;
  }, 0);

  return (
    <TransactionContext.Provider
      value={{ transactions, addTransaction, totalBalance }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
