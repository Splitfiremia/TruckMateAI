import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { useTelematicsStore, TelematicsDevice } from '@/store/telematicsStore';
import { useUserStore } from '@/store/userStore';

interface UseDeviceDiscoveryReturn {
  showDiscoveryPrompt: boolean;
  detectedDevice: TelematicsDevice | null;
  dismissPrompt: () => void;
  isScanning: boolean;
}

export function useDeviceDiscovery(): UseDeviceDiscoveryReturn {
  const { user, isOnboarded } = useUserStore();
  const {
    devices,
    onboardingPreference,
    autoDetectionEnabled,
    isScanning,
    startDeviceDetection,
    detectDeviceFromUserAgent,
    setError
  } = useTelematicsStore();

  const [showDiscoveryPrompt, setShowDiscoveryPrompt] = useState(false);
  const [detectedDevice, setDetectedDevice] = useState<TelematicsDevice | null>(null);
  const [hasShownPrompt, setHasShownPrompt] = useState(false);

  // Auto-detect devices when user completes onboarding
  const performAutoDetection = useCallback(async () => {
    if (!autoDetectionEnabled || !isOnboarded || hasShownPrompt) return;
    
    try {
      // First, try user agent detection (instant)
      const userAgentDevice = detectDeviceFromUserAgent();
      if (userAgentDevice !== 'unknown') {
        // If we detect a device type from user agent, show prompt immediately
        const mockDevice: TelematicsDevice = {
          id: `detected-${Date.now()}`,
          name: `${userAgentDevice.charAt(0).toUpperCase() + userAgentDevice.slice(1)} Device`,
          type: userAgentDevice,
          status: 'detected',
          connectionMethod: Platform.OS === 'web' ? 'wifi' : 'bluetooth',
          isELDCertified: true,
          capabilities: ['gps', 'eld'],
          signalStrength: 85,
        };
        
        setDetectedDevice(mockDevice);
        setShowDiscoveryPrompt(true);
        setHasShownPrompt(true);
        return;
      }

      // If no user agent detection, perform network/bluetooth scan
      const result = await startDeviceDetection();
      
      if (result.devices.length > 0 && result.confidence > 0.7) {
        // Show prompt for the first high-confidence device
        const device = result.devices[0];
        setDetectedDevice(device);
        setShowDiscoveryPrompt(true);
        setHasShownPrompt(true);
      }
    } catch (error) {
      console.log('Auto-detection failed:', error);
      setError(null); // Clear error silently for auto-detection
    }
  }, [
    autoDetectionEnabled,
    isOnboarded,
    hasShownPrompt,
    detectDeviceFromUserAgent,
    startDeviceDetection,
    setError
  ]);

  // Check for incoming data patterns that suggest a device is connected
  const checkForIncomingDeviceData = useCallback(() => {
    if (!isOnboarded || hasShownPrompt) return;

    // Simulate checking for incoming telematics data
    // In a real app, this would monitor for:
    // - GPS coordinates being received
    // - Engine diagnostics data
    // - ELD compliance messages
    // - Specific IP/MAC address patterns
    
    const hasIncomingData = Math.random() > 0.8; // 20% chance to simulate detection
    
    if (hasIncomingData) {
      const detectedTypes = ['geotab', 'samsara', 'motive'] as const;
      const randomType = detectedTypes[Math.floor(Math.random() * detectedTypes.length)];
      
      const device: TelematicsDevice = {
        id: `incoming-${Date.now()}`,
        name: `${randomType.charAt(0).toUpperCase() + randomType.slice(1)} Device`,
        type: randomType,
        status: 'detected',
        connectionMethod: 'cellular',
        isELDCertified: true,
        capabilities: ['gps', 'eld', 'diagnostics'],
        signalStrength: 92,
        metadata: {
          detectionMethod: 'incoming-data',
          confidence: 0.9
        }
      };
      
      setDetectedDevice(device);
      setShowDiscoveryPrompt(true);
      setHasShownPrompt(true);
    }
  }, [isOnboarded, hasShownPrompt]);

  // Run auto-detection when conditions are met
  useEffect(() => {
    if (!isOnboarded || !user) return;

    // Skip if user explicitly chose to skip device setup during onboarding
    if (onboardingPreference.skipDetection) return;

    // Skip if user already has connected devices
    if (devices.some(device => device.status === 'connected')) return;

    // Delay auto-detection to avoid interfering with onboarding completion
    const timer = setTimeout(() => {
      performAutoDetection();
    }, 3000); // 3 second delay

    return () => clearTimeout(timer);
  }, [isOnboarded, user, onboardingPreference.skipDetection, devices, performAutoDetection]);

  // Periodically check for incoming device data (post-onboarding discovery)
  useEffect(() => {
    if (!isOnboarded || hasShownPrompt) return;

    const interval = setInterval(() => {
      checkForIncomingDeviceData();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isOnboarded, hasShownPrompt, checkForIncomingDeviceData]);

  const dismissPrompt = useCallback(() => {
    setShowDiscoveryPrompt(false);
    setDetectedDevice(null);
  }, []);

  return {
    showDiscoveryPrompt,
    detectedDevice,
    dismissPrompt,
    isScanning,
  };
}