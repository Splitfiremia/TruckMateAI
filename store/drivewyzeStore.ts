import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  DrivewyzeWeighStation, 
  DrivewyzeBypassRequest, 
  DrivewyzeBypassResponse, 
  DrivewyzeNotification,
  DrivewyzeRoute,
  DrivewyzeAnalytics,
  DrivewyzeConfig 
} from '@/types';
import { drivewyzeApi } from '@/services/drivewyzeApi';

interface DrivewyzeState {
  // Configuration
  config: DrivewyzeConfig;
  
  // Weigh stations
  weighStations: DrivewyzeWeighStation[];
  nearbyStations: DrivewyzeWeighStation[];
  
  // Bypass requests
  bypassRequests: DrivewyzeBypassResponse[];
  activeBypass: DrivewyzeBypassResponse | null;
  
  // Notifications
  notifications: DrivewyzeNotification[];
  unreadNotifications: number;
  
  // Route information
  currentRoute: DrivewyzeRoute | null;
  
  // Analytics
  analytics: DrivewyzeAnalytics | null;
  
  // Loading states
  loading: {
    weighStations: boolean;
    bypass: boolean;
    notifications: boolean;
    route: boolean;
    analytics: boolean;
  };
  
  // Error states
  errors: {
    weighStations: string | null;
    bypass: string | null;
    notifications: string | null;
    route: string | null;
    analytics: string | null;
  };
  
  // Actions
  updateConfig: (config: Partial<DrivewyzeConfig>) => void;
  fetchWeighStationsOnRoute: (origin: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }) => Promise<void>;
  fetchNearbyWeighStations: (location: { latitude: number; longitude: number }, radius?: number) => Promise<void>;
  requestBypass: (request: DrivewyzeBypassRequest) => Promise<DrivewyzeBypassResponse | null>;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotification: (notificationId: string) => void;
  fetchRouteWithWeighStations: (origin: string, destination: string) => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  clearActiveBypass: () => void;
  refreshWeighStationStatus: (stationId: string) => Promise<void>;
  clearErrors: () => void;
}

