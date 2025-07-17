import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type DeviceType = 'geotab' | 'samsara' | 'motive' | 'omnitracs' | 'keeptruckin' | 'other' | 'unknown';
export type DeviceStatus = 'detected' | 'connected' | 'disconnected' | 'pending' | 'error';
export type ConnectionMethod = 'bluetooth' | 'wifi' | 'cellular' | 'usb' | 'manual';

export interface TelematicsDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  connectionMethod: ConnectionMethod;
  macAddress?: string;
  ipAddress?: string;
  serialNumber?: string;
  firmwareVersion?: string;
  lastSeen?: Date;
  signalStrength?: number;
  batteryLevel?: number;
  isELDCertified: boolean;
  capabilities: string[];
  metadata?: Record<string, any>;
}

export interface DeviceDetectionResult {
  devices: TelematicsDevice[];
  detectionMethod: string;
  confidence: number;
  timestamp: Date;
}

export interface OnboardingDevicePreference {
  hasExistingDevice: boolean | null;
  deviceType: DeviceType | null;
  skipDetection: boolean;
  needsRecommendation: boolean;
}

interface TelematicsState {
  devices: TelematicsDevice[];
  detectionResults: DeviceDetectionResult[];
  onboardingPreference: OnboardingDevicePreference;
  isScanning: boolean;
  autoDetectionEnabled: boolean;
  lastScanTime?: Date;
  error: string | null;
  
  // Actions
  addDevice: (device: Omit<TelematicsDevice, 'id'>) => void;
  updateDevice: (id: string, updates: Partial<TelematicsDevice>) => void;
  removeDevice: (id: string) => void;
  connectDevice: (id: string) => Promise<boolean>;
  disconnectDevice: (id: string) => void;
  
  // Detection
  startDeviceDetection: () => Promise<DeviceDetectionResult>;
  stopDeviceDetection: () => void;
  detectDeviceFromUserAgent: () => DeviceType;
  detectDeviceFromNetwork: () => Promise<TelematicsDevice[]>;
  detectBluetoothDevices: () => Promise<TelematicsDevice[]>;
  detectFromIncomingData: () => Promise<TelematicsDevice | null>;
  
  // Onboarding
  setOnboardingPreference: (preference: Partial<OnboardingDevicePreference>) => void;
  resetOnboardingPreference: () => void;
  
  // Utilities
  getDeviceRecommendations: () => TelematicsDevice[];
  setAutoDetection: (enabled: boolean) => void;
  setError: (error: string | null) => void;
}

const devicePatterns = {
  geotab: {
    userAgent: /GO\s?\d+/i,
    macPrefix: ['00:04:F2', '00:0C:E7'],
    ports: [9001, 9002],
    capabilities: ['gps', 'eld', 'diagnostics', 'fuel']
  },
  samsara: {
    userAgent: /SAMSARA[\-_]VG\d+/i,
    macPrefix: ['A4:CF:12', '8C:1F:64'],
    ports: [8080, 8443],
    capabilities: ['gps', 'eld', 'camera', 'temperature']
  },
  motive: {
    userAgent: /MOTIVE[\-_]ELD/i,
    macPrefix: ['00:1B:21', '00:50:C2'],
    ports: [7001, 7002],
    capabilities: ['gps', 'eld', 'hours', 'ifta']
  },
  omnitracs: {
    userAgent: /OMNITRACS/i,
    macPrefix: ['00:A0:C9', '00:E0:4C'],
    ports: [6001, 6002],
    capabilities: ['gps', 'eld', 'messaging', 'dispatch']
  },
  keeptruckin: {
    userAgent: /KEEPTRUCKIN/i,
    macPrefix: ['B8:27:EB', 'DC:A6:32'],
    ports: [5001, 5002],
    capabilities: ['gps', 'eld', 'maintenance', 'fuel']
  },
  other: {
    userAgent: /UNKNOWN/i,
    macPrefix: ['00:00:00'],
    ports: [8000],
    capabilities: ['gps']
  },
  unknown: {
    userAgent: /UNKNOWN/i,
    macPrefix: ['00:00:00'],
    ports: [8000],
    capabilities: ['gps']
  }
};

