import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { 
  Smartphone, 
  Wifi, 
  Bluetooth, 
  Search, 
  CheckCircle, 
  AlertCircle,
  Truck,
  Settings,
  ArrowRight,
  SkipForward
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTelematicsStore, DeviceType, TelematicsDevice } from '@/store/telematicsStore';

interface DeviceDetectionStepProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function DeviceDetectionStep({ onComplete, onSkip }: DeviceDetectionStepProps) {
  const {
    devices,
    onboardingPreference,
    isScanning,
    error,
    startDeviceDetection,
    setOnboardingPreference,
    connectDevice,
    getDeviceRecommendations,
    setError
  } = useTelematicsStore();

  const [selectedOption, setSelectedOption] = useState<'existing' | 'recommendations' | 'skip' | null>(null);
  const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceType | null>(null);
  const [showDetectedDevices, setShowDetectedDevices] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const deviceOptions: { type: DeviceType; name: string; description: string }[] = [
    { type: 'geotab', name: 'Geotab', description: 'GO series devices' },
    { type: 'samsara', name: 'Samsara', description: 'VG series devices' },
    { type: 'motive', name: 'Motive', description: 'ELD devices' },
    { type: 'omnitracs', name: 'Omnitracs', description: 'Fleet management' },
    { type: 'keeptruckin', name: 'KeepTruckin', description: 'ELD solutions' },
    { type: 'other', name: 'Other', description: 'Different brand' },
  ];

  const recommendations = getDeviceRecommendations();

  useEffect(() => {
    // Auto-detect on component mount if enabled
    if (onboardingPreference.hasExistingDevice === null) {
      handleAutoDetection();
    }
  }, []);

  const handleAutoDetection = async () => {
    try {
      const result = await startDeviceDetection();
      if (result.devices.length > 0) {
        setShowDetectedDevices(true);
        setSelectedOption('existing');
      }
    } catch (error) {
      console.log('Auto-detection failed:', error);
    }
  };

  const handleOptionSelect = (option: 'existing' | 'recommendations' | 'skip') => {
    setSelectedOption(option);
    setError(null);

    if (option === 'existing') {
      setOnboardingPreference({ hasExistingDevice: true, needsRecommendation: false });
      if (devices.length === 0) {
        handleManualDetection();
      } else {
        setShowDetectedDevices(true);
      }
    } else if (option === 'recommendations') {
      setOnboardingPreference({ hasExistingDevice: false, needsRecommendation: true });
      setShowRecommendations(true);
    } else if (option === 'skip') {
      setOnboardingPreference({ skipDetection: true });
    }
  };

  const handleManualDetection = async () => {
    try {
      const result = await startDeviceDetection();
      setShowDetectedDevices(true);
    } catch (error) {
      Alert.alert('Detection Failed', 'Unable to detect devices. You can connect manually later.');
    }
  };

  const handleDeviceTypeSelect = (deviceType: DeviceType) => {
    setSelectedDeviceType(deviceType);
    setOnboardingPreference({ deviceType });
  };

  const handleConnectDevice = async (deviceId: string) => {
    const success = await connectDevice(deviceId);
    if (success) {
      Alert.alert('Success', 'Device connected successfully!', [
        { text: 'Continue', onPress: onComplete }
      ]);
    } else {
      Alert.alert('Connection Failed', error || 'Unable to connect to device');
    }
  };

  const handleContinue = () => {
    if (selectedOption === 'skip') {
      onSkip();
    } else if (selectedOption === 'existing' && selectedDeviceType) {
      setOnboardingPreference({ deviceType: selectedDeviceType });
      onComplete();
    } else if (selectedOption === 'recommendations') {
      onComplete();
    } else {
      onComplete();
    }
  };

