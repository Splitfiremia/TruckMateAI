import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserTier {
  id: string;
  email: string;
  tier: 'trial' | 'paid';
  monthlyRevenue: number;
  apiCosts: number;
  apiCostRatio: number;
  joinedAt: string;
  lastActive: string;
}

export interface ApiUsage {
  service: string;
  provider: string;
  requests: number;
  cost: number;
  date: string;
}

export interface ProfitMetrics {
  monthlyRevenue: number;
  totalApiCosts: number;
  netProfit: number;
  profitMargin: number;
  userCount: {
    trial: number;
    paid: number;
  };
}

export interface CostAlert {
  id: string;
  userId: string;
  type: 'cost_threshold' | 'profit_margin' | 'api_failure';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  resolved: boolean;
}

interface AdminState {
  // User Management
  users: UserTier[];
  selectedUser: UserTier | null;
  
  // Metrics
  profitMetrics: ProfitMetrics;
  apiUsage: ApiUsage[];
  
  // Alerts
  alerts: CostAlert[];
  unreadAlerts: number;
  
  // Configuration
  costThresholds: {
    apiCostRatio: number;
    profitMarginMin: number;
    maxApiCostPerUser: number;
  };
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  
  // Actions
  loadAdminData: () => Promise<void>;
  updateUserTier: (userId: string, tier: 'trial' | 'paid') => Promise<void>;
  resolveAlert: (alertId: string) => void;
  updateCostThresholds: (thresholds: Partial<AdminState['costThresholds']>) => void;
  refreshMetrics: () => Promise<void>;
  exportUserData: () => Promise<string>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state
  users: [],
  selectedUser: null,
  profitMetrics: {
    monthlyRevenue: 0,
    totalApiCosts: 0,
    netProfit: 0,
    profitMargin: 0,
    userCount: { trial: 0, paid: 0 }
  },
  apiUsage: [],
  alerts: [],
  unreadAlerts: 0,
  costThresholds: {
    apiCostRatio: 0.3,
    profitMarginMin: 0.2,
    maxApiCostPerUser: 4.50
  },
  isLoading: false,
  isUpdating: false,

