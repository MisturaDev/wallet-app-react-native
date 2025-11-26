// auth.js
import { supabase } from './supabase';

// Sign up a new user
export const signUpUser = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.log('Sign up error:', error.message);
    return null;
  }
  console.log('User signed up:', data.user);
  return data.user;
};

// Login an existing user
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log('Login error:', error.message);
    return null;
  }
  console.log('User logged in:', data.user);
  return data.user;
};
