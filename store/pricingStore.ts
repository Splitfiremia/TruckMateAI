import { create } from 'zustand';
import { PricingCalculation, PricingTier, UserType, BillingCycle, UsageAlert, OnboardingFlow, Subscription } from '@/types/pricing';
import { pricingPlans, defaultPricingCalculation } from '@/constants/pricingData';

interface PricingState {
  // Pricing Calculator
  calculation: PricingCalculation;
  updateCalculation: (updates: Partial<PricingCalculation>) => void;
  calculatePricing: () => void;
  
  // Subscription Management
  currentSubscription: Subscription | null;
  setSubscription: (subscription: Subscription | null) => void;
  
  // Usage Alerts
  usageAlerts: UsageAlert[];
  addUsageAlert: (alert: UsageAlert) => void;
  dismissAlert: (alertId: string) => void;
  
  // Onboarding
  onboardingFlow: OnboardingFlow | null;
  startOnboarding: (userId: string) => void;
  updateOnboardingStep: (stepId: string, data: any) => void;
  completeOnboarding: () => void;
  
  // Analytics
  conversionTracking: {
    pageViews: number;
    calculatorUsage: number;
    signupAttempts: number;
    completedSignups: number;
  };
  trackEvent: (event: string) => void;
  
  // Cost Savings Calculator
  savingsCalculation: {
    fuelSavings: number;
    maintenanceSavings: number;
    complianceSavings: number;
    totalMonthlySavings: number;
    annualSavings: number;
    roiPercentage: number;
  };
  calculateSavings: (inputs: any) => void;
}

