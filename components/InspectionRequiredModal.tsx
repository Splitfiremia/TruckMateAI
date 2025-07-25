import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AlertTriangle, Clipboard, Shield } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface InspectionRequiredModalProps {
  visible: boolean;
  onStartInspection: () => void;
  onDismiss?: () => void;
}

export default function InspectionRequiredModal({ 
  visible, 
  onStartInspection,
  onDismiss 
}: InspectionRequiredModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss || (() => {})}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <AlertTriangle size={48} color={colors.warning} />
          </View>
          
          <Text style={styles.title}>Pre-Trip Inspection Recommended</Text>
          
          <Text style={styles.message}>
            <Text style={styles.boldText}>Safety Recommendation:</Text> Complete a full 21-point CDL pre-trip inspection before beginning your driving shift for optimal safety and compliance.
          </Text>
          
          <View style={styles.recommendationNotice}>
            <Shield size={16} color={colors.primaryLight} />
            <Text style={styles.recommendationText}>
              Inspection Recommended for Safety
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
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={onStartInspection}
            >
              <Clipboard size={20} color={colors.white} />
              <Text style={styles.startButtonText}>Start Pre-Trip Inspection</Text>
            </TouchableOpacity>
            
            {onDismiss && (
              <TouchableOpacity 
                style={styles.dismissButton}
                onPress={onDismiss}
              >
                <Text style={styles.dismissButtonText}>Continue Without Inspection</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.disclaimer}>
            <Text style={styles.boldText}>Note:</Text> While not mandatory, completing inspections helps ensure vehicle safety and regulatory compliance.
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
    backgroundColor: colors.white,
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
    color: colors.text.primary,
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
    color: colors.text.primary,
    marginLeft: 12,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dismissButton: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  boldText: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  recommendationNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.primaryLight,
    marginLeft: 8,
    fontWeight: '600',
  },
});