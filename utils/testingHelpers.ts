import { Platform } from 'react-native';

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
    // Log accessibility properties
    const elements = document.querySelectorAll('[role], [aria-label], [aria-describedby]');
    console.log(`Found ${elements.length} accessible elements`);
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
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log('💾 Memory usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
      });
    }
  }
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
    ipadpro: { width: 1024, height: 1366 }
  }
};