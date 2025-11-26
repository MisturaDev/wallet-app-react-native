import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Load current user & users on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@current_user');
        if (storedUser) setUser(JSON.parse(storedUser));

        const storedUsers = await AsyncStorage.getItem('@users');
        if (storedUsers) setUsers(JSON.parse(storedUsers));
      } catch (error) {
        console.log('Error loading user data:', error);
      }
    };

    loadUser();
  }, []);

  // Signup
  const signup = async (userData) => {
    const existingUser = users.find((u) => u.email === userData.email);
    if (existingUser) return { success: false, message: 'Email already registered' };

    const newUser = { ...userData };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUser(newUser);

    await AsyncStorage.setItem('@users', JSON.stringify(updatedUsers));
    await AsyncStorage.setItem('@current_user', JSON.stringify(newUser));

    return { success: true, user: newUser };
  };

  // Login
  const login = async (email, password) => {
    const foundUser = users.find((u) => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      await AsyncStorage.setItem('@current_user', JSON.stringify(foundUser));
      return { success: true, user: foundUser };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  // Logout
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@current_user');
  };

  // Update user profile safely
  const updateUser = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);

      const updatedUsers = users.map((u) =>
        u.email === updatedUser.email ? updatedUser : u
      );
      setUsers(updatedUsers);

      // Persist changes
      await AsyncStorage.setItem('@current_user', JSON.stringify(updatedUser));
      await AsyncStorage.setItem('@users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.log('Error updating user:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, users, signup, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
