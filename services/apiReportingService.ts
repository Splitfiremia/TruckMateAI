import { ApiEndpoint } from '@/store/adminStore';

export interface ApiReport {
  api_name: string;
  status: 'active' | 'deprecated' | 'inactive' | 'error';
  last_successful_call: string;
  error_rate: number;
  cost_last_30d: number;
  requests_last_30d: number;
  avg_response_time: number;
  uptime_percentage: number;
  tier: 'trial' | 'paid';
  endpoint_url: string;
}

export interface DetailedApiReport {
  generated_at: string;
  report_version: string;
  total_apis: number;
  active_apis: number;
  deprecated_apis: number;
  total_cost_30d: number;
  total_requests_30d: number;
  apis: ApiReport[];
  summary: {
    cost_by_tier: {
      trial: number;
      paid: number;
    };
    requests_by_tier: {
      trial: number;
      paid: number;
    };
    health_score: number;
  };
}

class ApiReportingService {
  private generateMockHistoricalData(endpoint: ApiEndpoint): {
    last_successful_call: string;
    error_rate: number;
    cost_last_30d: number;
    requests_last_30d: number;
    avg_response_time: number;
    uptime_percentage: number;
  } {
    // Generate realistic mock data based on current endpoint data
    const baseRequests = endpoint.requests_today * 30; // Extrapolate to 30 days
    const variance = 0.8 + Math.random() * 0.4; // 80-120% variance
    const requests_last_30d = Math.floor(baseRequests * variance);
    
    return {
      last_successful_call: this.getRandomRecentTimestamp(),
      error_rate: this.getErrorRateByStatus(endpoint.status),
      cost_last_30d: requests_last_30d * endpoint.cost_per_request,
      requests_last_30d,
      avg_response_time: this.getAvgResponseTime(endpoint.tier),
      uptime_percentage: this.getUptimeByStatus(endpoint.status),
    };
  }

