import React, { useRef, useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { UserContext } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/theme';

export default function LoginScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { login } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(4, 'Too Short!').required('Required'),
  });

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleLogin = async (values) => {
    const { email, password } = values;
    const result = await login(email, password);

    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: `Welcome back, ${result.user.fullName}`,
        position: 'bottom',
      });
      navigation.navigate('Dashboard');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: result.message,
        position: 'bottom',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              {/* Email input */}
              <TextInput
                placeholder="Email"
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
              />
              {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}

              {/* Password input with eye toggle */}
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Password"
                  style={styles.inputPassword}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#777" />
                </TouchableOpacity>
              </View>
              {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}

              {/* Login button */}
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Signup link */}
              <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.link}>
                <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f0f4f7' },
  card: { backgroundColor: '#fff', padding: 25, borderRadius: 15, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 10, marginBottom: 12, backgroundColor: '#f9f9f9' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 14, borderRadius: 10, marginBottom: 12, backgroundColor: '#f9f9f9', fontSize: 16 },
  inputPassword: { flex: 1, paddingVertical: 14, fontSize: 16 },
  button: { backgroundColor: COLORS.primary, paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  error: { color: 'red', marginBottom: 8 },
  link: { marginTop: 15, alignItems: 'center' },
  linkText: { color: COLORS.primary, fontWeight: 'bold' },
});
