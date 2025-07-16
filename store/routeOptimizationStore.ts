import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  OptimizedRoute,
  RouteWaypoint,
  RouteOptimizationPreferences,
  TrafficIncident,
  FuelStop,
  RouteAnalytics,
  TruckRestriction,
  WeatherAlert
} from '@/types';

interface RouteOptimizationState {
  // Current route data
  currentRoute: OptimizedRoute | null;
  waypoints: RouteWaypoint[];
  preferences: RouteOptimizationPreferences;
  
  // Route history and analytics
  routeHistory: OptimizedRoute[];
  routeAnalytics: RouteAnalytics[];
  
  // Real-time data
  trafficIncidents: TrafficIncident[];
  nearbyFuelStops: FuelStop[];
  truckRestrictions: TruckRestriction[];
  weatherAlerts: WeatherAlert[];
  
  // UI state
  isOptimizing: boolean;
  isNavigating: boolean;
  showTraffic: boolean;
  showFuelStops: boolean;
  showWeatherAlerts: boolean;
  
  // Actions
  addWaypoint: (waypoint: RouteWaypoint) => void;
  removeWaypoint: (waypointId: string) => void;
  updateWaypoint: (waypointId: string, updates: Partial<RouteWaypoint>) => void;
  reorderWaypoints: (waypoints: RouteWaypoint[]) => void;
  
  optimizeRoute: () => Promise<OptimizedRoute | null>;
  selectRoute: (route: OptimizedRoute) => void;
  startNavigation: () => void;
  stopNavigation: () => void;
  
  updatePreferences: (preferences: Partial<RouteOptimizationPreferences>) => void;
  updateTrafficData: (incidents: TrafficIncident[]) => void;
  updateFuelStops: (stops: FuelStop[]) => void;
  updateWeatherAlerts: (alerts: WeatherAlert[]) => void;
  
  toggleTrafficView: () => void;
  toggleFuelStopsView: () => void;
  toggleWeatherView: () => void;
  
  saveRouteAnalytics: (analytics: RouteAnalytics) => void;
  clearRoute: () => void;
  clearHistory: () => void;
}

const defaultPreferences: RouteOptimizationPreferences = {
  prioritizeTime: true,
  prioritizeFuel: false,
  avoidTolls: false,
  avoidHighways: false,
  preferTruckRoutes: true,
  maxDrivingHours: 11,
  requiredBreakDuration: 30,
  fuelTankCapacity: 200,
  mpg: 6.5,
  truckDimensions: {
    height: 13.6,
    width: 8.5,
    length: 53,
    weight: 80000,
  },
  hazmatEndorsement: false,
};

// Mock Google Maps API integration
const mockOptimizeRoute = async (
  waypoints: RouteWaypoint[],
  preferences: RouteOptimizationPreferences
): Promise<OptimizedRoute> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const totalDistance = waypoints.length * 150 + Math.random() * 200;
  const totalDuration = totalDistance / 55 * 60; // Assuming 55 mph average
  
  return {
    id: `route_${Date.now()}`,
    waypoints,
    totalDistance,
    totalDuration,
    estimatedFuelCost: (totalDistance / preferences.mpg) * 3.85,
    tollCosts: preferences.avoidTolls ? 0 : Math.random() * 50,
    routePolyline: 'mock_polyline_data',
    trafficConditions: ['light', 'moderate', 'heavy'][Math.floor(Math.random() * 3)] as any,
    weatherAlerts: [],
    truckRestrictions: [],
    optimizationScore: 75 + Math.random() * 25,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };
};