  private getRandomRecentTimestamp(): string {
    const now = new Date();
    const hoursAgo = Math.floor(Math.random() * 24); // 0-24 hours ago
    const minutesAgo = Math.floor(Math.random() * 60); // 0-60 minutes ago
    
    const timestamp = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000));
    return timestamp.toISOString();
  }

  private getErrorRateByStatus(status: string): number {
    switch (status) {
      case 'active':
        return Math.random() * 0.02; // 0-2% error rate
      case 'inactive':
        return 1.0; // 100% error rate (inactive)
      case 'error':
        return 0.15 + Math.random() * 0.35; // 15-50% error rate
      default:
        return Math.random() * 0.05; // 0-5% error rate
    }
  }

  private getAvgResponseTime(tier: 'trial' | 'paid'): number {
    // Paid tier APIs typically have better response times
    if (tier === 'paid') {
      return 150 + Math.random() * 200; // 150-350ms
    } else {
      return 300 + Math.random() * 500; // 300-800ms
    }
  }

  private getUptimeByStatus(status: string): number {
    switch (status) {
      case 'active':
        return 98.5 + Math.random() * 1.5; // 98.5-100%
      case 'inactive':
        return 0; // 0% uptime
      case 'error':
        return 85 + Math.random() * 10; // 85-95%
      default:
        return 95 + Math.random() * 5; // 95-100%
    }
  }

  private mapStatusToReportStatus(status: string): 'active' | 'deprecated' | 'inactive' | 'error' {
    switch (status) {
      case 'active':
        return 'active';
      case 'inactive':
        return 'inactive';
      case 'error':
        return 'error';
      default:
        return 'deprecated';
    }
  }

  private calculateHealthScore(apis: ApiReport[]): number {
    if (apis.length === 0) return 0;

    const weights = {
      uptime: 0.4,
      error_rate: 0.3,
      response_time: 0.2,
      status: 0.1,
    };

    let totalScore = 0;

    apis.forEach(api => {
      let apiScore = 0;

      // Uptime score (0-100)
      apiScore += (api.uptime_percentage / 100) * weights.uptime * 100;

      // Error rate score (inverted - lower is better)
      const errorScore = Math.max(0, 100 - (api.error_rate * 100));
      apiScore += (errorScore / 100) * weights.error_rate * 100;

      // Response time score (inverted - lower is better, cap at 2000ms)
      const responseScore = Math.max(0, 100 - (api.avg_response_time / 2000) * 100);
      apiScore += (responseScore / 100) * weights.response_time * 100;

      // Status score
      const statusScore = api.status === 'active' ? 100 : 
                         api.status === 'inactive' ? 50 : 
                         api.status === 'error' ? 25 : 0;
      apiScore += (statusScore / 100) * weights.status * 100;

      totalScore += apiScore;
    });

    return Math.round(totalScore / apis.length);
  }

  public generateDetailedReport(endpoints: ApiEndpoint[]): DetailedApiReport {
    const apis: ApiReport[] = endpoints.map(endpoint => {
      const historicalData = this.generateMockHistoricalData(endpoint);
      
      return {
        api_name: endpoint.name,
        status: this.mapStatusToReportStatus(endpoint.status),
        last_successful_call: historicalData.last_successful_call,
        error_rate: Number(historicalData.error_rate.toFixed(4)),
        cost_last_30d: Number(historicalData.cost_last_30d.toFixed(2)),
        requests_last_30d: historicalData.requests_last_30d,
        avg_response_time: Number(historicalData.avg_response_time.toFixed(0)),
        uptime_percentage: Number(historicalData.uptime_percentage.toFixed(2)),
        tier: endpoint.tier,
        endpoint_url: endpoint.url,
      };
    });

    // Calculate summary statistics
    const trialApis = apis.filter(api => api.tier === 'trial');
    const paidApis = apis.filter(api => api.tier === 'paid');

    const cost_by_tier = {
      trial: Number(trialApis.reduce((sum, api) => sum + api.cost_last_30d, 0).toFixed(2)),
      paid: Number(paidApis.reduce((sum, api) => sum + api.cost_last_30d, 0).toFixed(2)),
    };

    const requests_by_tier = {
      trial: trialApis.reduce((sum, api) => sum + api.requests_last_30d, 0),
      paid: paidApis.reduce((sum, api) => sum + api.requests_last_30d, 0),
    };

    const total_cost_30d = cost_by_tier.trial + cost_by_tier.paid;
    const total_requests_30d = requests_by_tier.trial + requests_by_tier.paid;

    const report: DetailedApiReport = {
      generated_at: new Date().toISOString(),
      report_version: '2.4.0',
      total_apis: apis.length,
      active_apis: apis.filter(api => api.status === 'active').length,
      deprecated_apis: apis.filter(api => api.status === 'deprecated').length,
      total_cost_30d,
      total_requests_30d,
      apis: apis.sort((a, b) => b.cost_last_30d - a.cost_last_30d), // Sort by cost descending
      summary: {
        cost_by_tier,
        requests_by_tier,
        health_score: this.calculateHealthScore(apis),
      },
    };

    return report;
  }

  public exportAsJson(report: DetailedApiReport): string {
    return JSON.stringify(report, null, 2);
  }

  public async downloadReport(report: DetailedApiReport, filename?: string): Promise<void> {
    const jsonString = this.exportAsJson(report);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // For web platform
    if (typeof window !== 'undefined' && window.document) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `api-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  public getApisByStatus(apis: ApiReport[], status: 'active' | 'deprecated' | 'inactive' | 'error'): ApiReport[] {
    return apis.filter(api => api.status === status);
  }

  public getHighCostApis(apis: ApiReport[], threshold: number = 100): ApiReport[] {
    return apis.filter(api => api.cost_last_30d > threshold);
  }

  public getHighErrorRateApis(apis: ApiReport[], threshold: number = 0.05): ApiReport[] {
    return apis.filter(api => api.error_rate > threshold);
  }

  public getLowPerformanceApis(apis: ApiReport[], responseTimeThreshold: number = 1000, uptimeThreshold: number = 95): ApiReport[] {
    return apis.filter(api => 
      api.avg_response_time > responseTimeThreshold || 
      api.uptime_percentage < uptimeThreshold
    );
  }
}

export const apiReportingService = new ApiReportingService();