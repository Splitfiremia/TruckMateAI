// Admin API Service for TruckMate AI Backend
// Handles all backend integrations: Supabase, NocoDB, Stripe, Kong

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

interface NocoDBConfig {
  host: string;
  apiKey: string;
}

interface StripeConfig {
  apiKey: string;
  webhookSecret: string;
}

interface KongConfig {
  adminUrl: string;
  apiKey: string;
}

class AdminApiService {
  private supabase: SupabaseConfig;
  private nocodb: NocoDBConfig;
  private stripe: StripeConfig;
  private kong: KongConfig;

  constructor() {
    this.supabase = {
      url: process.env.SUPABASE_URL || 'https://[YOUR_PROJECT].supabase.co',
      anonKey: process.env.SUPABASE_ANON_KEY || '[YOUR_ANON_KEY]',
    };

    this.nocodb = {
      host: process.env.NOCODB_HOST || 'https://truckmate-nocodb.digitalocean.app',
      apiKey: process.env.NOCODB_API_KEY || '[YOUR_NOCODB_KEY]',
    };

    this.stripe = {
      apiKey: process.env.STRIPE_API_KEY || 'sk_live_[YOUR_STRIPE_KEY]',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_[YOUR_WEBHOOK_SECRET]',
    };

    this.kong = {
      adminUrl: process.env.KONG_ADMIN_URL || 'http://localhost:8001',
      apiKey: process.env.KONG_API_KEY || '[YOUR_KONG_KEY]',
    };
  }

