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
  onInspectionRequired?: (isBeginningTrip: boolean) => void;
}

export default function StatusChangeModal({ 
  visible, 
  onClose, 
  onInspectionRequired 
}: StatusChangeModalProps) {
  const { changeStatus, startBreak, endBreak, currentStatus, isOnBreak, startTrip } = useLogbookStore();
  const { canStartDriving, isInspectionRequired, checkInspectionForTripStart, dismissInspectionPrompt } = useInspectionStore();
  
  const handleStatusChange = (status: DutyStatus) => {
    // Determine if this is the beginning of a trip
    const isBeginningTrip = status === 'Driving' && 
      (currentStatus === 'Off Duty' || currentStatus === 'Sleeper Berth');
    
    // End break if currently on break
    if (isOnBreak && status !== 'Off Duty' && status !== 'Sleeper Berth') {
      endBreak();
    }
    
    // Start a new trip if beginning to drive
    if (isBeginningTrip) {
      startTrip();
    }
    
    // Check for inspection requirement when starting a trip
    if (status === 'Driving' && isBeginningTrip) {
      const needsInspection = checkInspectionForTripStart();
      if (needsInspection) {
        Alert.alert(
          'Trip Start - Pre-Trip Inspection Recommended',
          'A pre-trip inspection is recommended before beginning your trip for safety and compliance.',
          [
            { text: 'Start Trip Without Inspection', onPress: () => {
              dismissInspectionPrompt();
              const success = changeStatus(status, true);
              if (success) {
                onClose();
              }
            }},
            { 
              text: 'Do Inspection First', 
              style: 'cancel',
              onPress: () => {
                onClose();
                if (onInspectionRequired) {
                  onInspectionRequired(isBeginningTrip);
                }
              }
            }
          ]
        );
        return;
      }
    }
    
    // For non-trip driving changes, show warning but allow
    if (status === 'Driving' && !isBeginningTrip && isInspectionRequired) {
      Alert.alert(
        'Inspection Recommended',
        'A current pre-trip inspection is recommended for continued driving.',
        [
          { text: 'Continue Without Inspection', onPress: () => {
            const success = changeStatus(status, true);
            if (success) {
              onClose();
            }
          }},
          { 
            text: 'Do Inspection', 
            style: 'cancel',
            onPress: () => {
              onClose();
              if (onInspectionRequired) {
                onInspectionRequired(false);
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
        'Cannot Change Status',
        'There was an issue changing your duty status.',
        [{ text: 'OK' }]
      );
    }
  };
  
  const handleStartBreak = () => {
    if (isOnBreak) {
      endBreak();
      Alert.alert('Break Ended', 'Your break has been logged and ended.');
    } else {
      startBreak();
      Alert.alert('Break Started', '30-minute break has been started and will be logged.');
    }
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
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.options}>
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleStatusChange('Driving')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
                <Truck size={24} color={colors.text.primary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Driving</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleStatusChange('On Duty Not Driving')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.warning }]}>
                <Clock size={24} color={colors.text.primary} />
              </View>
              <Text style={styles.optionText}>On Duty (Not Driving)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleStatusChange('Sleeper Berth')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.textSecondary }]}>
                <Bed size={24} color={colors.text.primary} />
              </View>
              <Text style={styles.optionText}>Sleeper Berth</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleStatusChange('Off Duty')}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
                <Coffee size={24} color={colors.text.primary} />
              </View>
              <Text style={styles.optionText}>Off Duty</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.breakButton}
            onPress={handleStartBreak}
          >
            <Text style={styles.breakButtonText}>
              {isOnBreak ? 'End Break' : 'Start 30-Minute Break'}
            </Text>
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
    backgroundColor: colors.background.primary,
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