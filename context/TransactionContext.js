import React, { createContext, useState, useEffect, useContext } from 'react';
import { firestore } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { UserContext } from './UserContext';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { user } = useContext(UserContext); // get the logged-in user
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load transactions from Firestore
  useEffect(() => {
    if (!user) return;

    const loadTransactions = async () => {
      try {
        const q = query(
          collection(firestore, 'transactions'),
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        const txData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(txData);
      } catch (error) {
        console.log('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user]);

  // Add a new transaction
  const addTransaction = async (transaction) => {
    if (!user) return;

    try {
      const newTransaction = {
        ...transaction,
        userId: user.uid,
        date: new Date(transaction.date).toISOString(),
      };
      const docRef = await addDoc(collection(firestore, 'transactions'), newTransaction);
      setTransactions(prev => [{ id: docRef.id, ...newTransaction }, ...prev]);
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
    <TransactionContext.Provider value={{ transactions, addTransaction, totalBalance, loading }}>
      {children}
    </TransactionContext.Provider>
  );
};