  // User Management (Supabase Auth + NocoDB)
  async getUsers(page: number = 1, limit: number = 50) {
    try {
      const response = await fetch(`${this.nocodb.host}/api/v1/db/data/noco/truckmate/users?limit=${limit}&offset=${(page - 1) * limit}`, {
        headers: {
          'xc-token': this.nocodb.apiKey,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async updateUserTier(userId: string, tier: 'trial' | 'paid') {
    try {
      const response = await fetch(`${this.nocodb.host}/api/v1/db/data/noco/truckmate/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'xc-token': this.nocodb.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update user tier: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating user tier:', error);
      throw error;
    }
  }

  // API Gateway Management (Kong)
  async getApiEndpoints() {
    try {
      const response = await fetch(`${this.kong.adminUrl}/services`, {
        headers: {
          'Kong-Admin-Token': this.kong.apiKey,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch API endpoints: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching API endpoints:', error);
      throw error;
    }
  }

  async toggleApiEndpoint(serviceId: string, enabled: boolean) {
    try {
      const response = await fetch(`${this.kong.adminUrl}/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Kong-Admin-Token': this.kong.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to toggle API endpoint: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error toggling API endpoint:', error);
      throw error;
    }
  }

  async getApiMetrics(timeframe: '1h' | '24h' | '7d' = '24h') {
    try {
      // Kong Analytics API
      const response = await fetch(`${this.kong.adminUrl}/analytics/requests?timeframe=${timeframe}`, {
        headers: {
          'Kong-Admin-Token': this.kong.apiKey,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch API metrics: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching API metrics:', error);
      throw error;
    }
  }

  // Cost Control
  async getCostMetrics() {
    try {
      // Fetch from NocoDB cost tracking table
      const response = await fetch(`${this.nocodb.host}/api/v1/db/data/noco/truckmate/cost_metrics?sort=-date&limit=30`, {
        headers: {
          'xc-token': this.nocodb.apiKey,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch cost metrics: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching cost metrics:', error);
      throw error;
    }
  }

  async updateCostMetrics(date: string, apiCosts: number, userRevenue: number) {
    try {
      const ratio = userRevenue > 0 ? apiCosts / userRevenue : 0;
      
      const response = await fetch(`${this.nocodb.host}/api/v1/db/data/noco/truckmate/cost_metrics`, {
        method: 'POST',
        headers: {
          'xc-token': this.nocodb.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          api_costs: apiCosts,
          user_revenue: userRevenue,
          ratio,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update cost metrics: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating cost metrics:', error);
      throw error;
    }
  }

  // Payment System (Stripe)
  async getSubscriptions(limit: number = 100) {
    try {
      const response = await fetch(`https://api.stripe.com/v1/subscriptions?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.stripe.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch subscriptions: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  }

  async createSubscription(customerId: string, priceId: string) {
    try {
      const response = await fetch('https://api.stripe.com/v1/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.stripe.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          customer: customerId,
          'items[0][price]': priceId,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create subscription: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const response = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.stripe.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to cancel subscription: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Webhook Handlers
  async handleStripeWebhook(event: any) {
    try {
      switch (event.type) {
        case 'invoice.paid':
          await this.handleInvoicePaid(event.data.object);
          break;
        case 'payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling Stripe webhook:', error);
      throw error;
    }
  }

  private async handleInvoicePaid(invoice: any) {
    // Update user tier to paid
    const customerId = invoice.customer;
    const subscriptionId = invoice.subscription;
    
    // Find user by Stripe customer ID and update tier
    await this.updateUserTierByStripeId(customerId, 'paid');
  }

  private async handlePaymentFailed(paymentIntent: any) {
    // Downgrade user to trial or send notification
    const customerId = paymentIntent.customer;
    
    // Find user and potentially downgrade
    await this.updateUserTierByStripeId(customerId, 'trial');
  }

  private async handleSubscriptionUpdated(subscription: any) {
    // Update user subscription status
    const customerId = subscription.customer;
    const status = subscription.status;
    
    const tier = status === 'active' ? 'paid' : 'trial';
    await this.updateUserTierByStripeId(customerId, tier);
  }

  private async updateUserTierByStripeId(stripeCustomerId: string, tier: 'trial' | 'paid') {
    try {
      // Find user by Stripe customer ID
      const response = await fetch(`${this.nocodb.host}/api/v1/db/data/noco/truckmate/users?where=(stripe_customer_id,eq,${stripeCustomerId})`, {
        headers: {
          'xc-token': this.nocodb.apiKey,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to find user by Stripe ID: ${response.statusText}`);
      }
      
      const users = await response.json();
      if (users.list && users.list.length > 0) {
        const userId = users.list[0].id;
        await this.updateUserTier(userId, tier);
      }
    } catch (error) {
      console.error('Error updating user tier by Stripe ID:', error);
      throw error;
    }
  }

  // Cost Breach Protection
  async checkCostBreach() {
    try {
      const metrics = await this.getCostMetrics();
      const latestMetric = metrics.list[0];
      
      if (latestMetric && latestMetric.ratio > 0.35) {
        // Trigger cost breach protection
        await this.activateCostBreachProtection();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking cost breach:', error);
      throw error;
    }
  }

  private async activateCostBreachProtection() {
    try {
      // 1. Switch all paid users to trial APIs
      await this.switchToTrialApis();
      
      // 2. Send notification to admin
      await this.sendCostBreachNotification();
      
      // 3. Log the event
      await this.logCostBreachEvent();
    } catch (error) {
      console.error('Error activating cost breach protection:', error);
      throw error;
    }
  }

  private async switchToTrialApis() {
    // Update Kong routing rules to use trial APIs for all users
    const trialRoutes = [
      { service: 'location', upstream: 'https://api.ipapi.com' },
      { service: 'diagnostics', upstream: 'https://generativelanguage.googleapis.com' },
      { service: 'weather', upstream: 'https://api.openweathermap.org' },
    ];

    for (const route of trialRoutes) {
      await fetch(`${this.kong.adminUrl}/services/${route.service}`, {
        method: 'PATCH',
        headers: {
          'Kong-Admin-Token': this.kong.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: route.upstream }),
      });
    }
  }

  private async sendCostBreachNotification() {
    // Send email notification to admin
    const notification = {
      to: 'admin@truckmate.ai',
      subject: 'Cost Breach Alert - TruckMate AI',
      body: 'API costs have exceeded 35% of revenue. Auto-downgrade protection has been activated.',
    };
    
    // Implement email sending logic here
    console.log('Cost breach notification sent:', notification);
  }

  private async logCostBreachEvent() {
    // Log to NocoDB alerts table
    await fetch(`${this.nocodb.host}/api/v1/db/data/noco/truckmate/alerts`, {
      method: 'POST',
      headers: {
        'xc-token': this.nocodb.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Cost Breach Protection Activated',
        message: 'API costs exceeded 35% threshold. All users switched to trial APIs.',
        severity: 'high',
        timestamp: new Date().toISOString(),
        resolved: false,
      }),
    });
  }
}

export const adminApiService = new AdminApiService();