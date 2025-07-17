import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { 
  Smartphone, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  ArrowRight
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTelematicsStore, TelematicsDevice } from '@/store/telematicsStore';

interface DeviceDiscoveryPromptProps {
  visible: boolean;
  onClose: () => void;
  detectedDevice?: TelematicsDevice;
}

export default function DeviceDiscoveryPrompt({ 
  visible, 
  onClose, 
  detectedDevice 
}: DeviceDiscoveryPromptProps) {
  const { connectDevice, isScanning } = useTelematicsStore();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!detectedDevice) return;
    
    setIsConnecting(true);
    try {
      const success = await connectDevice(detectedDevice.id);
      if (success) {
        Alert.alert(
          'Device Connected!',
          `Your ${detectedDevice.name} is now connected and ready to use.`,
          [{ text: 'Great!', onPress: onClose }]
        );
      } else {
        Alert.alert(
          'Connection Failed',
          'Unable to connect to the device. You can try again later in Settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Device Setup?',
      'You can connect your device later in Settings > Integrations.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: onClose }
      ]
    );
  };

  if (!detectedDevice) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.text.secondary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Smartphone size={32} color={colors.primary} />
              <View style={styles.detectedBadge}>
                <CheckCircle size={16} color={colors.success} />
              </View>
            </View>
            <Text style={styles.title}>Device Detected!</Text>
            <Text style={styles.subtitle}>
              We found a {detectedDevice.name} nearby
            </Text>
          </View>

          <View style={styles.deviceInfo}>
            <View style={styles.deviceCard}>
              <View style={styles.deviceHeader}>
                <Text style={styles.deviceName}>{detectedDevice.name}</Text>
                <View style={styles.deviceBadge}>
                  <Text style={styles.deviceBadgeText}>
                    {detectedDevice.type.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.deviceDetails}>
                <View style={styles.deviceDetail}>
                  <Text style={styles.detailLabel}>Connection:</Text>
                  <Text style={styles.detailValue}>
                    {detectedDevice.connectionMethod}
                  </Text>
                </View>
                
                {detectedDevice.signalStrength && (
                  <View style={styles.deviceDetail}>
                    <Text style={styles.detailLabel}>Signal:</Text>
                    <Text style={styles.detailValue}>
                      {detectedDevice.signalStrength}%
                    </Text>
                  </View>
                )}
                
                <View style={styles.deviceDetail}>
                  <Text style={styles.detailLabel}>ELD Certified:</Text>
                  <Text style={[
                    styles.detailValue,
                    detectedDevice.isELDCertified && styles.certifiedText
                  ]}>
                    {detectedDevice.isELDCertified ? 'Yes' : 'No'}
                  </Text>
                </View>
              </View>

              <View style={styles.capabilities}>
                <Text style={styles.capabilitiesTitle}>Features:</Text>
                <View style={styles.capabilitiesList}>
                  {detectedDevice.capabilities.map((capability, index) => (
                    <View key={index} style={styles.capabilityItem}>
                      <Zap size={12} color={colors.primary} />
                      <Text style={styles.capabilityText}>
                        {capability.toUpperCase()}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.benefits}>
            <Text style={styles.benefitsTitle}>Connect in 2 taps to enable:</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <CheckCircle size={16} color={colors.success} />
                <Text style={styles.benefitText}>Automatic logbook updates</Text>
              </View>
              <View style={styles.benefitItem}>
                <CheckCircle size={16} color={colors.success} />
                <Text style={styles.benefitText}>Real-time compliance monitoring</Text>
              </View>
              <View style={styles.benefitItem}>
                <CheckCircle size={16} color={colors.success} />
                <Text style={styles.benefitText}>Vehicle diagnostics & maintenance alerts</Text>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <ActivityIndicator size="small" color={colors.text.primary} />
              ) : (
                <>
                  <Text style={styles.connectButtonText}>Connect Device</Text>
                  <ArrowRight size={16} color={colors.text.primary} />
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <AlertTriangle size={14} color={colors.text.secondary} />
            <Text style={styles.footerText}>
              Connection is secure and encrypted
            </Text>
          </View>
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
    padding: 20,
  },
  container: {
    backgroundColor: colors.background.primary,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  detectedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  deviceInfo: {
    marginBottom: 24,
  },
  deviceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  deviceBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deviceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  deviceDetails: {
    gap: 8,
    marginBottom: 16,
  },
  deviceDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  certifiedText: {
    color: colors.success,
  },
  capabilities: {
    borderTopWidth: 1,
    borderTopColor: colors.background.secondary,
    paddingTop: 12,
  },
  capabilitiesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  capabilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  capabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  capabilityText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
  },
  benefits: {
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 12,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  actions: {
    gap: 12,
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  skipButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});