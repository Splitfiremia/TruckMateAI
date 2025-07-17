import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  X,
  Smartphone,
  Wifi,
  Bluetooth,
  Search,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Settings,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTelematicsStore, DeviceType, TelematicsDevice } from '@/store/telematicsStore';

interface SmartDeviceOnboardingProps {
  onBack?: () => void;
  onComplete?: () => void;
  onSkip?: () => void;
}

type OnboardingStep = 'preference' | 'detection' | 'selection' | 'connection';

export default function SmartDeviceOnboarding({ 
  onBack, 
  onComplete, 
  onSkip 
}: SmartDeviceOnboardingProps) {
  const {
    devices,
    isScanning,
    onboardingPreference,
    startDeviceDetection,
    connectDevice,
    setOnboardingPreference,
    getDeviceRecommendations,
    detectDeviceFromUserAgent,
  } = useTelematicsStore();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('preference');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [autoDetectedDevice, setAutoDetectedDevice] = useState<DeviceType | null>(null);

  const recommendations = getDeviceRecommendations();

  useEffect(() => {
    // Auto-detect device on component mount
    const detected = detectDeviceFromUserAgent();
    if (detected !== 'unknown') {
      setAutoDetectedDevice(detected);
    }

    // Check for existing devices and show prompt
    if (devices.length > 0) {
      const connectedDevice = devices.find(d => d.status === 'connected');
      if (connectedDevice) {
        setCurrentStep('connection');
        setSelectedDeviceId(connectedDevice.id);
      }
    }
  }, []);

  const handlePreferenceSelection = async (option: 'existing' | 'recommendations' | 'skip') => {
    switch (option) {
      case 'existing':
        setOnboardingPreference({ hasExistingDevice: true, skipDetection: false });
        setCurrentStep('detection');
        // Start detection immediately
        await startDeviceDetection();
        setCurrentStep('selection');
        break;
      case 'recommendations':
        setOnboardingPreference({ hasExistingDevice: false, needsRecommendation: true });
        setCurrentStep('selection');
        break;
      case 'skip':
        setOnboardingPreference({ skipDetection: true });
        onSkip?.();
        break;
    }
  };

  const handleDeviceSelection = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setCurrentStep('connection');
  };

  const handleConnectDevice = async () => {
    if (!selectedDeviceId) return;

    setIsConnecting(true);
    try {
      const success = await connectDevice(selectedDeviceId);
      if (success) {
        Alert.alert('Success!', 'Device connected successfully', [
          { text: 'Continue', onPress: () => onComplete?.() }
        ]);
      } else {
        Alert.alert('Connection Failed', 'Please try again or select a different device');
        setCurrentStep('selection');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      setCurrentStep('selection');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRescan = async () => {
    setCurrentStep('detection');
    await startDeviceDetection();
    setCurrentStep('selection');
  };

  const renderPreferenceStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Device Setup</Text>
        <Text style={styles.stepSubtitle}>
          Let's connect your fleet hardware for automated tracking
        </Text>
      </View>

      {autoDetectedDevice && (
        <View style={styles.autoDetectedBanner}>
          <Zap size={20} color={colors.warning} />
          <View style={styles.autoDetectedContent}>
            <Text style={styles.autoDetectedTitle}>
              {autoDetectedDevice.toUpperCase()} device detected
            </Text>
            <Text style={styles.autoDetectedText}>
              We found a {autoDetectedDevice} device - connect it in 2 taps?
            </Text>
          </View>
        </View>
      )}

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => handlePreferenceSelection('existing')}
        >
          <View style={styles.optionIcon}>
            <Smartphone size={24} color={colors.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Yes, I have fleet hardware</Text>
            <Text style={styles.optionDescription}>
              Geotab, Samsara, Motive, or other ELD devices
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => handlePreferenceSelection('recommendations')}
        >
          <View style={styles.optionIcon}>
            <Shield size={24} color={colors.success} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>No, need recommendations</Text>
            <Text style={styles.optionDescription}>
              Show me certified ELD devices that work great
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, styles.skipOption]}
          onPress={() => handlePreferenceSelection('skip')}
        >
          <View style={styles.optionIcon}>
            <Settings size={24} color={colors.text.secondary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Skip for now</Text>
            <Text style={styles.optionDescription}>
              Set up manually later in settings
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDetectionStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Scanning for Devices</Text>
        <Text style={styles.stepSubtitle}>
          Looking for nearby ELD and telematics devices...
        </Text>
      </View>

      <View style={styles.scanningContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.scanningText}>
          {Platform.OS === 'web' ? 'Scanning network...' : 'Scanning Bluetooth...'}
        </Text>
        <View style={styles.scanningMethods}>
          <View style={styles.scanMethod}>
            <Wifi size={16} color={colors.text.secondary} />
            <Text style={styles.scanMethodText}>Network</Text>
          </View>
          {Platform.OS !== 'web' && (
            <View style={styles.scanMethod}>
              <Bluetooth size={16} color={colors.text.secondary} />
              <Text style={styles.scanMethodText}>Bluetooth</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderSelectionStep = () => {
    const availableDevices = onboardingPreference.needsRecommendation 
      ? recommendations 
      : devices.filter(d => d.status === 'detected');

    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>
            {onboardingPreference.needsRecommendation ? 'Recommended Devices' : 'Available Devices'}
          </Text>
          <Text style={styles.stepSubtitle}>
            {onboardingPreference.needsRecommendation 
              ? 'These devices work great with TruckMate AI'
              : `Found ${availableDevices.length} device${availableDevices.length !== 1 ? 's' : ''}`
            }
          </Text>
        </View>

        {!onboardingPreference.needsRecommendation && (
          <TouchableOpacity style={styles.rescanButton} onPress={handleRescan}>
            <Search size={16} color={colors.primary} />
            <Text style={styles.rescanText}>Scan for other devices</Text>
          </TouchableOpacity>
        )}

        <ScrollView style={styles.devicesList} showsVerticalScrollIndicator={false}>
          {availableDevices.map((device) => (
            <TouchableOpacity
              key={device.id}
              style={[
                styles.deviceCard,
                selectedDeviceId === device.id && styles.selectedDeviceCard
              ]}
              onPress={() => handleDeviceSelection(device.id)}
            >
              <View style={styles.deviceHeader}>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceType}>{device.type.toUpperCase()}</Text>
                </View>
                {device.isELDCertified && (
                  <View style={styles.certifiedBadge}>
                    <CheckCircle size={16} color={colors.success} />
                    <Text style={styles.certifiedText}>ELD Certified</Text>
                  </View>
                )}
              </View>

              {device.metadata?.features && (
                <View style={styles.deviceFeatures}>
                  {device.metadata.features.slice(0, 2).map((feature: string, index: number) => (
                    <Text key={index} style={styles.featureText}>• {feature}</Text>
                  ))}
                </View>
              )}

              <View style={styles.deviceFooter}>
                {device.metadata?.price && (
                  <Text style={styles.devicePrice}>{device.metadata.price}</Text>
                )}
                {device.metadata?.rating && (
                  <Text style={styles.deviceRating}>⭐ {device.metadata.rating}</Text>
                )}
                {device.signalStrength && (
                  <Text style={styles.signalStrength}>Signal: {device.signalStrength}%</Text>
                )}
              </View>

              {selectedDeviceId === device.id && (
                <View style={styles.selectedIndicator}>
                  <CheckCircle size={20} color={colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {availableDevices.length === 0 && (
          <View style={styles.noDevicesContainer}>
            <AlertCircle size={48} color={colors.text.secondary} />
            <Text style={styles.noDevicesTitle}>No devices found</Text>
            <Text style={styles.noDevicesText}>
              {onboardingPreference.needsRecommendation 
                ? 'Check our partner store for certified devices'
                : 'Make sure your device is powered on and nearby'
              }
            </Text>
          </View>
        )}

        {selectedDeviceId && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => setCurrentStep('connection')}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderConnectionStep = () => {
    const selectedDevice = devices.find(d => d.id === selectedDeviceId) || 
                          recommendations.find(d => d.id === selectedDeviceId);

    if (!selectedDevice) return null;

    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>Connect Device</Text>
          <Text style={styles.stepSubtitle}>
            Setting up {selectedDevice.name}
          </Text>
        </View>

        <View style={styles.connectionCard}>
          <View style={styles.connectionHeader}>
            <Text style={styles.connectionDeviceName}>{selectedDevice.name}</Text>
            <Text style={styles.connectionDeviceType}>{selectedDevice.type.toUpperCase()}</Text>
          </View>

          {selectedDevice.isELDCertified && (
            <View style={styles.certificationInfo}>
              <Shield size={16} color={colors.success} />
              <Text style={styles.certificationText}>FMCSA Certified ELD</Text>
            </View>
          )}

          <View style={styles.connectionFeatures}>
            <Text style={styles.featuresTitle}>What you'll get:</Text>
            {selectedDevice.capabilities.map((capability, index) => (
              <Text key={index} style={styles.capabilityText}>
                • {capability.charAt(0).toUpperCase() + capability.slice(1)} tracking
              </Text>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.connectButton, isConnecting && styles.connectingButton]}
            onPress={handleConnectDevice}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <ActivityIndicator size="small" color={colors.text.primary} />
            ) : (
              <Text style={styles.connectButtonText}>
                {onboardingPreference.needsRecommendation ? 'Learn More' : 'Connect Device'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Info size={16} color={colors.primary} />
          <Text style={styles.infoText}>
            All connections are secure and encrypted. Your data is protected and only used for compliance and fleet management.
          </Text>
        </View>
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'preference':
        return renderPreferenceStep();
      case 'detection':
        return renderDetectionStep();
      case 'selection':
        return renderSelectionStep();
      case 'connection':
        return renderConnectionStep();
      default:
        return renderPreferenceStep();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navigationBar}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <ArrowLeft size={24} color={colors.text.primary} />
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Smart Device Setup</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onSkip}>
            <X size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${
                  currentStep === 'preference' ? 25 : 
                  currentStep === 'detection' ? 50 : 
                  currentStep === 'selection' ? 75 : 100
                }%` 
              }
            ]} 
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    backgroundColor: colors.card,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.background.secondary,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepHeader: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  autoDetectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.warning}10`,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  autoDetectedContent: {
    flex: 1,
  },
  autoDetectedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  autoDetectedText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 12,
    gap: 16,
  },
  skipOption: {
    backgroundColor: colors.background.secondary,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  scanningContainer: {
    alignItems: 'center',
    padding: 40,
  },
  scanningText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 16,
    marginBottom: 24,
  },
  scanningMethods: {
    flexDirection: 'row',
    gap: 24,
  },
  scanMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scanMethodText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 16,
  },
  rescanText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  devicesList: {
    maxHeight: 400,
  },
  deviceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedDeviceCard: {
    borderColor: colors.primary,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  deviceType: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  certifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  certifiedText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.success,
  },
  deviceFeatures: {
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 2,
  },
  deviceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  devicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  deviceRating: {
    fontSize: 14,
    color: colors.warning,
  },
  signalStrength: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  noDevicesContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noDevicesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  noDevicesText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  connectionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  connectionHeader: {
    marginBottom: 16,
  },
  connectionDeviceName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  connectionDeviceType: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  certificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  certificationText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.success,
  },
  connectionFeatures: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  capabilityText: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 4,
  },
  connectButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  connectingButton: {
    opacity: 0.7,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: `${colors.primary}10`,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});