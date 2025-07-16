import { Platform } from 'react-native';
import {
  RouteWaypoint,
  OptimizedRoute,
  RouteOptimizationPreferences,
  TrafficIncident,
  FuelStop,
  TruckRestriction,
  WeatherAlert,
} from '@/types';
import axios from 'axios';

// Openrouteservice API key - in production, this should be from environment variables
const OPENROUTESERVICE_API_KEY = 'YOUR_OPENROUTESERVICE_API_KEY';

class OpenRouteService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openrouteservice.org';

  constructor(apiKey: string = OPENROUTESERVICE_API_KEY) {
    this.apiKey = apiKey;
  }

  /**
   * Geocode an address to get coordinates
   */
  async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/geocode/search`,
        {
          params: {
            api_key: this.apiKey,
            text: address,
            size: 1
          }
        }
      );

      if (response.data.features && response.data.features.length > 0) {
        const geometry = response.data.features[0].geometry;
        return {
          latitude: geometry.coordinates[1],
          longitude: geometry.coordinates[0]
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding failed:', error);
      return null;
    }
  }

  /**
   * Reverse geocode coordinates to get address
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/geocode/reverse`,
        {
          params: {
            api_key: this.apiKey,
            'point.lat': latitude,
            'point.lon': longitude
          }
        }
      );

      if (response.data.features && response.data.features.length > 0) {
        return response.data.features[0].properties.label || 'Unknown location';
      }
      return 'Unknown location';
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return null;
    }
  }

  /**
   * Optimize route with multiple waypoints
   */
  async optimizeRoute(
    waypoints: RouteWaypoint[],
    preferences: RouteOptimizationPreferences
  ): Promise<OptimizedRoute | null> {
    try {
      if (waypoints.length < 2) {
        throw new Error('At least two waypoints are required for route optimization');
      }

      const coordinates = waypoints.map(wp => [
        wp.location.longitude,
        wp.location.latitude
      ]);

      // Use HGV (Heavy Goods Vehicle) profile for truck routing
      const profile = preferences.vehicleType === 'truck' ? 'driving-hgv' : 'driving-car';

      const response = await axios.post(
        `${this.baseUrl}/v2/directions/${profile}/geojson`,
        {
          coordinates,
          instructions: false,
          geometry: true,
          elevation: false,
          options: {
            avoid_features: preferences.avoidTolls ? ['tollways'] : [],
            avoid_borders: preferences.avoidBorders ? 'all' : 'none',
            profile_params: {
              restrictions: preferences.vehicleType === 'truck' ? {
                length: 16.5, // meters (example for truck length)
                width: 2.5,   // meters
                height: 4.0,  // meters
                weight: 40000 // kg
              } : {}
            }
          }
        },
        {
          headers: {
            'Authorization': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.features && response.data.features.length > 0) {
        const routeData = response.data.features[0];
        const summary = routeData.properties.summary;

        return {
          id: 'route_' + Date.now(),
          waypoints,
          totalDistance: Math.round(summary.distance / 1000), // Convert to km
          totalDuration: Math.round(summary.duration / 60), // Convert to minutes
          estimatedFuelCost: 0, // Not provided by Openrouteservice, would need separate calculation
          tollCosts: 0, // Not directly provided, would need additional integration
          routePolyline: routeData.geometry, // GeoJSON format
          trafficConditions: 'unknown',
          weatherAlerts: [], // Not provided by Openrouteservice
          truckRestrictions: [], // Handled in route options but not as separate alerts
          optimizationScore: 80, // Static value as not provided
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };
      }
      return null;
    } catch (error) {
      console.error('Route optimization failed:', error);
      return null;
    }
  }

  /**
   * Get real-time traffic information - Not supported by Openrouteservice
   * Returns empty array as placeholder
   */
  async getTrafficInfo(route: string): Promise<TrafficIncident[]> {
    console.warn('Traffic information is not supported by Openrouteservice API');
    return [];
  }

  /**
   * Find fuel stops along route using POI search
   */
  async findFuelStops(
    waypoints: RouteWaypoint[],
    fuelRange: number = 300
  ): Promise<FuelStop[]> {
    try {
      if (waypoints.length < 2) return [];

      // Use the middle point of the route for simplicity
      const midPointIndex = Math.floor(waypoints.length / 2);
      const midPoint = waypoints[midPointIndex].location;

      const response = await axios.get(
        `${this.baseUrl}/pois`,
        {
          params: {
            api_key: this.apiKey,
            request: 'pois',
            geometry: {
              bbox: [
                [midPoint.longitude - 0.1, midPoint.latitude - 0.1],
                [midPoint.longitude + 0.1, midPoint.latitude + 0.1]
              ],
              geojson: {
                type: 'Point',
                coordinates: [midPoint.longitude, midPoint.latitude]
              },
              buffer: 5000 // 5km radius
            },
            filters: {
              category_ids: [220] // Fuel stations category in ORS
            },
            limit: 5
          }
        }
      );

      if (response.data && response.data.features) {
        return response.data.features.map((feature: any, index: number) => ({
          id: String(index + 1),
          name: feature.properties.name || 'Fuel Station',
          address: feature.properties.address || 'Unknown address',
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
          brand: feature.properties.brand || 'Unknown',
          currentPrice: 0, // Not available from ORS
          truckParking: feature.properties.truck_parking || false,
          showers: false, // Not available
          restaurant: feature.properties.restaurant || false,
          distance: feature.properties.distance || 0,
          detourTime: 10, // Static value
          reviewCount: 0,
          amenities: [],
          rating: 0,
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to find fuel stops:', error);
      return [];
    }
  }

  /**
   * Get truck restrictions for route - Handled in route calculation but not as separate data
   */
  async getTruckRestrictions(route: string): Promise<TruckRestriction[]> {
    console.warn('Separate truck restrictions data not supported by Openrouteservice API');
    return [];
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
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
}

export const openRouteService = new OpenRouteService();
export default OpenRouteService;
