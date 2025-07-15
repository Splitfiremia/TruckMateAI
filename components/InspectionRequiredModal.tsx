import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AlertTriangle, Clipboard, Shield } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface InspectionRequiredModalProps {
  visible: boolean;
  onStartInspection: () => void;
}

export default function InspectionRequiredModal({ 
  visible, 
  onStartInspection 
}: InspectionRequiredModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <AlertTriangle size={48} color={colors.warning} />
          </View>
          
          <Text style={styles.title}>Pre-Trip Inspection Required</Text>
          
          <Text style={styles.message}>
            Federal regulations require a pre-trip inspection before you can begin driving. 
            This ensures your vehicle is safe and compliant with DOT standards.
          </Text>
          
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <Clipboard size={20} color={colors.primaryLight} />
              <Text style={styles.requirementText}>
                Complete all inspection items
              </Text>
            </View>
            
            <View style={styles.requirementItem}>
              <Shield size={20} color={colors.primaryLight} />
              <Text style={styles.requirementText}>
                Document any defects found
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={onStartInspection}
          >
            <Clipboard size={20} color={colors.text} />
            <Text style={styles.startButtonText}>Start Pre-Trip Inspection</Text>
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            You cannot begin driving until the inspection is completed
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: 16,
    width: '85%',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  requirementsList: {
    width: '100%',
    marginBottom: 24,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requirementText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});