  const renderInitialOptions = () => (
    <View style={styles.optionsContainer}>
      <Text style={styles.question}>Already use fleet hardware?</Text>
      <Text style={styles.subtitle}>Skip if unsure - you can connect devices later</Text>

      <TouchableOpacity
        style={[styles.optionCard, selectedOption === 'existing' && styles.optionCardSelected]}
        onPress={() => handleOptionSelect('existing')}
      >
        <View style={styles.optionIcon}>
          <Truck size={24} color={selectedOption === 'existing' ? colors.primary : colors.text.secondary} />
        </View>
        <View style={styles.optionContent}>
          <Text style={[styles.optionTitle, selectedOption === 'existing' && styles.optionTitleSelected]}>
            Yes, I have a device
          </Text>
          <Text style={styles.optionDescription}>
            Geotab, Samsara, Motive, or other ELD device
          </Text>
        </View>
        {selectedOption === 'existing' && (
          <CheckCircle size={20} color={colors.primary} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionCard, selectedOption === 'recommendations' && styles.optionCardSelected]}
        onPress={() => handleOptionSelect('recommendations')}
      >
        <View style={styles.optionIcon}>
          <Settings size={24} color={selectedOption === 'recommendations' ? colors.primary : colors.text.secondary} />
        </View>
        <View style={styles.optionContent}>
          <Text style={[styles.optionTitle, selectedOption === 'recommendations' && styles.optionTitleSelected]}>
            No, need recommendations
          </Text>
          <Text style={styles.optionDescription}>
            Show me compatible devices and pricing
          </Text>
        </View>
        {selectedOption === 'recommendations' && (
          <CheckCircle size={20} color={colors.primary} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionCard, styles.skipOption, selectedOption === 'skip' && styles.optionCardSelected]}
        onPress={() => handleOptionSelect('skip')}
      >
        <View style={styles.optionIcon}>
          <SkipForward size={24} color={selectedOption === 'skip' ? colors.primary : colors.text.secondary} />
        </View>
        <View style={styles.optionContent}>
          <Text style={[styles.optionTitle, selectedOption === 'skip' && styles.optionTitleSelected]}>
            Skip for now
          </Text>
          <Text style={styles.optionDescription}>
            Set up device connection later
          </Text>
        </View>
        {selectedOption === 'skip' && (
          <CheckCircle size={20} color={colors.primary} />
        )}
      </TouchableOpacity>
    </View>
  );

