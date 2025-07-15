import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  urgency: 'immediate' | 'expected' | 'future';
  certainty: 'observed' | 'likely' | 'possible' | 'unlikely';
  areas: string[];
  effective: string;
  expires: string;
  event: string;
  headline: string;
  instruction?: string;
}

export interface WeatherCondition {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  conditions: string;
  icon: string;
  timestamp: string;
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  conditions: string;
  icon: string;
  precipitationChance: number;
  windSpeed: number;
}

interface WeatherState {
  // Current location
  currentLocation: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
  } | null;
  
  // Weather data
  currentWeather: WeatherCondition | null;
  forecast: WeatherForecast[];
  alerts: WeatherAlert[];
  
  // Settings
  weatherAlertsEnabled: boolean;
  severeWeatherOnly: boolean;
  locationPermissionGranted: boolean;
  
  // Loading states
  isLoadingWeather: boolean;
  isLoadingAlerts: boolean;
  lastUpdated: string | null;
  
  // Actions
  requestLocationPermission: () => Promise<boolean>;
  updateLocation: (location: { latitude: number; longitude: number; city: string; state: string }) => void;
  fetchWeatherData: () => Promise<void>;
  fetchWeatherAlerts: () => Promise<void>;
  dismissAlert: (alertId: string) => void;
  updateWeatherSettings: (key: 'weatherAlertsEnabled' | 'severeWeatherOnly', value: boolean) => void;
  clearWeatherData: () => void;
}

const NOAA_API_BASE = 'https://api.weather.gov';

// Helper function to get location name from coordinates
const getLocationName = async (latitude: number, longitude: number): Promise<{ city: string; state: string }> => {
  try {
    if (Platform.OS === 'web') {
      // For web, use a simple fallback
      return { city: 'Current Location', state: '' };
    }
    
    const [location] = await Location.reverseGeocodeAsync({ latitude, longitude });
    return {
      city: location.city || 'Unknown',
      state: location.region || ''
    };
  } catch (error) {
    console.error('Error getting location name:', error);
    return { city: 'Current Location', state: '' };
  }
};

