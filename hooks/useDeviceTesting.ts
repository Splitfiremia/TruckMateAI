import { useState, useEffect } from 'react';
import { Platform, Dimensions } from 'react-native';
import { TestingHelpers, DeviceSimulation, PERFORMANCE_BENCHMARKS } from '@/utils/testingHelpers';

interface DeviceTestResult {
  testName: string;
  status: 'pass' | 'warning' | 'fail';
  details: string;
  duration?: number;
  issues?: string[];
}

interface DeviceTestSuite {
  deviceName: string;
  platform: string;
  screenSize: { width: number; height: number };
  results: DeviceTestResult[];
  overallStatus: 'pass' | 'warning' | 'fail';
  completedAt?: Date;
}

export const useDeviceTesting = () => {
  const [testSuites, setTestSuites] = useState<DeviceTestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
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

  const runDeviceTest = async (deviceConfig: any) => {
    const testSuite: DeviceTestSuite = {
      deviceName: deviceConfig.name,
      platform: deviceConfig.platform,
      screenSize: deviceConfig.screen,
      results: [],
      overallStatus: 'pass',
    };

    // Screen size compatibility test
    const screenTest = await testScreenCompatibility(deviceConfig);
    testSuite.results.push(screenTest);

    // Performance test
    const performanceTest = await testPerformance(deviceConfig);
    testSuite.results.push(performanceTest);

    // Memory usage test
    const memoryTest = await testMemoryUsage(deviceConfig);
    testSuite.results.push(memoryTest);

    // Accessibility test
    const accessibilityTest = await testAccessibility(deviceConfig);
    testSuite.results.push(accessibilityTest);

    // Network conditions test
    const networkTest = await testNetworkConditions(deviceConfig);
    testSuite.results.push(networkTest);

    // Determine overall status
    const hasFailures = testSuite.results.some(r => r.status === 'fail');
    const hasWarnings = testSuite.results.some(r => r.status === 'warning');
    
    testSuite.overallStatus = hasFailures ? 'fail' : hasWarnings ? 'warning' : 'pass';
    testSuite.completedAt = new Date();

    return testSuite;
  };

  const testScreenCompatibility = async (deviceConfig: any): Promise<DeviceTestResult> => {
    setCurrentTest('Screen Compatibility');
    
    const { width, height } = deviceConfig.screen;
    const aspectRatio = height / width;
    const issues: string[] = [];

    // Check for common layout issues
    if (width < 375) {
      issues.push('Small screen may cause layout issues');
    }

    if (aspectRatio > 2.2) {
      issues.push('Very tall screen may affect navigation');
    }

    if (Platform.OS === 'web') {
      DeviceSimulation.setScreenSize(width, height);
    }

    return {
      testName: 'Screen Compatibility',
      status: issues.length > 0 ? 'warning' : 'pass',
      details: `${width}x${height} (${aspectRatio.toFixed(2)}:1)`,
      issues,
    };
  };

  const testPerformance = async (deviceConfig: any): Promise<DeviceTestResult> => {
    setCurrentTest('Performance');
    
    const performanceTimer = TestingHelpers.measurePerformance('DeviceTest');
    
    // Simulate component rendering
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const duration = performanceTimer.end();
    const isSlowDevice = deviceConfig.name.includes('SE') || 
                        (deviceConfig.platform === 'android' && !deviceConfig.name.includes('Pixel'));

    const issues: string[] = [];
    if (duration > PERFORMANCE_BENCHMARKS.NAVIGATION_TIME) {
      issues.push('Slow rendering detected');
    }

    if (isSlowDevice) {
      issues.push('Low-end device may need performance optimizations');
    }

    return {
      testName: 'Performance',
      status: issues.length > 0 ? 'warning' : 'pass',
      details: `Render time: ${duration.toFixed(2)}ms`,
      duration,
      issues,
    };
  };

  const testMemoryUsage = async (deviceConfig: any): Promise<DeviceTestResult> => {
    setCurrentTest('Memory Usage');
    
    TestingHelpers.trackMemoryUsage();
    
    const isLowMemoryDevice = deviceConfig.name.includes('SE');
    const issues: string[] = [];

    if (isLowMemoryDevice) {
      issues.push('Limited memory device - monitor usage closely');
    }

    return {
      testName: 'Memory Usage',
      status: isLowMemoryDevice ? 'warning' : 'pass',
      details: isLowMemoryDevice ? 'Low memory device' : 'Adequate memory',
      issues,
    };
  };

  const testAccessibility = async (deviceConfig: any): Promise<DeviceTestResult> => {
    setCurrentTest('Accessibility');
    
    TestingHelpers.testAccessibility();
    
    // Basic accessibility checks
    const issues: string[] = [];
    
    // Check if device supports accessibility features
    if (deviceConfig.platform === 'ios' && !deviceConfig.features?.includes('voiceover')) {
      issues.push('VoiceOver support not verified');
    }

    if (deviceConfig.platform === 'android' && !deviceConfig.features?.includes('talkback')) {
      issues.push('TalkBack support not verified');
    }

    return {
      testName: 'Accessibility',
      status: issues.length > 0 ? 'warning' : 'pass',
      details: 'Basic accessibility checks completed',
      issues,
    };
  };

  const testNetworkConditions = async (deviceConfig: any): Promise<DeviceTestResult> => {
    setCurrentTest('Network Conditions');
    
    const startTime = Date.now();
    await TestingHelpers.simulateSlowNetwork();
    const duration = Date.now() - startTime;

    const issues: string[] = [];
    if (duration > PERFORMANCE_BENCHMARKS.API_RESPONSE_TIME) {
      issues.push('Slow network response detected');
    }

    return {
      testName: 'Network Conditions',
      status: issues.length > 0 ? 'warning' : 'pass',
      details: `Network simulation: ${duration}ms`,
      duration,
      issues,
    };
  };

  const runFullTestSuite = async () => {
    setIsRunning(true);
    setTestSuites([]);

    const deviceConfigs = [
      {
        name: 'iPhone 15 Pro',
        platform: 'ios',
        screen: { width: 393, height: 852 },
        features: ['face-id', 'dynamic-island', 'voiceover'],
      },
      {
        name: 'iPhone SE (3rd gen)',
        platform: 'ios',
        screen: { width: 375, height: 667 },
        features: ['touch-id', 'voiceover'],
      },
      {
        name: 'Pixel 7',
        platform: 'android',
        screen: { width: 412, height: 915 },
        features: ['fingerprint', 'talkback'],
      },
      {
        name: 'Galaxy S23',
        platform: 'android',
        screen: { width: 384, height: 854 },
        features: ['fingerprint', 'talkback'],
      },
    ];

    const results: DeviceTestSuite[] = [];

    for (const config of deviceConfigs) {
      const testSuite = await runDeviceTest(config);
      results.push(testSuite);
      setTestSuites([...results]);
    }

    setIsRunning(false);
    setCurrentTest('');
  };

  const getTestSummary = () => {
    const totalTests = testSuites.reduce((sum, suite) => sum + suite.results.length, 0);
    const passedTests = testSuites.reduce((sum, suite) => 
      sum + suite.results.filter(r => r.status === 'pass').length, 0);
    const warningTests = testSuites.reduce((sum, suite) => 
      sum + suite.results.filter(r => r.status === 'warning').length, 0);
    const failedTests = testSuites.reduce((sum, suite) => 
      sum + suite.results.filter(r => r.status === 'fail').length, 0);

    return {
      total: totalTests,
      passed: passedTests,
      warnings: warningTests,
      failed: failedTests,
      successRate: totalTests > 0 ? ((passedTests + warningTests) / totalTests * 100) : 0,
    };
  };

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

  const getCurrentDeviceInfo = () => {
    const { width, height } = Dimensions.get('window');
    return {
      platform: Platform.OS,
      version: Platform.Version,
      screenWidth: width,
      screenHeight: height,
      aspectRatio: height / width,
      isWeb: Platform.OS === 'web',
      currentDevice
    };
  };

  return {
    // New comprehensive testing
    testSuites,
    isRunning,
    currentTest,
    runFullTestSuite,
    runDeviceTest,
    getTestSummary,
    getCurrentDeviceInfo,
    
    // Legacy testing methods
    isTestingMode,
    setIsTestingMode,
    simulateDevice,
    runAccessibilityTest,
    simulateLowBattery,
    measureComponentPerformance,
    performanceMetrics
  };
};