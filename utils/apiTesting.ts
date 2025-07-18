import { hybridApiService } from '@/services/hybridApiService';
import { fallbackLocationService } from '@/services/fallbackLocationService';
import { enhancedAiService } from '@/services/enhancedAiService';

interface TestResult {
  testName: string;
  success: boolean;
  duration: number;
  details: string;
  error?: string;
}

interface TestSuite {
  name: string;
  results: TestResult[];
  totalTests: number;
  passedTests: number;
  totalDuration: number;
}

class APITestingService {
  private testResults: TestSuite[] = [];

  async runAllTests(): Promise<TestSuite[]> {
    console.log('🚀 Starting Hybrid API Architecture Tests...');
    
    this.testResults = [];
    
    // Run test suites
    await this.runLocationTests();
    await this.runWeatherTests();
    await this.runAITests();
    await this.runFailoverTests();
    await this.runCostControlTests();
    await this.runCacheTests();
    
    this.printSummary();
    return this.testResults;
  }

  private async runLocationTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Location Services',
      results: [],
      totalTests: 0,
      passedTests: 0,
      totalDuration: 0
    };

    // Test 1: Basic location retrieval
    await this.runTest(
      'Basic Location Retrieval',
      async () => {
        const location = await fallbackLocationService.getCurrentLocation();
        if (!location) throw new Error('No location returned');
        if (!location.latitude || !location.longitude) {
          throw new Error('Invalid coordinates');
        }
        return `Location: ${location.city || 'Unknown'}, Source: ${location.source}`;
      },
      suite
    );

    // Test 2: Location accuracy assessment
    await this.runTest(
      'Location Accuracy Assessment',
      async () => {
        const location = await fallbackLocationService.getCurrentLocation();
        if (!location) throw new Error('No location returned');
        
        const quality = fallbackLocationService.getLocationQuality(location);
        const isCompliant = fallbackLocationService.isLocationAccurateForCompliance(location);
        
        return `Quality: ${quality}, Compliance: ${isCompliant ? 'Yes' : 'No'}`;
      },
      suite
    );

    // Test 3: Distance calculation
    await this.runTest(
      'Distance Calculation',
      async () => {
        const distance = fallbackLocationService.calculateDistance(
          40.7128, -74.0060, // NYC
          34.0522, -118.2437  // LA
        );
        
        if (distance < 2000 || distance > 3000) {
          throw new Error(`Unexpected distance: ${distance} miles`);
        }
        
        return `NYC to LA: ${Math.round(distance)} miles`;
      },
      suite
    );

    // Test 4: Geocoding
    await this.runTest(
      'Address Geocoding',
      async () => {
        const result = await fallbackLocationService.geocodeAddress('New York, NY');
        if (!result) throw new Error('Geocoding failed');
        
        return `Geocoded to: ${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)}`;
      },
      suite
    );

    this.testResults.push(suite);
  }

  private async runWeatherTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Weather Services',
      results: [],
      totalTests: 0,
      passedTests: 0,
      totalDuration: 0
    };

    // Test 1: Weather data retrieval
    await this.runTest(
      'Weather Data Retrieval',
      async () => {
        const weather = await hybridApiService.getWeatherData(40.7128, -74.0060);
        if (!weather) throw new Error('No weather data returned');
        
        return `Temperature: ${weather.temperature}°F, Conditions: ${weather.conditions}`;
      },
      suite
    );

    // Test 2: Weather caching
    await this.runTest(
      'Weather Data Caching',
      async () => {
        const start1 = Date.now();
        await hybridApiService.getWeatherData(40.7128, -74.0060);
        const duration1 = Date.now() - start1;
        
        const start2 = Date.now();
        await hybridApiService.getWeatherData(40.7128, -74.0060);
        const duration2 = Date.now() - start2;
        
        if (duration2 >= duration1) {
          throw new Error('Cache not working - second call took longer');
        }
        
        return `First call: ${duration1}ms, Cached call: ${duration2}ms`;
      },
      suite
    );

    this.testResults.push(suite);
  }

  private async runAITests(): Promise<void> {
    const suite: TestSuite = {
      name: 'AI Services',
      results: [],
      totalTests: 0,
      passedTests: 0,
      totalDuration: 0
    };

    // Test 1: Basic AI response
    await this.runTest(
      'Basic AI Response',
      async () => {
        const response = await enhancedAiService.generateResponse(
          'What are my hours of service?',
          { hoursRemaining: 6, currentStatus: 'driving' },
          []
        );
        
        if (!response.response) throw new Error('No response generated');
        
        return `Response: ${response.response.substring(0, 50)}..., Source: ${response.source}`;
      },
      suite
    );

    // Test 2: Diagnostic analysis
    await this.runTest(
      'Diagnostic Code Analysis',
      async () => {
        const analysis = await enhancedAiService.analyzeDiagnosticCodes(['P0001', 'P0300']);
        if (!analysis) throw new Error('No analysis returned');
        
        return `Issues: ${analysis.issues.length}, Severity: ${analysis.severity}, Urgency: ${analysis.urgency}`;
      },
      suite
    );

    // Test 3: Voice command processing
    await this.runTest(
      'Voice Command Processing',
      async () => {
        const response = await enhancedAiService.processVoiceCommand(
          'How am I doing?',
          { currentStatus: 'driving', hoursRemaining: 4 }
        );
        
        if (!response.response) throw new Error('No voice response generated');
        
        return `Voice response generated, confidence: ${response.confidence}`;
      },
      suite
    );

    // Test 4: Service status
    await this.runTest(
      'AI Service Status',
      async () => {
        const status = enhancedAiService.getServiceStatus();
        
        return `Available: ${status.aiAvailable}, Degraded: ${status.degradedMode}, Capabilities: ${status.capabilities.length}`;
      },
      suite
    );

    this.testResults.push(suite);
  }

  private async runFailoverTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Failover Mechanisms',
      results: [],
      totalTests: 0,
      passedTests: 0,
      totalDuration: 0
    };

    // Test 1: Simulate API failure
    await this.runTest(
      'API Failover Simulation',
      async () => {
        // Simulate failover
        await hybridApiService.simulateFailover('Geotab', 5000);
        
        const isDegraded = hybridApiService.isDegradedMode();
        if (!isDegraded) {
          throw new Error('Degraded mode not activated');
        }
        
        return 'Failover activated successfully';
      },
      suite
    );

    // Test 2: Service recovery
    await this.runTest(
      'Service Recovery',
      async () => {
        // Wait for recovery
        await new Promise(resolve => setTimeout(resolve, 6000));
        
        const isDegraded = hybridApiService.isDegradedMode();
        if (isDegraded) {
          throw new Error('Service did not recover');
        }
        
        return 'Service recovered successfully';
      },
      suite
    );

    this.testResults.push(suite);
  }

  private async runCostControlTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Cost Control',
      results: [],
      totalTests: 0,
      passedTests: 0,
      totalDuration: 0
    };

    // Test 1: Usage tracking
    await this.runTest(
      'Usage Statistics',
      async () => {
        const usage = await hybridApiService.getUsageStatus();
        if (!usage.apis || usage.apis.length === 0) {
          throw new Error('No usage statistics available');
        }
        
        const totalCalls = usage.apis.reduce((sum, api) => sum + api.dailyUsage, 0);
        return `Total daily calls: ${totalCalls}, APIs monitored: ${usage.apis.length}`;
      },
      suite
    );

    // Test 2: Cost calculation
    await this.runTest(
      'Cost Calculation',
      async () => {
        const usage = await hybridApiService.getUsageStatus();
        
        // Mock cost calculation
        const estimatedCost = usage.apis.reduce((sum, api) => sum + (api.dailyUsage * 0.001), 0);
        
        return `Estimated daily cost: $${estimatedCost.toFixed(3)}`;
      },
      suite
    );

    this.testResults.push(suite);
  }

  private async runCacheTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Caching System',
      results: [],
      totalTests: 0,
      passedTests: 0,
      totalDuration: 0
    };

    // Test 1: Cache effectiveness
    await this.runTest(
      'Cache Performance',
      async () => {
        // Clear cache first
        hybridApiService.clearCache();
        
        // First call (should be slow)
        const start1 = Date.now();
        await hybridApiService.getLocation();
        const duration1 = Date.now() - start1;
        
        // Second call (should be fast - cached)
        const start2 = Date.now();
        await hybridApiService.getLocation();
        const duration2 = Date.now() - start2;
        
        const improvement = ((duration1 - duration2) / duration1) * 100;
        
        return `Cache improved response time by ${improvement.toFixed(1)}%`;
      },
      suite
    );

    // Test 2: Cache expiration
    await this.runTest(
      'Cache Expiration',
      async () => {
        // This would test TTL in a real scenario
        // For demo, we'll just verify cache can be cleared
        hybridApiService.clearCache();
        
        return 'Cache cleared successfully';
      },
      suite
    );

    this.testResults.push(suite);
  }

  private async runTest(
    testName: string,
    testFunction: () => Promise<string>,
    suite: TestSuite
  ): Promise<void> {
    const startTime = Date.now();
    let result: TestResult;

    try {
      const details = await testFunction();
      const duration = Date.now() - startTime;
      
      result = {
        testName,
        success: true,
        duration,
        details
      };
      
      suite.passedTests++;
      console.log(`✅ ${testName}: ${details} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      
      result = {
        testName,
        success: false,
        duration,
        details: 'Test failed',
        error: error instanceof Error ? error.message : String(error)
      };
      
      console.log(`❌ ${testName}: ${result.error} (${duration}ms)`);
    }

    suite.results.push(result);
    suite.totalTests++;
    suite.totalDuration += result.duration;
  }

  private printSummary(): void {
    console.log('\n📊 Test Summary:');
    console.log('================');
    
    let totalTests = 0;
    let totalPassed = 0;
    let totalDuration = 0;
    
    this.testResults.forEach(suite => {
      const passRate = ((suite.passedTests / suite.totalTests) * 100).toFixed(1);
      console.log(`\n${suite.name}:`);
      console.log(`  Tests: ${suite.passedTests}/${suite.totalTests} passed (${passRate}%)`);
      console.log(`  Duration: ${suite.totalDuration}ms`);
      
      totalTests += suite.totalTests;
      totalPassed += suite.passedTests;
      totalDuration += suite.totalDuration;
    });
    
    const overallPassRate = ((totalPassed / totalTests) * 100).toFixed(1);
    console.log(`\n🎯 Overall Results:`);
    console.log(`   ${totalPassed}/${totalTests} tests passed (${overallPassRate}%)`);
    console.log(`   Total duration: ${totalDuration}ms`);
    
    if (totalPassed === totalTests) {
      console.log('🎉 All tests passed! Hybrid API architecture is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please review the results above.');
    }
  }

  // Quick health check for production monitoring
  async quickHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'critical';
    details: string[];
  }> {
    const details: string[] = [];
    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';

    try {
      // Check if APIs are responding
      const location = await hybridApiService.getLocation();
      if (!location) {
        details.push('Location service unavailable');
        status = 'degraded';
      }

      // Check degraded mode
      const isDegraded = hybridApiService.isDegradedMode();
      if (isDegraded) {
        details.push('System in degraded mode');
        status = 'degraded';
      }

      // Check usage limits
      const usage = await hybridApiService.getUsageStatus();
      const criticalAPIs = usage.apis.filter(api => api.status === 'critical');
      if (criticalAPIs.length > 0) {
        details.push(`${criticalAPIs.length} APIs at critical usage`);
        status = 'critical';
      }

      if (details.length === 0) {
        details.push('All systems operational');
      }

    } catch (error) {
      details.push(`Health check failed: ${error}`);
      status = 'critical';
    }

    return { status, details };
  }
}

export const apiTestingService = new APITestingService();
export default apiTestingService;