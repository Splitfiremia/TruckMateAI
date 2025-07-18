import { PricingPlan, Testimonial, CompetitorComparison } from '@/types/pricing';

export const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential tools for owner-operators',
    basePrice: {
      ownerOperator: {
        monthly: 29,
        annual: 290, // 2 months free
      },
      fleet: {
        monthly: 25,
        annual: 250,
        perVehicle: 25,
      },
    },
    features: [
      {
        id: 'eld_compliance',
        name: 'ELD Compliance',
        description: 'Hours of Service tracking and DOT compliance',
        included: true,
        category: 'compliance',
      },
      {
        id: 'basic_logbook',
        name: 'Digital Logbook',
        description: 'Electronic logging and duty status changes',
        included: true,
        category: 'compliance',
      },
      {
        id: 'fuel_tracking',
        name: 'Fuel Tracking',
        description: 'Basic fuel consumption monitoring',
        included: true,
        category: 'core',
      },
      {
        id: 'receipt_scanning',
        name: 'Receipt Scanning',
        description: 'OCR receipt capture and categorization',
        included: true,
        category: 'core',
      },
      {
        id: 'basic_maintenance',
        name: 'Maintenance Reminders',
        description: 'Schedule-based maintenance alerts',
        included: true,
        category: 'maintenance',
      },
      {
        id: 'email_support',
        name: 'Email Support',
        description: '48-hour response time',
        included: true,
        category: 'core',
      },
    ],
    limits: {
      vehicles: 1,
      apiCalls: 1000,
      storage: '5GB',
      support: 'Email only',
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Advanced features for serious operators',
    basePrice: {
      ownerOperator: {
        monthly: 59,
        annual: 590, // 2 months free
      },
      fleet: {
        monthly: 49,
        annual: 490,
        perVehicle: 49,
      },
    },
    features: [
      {
        id: 'eld_compliance',
        name: 'ELD Compliance',
        description: 'Hours of Service tracking and DOT compliance',
        included: true,
        category: 'compliance',
      },
      {
        id: 'advanced_logbook',
        name: 'Advanced Logbook',
        description: 'Automated duty status detection and trip planning',
        included: true,
        category: 'compliance',
      },
      {
        id: 'fuel_optimization',
        name: 'Fuel Optimization',
        description: 'Route-based fuel savings and station finder',
        included: true,
        category: 'optimization',
      },
      {
        id: 'predictive_maintenance',
        name: 'Predictive Maintenance',
        description: 'AI-powered maintenance predictions',
        included: true,
        category: 'maintenance',
      },
      {
        id: 'route_optimization',
        name: 'Route Optimization',
        description: 'Traffic-aware routing and weather alerts',
        included: true,
        category: 'optimization',
      },
      {
        id: 'dot_inspection_prep',
        name: 'DOT Inspection Prep',
        description: 'Inspection readiness and violation prevention',
        included: true,
        category: 'compliance',
      },
      {
        id: 'live_chat_support',
        name: 'Live Chat Support',
        description: '24/7 chat support',
        included: true,
        category: 'core',
      },
      {
        id: 'tire_pressure_monitoring',
        name: 'Tire Pressure Monitoring',
        description: 'Real-time tire health tracking',
        included: false,
        addon: {
          price: 15,
          billingType: 'monthly',
        },
        category: 'maintenance',
      },
    ],
    limits: {
      vehicles: 5,
      apiCalls: 10000,
      storage: '50GB',
      support: '24/7 Chat',
    },
    popular: true,
    badge: 'Most Popular',
  },
  {
    id: 'elite',
    name: 'Elite',
    description: 'Complete solution for fleets and power users',
    basePrice: {
      ownerOperator: {
        monthly: 99,
        annual: 990, // 2 months free
      },
      fleet: {
        monthly: 79,
        annual: 790,
        perVehicle: 79,
      },
    },
    features: [
      {
        id: 'everything_pro',
        name: 'Everything in Pro',
        description: 'All Pro features included',
        included: true,
        category: 'core',
      },
      {
        id: 'ai_assistant',
        name: 'AI Assistant',
        description: 'Voice commands and intelligent recommendations',
        included: true,
        category: 'core',
      },
      {
        id: 'fleet_management',
        name: 'Fleet Management',
        description: 'Multi-vehicle dashboard and driver management',
        included: true,
        category: 'core',
      },
      {
        id: 'advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Custom reports and business intelligence',
        included: true,
        category: 'optimization',
      },
      {
        id: 'api_access',
        name: 'API Access',
        description: 'Custom integrations and data export',
        included: true,
        category: 'integration',
      },
      {
        id: 'white_label',
        name: 'White Label Options',
        description: 'Custom branding and company colors',
        included: true,
        category: 'core',
      },
      {
        id: 'priority_support',
        name: 'Priority Support',
        description: 'Dedicated account manager and phone support',
        included: true,
        category: 'core',
      },
      {
        id: 'tire_pressure_monitoring',
        name: 'Tire Pressure Monitoring',
        description: 'Real-time tire health tracking',
        included: true,
        category: 'maintenance',
      },
      {
        id: 'load_board_integration',
        name: 'Load Board Integration',
        description: 'Connect with major load boards',
        included: false,
        addon: {
          price: 49,
          billingType: 'monthly',
        },
        category: 'integration',
      },
    ],
    limits: {
      vehicles: 'unlimited',
      apiCalls: 'unlimited',
      storage: 'Unlimited',
      support: 'Dedicated Manager',
    },
    badge: 'Best Value',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Dave K.',
    role: 'Owner-Operator',
    company: 'Independent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    quote: 'Saved $1,200/month on fuel costs alone. The route optimization is incredible.',
    savings: {
      amount: 1200,
      metric: 'fuel',
    },
    rating: 5,
    verified: true,
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    role: 'Fleet Manager',
    company: 'Rodriguez Trucking',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    quote: 'Prevented 3 major breakdowns this year with predictive maintenance. ROI was immediate.',
    savings: {
      amount: 8500,
      metric: 'maintenance',
    },
    rating: 5,
    verified: true,
  },
  {
    id: '3',
    name: 'James Wilson',
    role: 'Owner-Operator',
    company: 'Wilson Transport',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    quote: 'No more DOT violations since using Rork. The compliance alerts are a lifesaver.',
    savings: {
      amount: 2400,
      metric: 'compliance',
    },
    rating: 5,
    verified: true,
  },
  {
    id: '4',
    name: 'Sarah Chen',
    role: 'Fleet Owner',
    company: 'Pacific Logistics',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    quote: 'Managing 50 trucks is now effortless. The AI assistant handles most routine tasks.',
    savings: {
      amount: 15000,
      metric: 'time',
    },
    rating: 5,
    verified: true,
  },
];

