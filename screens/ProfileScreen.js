import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from '../context/UserContext';
import { COLORS, SIZES } from '../utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');
const TOPBAR_OFFSET = height * 0.02;

export default function ProfileScreen({ navigation }) {
  const { user, updateUser, logout } = useContext(UserContext);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setDob(user.dob || '');
      setGender(user.gender || '');
      setAddress(user.address || '');
      setImage(user.profile_pic || null);
    }
  }, [user]);

  const pickImage = async () => {
    if (!isEditing) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Allow access to your photos');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      console.log('ImagePicker Error:', err);
      Alert.alert('Error', 'Could not pick image. Try again.');
    }
  };

  const saveChanges = async () => {
    if (!fullName || !email) {
      Alert.alert('Error', 'Full name and email are required.');
      return;
    }

    const updatedData = { fullName, email, phone, dob, gender, address, image };
    const result = await updateUser(updatedData);

    if (result.success) {
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={{ marginTop: -TOPBAR_OFFSET, alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.imageContainer}>
              <Image
                source={image ? { uri: image } : require('../assets/default-profile.jpg')}
                style={styles.profileImage}
              />
              {isEditing && <Text style={styles.editImageText}>Tap to change photo</Text>}
            </TouchableOpacity>

            <Text style={styles.name}>{fullName || 'User'}</Text>
          </View>

          <View style={styles.fieldsContainer}>
            {[
              { label: 'Full Name', value: fullName, setter: setFullName, keyboard: 'default' },
              { label: 'Email Address', value: email, setter: setEmail, keyboard: 'email-address' },
              { label: 'Phone Number', value: phone, setter: setPhone, keyboard: 'phone-pad' },
              { label: 'Date of Birth', value: dob, setter: setDob, keyboard: 'default' },
              { label: 'Gender', value: gender, setter: setGender, keyboard: 'default' },
              { label: 'Address', value: address, setter: setAddress, keyboard: 'default' },
            ].map((field, idx) => (
              <TextInput
                key={idx}
                style={styles.input}
                placeholder={field.label}
                value={field.value}
                onChangeText={field.setter}
                editable={isEditing}
                keyboardType={field.keyboard}
              />
            ))}
          </View>

          <View style={styles.buttonsContainer}>
            {isEditing ? (
              <TouchableOpacity style={styles.primaryButton} onPress={saveChanges}>
                <Text style={styles.buttonText}>Save Profile</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.primaryButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('ChangePassword')}>
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: 'red' }]} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20, alignItems: 'center' },
  imageContainer: { alignItems: 'center' },
  profileImage: { width: 130, height: 130, borderRadius: 65, backgroundColor: '#ccc' },
  editImageText: { textAlign: 'center', color: COLORS.primary, marginTop: 5 },
  name: { fontSize: SIZES.fontLarge, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 10 },
  fieldsContainer: { width: '100%', marginTop: 10 },
  input: { width: '100%', padding: 14, borderRadius: SIZES.radius, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#fff', marginBottom: 12 },
  buttonsContainer: { width: '100%', marginTop: 10 },
  primaryButton: { width: '100%', padding: 15, borderRadius: SIZES.radius, backgroundColor: COLORS.primary, alignItems: 'center', marginVertical: 6 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: SIZES.font },
});
