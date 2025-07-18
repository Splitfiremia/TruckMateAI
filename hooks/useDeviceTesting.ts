import { useEffect, useState } from 'react';
import { Platform, Dimensions } from 'react-native';
import { TestingHelpers, DeviceSimulation } from '@/utils/testingHelpers';

export const useDeviceTesting = () => {
  const [isTestingMode, setIsTestingMode] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<string>('default');
  const [performanceMetrics, setPerformanceMetrics] = useState<any[]>([]);

  useEffect(() => {
    if (isTestingMode) {
      // Start performance monitoring
      const interval = setInterval(() => {
        TestingHelpers.trackMemoryUsage();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isTestingMode]);

  const simulateDevice = (deviceName: keyof typeof DeviceSimulation.devices) => {
    const device = DeviceSimulation.devices[deviceName];
    DeviceSimulation.setScreenSize(device.width, device.height);
    setCurrentDevice(deviceName);
    console.log(`📱 Simulating ${deviceName}: ${device.width}x${device.height}`);
  };

  const runAccessibilityTest = () => {
    TestingHelpers.testAccessibility();
  };

  const simulateLowBattery = () => {
    TestingHelpers.simulateLowBattery();
  };

  const measureComponentPerformance = (componentName: string) => {
    return TestingHelpers.measurePerformance(componentName);
  };

  const getDeviceInfo = () => {
    const { width, height } = Dimensions.get('window');
    return {
      platform: Platform.OS,
      version: Platform.Version,
      screenSize: { width, height },
      isWeb: Platform.OS === 'web',
      currentDevice
    };
  };

  return {
    isTestingMode,
    setIsTestingMode,
    simulateDevice,
    runAccessibilityTest,
    simulateLowBattery,
    measureComponentPerformance,
    getDeviceInfo,
    performanceMetrics
  };
};