export const competitorComparison: CompetitorComparison[] = [
  {
    feature: 'ELD Compliance',
    rork: true,
    motive: true,
    samsara: true,
    geotab: true,
    category: 'Compliance',
  },
  {
    feature: 'Predictive Maintenance',
    rork: true,
    motive: 'Basic',
    samsara: 'Add-on',
    geotab: false,
    category: 'Maintenance',
  },
  {
    feature: 'AI Assistant',
    rork: true,
    motive: false,
    samsara: false,
    geotab: false,
    category: 'Innovation',
  },
  {
    feature: 'Route Optimization',
    rork: true,
    motive: 'Basic',
    samsara: true,
    geotab: 'Add-on',
    category: 'Optimization',
  },
  {
    feature: 'Fuel Optimization',
    rork: true,
    motive: 'Basic',
    samsara: 'Add-on',
    geotab: false,
    category: 'Cost Savings',
  },
  {
    feature: 'White Label',
    rork: true,
    motive: false,
    samsara: 'Enterprise',
    geotab: false,
    category: 'Customization',
  },
  {
    feature: 'API Access',
    rork: true,
    motive: 'Enterprise',
    samsara: 'Enterprise',
    geotab: 'Add-on',
    category: 'Integration',
  },
  {
    feature: 'Starting Price',
    rork: '$29/mo',
    motive: '$45/mo',
    samsara: '$60/mo',
    geotab: '$39/mo',
    category: 'Pricing',
  },
];

export const defaultPricingCalculation = {
  userType: 'owner-operator' as const,
  vehicleCount: 1,
  selectedTier: 'pro' as const,
  billingCycle: 'monthly' as const,
  addons: [],
  subtotal: 59,
  discount: 0,
  tax: 0,
  total: 59,
};

export const savingsCalculatorDefaults = {
  fuelSavings: {
    currentMpg: 6.5,
    improvedMpg: 7.2,
    milesPerMonth: 10000,
    fuelPrice: 3.85,
  },
  maintenanceSavings: {
    currentCost: 800,
    predictiveSavings: 0.3, // 30% reduction
    downtimePrevention: 2000,
  },
  complianceSavings: {
    averageFine: 1500,
    violationPrevention: 0.8, // 80% reduction
    timeEfficiency: 10, // hours saved per month
    hourlyRate: 25,
  },
};