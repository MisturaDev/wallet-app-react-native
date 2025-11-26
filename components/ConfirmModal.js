import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../utils/theme'; 

export default function ConfirmModal({ visible, details, onClose, onConfirm }) {
  if (!details) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"      // removed transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Confirm Purchase</Text>

          <View style={styles.detailsContainer}>
            <Text style={styles.detail}>Network: {details.network}</Text>
            <Text style={styles.detail}>Phone: {details.phone}</Text>
            {details.plan && <Text style={styles.detail}>Plan: {details.plan}</Text>}
            {details.amount && <Text style={styles.detail}>Amount: ₦{details.amount}</Text>}
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirm]} onPress={onConfirm}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  modal: {
    width: '85%',
    backgroundColor: COLORS.background, 
    borderRadius: 12,
    padding: SIZES.padding,
  },
  title: {
    fontSize: SIZES.fontLarge,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    color: COLORS.textPrimary,
  },
  detailsContainer: { marginBottom: 20 },
  detail: {
    fontSize: SIZES.font,
    marginVertical: 3,
    color: COLORS.textPrimary,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancel: {
    backgroundColor: '#B0B0B0',
  },
  confirm: {
    backgroundColor: COLORS.primary, 
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: SIZES.font,
  },
});