  // Load admin data from storage and API
  loadAdminData: async () => {
    set({ isLoading: true });
    
    try {
      // Load from AsyncStorage first for offline capability
      const storedData = await AsyncStorage.getItem('admin_data');
      if (storedData) {
        const data = JSON.parse(storedData);
        set({
          users: data.users || [],
          profitMetrics: data.profitMetrics || get().profitMetrics,
          apiUsage: data.apiUsage || [],
          alerts: data.alerts || []
        });
      }

      // Mock API call - replace with actual API integration
      const mockUsers: UserTier[] = [
        {
          id: '1',
          email: 'driver1@example.com',
          tier: 'trial',
          monthlyRevenue: 0,
          apiCosts: 0,
          apiCostRatio: 0,
          joinedAt: '2024-01-15',
          lastActive: '2024-01-18'
        },
        {
          id: '2',
          email: 'fleet@company.com',
          tier: 'paid',
          monthlyRevenue: 15,
          apiCosts: 2.30,
          apiCostRatio: 0.15,
          joinedAt: '2024-01-10',
          lastActive: '2024-01-18'
        },
        {
          id: '3',
          email: 'owner@trucking.com',
          tier: 'paid',
          monthlyRevenue: 15,
          apiCosts: 5.20,
          apiCostRatio: 0.35,
          joinedAt: '2024-01-05',
          lastActive: '2024-01-17'
        }
      ];

      const mockApiUsage: ApiUsage[] = [
        { service: 'geolocation', provider: 'ipapi', requests: 1250, cost: 0, date: '2024-01-18' },
        { service: 'weather', provider: 'openweathermap', requests: 890, cost: 0, date: '2024-01-18' },
        { service: 'diagnostics', provider: 'google_ai_studio', requests: 340, cost: 0, date: '2024-01-18' },
        { service: 'geolocation', provider: 'geotab', requests: 450, cost: 3.20, date: '2024-01-18' },
        { service: 'weather', provider: 'weatherstack', requests: 320, cost: 1.80, date: '2024-01-18' },
        { service: 'diagnostics', provider: 'hugging_face', requests: 180, cost: 2.50, date: '2024-01-18' }
      ];

      const totalRevenue = mockUsers.reduce((sum, user) => sum + user.monthlyRevenue, 0);
      const totalCosts = mockUsers.reduce((sum, user) => sum + user.apiCosts, 0);
      const netProfit = totalRevenue - totalCosts;
      const profitMargin = totalRevenue > 0 ? netProfit / totalRevenue : 0;

      const mockProfitMetrics: ProfitMetrics = {
        monthlyRevenue: totalRevenue,
        totalApiCosts: totalCosts,
        netProfit,
        profitMargin,
        userCount: {
          trial: mockUsers.filter(u => u.tier === 'trial').length,
          paid: mockUsers.filter(u => u.tier === 'paid').length
        }
      };

      // Generate alerts for users exceeding cost thresholds
      const mockAlerts: CostAlert[] = mockUsers
        .filter(user => user.apiCostRatio > 0.3)
        .map(user => ({
          id: `alert_${user.id}_${Date.now()}`,
          userId: user.id,
          type: 'cost_threshold' as const,
          message: `User ${user.email} exceeded 30% API cost ratio (${(user.apiCostRatio * 100).toFixed(1)}%)`,
          severity: user.apiCostRatio > 0.4 ? 'high' as const : 'medium' as const,
          timestamp: new Date().toISOString(),
          resolved: false
        }));

      // Add profit margin alert if needed
      if (profitMargin < 0.2) {
        mockAlerts.push({
          id: `profit_alert_${Date.now()}`,
          userId: 'system',
          type: 'profit_margin',
          message: `Profit margin below 20% threshold (${(profitMargin * 100).toFixed(1)}%)`,
          severity: 'high',
          timestamp: new Date().toISOString(),
          resolved: false
        });
      }

      set({
        users: mockUsers,
        profitMetrics: mockProfitMetrics,
        apiUsage: mockApiUsage,
        alerts: mockAlerts,
        unreadAlerts: mockAlerts.filter(a => !a.resolved).length
      });

      // Save to AsyncStorage
      await AsyncStorage.setItem('admin_data', JSON.stringify({
        users: mockUsers,
        profitMetrics: mockProfitMetrics,
        apiUsage: mockApiUsage,
        alerts: mockAlerts
      }));

    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Update user tier
  updateUserTier: async (userId: string, tier: 'trial' | 'paid') => {
    set({ isUpdating: true });
    
    try {
      const users = get().users.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              tier,
              monthlyRevenue: tier === 'paid' ? 15 : 0,
              apiCostRatio: tier === 'paid' ? user.apiCosts / 15 : 0
            }
          : user
      );
      
      set({ users });
      
      // Save to storage
      const currentData = await AsyncStorage.getItem('admin_data');
      if (currentData) {
        const data = JSON.parse(currentData);
        data.users = users;
        await AsyncStorage.setItem('admin_data', JSON.stringify(data));
      }
      
    } catch (error) {
      console.error('Failed to update user tier:', error);
    } finally {
      set({ isUpdating: false });
    }
  },

  // Resolve alert
  resolveAlert: (alertId: string) => {
    const alerts = get().alerts.map(alert =>
      alert.id === alertId ? { ...alert, resolved: true } : alert
    );
    
    set({ 
      alerts,
      unreadAlerts: alerts.filter(a => !a.resolved).length
    });
  },

  // Update cost thresholds
  updateCostThresholds: (thresholds) => {
    set({ 
      costThresholds: { ...get().costThresholds, ...thresholds }
    });
  },

  // Refresh metrics
  refreshMetrics: async () => {
    await get().loadAdminData();
  },

  // Export user data
  exportUserData: async () => {
    const { users, profitMetrics, apiUsage } = get();
    
    const exportData = {
      users,
      profitMetrics,
      apiUsage,
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(exportData, null, 2);
  }
}));