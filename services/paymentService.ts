import { Platform } from 'react-native';
import { PricingTier, BillingCycle, Subscription } from '@/types/pricing';

// Mock payment service - In production, integrate with Stripe/PayPal
export class PaymentService {
  private static instance: PaymentService;
  private subscriptions: Map<string, Subscription> = new Map();

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Initialize payment gateway
  async initialize(config: {
    stripePublishableKey?: string;
    paypalClientId?: string;
  }): Promise<void> {
    try {
      // In production, initialize Stripe/PayPal SDKs
      console.log('Payment service initialized with config:', config);
    } catch (error) {
      console.error('Failed to initialize payment service:', error);
      throw error;
    }
  }

  // Create subscription
  async createSubscription(params: {
    userId: string;
    planId: PricingTier;
    billingCycle: BillingCycle;
    vehicleCount: number;
    addons: string[];
    paymentMethodToken: string;
  }): Promise<Subscription> {
    try {
      // Mock subscription creation
      const subscription: Subscription = {
        id: `sub_${Date.now()}`,
        userId: params.userId,
        planId: params.planId,
        status: 'trialing', // Start with trial
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: this.calculatePeriodEnd(params.billingCycle, true), // Trial period
        billingCycle: params.billingCycle,
        vehicleCount: params.vehicleCount,
        addons: params.addons.map(addonId => ({
          id: addonId,
          name: this.getAddonName(addonId),
          price: this.getAddonPrice(addonId),
          billingType: 'monthly',
          quantity: 1,
          addedAt: new Date().toISOString(),
        })),
        totalAmount: this.calculateTotalAmount(params),
        nextBillingDate: this.calculatePeriodEnd(params.billingCycle, true),
        trialEndsAt: this.calculateTrialEnd(),
        paymentMethod: {
          type: 'card',
          last4: '4242',
          brand: 'visa',
        },
      };

      this.subscriptions.set(subscription.id, subscription);
      
      // In production, create actual subscription with payment processor
      await this.mockPaymentProcessorCall('create_subscription', subscription);
      
      return subscription;
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw error;
    }
  }

  // Update subscription
  async updateSubscription(
    subscriptionId: string,
    updates: Partial<{
      planId: PricingTier;
      vehicleCount: number;
      addons: string[];
    }>
  ): Promise<Subscription> {
    try {
      const subscription = this.subscriptions.get(subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      const updatedSubscription: Subscription = {
        ...subscription,
        ...updates,
        totalAmount: this.calculateTotalAmount({
          planId: updates.planId || subscription.planId,
          billingCycle: subscription.billingCycle,
          vehicleCount: updates.vehicleCount || subscription.vehicleCount,
          addons: updates.addons || subscription.addons.map(a => a.id),
        } as any),
      };

      this.subscriptions.set(subscriptionId, updatedSubscription);
      
      // In production, update actual subscription
      await this.mockPaymentProcessorCall('update_subscription', updatedSubscription);
      
      return updatedSubscription;
    } catch (error) {
      console.error('Failed to update subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const subscription = this.subscriptions.get(subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      const canceledSubscription: Subscription = {
        ...subscription,
        status: 'canceled',
        canceledAt: new Date().toISOString(),
      };

      this.subscriptions.set(subscriptionId, canceledSubscription);
      
      // In production, cancel actual subscription
      await this.mockPaymentProcessorCall('cancel_subscription', canceledSubscription);
      
      return canceledSubscription;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    }
  }

  // Process one-time payment (for add-ons)
  async processOneTimePayment(params: {
    amount: number;
    description: string;
    paymentMethodToken: string;
    userId: string;
  }): Promise<{ id: string; status: 'succeeded' | 'failed'; receiptUrl?: string }> {
    try {
      // Mock one-time payment
      const payment = {
        id: `pi_${Date.now()}`,
        status: 'succeeded' as const,
        receiptUrl: `https://receipts.example.com/${Date.now()}`,
      };

      // In production, process actual payment
      await this.mockPaymentProcessorCall('process_payment', payment);
      
      return payment;
    } catch (error) {
      console.error('Failed to process payment:', error);
      throw error;
    }
  }

  // Get subscription by ID
  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    return this.subscriptions.get(subscriptionId) || null;
  }

  // Get user subscriptions
  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      sub => sub.userId === userId
    );
  }

  // Validate payment method
  async validatePaymentMethod(token: string): Promise<{
    valid: boolean;
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  }> {
    try {
      // Mock validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        valid: true,
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
      };
    } catch (error) {
      console.error('Failed to validate payment method:', error);
      return { valid: false };
    }
  }

  // Calculate pricing
  calculateTotalAmount(params: {
    planId: PricingTier;
    billingCycle: BillingCycle;
    vehicleCount: number;
    addons: string[];
  }): number {
    // Mock pricing calculation
    const basePrices = {
      basic: { monthly: 29, annual: 290 },
      pro: { monthly: 59, annual: 590 },
      elite: { monthly: 99, annual: 990 },
    };

    const addonPrices: Record<string, number> = {
      tire_pressure_monitoring: 15,
      load_board_integration: 49,
      advanced_analytics: 30,
    };

    let basePrice = basePrices[params.planId][params.billingCycle];
    if (params.vehicleCount > 1) {
      basePrice *= params.vehicleCount;
    }

    const addonCost = params.addons.reduce((sum, addonId) => 
      sum + (addonPrices[addonId] || 0), 0
    );

    return basePrice + addonCost;
  }

  // Helper methods
  private calculatePeriodEnd(billingCycle: BillingCycle, isTrial = false): string {
    const now = new Date();
    if (isTrial) {
      now.setDate(now.getDate() + 30); // 30-day trial
    } else if (billingCycle === 'annual') {
      now.setFullYear(now.getFullYear() + 1);
    } else {
      now.setMonth(now.getMonth() + 1);
    }
    return now.toISOString();
  }

  private calculateTrialEnd(): string {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 30);
    return trialEnd.toISOString();
  }

  private getAddonName(addonId: string): string {
    const names: Record<string, string> = {
      tire_pressure_monitoring: 'Tire Pressure Monitoring',
      load_board_integration: 'Load Board Integration',
      advanced_analytics: 'Advanced Analytics',
    };
    return names[addonId] || addonId;
  }

  private getAddonPrice(addonId: string): number {
    const prices: Record<string, number> = {
      tire_pressure_monitoring: 15,
      load_board_integration: 49,
      advanced_analytics: 30,
    };
    return prices[addonId] || 0;
  }

  private async mockPaymentProcessorCall(action: string, data: any): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate occasional failures for testing
    if (Math.random() < 0.05) { // 5% failure rate
      throw new Error(`Payment processor error: ${action} failed`);
    }
    
    console.log(`Mock payment processor call: ${action}`, data);
  }
}

export const paymentService = PaymentService.getInstance();