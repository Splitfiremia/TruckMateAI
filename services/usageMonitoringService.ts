import { UsageAlert, PricingTier } from '@/types/pricing';
import { usePricingStore } from '@/store/pricingStore';

interface UsageMetric {
  id: string;
  name: string;
  current: number;
  limit: number;
  resetPeriod: 'daily' | 'monthly';
  cost: number;
  tier: PricingTier[];
}

interface UsageThreshold {
  percentage: number;
  alertType: UsageAlert['type'];
  severity: UsageAlert['severity'];
}

export class UsageMonitoringService {
  private static instance: UsageMonitoringService;
  private metrics: Map<string, UsageMetric> = new Map();
  private thresholds: UsageThreshold[] = [
    { percentage: 80, alertType: 'upgrade_nudge', severity: 'warning' },
    { percentage: 90, alertType: 'tier_limit', severity: 'critical' },
    { percentage: 100, alertType: 'tier_limit', severity: 'critical' },
  ];

  static getInstance(): UsageMonitoringService {
    if (!UsageMonitoringService.instance) {
      UsageMonitoringService.instance = new UsageMonitoringService();
    }
    return UsageMonitoringService.instance;
  }

  constructor() {
    this.initializeMetrics();
    this.startMonitoring();
  }

  private initializeMetrics(): void {
    const metrics: UsageMetric[] = [
      {
        id: 'api_calls',
        name: 'API Calls',
        current: 0,
        limit: 1000,
        resetPeriod: 'monthly',
        cost: 0.001,
        tier: ['basic'],
      },
      {
        id: 'storage',
        name: 'Storage',
        current: 0,
        limit: 5, // GB
        resetPeriod: 'monthly',
        cost: 0.10,
        tier: ['basic', 'pro'],
      },
      {
        id: 'ai_tokens',
        name: 'AI Tokens',
        current: 0,
        limit: 100000,
        resetPeriod: 'monthly',
        cost: 0.000002,
        tier: ['basic', 'pro'],
      },
      {
        id: 'weather_calls',
        name: 'Weather API Calls',
        current: 0,
        limit: 1000,
        resetPeriod: 'daily',
        cost: 0.002,
        tier: ['basic', 'pro'],
      },
      {
        id: 'route_optimizations',
        name: 'Route Optimizations',
        current: 0,
        limit: 100,
        resetPeriod: 'monthly',
        cost: 0.05,
        tier: ['basic', 'pro'],
      },
    ];

    metrics.forEach(metric => {
      this.metrics.set(metric.id, metric);
    });
  }

  // Record usage
  recordUsage(metricId: string, amount: number = 1): void {
    const metric = this.metrics.get(metricId);
    if (!metric) {
      console.warn(`Unknown metric: ${metricId}`);
      return;
    }

    metric.current += amount;
    this.metrics.set(metricId, metric);
    
    // Check thresholds
    this.checkThresholds(metric);
  }

  // Get current usage
  getUsage(metricId: string): UsageMetric | null {
    return this.metrics.get(metricId) || null;
  }

  // Get all usage metrics
  getAllUsage(): UsageMetric[] {
    return Array.from(this.metrics.values());
  }

  // Update limits based on subscription tier
  updateLimitsForTier(tier: PricingTier, vehicleCount: number = 1): void {
    const tierLimits = this.getTierLimits(tier, vehicleCount);
    
    tierLimits.forEach((limit, metricId) => {
      const metric = this.metrics.get(metricId);
      if (metric) {
        metric.limit = limit;
        this.metrics.set(metricId, metric);
      }
    });
  }

  // Reset usage for metrics that have reached their reset period
  resetUsage(): void {
    const now = new Date();
    const isNewMonth = now.getDate() === 1;
    const isNewDay = now.getHours() === 0 && now.getMinutes() === 0;

    this.metrics.forEach((metric, id) => {
      if (
        (metric.resetPeriod === 'monthly' && isNewMonth) ||
        (metric.resetPeriod === 'daily' && isNewDay)
      ) {
        metric.current = 0;
        this.metrics.set(id, metric);
      }
    });
  }

  // Calculate cost savings from optimization
  calculateCostSavings(): {
    potentialSavings: number;
    optimizationTips: string[];
  } {
    let potentialSavings = 0;
    const tips: string[] = [];

    this.metrics.forEach(metric => {
      const usagePercentage = (metric.current / metric.limit) * 100;
      
      if (usagePercentage > 80) {
        const overageEstimate = (metric.current - metric.limit * 0.8) * metric.cost * 2;
        potentialSavings += overageEstimate;
        
        tips.push(`Reduce ${metric.name} usage to save $${overageEstimate.toFixed(2)}/month`);
      }
    });

    // Add general optimization tips
    if (potentialSavings > 10) {
      tips.push('Consider upgrading to a higher tier for better value');
    }
    
    tips.push('Enable caching to reduce API calls by up to 40%');
    tips.push('Use batch operations to optimize API usage');

    return { potentialSavings, optimizationTips: tips };
  }

