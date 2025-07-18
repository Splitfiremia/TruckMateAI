import { Platform } from 'react-native';
import { QueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Testing utilities for the trucking app
 */

// Mock data generators
export const mockLogbookEntry = (overrides = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  status: 'On Duty',
  startTime: new Date().toISOString(),
  endTime: null,
  location: 'Test Location',
  odometer: 123456,
  notes: 'Test entry',
  ...overrides,
});

export const mockReceiptData = (overrides = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  amount: 45.67,
  vendor: 'Test Fuel Station',
  category: 'Fuel',
  date: new Date().toISOString(),
  imageUri: 'test://image.jpg',
  ocrText: 'Test OCR text',
  ...overrides,
});

export const mockLoadData = (overrides = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  pickupLocation: 'Test Pickup',
  deliveryLocation: 'Test Delivery',
  pickupDate: new Date().toISOString(),
  deliveryDate: new Date(Date.now() + 86400000).toISOString(),
  weight: 40000,
  rate: 2500,
  status: 'assigned',
  ...overrides,
});

// Test query client
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

// Performance benchmarks
export const PERFORMANCE_BENCHMARKS = {
  STARTUP_TIME: 3000, // 3 seconds
  NAVIGATION_TIME: 200, // 200ms
  API_RESPONSE_TIME: 2000, // 2 seconds
  IMAGE_LOAD_TIME: 1000, // 1 second
  MEMORY_USAGE_LIMIT: 100 * 1024 * 1024, // 100MB
};

export const TestingHelpers = {
  // Simulate low battery mode effects
  simulateLowBattery: () => {
    if (Platform.OS === 'web') {
      console.log('🔋 Simulating low battery mode - reducing animations');
      // Disable animations in web
      document.documentElement.style.setProperty('--animation-duration', '0s');
    }
  },

  // Simulate slow network
  simulateSlowNetwork: () => {
    console.log('🐌 Simulating 3G network conditions');
    // Add artificial delays to API calls
    return new Promise(resolve => setTimeout(resolve, 2000));
  },

  // Test screen reader compatibility
  testAccessibility: () => {
    console.log('♿ Testing accessibility features');
    if (Platform.OS === 'web') {
      // Log accessibility properties
      const elements = document.querySelectorAll('[role], [aria-label], [aria-describedby]');
      console.log(`Found ${elements.length} accessible elements`);
    }
  },

  // Performance monitoring
  measurePerformance: (componentName: string) => {
    const start = performance.now();
    return {
      end: () => {
        const duration = performance.now() - start;
        console.log(`⚡ ${componentName} render time: ${duration.toFixed(2)}ms`);
        return duration;
      }
    };
  },

  // Memory usage tracking (web only)
  trackMemoryUsage: () => {
    if (Platform.OS === 'web' && 'memory' in performance) {
      const memory = (performance as any).memory;
      console.log('💾 Memory usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
      });
    }
  },

  // Validate form data
  validateFormData: (data: Record<string, any>, requiredFields: string[]) => {
    const errors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      if (!data[field] || data[field].toString().trim() === '') {
        errors[field] = `${field} is required`;
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Error simulation
  simulateNetworkError: () => {
    throw new Error('Network request failed');
  },

  simulateApiError: (status = 500, message = 'Internal Server Error') => {
    const error = new Error(message) as any;
    error.status = status;
    throw error;
  },

  // Load testing data generation
  generateLoadTestData: (count: number) => {
    return Array.from({ length: count }, (_, index) => ({
      id: `test-${index}`,
      data: `Test data item ${index}`,
      timestamp: new Date(Date.now() - index * 1000).toISOString(),
    }));
  },

  // Test data cleanup
  cleanupTestData: async () => {
    await AsyncStorage.clear();
  },
};

// Device simulation utilities
export const DeviceSimulation = {
  // Simulate different screen sizes
  setScreenSize: (width: number, height: number) => {
    if (Platform.OS === 'web') {
      document.documentElement.style.setProperty('--screen-width', `${width}px`);
      document.documentElement.style.setProperty('--screen-height', `${height}px`);
    }
  },

  // Common device presets
  devices: {
    iphone15pro: { width: 393, height: 852 },
    pixel7: { width: 412, height: 915 },
    ipadpro: { width: 1024, height: 1366 },
    iphoneSE: { width: 375, height: 667 },
  },

  // Mock device info
  mockDeviceInfo: (deviceType: 'ios' | 'android' | 'web' = 'ios') => ({
    platform: deviceType,
    version: deviceType === 'ios' ? '17.0' : '14.0',
    model: deviceType === 'ios' ? 'iPhone 15 Pro' : 'Pixel 7',
    screenWidth: deviceType === 'ios' ? 393 : 412,
    screenHeight: deviceType === 'ios' ? 852 : 915,
  }),
};

// Accessibility testing helpers
export const AccessibilityHelpers = {
  checkAccessibilityProps: (element: any) => {
    const issues = [];
    
    if (!element.props.accessibilityLabel && !element.props.accessibilityHint) {
      issues.push('Missing accessibility label or hint');
    }
    
    if (element.type === 'Pressable' && !element.props.accessibilityRole) {
      issues.push('Missing accessibility role for interactive element');
    }
    
    return issues;
  },
};