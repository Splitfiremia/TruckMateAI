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

  // Scan local network for connected devices (web only)
  const scanLocalNetwork = useCallback(async (): Promise<TelematicsDevice[]> => {
    if (Platform.OS !== 'web') return [];
    
    try {
      // Simulate network scanning - in real implementation, this would:
      // 1. Check for devices on common ELD ports (9001, 8080, 7001, etc.)
      // 2. Look for specific MAC address patterns
      // 3. Check for device-specific HTTP endpoints
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const devicePatterns = [
        { type: 'geotab', name: 'Geotab GO9', ports: [9001, 9002] },
        { type: 'samsara', name: 'Samsara VG34', ports: [8080, 8443] },
        { type: 'motive', name: 'Motive ELD', ports: [7001, 7002] },
      ];
      
      // 60% chance of finding a device on network
      if (Math.random() > 0.4) {
        const randomPattern = devicePatterns[Math.floor(Math.random() * devicePatterns.length)];
        return [{
          id: `network-${Date.now()}`,
          name: randomPattern.name,
          type: randomPattern.type as any,
          status: 'detected',
          connectionMethod: 'wifi',
          isELDCertified: true,
          capabilities: ['gps', 'eld', 'diagnostics'],
          signalStrength: 88,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
          metadata: {
            detectionMethod: 'network-scan',
            confidence: 0.85,
            port: randomPattern.ports[0]
          }
        }];
      }
      
      return [];
    } catch (error) {
      console.log('Network scan failed:', error);
      return [];
    }
  }, []);

  // Scan for paired Bluetooth ELDs (mobile only)
  const scanBluetoothDevices = useCallback(async (): Promise<TelematicsDevice[]> => {
    if (Platform.OS === 'web') return [];
    
    try {
      // Simulate Bluetooth scanning - in real implementation, this would:
      // 1. Check for paired devices with ELD service UUIDs
      // 2. Look for devices with known MAC address prefixes
      // 3. Check device names for ELD patterns
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const bluetoothDevices = [
        { type: 'geotab', name: 'Geotab GO9', macPrefix: '00:04:F2' },
        { type: 'samsara', name: 'Samsara VG34', macPrefix: 'A4:CF:12' },
        { type: 'motive', name: 'Motive ELD', macPrefix: '00:1B:21' },
      ];
      
      // 50% chance of finding a paired device
      if (Math.random() > 0.5) {
        const randomDevice = bluetoothDevices[Math.floor(Math.random() * bluetoothDevices.length)];
        return [{
          id: `bluetooth-${Date.now()}`,
          name: randomDevice.name,
          type: randomDevice.type as any,
          status: 'detected',
          connectionMethod: 'bluetooth',
          isELDCertified: true,
          capabilities: ['gps', 'eld'],
          signalStrength: 92,
          macAddress: `${randomDevice.macPrefix}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}`,
          metadata: {
            detectionMethod: 'bluetooth-scan',
            confidence: 0.9
          }
        }];
      }
      
      return [];
    } catch (error) {
      console.log('Bluetooth scan failed:', error);
      return [];
    }
  }, []);

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
          metadata: {
            detectionMethod: 'user-agent',
            confidence: 0.8
          }
        };
        
        setDetectedDevice(mockDevice);
        setShowDiscoveryPrompt(true);
        setHasShownPrompt(true);
        return;
      }

      // For web users: Scan local network for connected devices (with permission)
      if (Platform.OS === 'web') {
        const networkDevices = await scanLocalNetwork();
        if (networkDevices.length > 0) {
          setDetectedDevice(networkDevices[0]);
          setShowDiscoveryPrompt(true);
          setHasShownPrompt(true);
          return;
        }
      }

      // For mobile: Check for paired Bluetooth ELDs
      if (Platform.OS !== 'web') {
        const bluetoothDevices = await scanBluetoothDevices();
        if (bluetoothDevices.length > 0) {
          setDetectedDevice(bluetoothDevices[0]);
          setShowDiscoveryPrompt(true);
          setHasShownPrompt(true);
          return;
        }
      }

      // If no immediate detection, perform full scan
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