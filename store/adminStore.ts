import { create } from 'zustand';

export interface User {
  uid: string;
  name: string;
  email: string;
  tier: 'trial' | 'paid';
  subscription_id?: string;
  created_at: string;
  last_active: string;
  api_usage: number;
  monthly_cost: number;
}

export interface ApiEndpoint {
  name: string;
  url: string;
  tier: 'trial' | 'paid';
  cost_per_request: number;
  requests_today: number;
  status: 'active' | 'inactive' | 'error';
}

export interface CostMetric {
  date: string;
  api_costs: number;
  user_revenue: number;
  ratio: number;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  resolved: boolean;
}

export interface PaymentData {
  subscription_id: string;
  user_id: string;
  plan: string;
  amount: number;
  status: 'active' | 'cancelled' | 'past_due';
  next_billing: string;
}

interface AdminState {
  // Metrics
  metrics: {
    totalUsers: number;
    activeUsers: number;
    trialUsers: number;
    paidUsers: number;
    apiRequests: number;
    costRatio: number;
    monthlyRevenue: number;
    dailyApiCost: number;
  };
  
  // Data
  users: User[];
  apiEndpoints: ApiEndpoint[];
  costHistory: CostMetric[];
  alerts: Alert[];
  payments: PaymentData[];
  
  // Loading states
  loading: {
    users: boolean;
    metrics: boolean;
    costs: boolean;
    payments: boolean;
  };
  
  // Actions
  fetchUsers: () => Promise<void>;
  fetchMetrics: () => Promise<void>;
  fetchCostHistory: () => Promise<void>;
  fetchPayments: () => Promise<void>;
  updateUserTier: (userId: string, tier: 'trial' | 'paid') => Promise<void>;
  toggleApiEndpoint: (endpointName: string) => Promise<void>;
  resolveAlert: (alertId: string) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  metrics: {
    totalUsers: 1247,
    activeUsers: 892,
    trialUsers: 1089,
    paidUsers: 158,
    apiRequests: 15420,
    costRatio: 0.28,
    monthlyRevenue: 23700,
    dailyApiCost: 186.50,
  },
  
  users: [
    {
      uid: '1',
      name: 'John Smith',
      email: 'john@example.com',
      tier: 'paid',
      subscription_id: 'sub_123',
      created_at: '2024-01-15',
      last_active: '2024-01-18 14:30',
      api_usage: 450,
      monthly_cost: 15.00,
    },
    {
      uid: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      tier: 'trial',
      created_at: '2024-01-17',
      last_active: '2024-01-18 09:15',
      api_usage: 85,
      monthly_cost: 0.00,
    },
    {
      uid: '3',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      tier: 'paid',
      subscription_id: 'sub_456',
      created_at: '2024-01-10',
      last_active: '2024-01-18 16:45',
      api_usage: 720,
      monthly_cost: 15.00,
    },
  ],
  
  apiEndpoints: [
    {
      name: 'Location (Trial)',
      url: 'https://api.ipapi.com',
      tier: 'trial',
      cost_per_request: 0.001,
      requests_today: 8420,
      status: 'active',
    },
    {
      name: 'Location (Paid)',
      url: 'https://my.geotab.com/apiv1',
      tier: 'paid',
      cost_per_request: 0.005,
      requests_today: 3200,
      status: 'active',
    },
    {
      name: 'Diagnostics (Trial)',
      url: 'https://generativelanguage.googleapis.com',
      tier: 'trial',
      cost_per_request: 0.002,
      requests_today: 2100,
      status: 'active',
    },
    {
      name: 'Diagnostics (Paid)',
      url: 'https://api-inference.huggingface.co',
      tier: 'paid',
      cost_per_request: 0.008,
      requests_today: 1800,
      status: 'active',
    },
  ],
  
  costHistory: [
    { date: '2024-01-14', api_costs: 145.20, user_revenue: 580.00, ratio: 0.25 },
    { date: '2024-01-15', api_costs: 162.30, user_revenue: 595.00, ratio: 0.27 },
    { date: '2024-01-16', api_costs: 178.90, user_revenue: 610.00, ratio: 0.29 },
    { date: '2024-01-17', api_costs: 195.40, user_revenue: 625.00, ratio: 0.31 },
    { date: '2024-01-18', api_costs: 186.50, user_revenue: 640.00, ratio: 0.29 },
  ],
  
  alerts: [
    {
      id: '1',
      title: 'High API Usage Detected',
      message: 'User john@example.com exceeded daily limit',
      severity: 'medium',
      timestamp: '2 hours ago',
      resolved: false,
    },
    {
      id: '2',
      title: 'Payment Failed',
      message: 'Subscription renewal failed for user sarah@example.com',
      severity: 'high',
      timestamp: '4 hours ago',
      resolved: false,
    },
    {
      id: '3',
      title: 'API Endpoint Slow Response',
      message: 'Geotab API response time > 5 seconds',
      severity: 'low',
      timestamp: '6 hours ago',
      resolved: true,
    },
  ],
  
  payments: [
    {
      subscription_id: 'sub_123',
      user_id: '1',
      plan: 'Pro Plan',
      amount: 15.00,
      status: 'active',
      next_billing: '2024-02-15',
    },
    {
      subscription_id: 'sub_456',
      user_id: '3',
      plan: 'Pro Plan',
      amount: 15.00,
      status: 'active',
      next_billing: '2024-02-10',
    },
  ],
  
  loading: {
    users: false,
    metrics: false,
    costs: false,
    payments: false,
  },
  
  fetchUsers: async () => {
    set((state) => ({ loading: { ...state.loading, users: true } }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, fetch from Supabase/NocoDB
    set((state) => ({ loading: { ...state.loading, users: false } }));
  },
  
  fetchMetrics: async () => {
    set((state) => ({ loading: { ...state.loading, metrics: true } }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In real implementation, calculate from database
    set((state) => ({ loading: { ...state.loading, metrics: false } }));
  },
  
  fetchCostHistory: async () => {
    set((state) => ({ loading: { ...state.loading, costs: true } }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    set((state) => ({ loading: { ...state.loading, costs: false } }));
  },
  
  fetchPayments: async () => {
    set((state) => ({ loading: { ...state.loading, payments: true } }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 900));
    
    set((state) => ({ loading: { ...state.loading, payments: false } }));
  },
  
  updateUserTier: async (userId: string, tier: 'trial' | 'paid') => {
    // Update user tier in database
    set((state) => ({
      users: state.users.map(user =>
        user.uid === userId ? { ...user, tier } : user
      ),
    }));
    
    // Update metrics
    const { users } = get();
    const trialUsers = users.filter(u => u.tier === 'trial').length;
    const paidUsers = users.filter(u => u.tier === 'paid').length;
    
    set((state) => ({
      metrics: {
        ...state.metrics,
        trialUsers,
        paidUsers,
      },
    }));
  },
  
  toggleApiEndpoint: async (endpointName: string) => {
    set((state) => ({
      apiEndpoints: state.apiEndpoints.map(endpoint =>
        endpoint.name === endpointName
          ? { ...endpoint, status: endpoint.status === 'active' ? 'inactive' : 'active' }
          : endpoint
      ),
    }));
  },
  
  resolveAlert: (alertId: string) => {
    set((state) => ({
      alerts: state.alerts.map(alert =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      ),
    }));
  },
  
  addAlert: (alertData: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
    };
    
    set((state) => ({
      alerts: [newAlert, ...state.alerts],
    }));
  },
}));