// Helper function to fetch from NOAA API
const fetchNOAAData = async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TruckingApp/1.0 (contact@example.com)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`NOAA API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('NOAA API fetch error:', error);
    throw error;
  }
};

export const useWeatherStore = create<WeatherState>()(persist(
  (set, get) => ({
    currentLocation: null,
    currentWeather: null,
    forecast: [],
    alerts: [],
    weatherAlertsEnabled: true,
    severeWeatherOnly: false,
    locationPermissionGranted: false,
    isLoadingWeather: false,
    isLoadingAlerts: false,
    lastUpdated: null,
    
    requestLocationPermission: async () => {
      try {
        if (Platform.OS === 'web') {
          // For web, use browser geolocation
          return new Promise((resolve) => {
            if ('geolocation' in navigator) {
              navigator.geolocation.getCurrentPosition(
                async (position) => {
                  const { latitude, longitude } = position.coords;
                  const locationName = await getLocationName(latitude, longitude);
                  
                  set({
                    currentLocation: {
                      latitude,
                      longitude,
                      city: locationName.city,
                      state: locationName.state
                    },
                    locationPermissionGranted: true
                  });
                  resolve(true);
                },
                () => resolve(false)
              );
            } else {
              resolve(false);
            }
          });
        }
        
        const { status } = await Location.requestForegroundPermissionsAsync();
        const granted = status === 'granted';
        
        if (granted) {
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          const locationName = await getLocationName(latitude, longitude);
          
          set({
            currentLocation: {
              latitude,
              longitude,
              city: locationName.city,
              state: locationName.state
            },
            locationPermissionGranted: true
          });
        }
        
        set({ locationPermissionGranted: granted });
        return granted;
      } catch (error) {
        console.error('Error requesting location permission:', error);
        return false;
      }
    },
    
    updateLocation: (location) => {
      set({ currentLocation: location });
    },
    
    fetchWeatherData: async () => {
      const { currentLocation } = get();
      if (!currentLocation) return;
      
      set({ isLoadingWeather: true });
      
      try {
        // Get grid point for location
        const pointsUrl = `${NOAA_API_BASE}/points/${currentLocation.latitude},${currentLocation.longitude}`;
        const pointsData = await fetchNOAAData(pointsUrl);
        
        // Get current conditions
        const stationsUrl = pointsData.properties.observationStations;
        const stationsData = await fetchNOAAData(stationsUrl);
        
        if (stationsData.features && stationsData.features.length > 0) {
          const stationId = stationsData.features[0].properties.stationIdentifier;
          const observationsUrl = `${NOAA_API_BASE}/stations/${stationId}/observations/latest`;
          const observationData = await fetchNOAAData(observationsUrl);
          
          const props = observationData.properties;
          const currentWeather: WeatherCondition = {
            temperature: props.temperature.value ? Math.round((props.temperature.value * 9/5) + 32) : 0,
            humidity: props.relativeHumidity.value || 0,
            windSpeed: props.windSpeed.value ? Math.round(props.windSpeed.value * 2.237) : 0, // Convert m/s to mph
            windDirection: props.windDirection.value ? `${Math.round(props.windDirection.value)}°` : 'N/A',
            visibility: props.visibility.value ? Math.round(props.visibility.value * 0.000621371) : 0, // Convert m to miles
            conditions: props.textDescription || 'Unknown',
            icon: props.icon || '',
            timestamp: props.timestamp
          };
          
          set({ currentWeather });
        }
        
        // Get forecast
        const forecastUrl = pointsData.properties.forecast;
        const forecastData = await fetchNOAAData(forecastUrl);
        
        const forecast: WeatherForecast[] = forecastData.properties.periods.slice(0, 7).map((period: any) => ({
          date: period.startTime.split('T')[0],
          high: period.temperature,
          low: period.temperature - 10, // NOAA doesn't always provide low, estimate
          conditions: period.shortForecast,
          icon: period.icon,
          precipitationChance: period.probabilityOfPrecipitation?.value || 0,
          windSpeed: parseInt(period.windSpeed) || 0
        }));
        
        set({ 
          forecast,
          lastUpdated: new Date().toISOString()
        });
        
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        set({ isLoadingWeather: false });
      }
    },
    
    fetchWeatherAlerts: async () => {
      const { currentLocation } = get();
      if (!currentLocation) return;
      
      set({ isLoadingAlerts: true });
      
      try {
        const alertsUrl = `${NOAA_API_BASE}/alerts/active?point=${currentLocation.latitude},${currentLocation.longitude}`;
        const alertsData = await fetchNOAAData(alertsUrl);
        
        const alerts: WeatherAlert[] = alertsData.features.map((alert: any) => ({
          id: alert.id,
          title: alert.properties.headline,
          description: alert.properties.description,
          severity: alert.properties.severity.toLowerCase(),
          urgency: alert.properties.urgency.toLowerCase(),
          certainty: alert.properties.certainty.toLowerCase(),
          areas: alert.properties.areaDesc.split('; '),
          effective: alert.properties.effective,
          expires: alert.properties.expires,
          event: alert.properties.event,
          headline: alert.properties.headline,
          instruction: alert.properties.instruction
        }));
        
        set({ alerts });
        
      } catch (error) {
        console.error('Error fetching weather alerts:', error);
      } finally {
        set({ isLoadingAlerts: false });
      }
    },
    
    dismissAlert: (alertId) => {
      set((state) => ({
        alerts: state.alerts.filter(alert => alert.id !== alertId)
      }));
    },
    
    updateWeatherSettings: (key, value) => {
      set({ [key]: value });
    },
    
    clearWeatherData: () => {
      set({
        currentWeather: null,
        forecast: [],
        alerts: [],
        lastUpdated: null
      });
    }
  }),
  {
    name: 'weather-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      weatherAlertsEnabled: state.weatherAlertsEnabled,
      severeWeatherOnly: state.severeWeatherOnly,
      locationPermissionGranted: state.locationPermissionGranted,
      currentLocation: state.currentLocation
    })
  }
));