const mockDevices: TelematicsDevice[] = [
  {
    id: 'geotab-go9',
    name: 'Geotab GO9',
    type: 'geotab',
    status: 'detected',
    connectionMethod: 'wifi',
    isELDCertified: true,
    capabilities: ['gps', 'eld', 'diagnostics', 'fuel'],
    signalStrength: 85,
    batteryLevel: 92
  },
  {
    id: 'samsara-vg34',
    name: 'Samsara VG34',
    type: 'samsara',
    status: 'detected',
    connectionMethod: 'cellular',
    isELDCertified: true,
    capabilities: ['gps', 'eld', 'camera', 'temperature'],
    signalStrength: 78,
    batteryLevel: 88
  },
  {
    id: 'motive-eld',
    name: 'Motive ELD Device',
    type: 'motive',
    status: 'detected',
    connectionMethod: 'bluetooth',
    isELDCertified: true,
    capabilities: ['gps', 'eld', 'hours', 'ifta'],
    signalStrength: 92,
    batteryLevel: 76
  }
];

export const useTelematicsStore = create<TelematicsState>()(persist(
  (set, get) => ({
    devices: [],
    detectionResults: [],
    onboardingPreference: {
      hasExistingDevice: null,
      deviceType: null,
      skipDetection: false,
      needsRecommendation: false
    },
    isScanning: false,
    autoDetectionEnabled: true,
    error: null,
    detectFromIncomingData: async () => {
      // Simulate detection from incoming data patterns  
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock analysis of incoming data to detect device type
      // In real implementation, this would analyze data patterns, headers, or protocols
      const dataPatterns = [
        { type: 'geotab', probability: 0.3, signature: 'GO_DEVICE_DATA' },
        { type: 'samsara', probability: 0.25, signature: 'SAMSARA_TELEMETRY' },
        { type: 'motive', probability: 0.2, signature: 'MOTIVE_ELD_DATA' },
        { type: 'omnitracs', probability: 0.15, signature: 'OMNI_FLEET_MSG' },
        { type: 'keeptruckin', probability: 0.1, signature: 'KT_DEVICE_INFO' }
      ];
      
      // Simulate random detection based on probability
      const random = Math.random();
      let cumulativeProbability = 0;
      
      for (const pattern of dataPatterns) {
        cumulativeProbability += pattern.probability;
        if (random < cumulativeProbability) {
          const mockDevice = mockDevices.find(d => d.type === pattern.type);
          if (mockDevice) {
            const detectedDevice: TelematicsDevice = {
              ...mockDevice,
              id: `incoming-${Date.now()}`,
              status: 'detected',
              connectionMethod: 'cellular',
              lastSeen: new Date(),
              metadata: {
                ...mockDevice.metadata,
                detectionSource: 'incoming-data',
                dataSignature: pattern.signature,
                confidence: 0.8
              }
            };
            
            // Add to devices if not already present
            const existingDevice = get().devices.find(d => 
              d.type === detectedDevice.type && d.serialNumber === detectedDevice.serialNumber
            );
            
            if (!existingDevice) {
              get().addDevice(detectedDevice);
            }
            
            return detectedDevice;
          }
        }
      }
      
      return null;
    },
    
    addDevice: (device) => {
      const newDevice: TelematicsDevice = {
        ...device,
        id: Date.now().toString(),
      };
      set((state) => ({
        devices: [...state.devices, newDevice],
      }));
    },
    
    updateDevice: (id, updates) => {
      set((state) => ({
        devices: state.devices.map((device) =>
          device.id === id ? { ...device, ...updates } : device
        ),
      }));
    },
    
    removeDevice: (id) => {
      set((state) => ({
        devices: state.devices.filter((device) => device.id !== id),
      }));
    },
    
    connectDevice: async (id) => {
      set({ error: null });
      
      try {
        // Simulate connection process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const device = get().devices.find(d => d.id === id);
        if (!device) throw new Error('Device not found');
        
        // Mock connection success rate based on device type
        const successRate = device.type === 'unknown' ? 0.6 : 0.9;
        const success = Math.random() < successRate;
        
        if (!success) {
          throw new Error('Failed to connect to device. Please check the connection.');
        }
        
        get().updateDevice(id, {
          status: 'connected',
          lastSeen: new Date(),
        });
        
        return true;
      } catch (error) {
        get().updateDevice(id, { status: 'error' });
        set({ error: error instanceof Error ? error.message : 'Connection failed' });
        return false;
      }
    },
    
    disconnectDevice: (id) => {
      get().updateDevice(id, {
        status: 'disconnected',
        lastSeen: new Date(),
      });
    },
    
    startDeviceDetection: async () => {
      set({ isScanning: true, error: null });
      
      try {
        const detectedDevices: TelematicsDevice[] = [];
        
        // User agent detection
        const userAgentDevice = get().detectDeviceFromUserAgent();
        if (userAgentDevice !== 'unknown') {
          const mockDevice = mockDevices.find(d => d.type === userAgentDevice);
          if (mockDevice) {
            detectedDevices.push({
              ...mockDevice,
              id: `detected-${Date.now()}`,
              status: 'detected'
            });
          }
        }
        
        // Network detection (web only)
        if (Platform.OS === 'web') {
          const networkDevices = await get().detectDeviceFromNetwork();
          detectedDevices.push(...networkDevices);
        }
        
        // Bluetooth detection (mobile only)
        if (Platform.OS !== 'web') {
          const bluetoothDevices = await get().detectBluetoothDevices();
          detectedDevices.push(...bluetoothDevices);
        }
        
        // Add detected devices to store
        detectedDevices.forEach(device => {
          const existingDevice = get().devices.find(d => d.serialNumber === device.serialNumber);
          if (!existingDevice) {
            get().addDevice(device);
          }
        });
        
        const result: DeviceDetectionResult = {
          devices: detectedDevices,
          detectionMethod: Platform.OS === 'web' ? 'network-scan' : 'bluetooth-scan',
          confidence: detectedDevices.length > 0 ? 0.85 : 0.1,
          timestamp: new Date()
        };
        
        set((state) => ({
          detectionResults: [...state.detectionResults, result],
          lastScanTime: new Date(),
          isScanning: false
        }));
        
        return result;
      } catch (error) {
        set({ 
          isScanning: false, 
          error: error instanceof Error ? error.message : 'Detection failed' 
        });
        throw error;
      }
    },
    
    stopDeviceDetection: () => {
      set({ isScanning: false });
    },
    
    detectDeviceFromUserAgent: () => {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
        const userAgent = navigator.userAgent;
        
        // Check for specific ELD device patterns in user agent
        for (const [deviceType, pattern] of Object.entries(devicePatterns)) {
          if (pattern.userAgent.test(userAgent)) {
            return deviceType as DeviceType;
          }
        }
        
        // Check for common ELD-related strings
        const eldPatterns = [
          /geotab/i,
          /samsara/i,
          /motive/i,
          /keeptruckin/i,
          /omnitracs/i,
          /eld/i,
          /electronic.logging/i,
          /fleet.management/i
        ];
        
        for (const pattern of eldPatterns) {
          if (pattern.test(userAgent)) {
            // Try to determine specific type
            if (/geotab/i.test(userAgent)) return 'geotab';
            if (/samsara/i.test(userAgent)) return 'samsara';
            if (/motive|keeptruckin/i.test(userAgent)) return 'motive';
            if (/omnitracs/i.test(userAgent)) return 'omnitracs';
            return 'other'; // Generic ELD detected
          }
        }
      }
      return 'unknown';
    },
    
    detectDeviceFromNetwork: async () => {
      // Simulate network scanning for web
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const detectedDevices: TelematicsDevice[] = [];
      
      // Mock network detection - in real implementation, this would scan local network
      if (Math.random() > 0.3) { // 70% chance of finding a device
        const randomDevice = mockDevices[Math.floor(Math.random() * mockDevices.length)];
        detectedDevices.push({
          ...randomDevice,
          id: `network-${Date.now()}`,
          connectionMethod: 'wifi',
          ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
          status: 'detected'
        });
      }
      
      return detectedDevices;
    },
    
    detectBluetoothDevices: async () => {
      // Simulate Bluetooth scanning for mobile
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const detectedDevices: TelematicsDevice[] = [];
      
      // Mock Bluetooth detection
      if (Math.random() > 0.4) { // 60% chance of finding a device
        const randomDevice = mockDevices[Math.floor(Math.random() * mockDevices.length)];
        detectedDevices.push({
          ...randomDevice,
          id: `bluetooth-${Date.now()}`,
          connectionMethod: 'bluetooth',
          macAddress: (() => {
            const prefix = devicePatterns[randomDevice.type]?.macPrefix[0] || '00:00:00';
            const suffix1 = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
            const suffix2 = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
            const suffix3 = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
            return `${prefix}:${suffix1}:${suffix2}:${suffix3}`;
          })(),
          status: 'detected'
        });
      }
      
      return detectedDevices;
    },
    
    detectFromIncomingData: async () => {
      // Simulate detection from incoming data patterns  
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock analysis of incoming data to detect device type
      // In real implementation, this would analyze data patterns, headers, or protocols
      const dataPatterns = [
        { type: 'geotab', probability: 0.3, signature: 'GO_DEVICE_DATA' },
        { type: 'samsara', probability: 0.25, signature: 'SAMSARA_TELEMETRY' },
        { type: 'motive', probability: 0.2, signature: 'MOTIVE_ELD_DATA' },
        { type: 'omnitracs', probability: 0.15, signature: 'OMNI_FLEET_MSG' },
        { type: 'keeptruckin', probability: 0.1, signature: 'KT_DEVICE_INFO' }
      ];
      
      // Simulate random detection based on probability
      const random = Math.random();
      let cumulativeProbability = 0;
      
      for (const pattern of dataPatterns) {
        cumulativeProbability += pattern.probability;
        if (random < cumulativeProbability) {
          const mockDevice = mockDevices.find(d => d.type === pattern.type);
          if (mockDevice) {
            const detectedDevice: TelematicsDevice = {
              ...mockDevice,
              id: `incoming-${Date.now()}`,
              status: 'detected',
              connectionMethod: 'cellular',
              lastSeen: new Date(),
              metadata: {
                ...mockDevice.metadata,
                detectionSource: 'incoming-data',
                dataSignature: pattern.signature,
                confidence: 0.8
              }
            };
            
            // Add to devices if not already present
            const existingDevice = get().devices.find(d => 
              d.type === detectedDevice.type && d.serialNumber === detectedDevice.serialNumber
            );
            
            if (!existingDevice) {
              get().addDevice(detectedDevice);
            }
            
            return detectedDevice;
          }
        }
      }
      
      return null;
    },
    
    setOnboardingPreference: (preference) => {
      set((state) => ({
        onboardingPreference: { ...state.onboardingPreference, ...preference }
      }));
    },
    
    resetOnboardingPreference: () => {
      set({
        onboardingPreference: {
          hasExistingDevice: null,
          deviceType: null,
          skipDetection: false,
          needsRecommendation: false
        }
      });
    },
    
    getDeviceRecommendations: () => {
      // Return recommended devices based on user profile
      return [
        {
          id: 'rec-geotab',
          name: 'Geotab GO9 (Recommended)',
          type: 'geotab' as DeviceType,
          status: 'disconnected' as DeviceStatus,
          connectionMethod: 'wifi' as ConnectionMethod,
          isELDCertified: true,
          capabilities: ['gps', 'eld', 'diagnostics', 'fuel'],
          metadata: { 
            price: '$299',
            rating: 4.8,
            features: ['Easy installation', 'Real-time tracking', 'Compliance reporting']
          }
        },
        {
          id: 'rec-samsara',
          name: 'Samsara VG34 (Popular)',
          type: 'samsara' as DeviceType,
          status: 'disconnected' as DeviceStatus,
          connectionMethod: 'cellular' as ConnectionMethod,
          isELDCertified: true,
          capabilities: ['gps', 'eld', 'camera', 'temperature'],
          metadata: { 
            price: '$349',
            rating: 4.6,
            features: ['Dash cam integration', 'Driver coaching', 'Fleet management']
          }
        }
      ];
    },
    
    setAutoDetection: (enabled) => {
      set({ autoDetectionEnabled: enabled });
    },
    
    setError: (error) => {
      set({ error });
    },
    
    detectFromIncomingData: async () => {
      // Simulate detection from incoming data patterns  
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock analysis of incoming data to detect device type
      // In real implementation, this would analyze data patterns, headers, or protocols
      const dataPatterns = [
        { type: 'geotab', probability: 0.3, signature: 'GO_DEVICE_DATA' },
        { type: 'samsara', probability: 0.25, signature: 'SAMSARA_TELEMETRY' },
        { type: 'motive', probability: 0.2, signature: 'MOTIVE_ELD_DATA' },
        { type: 'omnitracs', probability: 0.15, signature: 'OMNI_FLEET_MSG' },
        { type: 'keeptruckin', probability: 0.1, signature: 'KT_DEVICE_INFO' }
      ];
      
      // Simulate random detection based on probability
      const random = Math.random();
      let cumulativeProbability = 0;
      
      for (const pattern of dataPatterns) {
        cumulativeProbability += pattern.probability;
        if (random < cumulativeProbability) {
          const mockDevice = mockDevices.find(d => d.type === pattern.type);
          if (mockDevice) {
            const detectedDevice: TelematicsDevice = {
              ...mockDevice,
              id: `incoming-${Date.now()}`,
              status: 'detected',
              connectionMethod: 'cellular',
              lastSeen: new Date(),
              metadata: {
                ...mockDevice.metadata,
                detectionSource: 'incoming-data',
                dataSignature: pattern.signature,
                confidence: 0.8
              }
            };
            
            // Add to devices if not already present
            const existingDevice = get().devices.find(d => 
              d.type === detectedDevice.type && d.serialNumber === detectedDevice.serialNumber
            );
            
            if (!existingDevice) {
              get().addDevice(detectedDevice);
            }
            
            return detectedDevice;
          }
        }
      }
      
      return null;
    },
  }),
  {
    name: 'telematics-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      devices: state.devices,
      onboardingPreference: state.onboardingPreference,
      autoDetectionEnabled: state.autoDetectionEnabled,
    }),
  }
));