export const usePricingStore = create<PricingState>((set, get) => ({
  // Initial state
  calculation: defaultPricingCalculation,
  currentSubscription: null,
  usageAlerts: [],
  onboardingFlow: null,
  conversionTracking: {
    pageViews: 0,
    calculatorUsage: 0,
    signupAttempts: 0,
    completedSignups: 0,
  },
  savingsCalculation: {
    fuelSavings: 0,
    maintenanceSavings: 0,
    complianceSavings: 0,
    totalMonthlySavings: 0,
    annualSavings: 0,
    roiPercentage: 0,
  },

  // Pricing Calculator Actions
  updateCalculation: (updates) => {
    set((state) => ({
      calculation: { ...state.calculation, ...updates },
    }));
    get().calculatePricing();
  },

  calculatePricing: () => {
    const { calculation } = get();
    const plan = pricingPlans.find(p => p.id === calculation.selectedTier);
    
    if (!plan) return;

    let basePrice = 0;
    
    if (calculation.userType === 'owner-operator') {
      basePrice = calculation.billingCycle === 'annual' 
        ? plan.basePrice.ownerOperator.annual 
        : plan.basePrice.ownerOperator.monthly;
    } else {
      const vehiclePrice = calculation.billingCycle === 'annual'
        ? plan.basePrice.fleet.annual
        : plan.basePrice.fleet.monthly;
      basePrice = vehiclePrice * calculation.vehicleCount;
    }

    // Calculate addon costs
    let addonCost = 0;
    calculation.addons.forEach(addonId => {
      const feature = plan.features.find(f => f.id === addonId);
      if (feature?.addon) {
        if (feature.addon.billingType === 'per-vehicle') {
          addonCost += feature.addon.price * calculation.vehicleCount;
        } else {
          addonCost += feature.addon.price;
        }
      }
    });

    const subtotal = basePrice + addonCost;
    
    // Calculate discounts
    let discount = 0;
    if (calculation.billingCycle === 'annual') {
      discount = subtotal * 0.17; // ~2 months free
    }
    if (calculation.vehicleCount >= 10) {
      discount += subtotal * 0.1; // 10% fleet discount
    }

    const tax = (subtotal - discount) * 0.08; // 8% tax
    const total = subtotal - discount + tax;

    // Calculate savings for annual billing
    const savings = calculation.billingCycle === 'annual' ? {
      annualDiscount: discount,
      estimatedMonthlySavings: discount / 12,
    } : undefined;

    set((state) => ({
      calculation: {
        ...state.calculation,
        subtotal,
        discount,
        tax,
        total,
        savings,
      },
    }));
  },

  // Subscription Management
  setSubscription: (subscription) => {
    set({ currentSubscription: subscription });
  },

  // Usage Alerts
  addUsageAlert: (alert) => {
    set((state) => ({
      usageAlerts: [...state.usageAlerts, alert],
    }));
  },

  dismissAlert: (alertId) => {
    set((state) => ({
      usageAlerts: state.usageAlerts.filter(alert => alert.id !== alertId),
    }));
  },

  // Onboarding
  startOnboarding: (userId) => {
    const onboardingFlow: OnboardingFlow = {
      userId,
      currentStep: 0,
      steps: [
        {
          id: 'vehicle-count',
          title: 'How many trucks need tracking?',
          description: 'This helps us recommend the right plan',
          component: 'VehicleCountStep',
          required: true,
          completed: false,
        },
        {
          id: 'user-type',
          title: 'Are you an owner-operator or fleet manager?',
          description: 'Different roles have different needs',
          component: 'UserTypeStep',
          required: true,
          completed: false,
        },
        {
          id: 'feature-selection',
          title: 'Which features matter most?',
          description: 'Customize your experience',
          component: 'FeatureSelectionStep',
          required: false,
          completed: false,
        },
        {
          id: 'hardware-options',
          title: 'Connect existing device or get sponsored hardware?',
          description: 'We work with all major ELD providers',
          component: 'HardwareOptionsStep',
          required: false,
          completed: false,
        },
        {
          id: 'payment',
          title: 'Choose your plan',
          description: 'Start your free trial today',
          component: 'PaymentStep',
          required: true,
          completed: false,
        },
      ],
      selectedFeatures: [],
    };

    set({ onboardingFlow });
  },

  updateOnboardingStep: (stepId, data) => {
    set((state) => {
      if (!state.onboardingFlow) return state;

      const updatedSteps = state.onboardingFlow.steps.map(step => 
        step.id === stepId 
          ? { ...step, completed: true, data }
          : step
      );

      const currentStepIndex = state.onboardingFlow.steps.findIndex(s => s.id === stepId);
      const nextStep = currentStepIndex + 1;

      return {
        onboardingFlow: {
          ...state.onboardingFlow,
          steps: updatedSteps,
          currentStep: nextStep < updatedSteps.length ? nextStep : currentStepIndex,
          ...data, // Merge step data into flow
        },
      };
    });
  },

  completeOnboarding: () => {
    set((state) => ({
      onboardingFlow: state.onboardingFlow ? {
        ...state.onboardingFlow,
        completedAt: new Date().toISOString(),
      } : null,
    }));
  },

  // Analytics
  trackEvent: (event) => {
    set((state) => {
      const updates: any = {};
      
      switch (event) {
        case 'pricing_page_view':
          updates.pageViews = state.conversionTracking.pageViews + 1;
          break;
        case 'calculator_used':
          updates.calculatorUsage = state.conversionTracking.calculatorUsage + 1;
          break;
        case 'signup_attempted':
          updates.signupAttempts = state.conversionTracking.signupAttempts + 1;
          break;
        case 'signup_completed':
          updates.completedSignups = state.conversionTracking.completedSignups + 1;
          break;
      }

      return {
        conversionTracking: {
          ...state.conversionTracking,
          ...updates,
        },
      };
    });
  },

  // Cost Savings Calculator
  calculateSavings: (inputs) => {
    const {
      currentMpg = 6.5,
      improvedMpg = 7.2,
      milesPerMonth = 10000,
      fuelPrice = 3.85,
      currentMaintenanceCost = 800,
      predictiveSavingsRate = 0.3,
      downtimePrevention = 2000,
      averageFine = 1500,
      violationPreventionRate = 0.8,
      timeEfficiencyHours = 10,
      hourlyRate = 25,
    } = inputs;

    // Fuel savings calculation
    const currentFuelCost = (milesPerMonth / currentMpg) * fuelPrice;
    const improvedFuelCost = (milesPerMonth / improvedMpg) * fuelPrice;
    const fuelSavings = currentFuelCost - improvedFuelCost;

    // Maintenance savings calculation
    const predictiveSavings = currentMaintenanceCost * predictiveSavingsRate;
    const maintenanceSavings = predictiveSavings + (downtimePrevention / 12); // Amortize downtime prevention

    // Compliance savings calculation
    const fineSavings = (averageFine * violationPreventionRate) / 12; // Monthly average
    const timeSavings = timeEfficiencyHours * hourlyRate;
    const complianceSavings = fineSavings + timeSavings;

    const totalMonthlySavings = fuelSavings + maintenanceSavings + complianceSavings;
    const annualSavings = totalMonthlySavings * 12;
    
    // Calculate ROI based on Elite plan cost
    const elitePlanCost = 99; // Monthly cost
    const roiPercentage = ((totalMonthlySavings - elitePlanCost) / elitePlanCost) * 100;

    set({
      savingsCalculation: {
        fuelSavings: Math.round(fuelSavings),
        maintenanceSavings: Math.round(maintenanceSavings),
        complianceSavings: Math.round(complianceSavings),
        totalMonthlySavings: Math.round(totalMonthlySavings),
        annualSavings: Math.round(annualSavings),
        roiPercentage: Math.round(roiPercentage),
      },
    });
  },
}));