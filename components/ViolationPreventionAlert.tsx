import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Alert,
  Vibration,
  Platform,
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Navigation,
  X,
  CheckCircle,
  Zap,
  Phone,
  Shield,
  FileText
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ComplianceViolationPrediction, ViolationOverride } from '@/types';
import { usePredictiveComplianceStore } from '@/store/predictiveComplianceStore';
import { useLogbookStore } from '@/store/logbookStore';

interface ViolationPreventionAlertProps {
  prediction: ComplianceViolationPrediction;
  visible: boolean;
  onDismiss: () => void;
  onActionTaken: (actionId: string) => void;
}

export const ViolationPreventionAlert: React.FC<ViolationPreventionAlertProps> = ({
  prediction,
  visible,
  onDismiss,
  onActionTaken
}) => {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [countdownAnim] = useState(new Animated.Value(1));
  const [timeRemaining, setTimeRemaining] = useState(prediction.timeToViolation);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);
  const [fineAccepted, setFineAccepted] = useState(false);
  
  const { executePreventionAction, overrideViolationPrediction, canOverrideViolation } = usePredictiveComplianceStore();
  const { startBreak, changeStatus, currentTripId, getWeeklyOverrideCount } = useLogbookStore();

  useEffect(() => {
    if (visible && prediction.severity === 'Critical') {
      // Vibrate for critical alerts
      if (Platform.OS !== 'web') {
        Vibration.vibrate([0, 500, 200, 500]);
      }

      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Countdown timer
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = Math.max(0, prev - 1);
        if (newTime === 0 && prediction.severity === 'Critical') {
          // Violation occurred
          if (Platform.OS !== 'web') {
            Vibration.vibrate([0, 1000, 500, 1000, 500, 1000]);
          }
        }
        return newTime;
      });
    }, 60000); // Update every minute

    return () => {
      clearInterval(interval);
      pulseAnim.stopAnimation();
    };
  }, [visible, prediction.severity]);

  const formatTime = (minutes: number) => {
    if (minutes <= 0) return 'NOW';
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getSeverityColor = () => {
    switch (prediction.severity) {
      case 'Critical': return colors.error;
      case 'Warning': return colors.warning;
      default: return colors.primary;
    }
  };

  const handleQuickAction = async (actionType: string) => {
    try {
      switch (actionType) {
        case 'break':
          startBreak();
          Alert.alert('Break Started', '30-minute break has been logged');
          break;
        case 'stop':
          changeStatus('Off Duty');
          Alert.alert('Status Changed', 'Changed to Off Duty status');
          break;
        case 'navigate':
          // Simulate navigation to nearest rest area
          Alert.alert('Navigation', 'Routing to nearest truck stop...');
          break;
        case 'emergency':
          Alert.alert(
            'Emergency Contact',
            'Contact dispatch or safety department?',
            [
              { text: 'Dispatch', onPress: () => console.log('Call dispatch') },
              { text: 'Safety', onPress: () => console.log('Call safety') },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
          break;
      }
      onActionTaken(actionType);
    } catch (error) {
      Alert.alert('Error', 'Failed to execute action');
    }
  };
  
  const handleOverrideRequest = () => {
    if (!canOverrideViolation(prediction.id)) {
      const weeklyCount = getWeeklyOverrideCount();
      Alert.alert(
        'Override Not Available',
        weeklyCount >= 3 
          ? 'Maximum 3 overrides per week already used'
          : 'This violation type cannot be overridden',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setShowOverrideModal(true);
  };
  
  const handleOverrideSubmit = async () => {
    if (!overrideReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for the override');
      return;
    }
    
    if (!riskAcknowledged) {
      Alert.alert('Error', 'Please acknowledge the safety risks');
      return;
    }
    
    if (prediction.estimatedFine && !fineAccepted) {
      Alert.alert('Error', 'Please acknowledge the potential fine');
      return;
    }
    
    const override: ViolationOverride = {
      id: `override-${Date.now()}`,
      timestamp: new Date().toISOString(),
      reason: overrideReason,
      driverId: 'current-driver', // In real app, get from auth
      documentedInTrip: true,
      tripId: currentTripId,
      riskAcknowledged,
      estimatedFineAccepted: fineAccepted
    };
    
    const success = await overrideViolationPrediction(prediction.id, override);
    
    if (success) {
      Alert.alert(
        'Override Applied',
        'Violation override has been documented in your trip log. Continue with caution.',
        [{ text: 'OK', onPress: () => {
          setShowOverrideModal(false);
          onActionTaken('override');
        }}]
      );
    } else {
      Alert.alert('Error', 'Failed to apply override. Please try again.');
    }
  };

  const handlePreventionAction = async (actionId: string) => {
    try {
      await executePreventionAction(actionId);
      onActionTaken(actionId);
    } catch (error) {
      Alert.alert('Error', 'Failed to execute prevention action');
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.alertContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <LinearGradient
            colors={[getSeverityColor() + '20', getSeverityColor() + '05']}
            style={styles.alertCard}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <AlertTriangle size={24} color={getSeverityColor()} />
                <View>
                  <Text style={[styles.alertTitle, { color: getSeverityColor() }]}>
                    {prediction.severity === 'Critical' ? '🚨 VIOLATION ALERT' : '⚠️ WARNING'}
                  </Text>
                  <Text style={styles.alertSubtitle}>
                    {prediction.type} Violation Predicted
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Countdown */}
            <View style={styles.countdownSection}>
              <Clock size={20} color={getSeverityColor()} />
              <Text style={styles.countdownLabel}>Time to Violation:</Text>
              <Animated.Text 
                style={[
                  styles.countdownTime,
                  { 
                    color: getSeverityColor(),
                    transform: [{ scale: countdownAnim }]
                  }
                ]}
              >
                {formatTime(timeRemaining)}
              </Animated.Text>
            </View>

            {/* Message */}
            <Text style={styles.message}>{prediction.message}</Text>

            {/* Current Status */}
            <View style={styles.statusSection}>
              <Text style={styles.statusLabel}>Current Status:</Text>
              <Text style={styles.statusValue}>
                {prediction.currentValue.toFixed(1)} / {prediction.thresholdValue} hours
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${Math.min(100, (prediction.currentValue / prediction.thresholdValue) * 100)}%`,
                      backgroundColor: getSeverityColor()
                    }
                  ]} 
                />
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsSection}>
              <Text style={styles.quickActionsTitle}>Quick Actions:</Text>
              <View style={styles.quickActions}>
                {prediction.type === 'Break' && (
                  <TouchableOpacity
                    style={[styles.quickActionButton, styles.primaryAction]}
                    onPress={() => handleQuickAction('break')}
                  >
                    <CheckCircle size={16} color="white" />
                    <Text style={styles.quickActionText}>Start Break</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[styles.quickActionButton, styles.secondaryAction]}
                  onPress={() => handleQuickAction('navigate')}
                >
                  <Navigation size={16} color={colors.primary} />
                  <Text style={[styles.quickActionText, { color: colors.primary }]}>
                    Find Parking
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickActionButton, styles.secondaryAction]}
                  onPress={() => handleQuickAction('stop')}
                >
                  <MapPin size={16} color={colors.primary} />
                  <Text style={[styles.quickActionText, { color: colors.primary }]}>
                    Go Off Duty
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Prevention Actions */}
            {prediction.preventionActions.length > 0 && (
              <View style={styles.preventionSection}>
                <Text style={styles.preventionTitle}>Recommended Actions:</Text>
                {prediction.preventionActions.slice(0, 3).map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[
                      styles.preventionAction,
                      action.urgency === 'Immediate' && styles.urgentAction
                    ]}
                    onPress={() => handlePreventionAction(action.id)}
                  >
                    <View style={styles.actionContent}>
                      <Text style={styles.actionTitle}>{action.title}</Text>
                      <Text style={styles.actionDescription}>{action.description}</Text>
                    </View>
                    <View style={styles.actionMeta}>
                      <Text style={styles.actionTime}>{action.estimatedTime}min</Text>
                      {action.automated && (
                        <Zap size={14} color={colors.primary} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Emergency Contact */}
            {prediction.severity === 'Critical' && (
              <TouchableOpacity
                style={styles.emergencyButton}
                onPress={() => handleQuickAction('emergency')}
              >
                <Phone size={16} color={colors.error} />
                <Text style={styles.emergencyText}>Emergency Contact</Text>
              </TouchableOpacity>
            )}

            {/* Fine Information */}
            {prediction.estimatedFine && (
              <View style={styles.fineSection}>
                <Text style={styles.fineLabel}>Potential Fine:</Text>
                <Text style={styles.fineAmount}>
                  ${prediction.estimatedFine.toLocaleString()}
                </Text>
              </View>
            )}
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    width: '100%',
    maxWidth: 400,
  },
  alertCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  alertSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  countdownLabel: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  countdownTime: {
    fontSize: 20,
    fontWeight: '700',
  },
  message: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  statusSection: {
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  quickActionsSection: {
    marginBottom: 20,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  primaryAction: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondaryAction: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  preventionSection: {
    marginBottom: 16,
  },
  preventionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  preventionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  urgentAction: {
    borderColor: colors.warning,
    backgroundColor: colors.warning + '10',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionMeta: {
    alignItems: 'center',
    gap: 4,
  },
  actionTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.error + '20',
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
  },
  emergencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
  fineSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.error + '10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  fineLabel: {
    fontSize: 14,
    color: colors.text,
  },
  fineAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
  },
  
  // Override Styles
  overrideSection: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.warning + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  overrideTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  overrideDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  overrideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.warning,
    borderRadius: 8,
    paddingVertical: 10,
  },
  overrideButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  
  overrideAppliedSection: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  overrideAppliedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  overrideAppliedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  overrideAppliedText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  overrideReason: {
    fontSize: 12,
    color: colors.text,
    fontStyle: 'italic',
  },
  
  // Override Modal Styles
  overrideModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overrideModalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
  },
  overrideModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overrideModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  overrideModalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overrideModalWarning: {
    fontSize: 14,
    color: colors.warning,
    backgroundColor: colors.warning + '10',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    lineHeight: 18,
  },
  overrideFormSection: {
    marginBottom: 20,
  },
  overrideFormLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  overrideReasonInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.background,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  overrideCheckboxSection: {
    marginBottom: 24,
    gap: 12,
  },
  overrideCheckbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
  overrideModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  overrideCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  overrideCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  overrideSubmitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.warning,
    alignItems: 'center',
  },
  overrideSubmitButtonDisabled: {
    backgroundColor: colors.border,
  },
  overrideSubmitText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});