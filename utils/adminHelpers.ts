// Admin utility functions for TruckMate AI Backend

export interface CostCalculation {
  apiCosts: number;
  userRevenue: number;
  ratio: number;
  isOverThreshold: boolean;
  projectedMonthlyCost: number;
  projectedMonthlyRevenue: number;
}

export interface UserTierDistribution {
  trial: number;
  paid: number;
  total: number;
  conversionRate: number;
}

export interface ApiUsageStats {
  totalRequests: number;
  costPerRequest: number;
  totalCost: number;
  requestsByTier: {
    trial: number;
    paid: number;
  };
  costByTier: {
    trial: number;
    paid: number;
  };
}

// Cost Control Helpers
export const calculateCostRatio = (apiCosts: number, userRevenue: number): CostCalculation => {
  const ratio = userRevenue > 0 ? apiCosts / userRevenue : 0;
  const isOverThreshold = ratio > 0.35;
  
  // Project monthly costs based on daily averages
  const projectedMonthlyCost = apiCosts * 30;
  const projectedMonthlyRevenue = userRevenue * 30;
  
  return {
    apiCosts,
    userRevenue,
    ratio,
    isOverThreshold,
    projectedMonthlyCost,
    projectedMonthlyRevenue,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

// User Management Helpers
export const calculateUserDistribution = (users: any[]): UserTierDistribution => {
  const trialUsers = users.filter(u => u.tier === 'trial').length;
  const paidUsers = users.filter(u => u.tier === 'paid').length;
  const total = users.length;
  const conversionRate = total > 0 ? paidUsers / total : 0;
  
  return {
    trial: trialUsers,
    paid: paidUsers,
    total,
    conversionRate,
  };
};

export const calculateChurnRate = (subscriptions: any[]): number => {
  const cancelledSubscriptions = subscriptions.filter(s => s.status === 'cancelled').length;
  const totalSubscriptions = subscriptions.length;
  
  return totalSubscriptions > 0 ? cancelledSubscriptions / totalSubscriptions : 0;
};

// API Gateway Helpers
export const calculateApiUsage = (endpoints: any[]): ApiUsageStats => {
  const totalRequests = endpoints.reduce((sum, endpoint) => sum + endpoint.requests_today, 0);
  const totalCost = endpoints.reduce((sum, endpoint) => 
    sum + (endpoint.requests_today * endpoint.cost_per_request), 0
  );
  const costPerRequest = totalRequests > 0 ? totalCost / totalRequests : 0;
  
  const trialEndpoints = endpoints.filter(e => e.tier === 'trial');
  const paidEndpoints = endpoints.filter(e => e.tier === 'paid');
  
  const trialRequests = trialEndpoints.reduce((sum, e) => sum + e.requests_today, 0);
  const paidRequests = paidEndpoints.reduce((sum, e) => sum + e.requests_today, 0);
  
  const trialCost = trialEndpoints.reduce((sum, e) => sum + (e.requests_today * e.cost_per_request), 0);
  const paidCost = paidEndpoints.reduce((sum, e) => sum + (e.requests_today * e.cost_per_request), 0);
  
  return {
    totalRequests,
    costPerRequest,
    totalCost,
    requestsByTier: {
      trial: trialRequests,
      paid: paidRequests,
    },
    costByTier: {
      trial: trialCost,
      paid: paidCost,
    },
  };
};

// Alert System Helpers
export const generateCostBreachAlert = (ratio: number) => ({
  id: Date.now().toString(),
  title: 'Cost Breach Alert',
  message: `API costs (${formatPercentage(ratio)}) exceed 35% threshold. Auto-downgrade activated.`,
  severity: 'high' as const,
  timestamp: new Date().toLocaleString(),
  resolved: false,
});

export const generatePaymentFailedAlert = (userEmail: string) => ({
  id: Date.now().toString(),
  title: 'Payment Failed',
  message: `Payment failed for user: ${userEmail}`,
  severity: 'high' as const,
  timestamp: new Date().toLocaleString(),
  resolved: false,
});

export const generateHighUsageAlert = (userEmail: string, usage: number) => ({
  id: Date.now().toString(),
  title: 'High API Usage',
  message: `User ${userEmail} exceeded daily limit with ${usage} requests`,
  severity: 'medium' as const,
  timestamp: new Date().toLocaleString(),
  resolved: false,
});

// Data Validation Helpers
export const validateApiKey = (key: string): boolean => {
  return Boolean(key && key.length > 10 && !key.includes('[YOUR_'));
};

export const validateWebhookUrl = (url: string): boolean => {
  try {
    new URL(url);
    return url.startsWith('https://');
  } catch {
    return false;
  }
};

export const validateCostThreshold = (threshold: number): boolean => {
  return threshold > 0 && threshold <= 1;
};

// Configuration Helpers
export const getApiTierConfig = (tier: 'trial' | 'paid') => {
  const configs = {
    trial: {
      location: {
        provider: 'ipapi',
        url: 'https://api.ipapi.com',
        costPerRequest: 0.001,
        dailyLimit: 1000,
      },
      diagnostics: {
        provider: 'google_ai',
        url: 'https://generativelanguage.googleapis.com',
        costPerRequest: 0.002,
        dailyLimit: 100,
      },
      weather: {
        provider: 'openweather',
        url: 'https://api.openweathermap.org',
        costPerRequest: 0.0005,
        dailyLimit: 1000,
      },
    },
    paid: {
      location: {
        provider: 'geotab',
        url: 'https://my.geotab.com/apiv1',
        costPerRequest: 0.005,
        dailyLimit: 10000,
      },
      diagnostics: {
        provider: 'hugging_face',
        url: 'https://api-inference.huggingface.co',
        costPerRequest: 0.008,
        dailyLimit: 1000,
      },
      weather: {
        provider: 'weatherstack',
        url: 'https://api.weatherstack.com',
        costPerRequest: 0.001,
        dailyLimit: 10000,
      },
    },
  };
  
  return configs[tier];
};

// Time and Date Helpers
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }
};

export const getDateRange = (days: number): { start: string; end: string } => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};

// Export Configuration Generator
export const generateDeploymentConfig = () => {
  return {
    project: {
      name: 'TruckMate_AI_Admin',
      mode: 'profit_optimized',
      platforms: ['web_admin', 'mobile_sync'],
    },
    user_tiers: {
      trial: {
        apis: getApiTierConfig('trial'),
        limits: {
          daily_requests: 100,
          monthly_cost: 0.00,
        },
      },
      paid: {
        apis: getApiTierConfig('paid'),
        cost_ceiling: 0.35,
      },
    },
    deployment: {
      hosting: 'netlify',
      domain: 'admin.truckmate.ai',
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL || '[YOUR_SUPABASE_URL]',
        NOCODB_KEY: process.env.NOCODB_KEY || '[YOUR_NOCODB_KEY]',
        STRIPE_KEY: process.env.STRIPE_KEY || '[YOUR_STRIPE_KEY]',
        KONG_ADMIN_URL: process.env.KONG_ADMIN_URL || '[YOUR_KONG_URL]',
      },
    },
  };
};