  const renderDeviceTypeSelection = () => (
    <View style={styles.deviceTypeContainer}>
      <Text style={styles.sectionTitle}>Select your device type</Text>
      <Text style={styles.sectionSubtitle}>This helps us optimize the connection process</Text>

      <ScrollView style={styles.deviceTypeList}>
        {deviceOptions.map((device) => (
          <TouchableOpacity
            key={device.type}
            style={[
              styles.deviceTypeCard,
              selectedDeviceType === device.type && styles.deviceTypeCardSelected
            ]}
            onPress={() => handleDeviceTypeSelect(device.type)}
          >
            <View style={styles.deviceTypeContent}>
              <Text style={[
                styles.deviceTypeName,
                selectedDeviceType === device.type && styles.deviceTypeNameSelected
              ]}>
                {device.name}
              </Text>
              <Text style={styles.deviceTypeDescription}>{device.description}</Text>
            </View>
            {selectedDeviceType === device.type && (
              <CheckCircle size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderDetectedDevices = () => (
    <View style={styles.detectedContainer}>
      <Text style={styles.sectionTitle}>Detected Devices</Text>
      <Text style={styles.sectionSubtitle}>
        {devices.length > 0 
          ? 'We found these devices nearby' 
          : 'Scanning for devices...'
        }
      </Text>

      {isScanning && (
        <View style={styles.scanningContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.scanningText}>Scanning for devices...</Text>
          <View style={styles.scanningMethods}>
            <View style={styles.scanningMethod}>
              <Wifi size={16} color={colors.text.secondary} />
              <Text style={styles.scanningMethodText}>Network</Text>
            </View>
            <View style={styles.scanningMethod}>
              <Bluetooth size={16} color={colors.text.secondary} />
              <Text style={styles.scanningMethodText}>Bluetooth</Text>
            </View>
          </View>
        </View>
      )}

      {devices.length > 0 && (
        <ScrollView style={styles.devicesList}>
          {devices.map((device) => (
            <View key={device.id} style={styles.deviceCard}>
              <View style={styles.deviceInfo}>
                <View style={styles.deviceHeader}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <View style={[styles.deviceStatus, styles[`status${device.status.charAt(0).toUpperCase() + device.status.slice(1)}`]]}>
                    <Text style={styles.deviceStatusText}>{device.status}</Text>
                  </View>
                </View>
                <Text style={styles.deviceType}>{device.type.toUpperCase()}</Text>
                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceDetail}>
                    Connection: {device.connectionMethod}
                  </Text>
                  {device.signalStrength && (
                    <Text style={styles.deviceDetail}>
                      Signal: {device.signalStrength}%
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => handleConnectDevice(device.id)}
                disabled={device.status === 'connected'}
              >
                <Text style={styles.connectButtonText}>
                  {device.status === 'connected' ? 'Connected' : 'Connect'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {!isScanning && devices.length === 0 && (
        <View style={styles.noDevicesContainer}>
          <AlertCircle size={48} color={colors.text.secondary} />
          <Text style={styles.noDevicesTitle}>No devices found</Text>
          <Text style={styles.noDevicesText}>
            Make sure your device is powered on and nearby
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleManualDetection}>
            <Search size={16} color={colors.primary} />
            <Text style={styles.retryButtonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderRecommendations = () => (
    <View style={styles.recommendationsContainer}>
      <Text style={styles.sectionTitle}>Recommended Devices</Text>
      <Text style={styles.sectionSubtitle}>
        These devices work great with TruckMate AI
      </Text>

      <ScrollView style={styles.recommendationsList}>
        {recommendations.map((device) => (
          <View key={device.id} style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
              <Text style={styles.recommendationName}>{device.name}</Text>
              <Text style={styles.recommendationPrice}>{device.metadata?.price}</Text>
            </View>
            <Text style={styles.recommendationType}>{device.type.toUpperCase()}</Text>
            <View style={styles.recommendationFeatures}>
              {device.metadata?.features?.map((feature: string, index: number) => (
                <Text key={index} style={styles.recommendationFeature}>• {feature}</Text>
              ))}
            </View>
            <View style={styles.recommendationFooter}>
              <View style={styles.rating}>
                <Text style={styles.ratingText}>★ {device.metadata?.rating}</Text>
              </View>
              <TouchableOpacity style={styles.learnMoreButton}>
                <Text style={styles.learnMoreText}>Learn More</Text>
                <ArrowRight size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Setup</Text>
      
      {!selectedOption && renderInitialOptions()}
      
      {selectedOption === 'existing' && !showDetectedDevices && renderDeviceTypeSelection()}
      
      {showDetectedDevices && renderDetectedDevices()}
      
      {showRecommendations && renderRecommendations()}

      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={16} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {selectedOption && (
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>
              {selectedOption === 'skip' ? 'Skip Setup' : 'Continue'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  question: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.background.secondary,
  },
  skipOption: {
    opacity: 0.8,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  optionTitleSelected: {
    color: colors.primary,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  deviceTypeContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  deviceTypeList: {
    maxHeight: 300,
  },
  deviceTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  deviceTypeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.background.secondary,
  },
  deviceTypeContent: {
    flex: 1,
  },
  deviceTypeName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  deviceTypeNameSelected: {
    color: colors.primary,
  },
  deviceTypeDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  detectedContainer: {
    marginBottom: 24,
  },
  scanningContainer: {
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  scanningText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  scanningMethods: {
    flexDirection: 'row',
    gap: 24,
  },
  scanningMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scanningMethodText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  devicesList: {
    maxHeight: 300,
  },
  deviceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  deviceStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusDetected: {
    backgroundColor: colors.warning + '20',
  },
  statusConnected: {
    backgroundColor: colors.success + '20',
  },
  statusError: {
    backgroundColor: colors.error + '20',
  },
  deviceStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
  },
  deviceType: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  deviceDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  deviceDetail: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  connectButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  noDevicesContainer: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  noDevicesTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text.primary,
  },
  noDevicesText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  retryButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  recommendationsContainer: {
    marginBottom: 24,
  },
  recommendationsList: {
    maxHeight: 400,
  },
  recommendationCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recommendationName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  recommendationPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  recommendationType: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  recommendationFeatures: {
    marginBottom: 12,
  },
  recommendationFeature: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 2,
  },
  recommendationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '500',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  learnMoreText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.error + '10',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
});