export const useDrivewyzeStore = create<DrivewyzeState>()(persist(
  (set, get) => ({
    // Initial state
    config: {
      apiKey: '',
      deviceId: '',
      enableNotifications: true,
      autoBypassRequest: false,
      notificationRadius: 25,
      updateInterval: 5
    },
    
    weighStations: [],
    nearbyStations: [],
    bypassRequests: [],
    activeBypass: null,
    notifications: [],
    unreadNotifications: 0,
    currentRoute: null,
    analytics: null,
    
    loading: {
      weighStations: false,
      bypass: false,
      notifications: false,
      route: false,
      analytics: false
    },
    
    errors: {
      weighStations: null,
      bypass: null,
      notifications: null,
      route: null,
      analytics: null
    },
    
    // Actions
    updateConfig: (newConfig) => {
      set((state) => ({
        config: { ...state.config, ...newConfig }
      }));
    },
    
    fetchWeighStationsOnRoute: async (origin, destination) => {
      set((state) => ({
        loading: { ...state.loading, weighStations: true },
        errors: { ...state.errors, weighStations: null }
      }));
      
      try {
        const stations = await drivewyzeApi.getWeighStationsOnRoute(origin, destination);
        set((state) => ({
          weighStations: stations,
          loading: { ...state.loading, weighStations: false }
        }));
      } catch (error) {
        set((state) => ({
          loading: { ...state.loading, weighStations: false },
          errors: { ...state.errors, weighStations: 'Failed to fetch weigh stations' }
        }));
      }
    },
    
    fetchNearbyWeighStations: async (location, radius = 25) => {
      set((state) => ({
        loading: { ...state.loading, weighStations: true },
        errors: { ...state.errors, weighStations: null }
      }));
      
      try {
        const stations = await drivewyzeApi.getNearbyWeighStations(location, radius);
        set((state) => ({
          nearbyStations: stations,
          loading: { ...state.loading, weighStations: false }
        }));
      } catch (error) {
        set((state) => ({
          loading: { ...state.loading, weighStations: false },
          errors: { ...state.errors, weighStations: 'Failed to fetch nearby weigh stations' }
        }));
      }
    },
    
    requestBypass: async (request) => {
      set((state) => ({
        loading: { ...state.loading, bypass: true },
        errors: { ...state.errors, bypass: null }
      }));
      
      try {
        const response = await drivewyzeApi.requestBypass(request);
        set((state) => ({
          bypassRequests: [...state.bypassRequests, response],
          activeBypass: response.status === 'approved' ? response : null,
          loading: { ...state.loading, bypass: false }
        }));
        return response;
      } catch (error) {
        set((state) => ({
          loading: { ...state.loading, bypass: false },
          errors: { ...state.errors, bypass: 'Failed to request bypass' }
        }));
        return null;
      }
    },
    
    fetchNotifications: async () => {
      set((state) => ({
        loading: { ...state.loading, notifications: true },
        errors: { ...state.errors, notifications: null }
      }));
      
      try {
        const notifications = await drivewyzeApi.getNotifications();
        const unreadCount = notifications.filter(n => !n.actionRequired).length;
        set((state) => ({
          notifications,
          unreadNotifications: unreadCount,
          loading: { ...state.loading, notifications: false }
        }));
      } catch (error) {
        set((state) => ({
          loading: { ...state.loading, notifications: false },
          errors: { ...state.errors, notifications: 'Failed to fetch notifications' }
        }));
      }
    },
    
    markNotificationAsRead: (notificationId) => {
      set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === notificationId ? { ...n, actionRequired: false } : n
        ),
        unreadNotifications: Math.max(0, state.unreadNotifications - 1)
      }));
    },
    
    clearNotification: (notificationId) => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== notificationId),
        unreadNotifications: state.notifications.find(n => n.id === notificationId)?.actionRequired 
          ? Math.max(0, state.unreadNotifications - 1) 
          : state.unreadNotifications
      }));
    },
    
    fetchRouteWithWeighStations: async (origin, destination) => {
      set((state) => ({
        loading: { ...state.loading, route: true },
        errors: { ...state.errors, route: null }
      }));
      
      try {
        const route = await drivewyzeApi.getRouteWithWeighStations(origin, destination);
        set((state) => ({
          currentRoute: route,
          weighStations: route.weighStations,
          loading: { ...state.loading, route: false }
        }));
      } catch (error) {
        set((state) => ({
          loading: { ...state.loading, route: false },
          errors: { ...state.errors, route: 'Failed to fetch route information' }
        }));
      }
    },
    
    fetchAnalytics: async () => {
      set((state) => ({
        loading: { ...state.loading, analytics: true },
        errors: { ...state.errors, analytics: null }
      }));
      
      try {
        const analytics = await drivewyzeApi.getAnalytics();
        set((state) => ({
          analytics,
          loading: { ...state.loading, analytics: false }
        }));
      } catch (error) {
        set((state) => ({
          loading: { ...state.loading, analytics: false },
          errors: { ...state.errors, analytics: 'Failed to fetch analytics' }
        }));
      }
    },
    
    clearActiveBypass: () => {
      set({ activeBypass: null });
    },
    
    refreshWeighStationStatus: async (stationId) => {
      try {
        const updatedStation = await drivewyzeApi.getWeighStationStatus(stationId);
        if (updatedStation) {
          set((state) => ({
            weighStations: state.weighStations.map(station => 
              station.id === stationId ? updatedStation : station
            ),
            nearbyStations: state.nearbyStations.map(station => 
              station.id === stationId ? updatedStation : station
            )
          }));
        }
      } catch (error) {
        console.error('Failed to refresh weigh station status:', error);
      }
    },
    
    clearErrors: () => {
      set({
        errors: {
          weighStations: null,
          bypass: null,
          notifications: null,
          route: null,
          analytics: null
        }
      });
    }
  }),
  {
    name: 'drivewyze-store',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      config: state.config,
      bypassRequests: state.bypassRequests,
      analytics: state.analytics
    })
  }
));