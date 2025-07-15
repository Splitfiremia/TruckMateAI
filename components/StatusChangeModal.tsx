import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { X, Truck, Clock, Bed, Coffee, Shield } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { DutyStatus } from '@/types';
import { useLogbookStore } from '@/store/logbookStore';
import { useInspectionStore } from '@/store/inspectionStore';

interface StatusChangeModalProps {
  visible: boolean;
  onClose: () => void;
  onInspectionRequired?: () => void;
}

export default function StatusChangeModal({ 
  visible, 
  onClose, 
  onInspectionRequired 
}: StatusChangeModalProps) {
  const { changeStatus, startBreak } = useLogbookStore();
  const { canStartDriving, isInspectionRequired } = useInspectionStore();
  
  const handleStatusChange = (status: DutyStatus) => {
    if (status === 'Driving' && isInspectionRequired) {
      Alert.alert(
        'Pre-Trip Inspection Required',
        'You must complete a pre-trip inspection before you can begin driving.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Start Inspection', 
            onPress: () => {
              onClose();
              if (onInspectionRequired) {
                onInspectionRequired();
              }
            }
          }
        ]
      );
      return;
    }
    
    const success = changeStatus(status, canStartDriving);
    if (success) {
      onClose();
    } else {
      Alert.alert(
        'Cannot Start Driving',
        'Pre-trip inspection must be completed first.',
        [{ text: 'OK' }]
      );
    }
  };
  
  const handleStartBreak = () => {
    startBreak();
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Change Duty Status</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.options}>
            <TouchableOpacity 
              style={[
                styles.option,
                isInspectionRequired && styles.disabledOption
              ]}
              onPress={() => handleStatusChange('Driving')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
                <Truck size={24} color={colors.text} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Driving</Text>
                {isInspectionRequired && (
                  <View style={styles.inspectionRequired}>
                    <Shield size={14} color={colors.warning} />
                    <Text style={styles.inspectionRequiredText}>Inspection required</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleStatusChange('On Duty Not Driving')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.warning }]}>
                <Clock size={24} color={colors.text} />
              </View>
              <Text style={styles.optionText}>On Duty (Not Driving)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleStatusChange('Sleeper Berth')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.textSecondary }]}>
                <Bed size={24} color={colors.text} />
              </View>
              <Text style={styles.optionText}>Sleeper Berth</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleStatusChange('Off Duty')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
                <Coffee size={24} color={colors.text} />
              </View>
              <Text style={styles.optionText}>Off Duty</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.breakButton}
            onPress={handleStartBreak}
          >
            <Text style={styles.breakButtonText}>Start 30-Minute Break</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: 16,
    width: '85%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  options: {
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  disabledOption: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  inspectionRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  inspectionRequiredText: {
    fontSize: 12,
    color: colors.warning,
    marginLeft: 4,
  },
  breakButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  breakButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});