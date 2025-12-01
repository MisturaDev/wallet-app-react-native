import React, { createContext, useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { uploadToCloudinary } from '../utils/cloudinary';


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
        setUser(userDoc.data() || { uid: firebaseUser.uid, email: firebaseUser.email });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // SIGNUP
  const signup = async ({ fullName, email, password }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Create Firestore user document
      await setDoc(doc(firestore, 'users', uid), {
        full_name: fullName,
        email,
        phone: '',
        dob: '',
        gender: '',
        address: '',
        profile_pic: '',
        uid,
      });

      const userDoc = await getDoc(doc(firestore, 'users', uid));
      setUser(userDoc.data());
      return { success: true, user: userDoc.data() };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(firestore, 'users', uid));
      setUser(userDoc.data());
      return { success: true, user: userDoc.data() };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // LOGOUT
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // UPDATE PROFILE
  const updateUser = async (updatedData) => {
    if (!user) return { success: false, message: 'No user logged in' };

    try {
      const userRef = doc(firestore, 'users', user.uid);

      let profilePicUrl = user.profile_pic || '';
      if (updatedData.image) {
        // Upload image to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(updatedData.image);
        if (cloudinaryResult.success) {
          profilePicUrl = cloudinaryResult.url;
        } else {
          return { success: false, message: 'Image upload failed' };
        }
      }

      await updateDoc(userRef, {
        full_name: updatedData.fullName,
        phone: updatedData.phone,
        dob: updatedData.dob,
        gender: updatedData.gender,
        address: updatedData.address,
        profile_pic: profilePicUrl,
      });

      const updatedUserDoc = await getDoc(userRef);
      setUser(updatedUserDoc.data());

      return { success: true, user: updatedUserDoc.data() };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <UserContext.Provider value={{ user, signup, login, logout, updateUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