// Mock route analytics data
const mockRouteAnalytics: RouteAnalytics[] = [
  {
    routeId: 'route_1234567890',
    actualDistance: 287.5,
    actualDuration: 342, // 5h 42m
    fuelConsumed: 44.2,
    tollsPaid: 23.50,
    delaysEncountered: [
      {
        id: 'delay_1',
        type: 'construction',
        severity: 'minor',
        description: 'Lane closure on I-95',
        location: { latitude: 40.7589, longitude: -73.9851, address: 'I-95 North' },
        estimatedDelay: 15,
        startTime: '2024-01-15T14:30:00Z',
      },
    ],
    fuelStopsUsed: [],
    complianceIssues: [],
    driverFeedback: { rating: 4, comments: 'Good route, minor delays' },
    accuracyScore: 87,
    completedAt: '2024-01-15T18:45:00Z',
  },
  {
    routeId: 'route_0987654321',
    actualDistance: 156.8,
    actualDuration: 198, // 3h 18m
    fuelConsumed: 24.1,
    tollsPaid: 0,
    delaysEncountered: [],
    fuelStopsUsed: [],
    complianceIssues: [],
    driverFeedback: { rating: 5, comments: 'Perfect route' },
    accuracyScore: 94,
    completedAt: '2024-01-14T16:22:00Z',
  },
  {
    routeId: 'route_1122334455',
    actualDistance: 423.2,
    actualDuration: 512, // 8h 32m
    fuelConsumed: 65.1,
    tollsPaid: 45.75,
    delaysEncountered: [
      {
        id: 'delay_2',
        type: 'accident',
        severity: 'moderate',
        description: 'Multi-vehicle accident',
        location: { latitude: 41.8781, longitude: -87.6298, address: 'I-80 West' },
        estimatedDelay: 35,
        startTime: '2024-01-13T11:15:00Z',
      },
    ],
    fuelStopsUsed: [],
    complianceIssues: [],
    driverFeedback: { rating: 3, comments: 'Long delays due to accident' },
    accuracyScore: 72,
    completedAt: '2024-01-13T19:47:00Z',
  },
];

export const useRouteOptimizationStore = create<RouteOptimizationState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentRoute: null,
      waypoints: [],
      preferences: defaultPreferences,
      routeHistory: [],
      routeAnalytics: mockRouteAnalytics,
      trafficIncidents: [],
      nearbyFuelStops: [],
      truckRestrictions: [],
      weatherAlerts: [],
      isOptimizing: false,
      isNavigating: false,
      showTraffic: true,
      showFuelStops: true,
      showWeatherAlerts: true,

      // Waypoint management
      addWaypoint: (waypoint) => {
        set((state) => ({
          waypoints: [...state.waypoints, waypoint],
        }));
      },

      removeWaypoint: (waypointId) => {
        set((state) => ({
          waypoints: state.waypoints.filter(w => w.id !== waypointId),
        }));
      },

      updateWaypoint: (waypointId, updates) => {
        set((state) => ({
          waypoints: state.waypoints.map(w =>
            w.id === waypointId ? { ...w, ...updates } : w
          ),
        }));
      },

      reorderWaypoints: (waypoints) => {
        set({ waypoints });
      },

      // Route optimization
      optimizeRoute: async () => {
        const { waypoints, preferences } = get();
        
        if (waypoints.length < 2) {
          return null;
        }

        set({ isOptimizing: true });

        try {
          const optimizedRoute = await mockOptimizeRoute(waypoints, preferences);
          
          set((state) => ({
            currentRoute: optimizedRoute,
            routeHistory: [optimizedRoute, ...state.routeHistory.slice(0, 9)],
            isOptimizing: false,
          }));

          return optimizedRoute;
        } catch (error) {
          console.error('Route optimization failed:', error);
          set({ isOptimizing: false });
          return null;
        }
      },

      selectRoute: (route) => {
        set({ currentRoute: route });
      },

      startNavigation: () => {
        set({ isNavigating: true });
      },

      stopNavigation: () => {
        set({ isNavigating: false });
      },

      // Preferences
      updatePreferences: (preferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        }));
      },

      // Real-time data updates
      updateTrafficData: (incidents) => {
        set({ trafficIncidents: incidents });
      },

      updateFuelStops: (stops) => {
        set({ nearbyFuelStops: stops });
      },

      updateWeatherAlerts: (alerts) => {
        set({ weatherAlerts: alerts });
      },

      // View toggles
      toggleTrafficView: () => {
        set((state) => ({ showTraffic: !state.showTraffic }));
      },

      toggleFuelStopsView: () => {
        set((state) => ({ showFuelStops: !state.showFuelStops }));
      },

      toggleWeatherView: () => {
        set((state) => ({ showWeatherAlerts: !state.showWeatherAlerts }));
      },

      // Analytics
      saveRouteAnalytics: (analytics) => {
        set((state) => ({
          routeAnalytics: [analytics, ...state.routeAnalytics.slice(0, 49)],
        }));
      },

      // Cleanup
      clearRoute: () => {
        set({
          currentRoute: null,
          waypoints: [],
          isNavigating: false,
        });
      },

      clearHistory: () => {
        set({
          routeHistory: [],
          routeAnalytics: [],
        });
      },
    }),
    {
      name: 'route-optimization-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        routeHistory: state.routeHistory.slice(0, 5), // Only persist recent routes
        routeAnalytics: state.routeAnalytics.slice(0, 10),
      }),
    }
  )
);