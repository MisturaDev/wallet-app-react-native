import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { UserContext } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../utils/theme';

export default function ChangePasswordScreen({ navigation }) {
  const { user, updateUser } = useContext(UserContext);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const PasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required('Required')
      .test('match', 'Current password is incorrect', function (value) {
        return value === user?.password;
      }),
    newPassword: Yup.string().min(4, 'Too short!').required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Required'),
  });

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleChangePassword = async (values, { resetForm }) => {
    await updateUser({ password: values.newPassword });
    Toast.show({
      type: 'success',
      text1: 'Password Updated',
      text2: 'Your password has been successfully changed.',
      position: 'bottom',
    });
    resetForm();
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.heading}>Change Password</Text>

        <Formik
          initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
          validationSchema={PasswordSchema}
          onSubmit={handleChangePassword}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Current Password"
                  value={values.currentPassword}
                  onChangeText={handleChange('currentPassword')}
                  onBlur={handleBlur('currentPassword')}
                  secureTextEntry={!showCurrent}
                />
                <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                  <Ionicons name={showCurrent ? 'eye-off' : 'eye'} size={24} color="#777" />
                </TouchableOpacity>
              </View>
              {errors.currentPassword && touched.currentPassword && (
                <Text style={styles.error}>{errors.currentPassword}</Text>
              )}

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  value={values.newPassword}
                  onChangeText={handleChange('newPassword')}
                  onBlur={handleBlur('newPassword')}
                  secureTextEntry={!showNew}
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  <Ionicons name={showNew ? 'eye-off' : 'eye'} size={24} color="#777" />
                </TouchableOpacity>
              </View>
              {errors.newPassword && touched.newPassword && (
                <Text style={styles.error}>{errors.newPassword}</Text>
              )}

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm New Password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={24} color="#777" />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && touched.confirmPassword && (
                <Text style={styles.error}>{errors.confirmPassword}</Text>
              )}

              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  <Text style={styles.buttonText}>Save Password</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </Formik>
      </View>
      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: COLORS.background },
  card: { backgroundColor: '#fff', padding: 25, borderRadius: 15, elevation: 5 },
  heading: { fontSize: SIZES.fontLarge, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 20, textAlign: 'center' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: SIZES.radius, paddingHorizontal: 10, marginBottom: 12, backgroundColor: '#f9f9f9' },
  input: { flex: 1, paddingVertical: 12, fontSize: 16 },
  button: { backgroundColor: COLORS.primary, paddingVertical: 15, borderRadius: SIZES.radius, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: SIZES.font },
  error: { color: 'red', marginBottom: 8, marginLeft: 5 },
});