  // Generate usage report
  generateUsageReport(): {
    totalCost: number;
    projectedCost: number;
    efficiency: number;
    recommendations: string[];
  } {
    let totalCost = 0;
    let totalUsage = 0;
    let totalLimit = 0;

    this.metrics.forEach(metric => {
      totalCost += metric.current * metric.cost;
      totalUsage += metric.current;
      totalLimit += metric.limit;
    });

    const efficiency = totalLimit > 0 ? ((totalLimit - totalUsage) / totalLimit) * 100 : 0;
    const projectedCost = totalCost * 1.2; // Assume 20% growth

    const recommendations: string[] = [];
    
    if (efficiency < 50) {
      recommendations.push('Consider upgrading your plan for better limits');
    }
    
    if (totalCost > 100) {
      recommendations.push('Review usage patterns to identify optimization opportunities');
    }
    
    recommendations.push('Enable automatic scaling to handle usage spikes');

    return {
      totalCost,
      projectedCost,
      efficiency,
      recommendations,
    };
  }

  private checkThresholds(metric: UsageMetric): void {
    const usagePercentage = (metric.current / metric.limit) * 100;
    
    this.thresholds.forEach(threshold => {
      if (usagePercentage >= threshold.percentage) {
        this.generateAlert(metric, threshold, usagePercentage);
      }
    });
  }

  private generateAlert(
    metric: UsageMetric, 
    threshold: UsageThreshold, 
    usagePercentage: number
  ): void {
    const { addUsageAlert } = usePricingStore.getState();
    
    const alert: UsageAlert = {
      id: `${metric.id}_${threshold.percentage}`,
      type: threshold.alertType,
      severity: threshold.severity,
      title: this.getAlertTitle(metric, threshold),
      message: this.getAlertMessage(metric, usagePercentage),
      threshold: metric.limit,
      currentUsage: metric.current,
      actionRequired: threshold.severity === 'critical',
      upgradeRecommendation: this.getUpgradeRecommendation(metric),
      dismissible: threshold.severity !== 'critical',
    };

    addUsageAlert(alert);
  }

  private getAlertTitle(metric: UsageMetric, threshold: UsageThreshold): string {
    if (threshold.percentage >= 100) {
      return `${metric.name} Limit Exceeded`;
    } else if (threshold.percentage >= 90) {
      return `${metric.name} Limit Almost Reached`;
    } else {
      return `Approaching ${metric.name} Limit`;
    }
  }

  private getAlertMessage(metric: UsageMetric, usagePercentage: number): string {
    if (usagePercentage >= 100) {
      return `You've exceeded your ${metric.name} limit. Additional usage will incur overage charges.`;
    } else if (usagePercentage >= 90) {
      return `You've used ${usagePercentage.toFixed(1)}% of your ${metric.name} allocation. Consider upgrading to avoid service interruption.`;
    } else {
      return `You're at ${usagePercentage.toFixed(1)}% of your ${metric.name} limit. Upgrade now to avoid overage charges.`;
    }
  }

  private getUpgradeRecommendation(metric: UsageMetric): UsageAlert['upgradeRecommendation'] {
    // Determine best upgrade tier based on current usage
    const currentUsage = metric.current;
    
    if (currentUsage > 10000) {
      return {
        tier: 'elite',
        benefit: 'unlimited usage',
        estimatedSavings: 200,
      };
    } else if (currentUsage > 5000) {
      return {
        tier: 'pro',
        benefit: 'higher limits and advanced features',
        estimatedSavings: 100,
      };
    } else {
      return {
        tier: 'pro',
        benefit: 'increased limits',
        estimatedSavings: 50,
      };
    }
  }

  private getTierLimits(tier: PricingTier, vehicleCount: number): Map<string, number> {
    const baseLimits = new Map<string, number>();
    
    switch (tier) {
      case 'basic':
        baseLimits.set('api_calls', 1000);
        baseLimits.set('storage', 5);
        baseLimits.set('ai_tokens', 100000);
        baseLimits.set('weather_calls', 1000);
        baseLimits.set('route_optimizations', 100);
        break;
      case 'pro':
        baseLimits.set('api_calls', 10000);
        baseLimits.set('storage', 50);
        baseLimits.set('ai_tokens', 1000000);
        baseLimits.set('weather_calls', 5000);
        baseLimits.set('route_optimizations', 500);
        break;
      case 'elite':
        baseLimits.set('api_calls', Infinity);
        baseLimits.set('storage', Infinity);
        baseLimits.set('ai_tokens', Infinity);
        baseLimits.set('weather_calls', Infinity);
        baseLimits.set('route_optimizations', Infinity);
        break;
    }

    // Scale limits by vehicle count for fleet plans
    if (vehicleCount > 1) {
      baseLimits.forEach((limit, key) => {
        if (limit !== Infinity) {
          baseLimits.set(key, limit * vehicleCount);
        }
      });
    }

    return baseLimits;
  }

  private startMonitoring(): void {
    // Check for reset conditions every hour
    setInterval(() => {
      this.resetUsage();
    }, 60 * 60 * 1000);

    // Generate cost-saving alerts daily
    setInterval(() => {
      this.generateCostSavingAlerts();
    }, 24 * 60 * 60 * 1000);
  }

  private generateCostSavingAlerts(): void {
    const { potentialSavings, optimizationTips } = this.calculateCostSavings();
    
    if (potentialSavings > 25) {
      const { addUsageAlert } = usePricingStore.getState();
      
      addUsageAlert({
        id: `cost_saving_${Date.now()}`,
        type: 'cost_saving',
        severity: 'info',
        title: 'Cost Optimization Opportunity',
        message: `You could save $${potentialSavings.toFixed(2)}/month with usage optimization.`,
        threshold: 0,
        currentUsage: potentialSavings,
        actionRequired: false,
        dismissible: true,
      });
    }
  }
}

export const usageMonitoringService = UsageMonitoringService.getInstance();