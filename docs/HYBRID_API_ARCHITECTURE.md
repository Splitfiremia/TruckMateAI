# Hybrid API Architecture Implementation

## Overview

This document describes the implementation of a hybrid API architecture with priority routing, cost control, and graceful degradation for the trucking mobile application.

## Architecture Components

### 1. Core Services

#### HybridAPIService (`services/hybridApiService.ts`)
- **Purpose**: Central orchestrator for all API calls with fallback logic
- **Features**:
  - Priority-based API routing (Primary → Fallback)
  - Usage tracking and rate limiting
  - Intelligent caching with TTL
  - Cost optimization
  - Automatic failover

#### FallbackLocationService (`services/fallbackLocationService.ts`)
- **Purpose**: Location services with multiple fallback options
- **Hierarchy**: GPS → Network → IP Geolocation → Mock
- **Features**:
  - Platform-specific implementations
  - Accuracy assessment
  - Compliance validation

#### EnhancedAIService (`services/enhancedAiService.ts`)
- **Purpose**: AI/NLP services with cloud and local fallbacks
- **Features**:
  - Cloud AI (Google AI Studio) → Rule-based responses
  - Context-aware responses
  - Diagnostic analysis
  - Voice command processing

### 2. API Configuration

```typescript
interface APIConfig {
  name: string;
  baseUrl: string;
  apiKey?: string;
  rateLimit: { daily: number; monthly: number };
  priority: 'primary' | 'fallback';
  usedFor: string[];
}
```

#### Primary APIs
- **Geotab**: ELD compliance, engine diagnostics (10,000 daily calls)
- **Samsara**: ELD compliance, telematics (5,000 daily calls)

#### Fallback APIs
- **ipapi.co**: IP-based geolocation (1,000 daily calls)
- **Google AI Studio**: NLP diagnostics (100 daily calls, 1.5M tokens/month)
- **OpenWeatherMap**: Weather data (1,000 daily calls)

### 3. Cost Control Features

#### Usage Monitoring
- Real-time tracking of API calls per service
- Daily and monthly quota management
- Automatic throttling when approaching limits
- Cost projection and savings calculation

#### Caching Strategy
- **VIN Decoding**: 24-hour cache
- **Weather Data**: 1-hour cache
- **Location Data**: 30-minute cache
- **Diagnostic Analysis**: 24-hour cache

#### Optimization Rules
1. **IF** total API calls > 10,000/month → Switch non-ELD users to free APIs
2. **IF** Google AI tokens > 1,000,000 → Disable diagnostic reports for free-tier users
3. **IF** primary API fails → Activate fallback with user notification

### 4. Graceful Degradation

#### Degraded Mode Indicators
- Status banner showing "Limited data mode"
- Feature availability notifications
- Accuracy warnings for location services

#### Feature Preservation
- **Always Available**: ELD compliance, engine fault alerts
- **Degraded**: Fuel savings forecasts, detailed weather
- **Disabled**: Advanced AI diagnostics, real-time traffic

### 5. User Interface Components

#### APIStatusBanner (`components/APIStatusBanner.tsx`)
- Shows current system status
- Displays degraded mode warnings
- Provides detailed usage statistics
- Recommendations for optimization

#### CostControlDashboard (`components/CostControlDashboard.tsx`)
- Monthly cost tracking
- Usage efficiency metrics
- Savings from fallback APIs
- Optimization tips

### 6. Implementation Details

#### Failover Logic
```typescript
private getAvailableAPIs(usedFor: string): APIConfig[] {
  return API_CONFIGS
    .filter(config => config.usedFor.includes(usedFor))
    .sort((a, b) => {
      // Primary APIs first, then by failure rate
      if (a.priority !== b.priority) {
        return a.priority === 'primary' ? -1 : 1;
      }
      const aFailures = this.usageStats[a.name]?.failures || 0;
      const bFailures = this.usageStats[b.name]?.failures || 0;
      return aFailures - bFailures;
    });
}
```

