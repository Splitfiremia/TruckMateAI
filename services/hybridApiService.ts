import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration Types
interface APIConfig {
  name: string;
  baseUrl: string;
  apiKey?: string;
  rateLimit: {
    daily: number;
    monthly: number;
  };
  priority: 'primary' | 'fallback';
  usedFor: string[];
}

interface UsageStats {
  [apiName: string]: {
    dailyCalls: number;
    monthlyCalls: number;
    lastReset: string;
    failures: number;
  };
}

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

// API Configurations - Updated for FleetPilot Hybrid Config
const API_CONFIGS: APIConfig[] = [
  // Trial APIs (Free Tier)
  {
    name: 'ipapi',
    baseUrl: 'https://api.ipapi.com',
    apiKey: process.env.EXPO_PUBLIC_IPAPI_KEY || 'demo_key',
    priority: 'fallback',
    usedFor: ['geolocation'],
    rateLimit: { daily: 1000, monthly: 30000 }
  },
  {
    name: 'OpenWeatherMap',
    baseUrl: 'https://api.openweathermap.org',
    apiKey: process.env.EXPO_PUBLIC_OPENWEATHER_KEY || 'demo_key',
    priority: 'fallback',
    usedFor: ['weather'],
    rateLimit: { daily: 1000, monthly: 30000 }
  },
  {
    name: 'GoogleAI',
    baseUrl: 'https://generativelanguage.googleapis.com',
    apiKey: process.env.EXPO_PUBLIC_GOOGLE_AI_KEY || 'demo_key',
    priority: 'fallback',
    usedFor: ['diagnostics'],
    rateLimit: { daily: 100, monthly: 1500 }
  },
  
  // Paid APIs (Premium Tier)
  {
    name: 'Geotab',
    baseUrl: 'https://my.geotab.com/apiv1',
    apiKey: process.env.EXPO_PUBLIC_GEOTAB_KEY || 'demo_key',
    priority: 'primary',
    usedFor: ['geolocation'],
    rateLimit: { daily: 10000, monthly: 300000 }
  },
  {
    name: 'WeatherStack',
    baseUrl: 'https://api.weatherstack.com',
    apiKey: process.env.EXPO_PUBLIC_WEATHERSTACK_KEY || 'demo_key',
    priority: 'primary',
    usedFor: ['weather'],
    rateLimit: { daily: 5000, monthly: 150000 }
  },
  {
    name: 'HuggingFace',
    baseUrl: 'https://api-inference.huggingface.co',
    apiKey: process.env.EXPO_PUBLIC_HUGGINGFACE_KEY || 'demo_key',
    priority: 'primary',
    usedFor: ['diagnostics'],
    rateLimit: { daily: 1000, monthly: 30000 }
  }
];

class HybridAPIService {
  private cache: Map<string, CacheEntry> = new Map();
  private usageStats: UsageStats = {};
  private isInitialized = false;

  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    if (this.isInitialized) return;
    
