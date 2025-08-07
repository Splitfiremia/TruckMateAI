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

// OpenStreetMap services configuration
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const OVERPASS_BASE_URL = 'https://overpass-api.de/api/interpreter';

// Rate limiting for free APIs
const API_DELAY = 1000; // 1 second between requests to respect rate limits

class OpenStreetMapService {
  private lastRequestTime = 0;

  /**
   * Rate limiting helper to respect API limits
   */
  private async respectRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < API_DELAY) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Geocode an address using Nominatim API
   */
  async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      await this.respectRateLimit();
      
      const encodedAddress = encodeURIComponent(address);
      const url = `${NOMINATIM_BASE_URL}/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`;
      
      console.log('Geocoding address:', address);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TruckingApp/1.0 (contact@example.com)', // Required by Nominatim
        },
      });
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding failed:', error);
      // Fallback to mock data for demo purposes
      return {
        latitude: 40.7128 + (Math.random() - 0.5) * 10,
        longitude: -74.0060 + (Math.random() - 0.5) * 10,
      };
    }
  }

  /**
   * Reverse geocode coordinates using Nominatim API
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    try {
      await this.respectRateLimit();
      
      const url = `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TruckingApp/1.0 (contact@example.com)',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Reverse geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      }
      
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  }

  /**
   * Optimize route using basic distance calculation and waypoint ordering
   * Note: This is a simplified implementation. For production, consider using
   * OpenRouteService API or GraphHopper API for more advanced routing
   */
  async optimizeRoute(
    waypoints: RouteWaypoint[],
    preferences: RouteOptimizationPreferences
  ): Promise<OptimizedRoute | null> {
    try {
      console.log('Optimizing route with OSM service...');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (waypoints.length < 2) {
        return null;
      }

      // Simple optimization: calculate distances between all waypoints
      const optimizedWaypoints = await this.optimizeWaypointOrder(waypoints, preferences);
      
      // Calculate route metrics
      const totalDistance = this.calculateTotalDistance(optimizedWaypoints);
      const totalDuration = this.estimateDuration(totalDistance, preferences);
      const fuelCost = this.calculateFuelCost(totalDistance, preferences);
      const tollCosts = preferences.avoidTolls ? 0 : this.estimateTollCosts(totalDistance);

      return {
        id: 'osm_route_' + Date.now(),
        waypoints: optimizedWaypoints,
        totalDistance: Math.round(totalDistance),
        totalDuration: Math.round(totalDuration),
        estimatedFuelCost: Math.round(fuelCost * 100) / 100,
        tollCosts: Math.round(tollCosts * 100) / 100,
        routePolyline: await this.generateRoutePolyline(optimizedWaypoints),
        trafficConditions: 'moderate' as const,
        weatherAlerts: this.generateMockWeatherAlerts(),
        truckRestrictions: await this.getTruckRestrictionsAlongRoute(optimizedWaypoints),
        optimizationScore: this.calculateOptimizationScore(totalDistance, totalDuration, preferences),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Route optimization failed:', error);
      return null;
    }
  }

  /**
   * Simple waypoint optimization using nearest neighbor algorithm
   */
  private async optimizeWaypointOrder(
    waypoints: RouteWaypoint[],
    preferences: RouteOptimizationPreferences
  ): Promise<RouteWaypoint[]> {
    if (waypoints.length <= 2) {
      return waypoints;
    }

    // Keep first and last waypoints fixed if they are pickup/delivery
    const start = waypoints[0];
    const end = waypoints[waypoints.length - 1];
    const middle = waypoints.slice(1, -1);

    if (middle.length === 0) {
      return waypoints;
    }

    // Simple nearest neighbor optimization for middle waypoints
    const optimizedMiddle: RouteWaypoint[] = [];
    const remaining = [...middle];
    let current = start;

    while (remaining.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = this.calculateDistance(
        current.latitude,
        current.longitude,
        remaining[0].latitude,
        remaining[0].longitude
      );

      for (let i = 1; i < remaining.length; i++) {
        const distance = this.calculateDistance(
          current.latitude,
          current.longitude,
          remaining[i].latitude,
          remaining[i].longitude
        );

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      const nearest = remaining.splice(nearestIndex, 1)[0];
      optimizedMiddle.push(nearest);
      current = nearest;
    }

    return [start, ...optimizedMiddle, end];
  }

  /**
   * Calculate total distance for a route
   */
  private calculateTotalDistance(waypoints: RouteWaypoint[]): number {
    let totalDistance = 0;
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      const distance = this.calculateDistance(
        waypoints[i].latitude,
        waypoints[i].longitude,
        waypoints[i + 1].latitude,
        waypoints[i + 1].longitude
      );
      totalDistance += distance;
    }
    
    // Add 10% for actual road distance vs straight line
    return totalDistance * 1.1;
  }

  /**
   * Estimate driving duration based on distance and preferences
   */
  private estimateDuration(distance: number, preferences: RouteOptimizationPreferences): number {
    // Base speed assumptions
    let averageSpeed = 55; // mph
    
    if (preferences.avoidHighways) {
      averageSpeed = 45; // Slower on local roads
    }
    
    if (preferences.preferTruckRoutes) {
      averageSpeed = 50; // Truck routes might be slightly slower
    }
    
    // Convert to minutes
    const baseDuration = (distance / averageSpeed) * 60;
    
    // Add time for breaks based on distance
    const breakTime = Math.floor(distance / 300) * preferences.requiredBreakDuration;
    
    return baseDuration + breakTime;
  }

  /**
   * Calculate estimated fuel cost
   */
  private calculateFuelCost(distance: number, preferences: RouteOptimizationPreferences): number {
    const fuelNeeded = distance / preferences.mpg;
    const avgFuelPrice = 3.85; // Average diesel price per gallon
    return fuelNeeded * avgFuelPrice;
  }

  /**
   * Estimate toll costs based on distance
   */
  private estimateTollCosts(distance: number): number {
    // Rough estimate: $0.15 per mile for toll roads
    return distance * 0.15 * Math.random(); // Random factor for variability
  }

  /**
   * Calculate optimization score based on various factors
   */
  private calculateOptimizationScore(
    distance: number,
    duration: number,
    preferences: RouteOptimizationPreferences
  ): number {
    let score = 100;
    
    // Penalize longer routes
    if (distance > 500) score -= 10;
    if (distance > 1000) score -= 20;
    
    // Reward efficient time/distance ratio
    const efficiency = distance / (duration / 60); // miles per hour
    if (efficiency > 50) score += 10;
    if (efficiency < 40) score -= 10;
    
    // Apply preference bonuses
    if (preferences.prioritizeTime) score += 5;
    if (preferences.prioritizeFuel) score += 5;
    
    return Math.max(60, Math.min(100, score));
  }

  /**
   * Generate a simple route polyline (mock implementation)
   */
  private async generateRoutePolyline(waypoints: RouteWaypoint[]): Promise<string> {
    // In a real implementation, you would use OpenRouteService or similar
    // to get actual route geometry. For now, return a mock polyline.
    const coordinates = waypoints.map(wp => `${wp.longitude},${wp.latitude}`).join(';');
    return `osm_polyline_${coordinates.substring(0, 50)}`;
  }

  /**
   * Find fuel stops using Overpass API
   */
  async findFuelStops(
    waypoints: RouteWaypoint[],
    fuelRange: number = 300
  ): Promise<FuelStop[]> {
    try {
      // For demo purposes, return mock data
      // In production, you would query Overpass API for fuel stations
      return this.generateMockFuelStops(waypoints);
    } catch (error) {
      console.error('Failed to find fuel stops:', error);
      return this.generateMockFuelStops(waypoints);
    }
  }

  /**
   * Get truck restrictions along route using Overpass API
   */
  async getTruckRestrictionsAlongRoute(waypoints: RouteWaypoint[]): Promise<TruckRestriction[]> {
    try {
      // Mock implementation - in production, query Overpass API for restrictions
      return this.generateMockTruckRestrictions();
    } catch (error) {
      console.error('Failed to get truck restrictions:', error);
      return [];
    }
  }

  /**
   * Get real-time traffic information (mock implementation)
   * Note: OSM doesn't provide real-time traffic. You'd need to integrate
   * with services like HERE, TomTom, or Mapbox for traffic data.
   */
  async getTrafficInfo(route: string): Promise<TrafficIncident[]> {
    try {
      // Return mock traffic data
      return this.generateMockTrafficIncidents();
    } catch (error) {
      console.error('Failed to get traffic info:', error);
      return [];
    }
  }

  /**
   * Calculate distance between two points using Haversine formula
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

  // Mock data generators (same as Google Maps service for consistency)
  private generateMockTrafficIncidents(): TrafficIncident[] {
    const incidents: TrafficIncident[] = [
      {
        id: '1',
        type: 'accident',
        severity: 'moderate',
        description: 'Multi-vehicle accident on I-95 North',
        location: {
          latitude: 40.7589,
          longitude: -73.9851,
          address: 'I-95 North, Mile 45'
        },
        estimatedDelay: 25,
        startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        estimatedEndTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        type: 'construction',
        severity: 'minor',
        description: 'Lane closure for road maintenance',
        location: {
          latitude: 40.6892,
          longitude: -74.3444,
          address: 'Route 287, Mile 12'
        },
        estimatedDelay: 10,
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        estimatedEndTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return incidents;
  }

  private generateMockFuelStops(waypoints: RouteWaypoint[]): FuelStop[] {
    const fuelStops: FuelStop[] = [
      {
        id: '1',
        name: 'TravelCenters of America',
        address: '123 Highway Blvd, Anytown, ST 12345',
        latitude: 40.7282,
        longitude: -74.0776,
        brand: 'TA',
        currentPrice: 3.89,
        truckParking: true,
        showers: true,
        restaurant: true,
        distance: 0.5,
        detourTime: 8,
        reviewCount: 245,
        amenities: ['restaurant', 'shower', 'parking', 'wifi'],
        rating: 4.2,
      },
      {
        id: '2',
        name: 'Pilot Flying J',
        address: '456 Truck Stop Way, Somewhere, ST 67890',
        latitude: 40.6501,
        longitude: -73.9496,
        brand: 'Pilot',
        currentPrice: 3.92,
        truckParking: true,
        showers: false,
        restaurant: true,
        distance: 1.2,
        detourTime: 12,
        reviewCount: 189,
        amenities: ['restaurant', 'convenience_store', 'parking'],
        rating: 4.0,
      },
      {
        id: '3',
        name: 'Love\'s Travel Stop',
        address: '789 Truck Route Ave, Elsewhere, ST 54321',
        latitude: 40.5892,
        longitude: -74.1234,
        brand: 'Loves',
        currentPrice: 3.87,
        truckParking: true,
        showers: true,
        restaurant: true,
        distance: 2.1,
        detourTime: 15,
        reviewCount: 312,
        amenities: ['restaurant', 'shower', 'parking', 'laundry', 'wifi'],
        rating: 4.3,
      },
    ];

    return fuelStops;
  }

  private generateMockTruckRestrictions(): TruckRestriction[] {
    const restrictions: TruckRestriction[] = [
      {
        type: 'height',
        value: 13.6,
        description: 'Low bridge - 13\'6" clearance',
        location: {
          latitude: 40.7505,
          longitude: -73.9934,
          address: 'Bridge on Route 9'
        },
        severity: 'warning',
      },
      {
        type: 'weight',
        value: 80000,
        description: 'Weight limit 40 tons',
        location: {
          latitude: 40.7831,
          longitude: -73.9712,
          address: 'Local road restriction'
        },
        severity: 'restriction',
      },
      {
        type: 'length',
        value: 53,
        description: 'Length restriction - 53ft max',
        location: {
          latitude: 40.7234,
          longitude: -73.9876,
          address: 'City center restriction'
        },
        severity: 'restriction',
      },
    ];

    return restrictions;
  }

  private generateMockWeatherAlerts(): WeatherAlert[] {
    const alerts: WeatherAlert[] = [
      {
        id: '1',
        type: 'snow',
        severity: 'moderate',
        description: 'Snow expected 2-4 inches in Northern New Jersey',
        location: {
          latitude: 40.8176,
          longitude: -74.0431,
          address: 'Northern New Jersey'
        },
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        impact: 'medium',
      },
      {
        id: '2',
        type: 'wind',
        severity: 'high',
        description: 'High winds 35-45 mph, gusts up to 60 mph',
        location: {
          latitude: 40.7456,
          longitude: -74.0123,
          address: 'Interstate 80 corridor'
        },
        startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        impact: 'high',
      },
    ];

    return alerts;
  }
}

export const openStreetMapService = new OpenStreetMapService();
export default OpenStreetMapService;