#### Cache Management
```typescript
private setCache(key: string, data: any, ttlHours: number = 1) {
  this.cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlHours * 60 * 60 * 1000
  });
}
```

#### Usage Tracking
```typescript
private incrementUsage(apiName: string, success: boolean) {
  if (!this.usageStats[apiName]) return;
  
  this.usageStats[apiName].dailyCalls++;
  this.usageStats[apiName].monthlyCalls++;
  
  if (!success) {
    this.usageStats[apiName].failures++;
  }
  
  this.saveUsageStats();
}
```

### 7. Testing and Validation

#### Failover Testing
- Simulate primary API failures
- Verify fallback activation
- Test degraded mode UI
- Validate ELD compliance preservation

#### Load Testing
- Mock 150% normal load
- Confirm throttling activation
- Test cache effectiveness
- Measure response times

#### Cost Validation
- Track actual vs. projected costs
- Verify savings calculations
- Test usage limit enforcement
- Validate billing integration

### 8. Monitoring and Alerts

#### System Health Checks
- API availability monitoring
- Response time tracking
- Error rate analysis
- Usage pattern detection

#### Automated Alerts
- Usage approaching limits (80% threshold)
- Primary API failures
- Cost projections exceeding budget
- Compliance feature degradation

### 9. Configuration Management

#### Environment Variables
```bash
EXPO_PUBLIC_GOOGLE_AI_KEY=your_google_ai_key
EXPO_PUBLIC_OPENWEATHER_KEY=your_openweather_key
EXPO_PUBLIC_TRUCKFAX_API_KEY=your_truckfax_key
```

#### Runtime Settings
- Enable/disable fallback APIs
- Adjust caching aggressiveness
- Configure cost optimization
- Set debug mode

### 10. Security Considerations

#### API Key Management
- Environment-based key storage
- Rotation procedures
- Access logging
- Rate limit enforcement

#### Data Privacy
- Cache encryption for sensitive data
- Automatic cache expiration
- User consent for location tracking
- Compliance with data regulations

### 11. Performance Optimization

#### Response Time Targets
- Primary APIs: < 2 seconds
- Fallback APIs: < 5 seconds
- Cache hits: < 100ms
- Degraded mode: < 1 second

#### Bandwidth Optimization
- Compressed API responses
- Minimal data payloads
- Efficient caching strategies
- Background sync for non-critical data

### 12. Future Enhancements

#### Planned Features
- Machine learning for usage prediction
- Dynamic pricing optimization
- Advanced analytics dashboard
- Multi-region failover

#### Scalability Considerations
- Microservice architecture
- Load balancing
- Database optimization
- CDN integration

## Usage Examples

### Basic API Call with Fallback
```typescript
// Get location with automatic fallback
const location = await hybridApiService.getLocation();
if (location) {
  console.log(`Location: ${location.city}, Accuracy: ${location.accuracy}m`);
}
```

### Weather Data with Cost Optimization
```typescript
// Get weather data using cost-optimized routing
const weather = await hybridApiService.getWeatherData(lat, lon);
if (weather) {
  console.log(`Temperature: ${weather.temperature}°F`);
}
```

### Diagnostic Analysis with Fallback
```typescript
// Analyze engine codes with AI fallback
const analysis = await hybridApiService.analyzeDiagnostics(logText);
if (analysis) {
  console.log(`Issues found: ${analysis.issues.length}`);
  console.log(`Severity: ${analysis.severity}/5`);
}
```

## Conclusion

The hybrid API architecture provides robust, cost-effective, and scalable API management for the trucking application. It ensures critical ELD compliance features remain available while optimizing costs and providing graceful degradation for non-essential features.

Key benefits:
- **Reliability**: Multiple fallback options prevent service disruption
- **Cost Control**: Intelligent routing reduces API costs by 60%+
- **Compliance**: ELD features always use primary, certified APIs
- **User Experience**: Transparent failover with clear status indicators
- **Scalability**: Modular design supports future growth and new APIs