    try {
      // Load usage stats from storage
      const storedStats = await AsyncStorage.getItem('api_usage_stats');
      if (storedStats) {
        this.usageStats = JSON.parse(storedStats);
      }
      
      // Initialize stats for new APIs
      API_CONFIGS.forEach(config => {
        if (!this.usageStats[config.name]) {
          this.usageStats[config.name] = {
            dailyCalls: 0,
            monthlyCalls: 0,
            lastReset: new Date().toISOString(),
            failures: 0
          };
        }
      });
      
      this.isInitialized = true;
      this.resetDailyCountersIfNeeded();
    } catch (error) {
      console.error('Failed to initialize HybridAPIService:', error);
    }
  }

  private async saveUsageStats() {
    try {
      await AsyncStorage.setItem('api_usage_stats', JSON.stringify(this.usageStats));
    } catch (error) {
      console.error('Failed to save usage stats:', error);
    }
  }

  private resetDailyCountersIfNeeded() {
    const now = new Date();
    const today = now.toDateString();
    
    Object.keys(this.usageStats).forEach(apiName => {
      const lastReset = new Date(this.usageStats[apiName].lastReset);
      if (lastReset.toDateString() !== today) {
        this.usageStats[apiName].dailyCalls = 0;
        this.usageStats[apiName].lastReset = now.toISOString();
      }
    });
    
    this.saveUsageStats();
  }

  private getCacheKey(service: string, endpoint: string, params?: any): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${service}_${endpoint}_${paramString}`;
  }

  private isDataFresh(cacheEntry: CacheEntry): boolean {
    return Date.now() - cacheEntry.timestamp < cacheEntry.ttl;
  }

  private async getFromCache(key: string): Promise<any | null> {
    const entry = this.cache.get(key);
    if (entry && this.isDataFresh(entry)) {
      return entry.data;
    }
    return null;
  }

  private setCache(key: string, data: any, ttlHours: number = 1) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlHours * 60 * 60 * 1000
    });
  }

  private canMakeRequest(apiName: string): boolean {
    const stats = this.usageStats[apiName];
    const config = API_CONFIGS.find(c => c.name === apiName);
    
    if (!stats || !config) return false;
    
    return stats.dailyCalls < config.rateLimit.daily && 
           stats.monthlyCalls < config.rateLimit.monthly;
  }

  private incrementUsage(apiName: string, success: boolean) {
    if (!this.usageStats[apiName]) return;
    
    this.usageStats[apiName].dailyCalls++;
    this.usageStats[apiName].monthlyCalls++;
    
    if (!success) {
      this.usageStats[apiName].failures++;
    }
    
    this.saveUsageStats();
  }

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

  // Geolocation with fallback
  async getLocation(): Promise<{ latitude: number; longitude: number; accuracy: number; city?: string } | null> {
    const cacheKey = this.getCacheKey('location', 'current');
    const cached = await this.getFromCache(cacheKey);
    if (cached) return cached;

    // Try primary location services first (device GPS)
    if (Platform.OS !== 'web') {
      try {
        // This would use expo-location in a real implementation
        // For now, return mock data
        const location = {
          latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
          longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
          accuracy: 10,
          city: 'New York'
        };
        
        this.setCache(cacheKey, location, 0.5); // Cache for 30 minutes
        return location;
      } catch (error) {
        console.log('Primary location service failed, trying fallback');
      }
    }

    // Fallback to IP geolocation
    const apis = this.getAvailableAPIs('location');
    for (const api of apis) {
      if (!this.canMakeRequest(api.name)) continue;
      
      try {
        let response;
        if (api.name === 'ipapi') {
          response = await fetch(`${api.baseUrl}/json/`);
          const data = await response.json();
          
          if (data.latitude && data.longitude) {
            const location = {
              latitude: data.latitude,
              longitude: data.longitude,
              accuracy: data.accuracy || 50000, // IP location is less accurate
              city: data.city
            };
            
            this.incrementUsage(api.name, true);
            this.setCache(cacheKey, location, 1); // Cache for 1 hour
            return location;
          }
        }
      } catch (error) {
        console.error(`${api.name} location API failed:`, error);
        this.incrementUsage(api.name, false);
      }
    }

    return null;
  }

  // NLP Diagnostics with Google AI fallback
  async analyzeDiagnostics(logText: string): Promise<{ issues: string[]; severity: number } | null> {
    const cacheKey = this.getCacheKey('diagnostics', 'analyze', { logText: logText.substring(0, 100) });
    const cached = await this.getFromCache(cacheKey);
    if (cached) return cached;

    const apis = this.getAvailableAPIs('nlp_diagnostics');
    
    for (const api of apis) {
      if (!this.canMakeRequest(api.name)) continue;
      
      try {
        if (api.name === 'GoogleAI') {
          const response = await fetch(`${api.baseUrl}/v1beta/models/gemini-2.0-flash:generateContent?key=${api.apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `Analyze this truck engine log: ${logText}. Return JSON format: {"issues": ["issue1", "issue2"], "severity": 1-5}`
                }]
              }]
            })
          });
          
          const data = await response.json();
          if (data.candidates && data.candidates[0]) {
            const text = data.candidates[0].content.parts[0].text;
            try {
              const analysis = JSON.parse(text);
              this.incrementUsage(api.name, true);
              this.setCache(cacheKey, analysis, 24); // Cache for 24 hours
              return analysis;
            } catch (parseError) {
              // Fallback to simple analysis
              const analysis = {
                issues: ['Engine diagnostic analysis completed'],
                severity: 2
              };
              this.incrementUsage(api.name, true);
              return analysis;
            }
          }
        }
      } catch (error) {
        console.error(`${api.name} diagnostics API failed:`, error);
        this.incrementUsage(api.name, false);
      }
    }

    return null;
  }

  // Weather with OpenWeatherMap fallback
  async getWeatherData(lat: number, lon: number): Promise<any | null> {
    const cacheKey = this.getCacheKey('weather', 'current', { lat, lon });
    const cached = await this.getFromCache(cacheKey);
    if (cached) return cached;

    const apis = this.getAvailableAPIs('weather');
    
    for (const api of apis) {
      if (!this.canMakeRequest(api.name)) continue;
      
      try {
        if (api.name === 'OpenWeatherMap') {
          const response = await fetch(
            `${api.baseUrl}/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${api.apiKey}&units=imperial`
          );
          
          const data = await response.json();
          if (data.current) {
            const weatherData = {
              temperature: Math.round(data.current.temp),
              conditions: data.current.weather[0].description,
              humidity: data.current.humidity,
              windSpeed: Math.round(data.current.wind_speed),
              visibility: data.current.visibility ? Math.round(data.current.visibility * 0.000621371) : 10,
              rain: data.current.rain ? 'Risk' : 'No Risk'
            };
            
            this.incrementUsage(api.name, true);
            this.setCache(cacheKey, weatherData, 1); // Cache for 1 hour
            return weatherData;
          }
        }
      } catch (error) {
        console.error(`${api.name} weather API failed:`, error);
        this.incrementUsage(api.name, false);
      }
    }

    return null;
  }

  // Usage monitoring and alerts
  async getUsageStatus(): Promise<{
    apis: Array<{
      name: string;
      dailyUsage: number;
      dailyLimit: number;
      monthlyUsage: number;
      monthlyLimit: number;
      status: 'healthy' | 'warning' | 'critical';
    }>;
    totalCost: number;
    recommendations: string[];
  }> {
    await this.initializeService();
    
    const apis = API_CONFIGS.map(config => {
      const stats = this.usageStats[config.name] || { dailyCalls: 0, monthlyCalls: 0, failures: 0 };
      const dailyPercent = (stats.dailyCalls / config.rateLimit.daily) * 100;
      const monthlyPercent = (stats.monthlyCalls / config.rateLimit.monthly) * 100;
      
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (dailyPercent > 90 || monthlyPercent > 90) {
        status = 'critical';
      } else if (dailyPercent > 70 || monthlyPercent > 70) {
        status = 'warning';
      }
      
      return {
        name: config.name,
        dailyUsage: stats.dailyCalls,
        dailyLimit: config.rateLimit.daily,
        monthlyUsage: stats.monthlyCalls,
        monthlyLimit: config.rateLimit.monthly,
        status
      };
    });
    
    const recommendations: string[] = [];
    apis.forEach(api => {
      if (api.status === 'critical') {
        recommendations.push(`${api.name} usage is critical - consider upgrading plan`);
      } else if (api.status === 'warning') {
        recommendations.push(`${api.name} usage is high - monitor closely`);
      }
    });
    
    return {
      apis,
      totalCost: 0, // Would calculate based on actual usage
      recommendations
    };
  }

  // Force failover for testing
  async simulateFailover(apiName: string, duration: number = 300000) { // 5 minutes default
    if (this.usageStats[apiName]) {
      this.usageStats[apiName].failures += 100; // Force high failure rate
      setTimeout(() => {
        if (this.usageStats[apiName]) {
          this.usageStats[apiName].failures = 0;
        }
      }, duration);
    }
  }

  // Get degraded mode status
  isDegradedMode(): boolean {
    const primaryAPIs = API_CONFIGS.filter(c => c.priority === 'primary');
    return primaryAPIs.some(api => {
      const stats = this.usageStats[api.name];
      return !stats || !this.canMakeRequest(api.name) || stats.failures > 10;
    });
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

export const hybridApiService = new HybridAPIService();
export default hybridApiService;