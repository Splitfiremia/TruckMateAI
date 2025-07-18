export type PricingTier = 'basic' | 'pro' | 'elite';
export type UserType = 'owner-operator' | 'fleet';
export type BillingCycle = 'monthly' | 'annual';

export interface PricingPlan {
  id: PricingTier;
  name: string;
  description: string;
  basePrice: {
    ownerOperator: {
      monthly: number;
      annual: number;
    };
    fleet: {
      monthly: number;
      annual: number;
      perVehicle: number;
    };
  };
  features: PricingFeature[];
  limits: {
    vehicles: number | 'unlimited';
    apiCalls: number | 'unlimited';
    storage: string;
    support: string;
  };
  popular?: boolean;
  badge?: string;
}

export interface PricingFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
  addon?: {
    price: number;
    billingType: 'one-time' | 'monthly' | 'per-vehicle';
  };
  category: 'core' | 'compliance' | 'maintenance' | 'optimization' | 'integration';
}

export interface PricingCalculation {
  userType: UserType;
  vehicleCount: number;
  selectedTier: PricingTier;
  billingCycle: BillingCycle;
  addons: string[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  savings?: {
    annualDiscount: number;
    estimatedMonthlySavings: number;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  quote: string;
  savings?: {
    amount: number;
    metric: 'fuel' | 'maintenance' | 'compliance' | 'time';
  };
  rating: number;
  verified: boolean;
}

export interface PaymentGateway {
  id: 'stripe' | 'paypal';
  name: string;
  enabled: boolean;
  config: {
    publicKey: string;
    webhookEndpoint: string;
    supportedMethods: string[];
  };
}

export interface Subscription {
  id: string;
  userId: string;
  planId: PricingTier;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  billingCycle: BillingCycle;
  vehicleCount: number;
  addons: SubscriptionAddon[];
  totalAmount: number;
  nextBillingDate: string;
  trialEndsAt?: string;
  canceledAt?: string;
  paymentMethod: {
    type: 'card' | 'bank';
    last4: string;
    brand?: string;
  };
}

export interface SubscriptionAddon {
  id: string;
  name: string;
  price: number;
  billingType: 'one-time' | 'monthly' | 'per-vehicle';
  quantity: number;
  addedAt: string;
}

export interface UsageAlert {
  id: string;
  type: 'tier_limit' | 'api_usage' | 'upgrade_nudge' | 'cost_saving';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  threshold: number;
  currentUsage: number;
  actionRequired: boolean;
  upgradeRecommendation?: {
    tier: PricingTier;
    benefit: string;
    estimatedSavings?: number;
  };
  dismissible: boolean;
  expiresAt?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  required: boolean;
  completed: boolean;
  data?: any;
}

export interface OnboardingFlow {
  userId: string;
  currentStep: number;
  steps: OnboardingStep[];
  selectedPlan?: PricingTier;
  vehicleCount?: number;
  userType?: UserType;
  selectedFeatures: string[];
  paymentMethod?: {
    type: string;
    token: string;
  };
  completedAt?: string;
}

export interface PricingAnalytics {
  conversionRate: {
    basic: number;
    pro: number;
    elite: number;
  };
  averageRevenuePerUser: number;
  churnRate: number;
  upgradeRate: number;
  mostPopularAddons: string[];
  seasonalTrends: {
    month: string;
    signups: number;
    revenue: number;
  }[];
}

export interface CompetitorComparison {
  feature: string;
  rork: boolean | string;
  motive: boolean | string;
  samsara: boolean | string;
  geotab: boolean | string;
  category: string;
}

export interface CostSavingCalculator {
  fuelSavings: {
    currentMpg: number;
    improvedMpg: number;
    milesPerMonth: number;
    fuelPrice: number;
    monthlySavings: number;
  };
  maintenanceSavings: {
    currentCost: number;
    predictiveSavings: number;
    downtimePrevention: number;
    monthlySavings: number;
  };
  complianceSavings: {
    finesPrevented: number;
    timeEfficiency: number;
    monthlySavings: number;
  };
  totalMonthlySavings: number;
  annualSavings: number;
  roiPercentage: number;
}