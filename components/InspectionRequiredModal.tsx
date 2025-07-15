import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AlertTriangle, Clipboard, Shield, Lock } from 'lucide-react-native';
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
      onRequestClose={() => {}} // Prevent back button from closing
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <AlertTriangle size={48} color={colors.warning} />
          </View>
          
          <Text style={styles.title}>HARD STOP: Pre-Trip Inspection Required</Text>
          
          <Text style={styles.message}>
            <Text style={styles.boldText}>FMCSA Federal Regulation:</Text> You cannot begin your driving shift without completing a full 21-point CDL pre-trip inspection. This is a mandatory safety requirement.
          </Text>
          
          <View style={styles.hardStopNotice}>
            <Lock size={16} color={colors.danger} />
            <Text style={styles.hardStopText}>
              System Locked - No Bypass Available
            </Text>
          </View>
          
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <Clipboard size={20} color={colors.primaryLight} />
              <Text style={styles.requirementText}>
                Complete ALL 21 CDL inspection points
              </Text>
            </View>
            
            <View style={styles.requirementItem}>
              <Shield size={20} color={colors.primaryLight} />
              <Text style={styles.requirementText}>
                Step-by-step category completion
              </Text>
            </View>
            
            <View style={styles.requirementItem}>
              <AlertTriangle size={20} color={colors.warning} />
              <Text style={styles.requirementText}>
                Document any defects or failures
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
            <Text style={styles.boldText}>WARNING:</Text> Attempting to bypass this inspection violates federal safety regulations and may result in penalties.
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
  boldText: {
    fontWeight: '600',
    color: colors.text,
  },
  hardStopNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  hardStopText: {
    fontSize: 14,
    color: colors.danger,
    marginLeft: 8,
    fontWeight: '600',
  },
});