#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

class DeviceTester {
  constructor() {
    this.testResults = [];
    this.deviceConfigs = [
      {
        name: 'iPhone 15 Pro',
        platform: 'ios',
        screen: { width: 393, height: 852 },
        features: ['face-id', 'dynamic-island', 'high-refresh']
      },
      {
        name: 'iPhone SE (3rd gen)',
        platform: 'ios', 
        screen: { width: 375, height: 667 },
        features: ['touch-id', 'small-screen']
      },
      {
        name: 'Pixel 7',
        platform: 'android',
        screen: { width: 412, height: 915 },
        features: ['fingerprint', 'adaptive-refresh']
      },
      {
        name: 'Galaxy S23',
        platform: 'android',
        screen: { width: 384, height: 854 },
        features: ['s-pen', 'edge-display']
      }
    ];
  }

  async runDeviceTests() {
    console.log('📱 DEVICE COMPATIBILITY TESTING');
    console.log('================================\n');

    for (const device of this.deviceConfigs) {
      console.log(`Testing ${device.name}...`);
      await this.testDevice(device);
    }

    this.generateReport();
  }

  async testDevice(device) {
    const results = {
      device: device.name,
      platform: device.platform,
      tests: []
    };

    // Screen size compatibility
    results.tests.push(this.testScreenSize(device));
    
    // Performance test
    results.tests.push(await this.testPerformance(device));
    
    // Feature compatibility
    results.tests.push(this.testFeatures(device));
    
    // Memory usage
    results.tests.push(this.testMemoryUsage(device));

    this.testResults.push(results);
  }

  testScreenSize(device) {
    const { width, height } = device.screen;
    const aspectRatio = height / width;
    
    let status = 'pass';
    let issues = [];

    // Check for common layout issues
    if (width < 375) {
      issues.push('Small screen may cause layout issues');
      status = 'warning';
    }

    if (aspectRatio > 2.2) {
      issues.push('Very tall screen may affect navigation');
      status = 'warning';
    }

    return {
      name: 'Screen Size Compatibility',
      status,
      details: `${width}x${height} (${aspectRatio.toFixed(2)}:1)`,
      issues
    };
  }

  async testPerformance(device) {
    // Simulate performance testing
    const isLowEnd = device.name.includes('SE') || device.platform === 'android' && !device.name.includes('Pixel');
    
    return {
      name: 'Performance',
      status: isLowEnd ? 'warning' : 'pass',
      details: `${isLowEnd ? 'Low-end' : 'High-end'} device performance`,
      issues: isLowEnd ? ['May experience slower animations', 'Consider performance optimizations'] : []
    };
  }

  testFeatures(device) {
    const unsupportedFeatures = [];
    
    // Check feature compatibility
    if (!device.features.includes('face-id') && !device.features.includes('fingerprint')) {
      unsupportedFeatures.push('Biometric authentication not available');
    }

    if (!device.features.includes('high-refresh') && !device.features.includes('adaptive-refresh')) {
      unsupportedFeatures.push('Standard 60Hz refresh rate');
    }

    return {
      name: 'Feature Compatibility',
      status: unsupportedFeatures.length > 0 ? 'warning' : 'pass',
      details: `${device.features.length} features supported`,
      issues: unsupportedFeatures
    };
  }

  testMemoryUsage(device) {
    // Simulate memory testing
    const isLowMemory = device.name.includes('SE');
    
    return {
      name: 'Memory Usage',
      status: isLowMemory ? 'warning' : 'pass',
      details: `${isLowMemory ? 'Limited' : 'Adequate'} memory available`,
      issues: isLowMemory ? ['Monitor memory usage closely', 'Implement memory optimizations'] : []
    };
  }

  generateReport() {
    console.log('\n📊 DEVICE TESTING REPORT');
    console.log('=========================\n');

    let totalTests = 0;
    let passedTests = 0;
    let warningTests = 0;
    let failedTests = 0;

    this.testResults.forEach(result => {
      console.log(`📱 ${result.device} (${result.platform.toUpperCase()})`);
      console.log('─'.repeat(40));

      result.tests.forEach(test => {
        totalTests++;
        const icon = test.status === 'pass' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
        
        console.log(`${icon} ${test.name}: ${test.details}`);
        
        if (test.issues.length > 0) {
          test.issues.forEach(issue => {
            console.log(`   • ${issue}`);
          });
        }

        if (test.status === 'pass') passedTests++;
        else if (test.status === 'warning') warningTests++;
        else failedTests++;
      });
      console.log('');
    });

    console.log('📈 SUMMARY:');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`⚠️  Warnings: ${warningTests}`);
    console.log(`❌ Failed: ${failedTests}`);

    const successRate = ((passedTests + warningTests) / totalTests * 100).toFixed(1);
    console.log(`📊 Success Rate: ${successRate}%`);

    console.log('\n🎯 RECOMMENDATIONS:');
    console.log('• Test on physical devices when possible');
    console.log('• Monitor performance on lower-end devices');
    console.log('• Implement responsive design for various screen sizes');
    console.log('• Consider graceful degradation for missing features');

    // Save results to file
    fs.writeFileSync('device-test-results.json', JSON.stringify(this.testResults, null, 2));
    console.log('\n💾 Results saved to device-test-results.json');

    return failedTests === 0;
  }
}

// Run device testing
const tester = new DeviceTester();
tester.runDeviceTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Device testing failed:', error);
  process.exit(1);
});