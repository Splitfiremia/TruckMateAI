import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { hybridApiService } from './hybridApiService';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  city?: string;
  state?: string;
  address?: string;
  source: 'gps' | 'network' | 'ip' | 'mock';
}

class FallbackLocationService {
  private lastKnownLocation: LocationData | null = null;
  private locationWatchId: any = null;

  async getCurrentLocation(): Promise<LocationData | null> {
    // Try GPS first (highest accuracy)
    if (Platform.OS !== 'web') {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            maximumAge: 300000, // 5 minutes
          });

          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy || 10,
            source: 'gps'
          };

          // Try to get address
          try {
            const [address] = await Location.reverseGeocodeAsync({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
            
            if (address) {
              locationData.city = address.city || undefined;
              locationData.state = address.region || undefined;
              locationData.address = [
                address.streetNumber,
                address.street,
                address.city,
                address.region
              ].filter(Boolean).join(', ');
            }
          } catch (geocodeError) {
            console.log('Geocoding failed, continuing without address');
          }

          this.lastKnownLocation = locationData;
          return locationData;
        }
      } catch (error) {
        console.log('GPS location failed, trying fallback methods:', error);
      }
    }

    // Fallback to IP geolocation
    try {
      const ipLocation = await hybridApiService.getLocation();
      if (ipLocation) {
        const locationData: LocationData = {
          ...ipLocation,
          source: 'ip'
        };
        this.lastKnownLocation = locationData;
        return locationData;
      }
    } catch (error) {
      console.log('IP geolocation failed:', error);
    }

    // Return last known location if available
    if (this.lastKnownLocation) {
      return {
        ...this.lastKnownLocation,
        accuracy: this.lastKnownLocation.accuracy * 2 // Indicate reduced accuracy
      };
    }

    // Final fallback - mock location for demo
    return {
      latitude: 39.8283,
      longitude: -98.5795,
      accuracy: 100000,
      city: 'Geographic Center',
      state: 'USA',
      address: 'United States',
      source: 'mock'
    };
  }

  async startLocationTracking(callback: (location: LocationData) => void): Promise<void> {
    if (Platform.OS === 'web') {
      // Web geolocation tracking
      if ('geolocation' in navigator) {
        this.locationWatchId = navigator.geolocation.watchPosition(
          (position) => {
            const locationData: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              source: 'network'
            };
            callback(locationData);
          },
          (error) => {
            console.error('Web geolocation error:', error);
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000
          }
        );
      }
      return;
    }

    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        this.locationWatchId = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 30000, // Update every 30 seconds
            distanceInterval: 100, // Update every 100 meters
          },
          (location) => {
            const locationData: LocationData = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy || 10,
              source: 'gps'
            };
            callback(locationData);
          }
        );
      }
    } catch (error) {
      console.error('Failed to start location tracking:', error);
    }
  }

  stopLocationTracking(): void {
    if (this.locationWatchId) {
      if (Platform.OS === 'web') {
        navigator.geolocation.clearWatch(this.locationWatchId);
      } else {
        this.locationWatchId.remove();
      }
      this.locationWatchId = null;
    }
  }

  getLastKnownLocation(): LocationData | null {
    return this.lastKnownLocation;
  }

  async geocodeAddress(address: string): Promise<LocationData | null> {
    if (Platform.OS !== 'web') {
      try {
        const locations = await Location.geocodeAsync(address);
        if (locations.length > 0) {
          const location = locations[0];
          return {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: 100, // Geocoded addresses have moderate accuracy
            address,
            source: 'network'
          };
        }
      } catch (error) {
        console.error('Geocoding failed:', error);
      }
    }

    // Fallback to mock geocoding for demo
    return {
      latitude: 40.7128 + (Math.random() - 0.5) * 10,
      longitude: -74.0060 + (Math.random() - 0.5) * 10,
      accuracy: 1000,
      address,
      source: 'mock'
    };
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Check if location is accurate enough for compliance
  isLocationAccurateForCompliance(location: LocationData): boolean {
    return location.accuracy < 100 && location.source !== 'ip' && location.source !== 'mock';
  }

  // Get location quality indicator
  getLocationQuality(location: LocationData): 'excellent' | 'good' | 'fair' | 'poor' {
    if (location.source === 'gps' && location.accuracy < 10) return 'excellent';
    if (location.source === 'gps' && location.accuracy < 50) return 'good';
    if (location.source === 'network' || location.accuracy < 1000) return 'fair';
    return 'poor';
  }
}

export const fallbackLocationService = new FallbackLocationService();
export default fallbackLocationService;