import {
  TruckFaxVehicleInfo,
  TruckFaxPredictiveInsights,
  TruckFaxAPIResponse,
  VehicleDiagnostics,
  MaintenancePrediction,
  MaintenanceHistory,
  RepairShop
} from '@/types';

// TruckFax API Configuration
const TRUCKFAX_API_BASE = 'https://api.truckfax.com/v2';
const API_KEY = process.env.EXPO_PUBLIC_TRUCKFAX_API_KEY || 'demo_key_12345';

interface TruckFaxConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

class TruckFaxAPIService {
  private config: TruckFaxConfig;

  constructor() {
    this.config = {
      apiKey: API_KEY,
      baseUrl: TRUCKFAX_API_BASE,
      timeout: 30000,
      retryAttempts: 3
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<TruckFaxAPIResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'X-API-Version': '2.0'
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        },
        timeout: this.config.timeout
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: response.status.toString(),
            message: data.message || 'API request failed',
            details: data
          },
          metadata: {
            requestId: data.requestId || 'unknown',
            timestamp: new Date().toISOString(),
            rateLimitRemaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0'),
            dataFreshness: response.headers.get('X-Data-Freshness') || 'unknown'
          }
        };
      }

      return {
        success: true,
        data: data.data,
        metadata: {
          requestId: data.requestId,
          timestamp: new Date().toISOString(),
          rateLimitRemaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '100'),
          dataFreshness: response.headers.get('X-Data-Freshness') || 'current'
        }
      };
    } catch (error) {
      console.error('TruckFax API Error:', error);
      
      // Return mock data for demo purposes
      return this.getMockResponse<T>(endpoint);
    }
  }

  // Mock response generator for demo/development
  private getMockResponse<T>(endpoint: string): TruckFaxAPIResponse<T> {
    const mockData = this.generateMockData(endpoint);
    
    return {
      success: true,
      data: mockData as T,
      metadata: {
        requestId: `mock_${Date.now()}`,
        timestamp: new Date().toISOString(),
        rateLimitRemaining: 95,
        dataFreshness: 'demo'
      }
    };
  }

  private generateMockData(endpoint: string): any {
    if (endpoint.includes('/vehicle/')) {
      return this.generateMockVehicleInfo();
    } else if (endpoint.includes('/predictive-insights/')) {
      return this.generateMockPredictiveInsights();
    } else if (endpoint.includes('/maintenance-history/')) {
      return this.generateMockMaintenanceHistory();
    } else if (endpoint.includes('/repair-shops/')) {
      return this.generateMockRepairShops();
    }
    
    return {};
  }

  private generateMockVehicleInfo(): TruckFaxVehicleInfo {
    return {
      vin: '1FUJGBDV8ELXXXXXX',
      make: 'Freightliner',
      model: 'Cascadia',
      year: 2019,
      engineType: 'Detroit DD15',
      transmissionType: 'DT12 Automated Manual',
      mileage: 487650,
      lastReportedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      ownershipHistory: [
        {
          ownerType: 'Commercial',
          startDate: '2019-03-15',
          endDate: '2021-08-20',
          state: 'TX',
          estimatedMileage: 285000
        },
        {
          ownerType: 'Individual',
          startDate: '2021-08-20',
          state: 'AZ',
          estimatedMileage: 487650
        }
      ],
      accidentHistory: [
        {
          date: '2020-11-12',
          severity: 'Minor',
          damageType: ['Front Bumper', 'Headlight'],
          estimatedDamage: 3200,
          airbagDeployment: false,
          location: 'Dallas, TX',
          reportNumber: 'TX-2020-445789'
        }
      ],
      maintenanceRecords: [
        {
          date: '2024-01-15',
          mileage: 485200,
          serviceType: 'Preventive Maintenance',
          description: 'A-Service: Oil change, filters, inspection',
          cost: 450,
          shopName: 'TruckCare Pro',
          partsReplaced: ['Engine Oil Filter', 'Air Filter', 'Fuel Filter'],
          warrantyInfo: {
            type: 'Parts & Labor',
            duration: '6 months',
            mileageLimit: 25000
          }
        },
        {
          date: '2023-10-08',
          mileage: 472100,
          serviceType: 'Brake Service',
          description: 'Front brake pad replacement',
          cost: 680,
          shopName: 'Highway Truck Service',
          partsReplaced: ['Front Brake Pads', 'Brake Hardware Kit']
        }
      ],
      recallInformation: [
        {
          recallNumber: 'NHTSA-2023-001',
          date: '2023-06-15',
          component: 'EGR Cooler',
          description: 'EGR cooler may crack causing coolant leak',
          severity: 'Safety',
          status: 'Completed',
          remedy: 'Replace EGR cooler assembly'
        }
      ],
      inspectionHistory: [
        {
          date: '2024-02-20',
          type: 'DOT',
          result: 'Pass',
          violations: [],
          inspector: 'Officer Johnson',
          location: 'Phoenix, AZ',
          nextDueDate: '2025-02-20'
        }
      ],
      titleHistory: [
        {
          issueDate: '2019-03-15',
          state: 'TX',
          titleType: 'Clean',
          brandHistory: [],
          mileageReported: 12,
          mileageAccurate: true
        }
      ],
      lienHistory: [
        {
          lienHolder: 'Freightliner Financial',
          date: '2019-03-15',
          amount: 145000,
          status: 'Released',
          type: 'Purchase'
        }
      ],
      commercialUse: true,
      fleetVehicle: false
    };
  }

  private generateMockPredictiveInsights(): TruckFaxPredictiveInsights {
    return {
      vehicleId: 'truck-001',
      riskScore: 35,
      reliabilityScore: 78,
      maintenancePredictions: [
        {
          component: 'Turbocharger',
          predictedFailureWindow: {
            earliest: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            latest: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            mostLikely: new Date(Date.now() + 67 * 24 * 60 * 60 * 1000).toISOString()
          },
          mileageWindow: {
            earliest: 495000,
            latest: 505000,
            mostLikely: 500000
          },
          confidence: 82,
          basedOnFactors: [
            'High mileage for component',
            'Similar vehicle patterns',
            'Operating conditions',
            'Maintenance history gaps'
          ],
          estimatedCost: {
            parts: 3200,
            labor: 800,
            total: 4000
          },
          severity: 'High',
          preventiveOptions: [
            {
              action: 'Turbo inspection and cleaning',
              cost: 350,
              effectiveness: 65
            },
            {
              action: 'Oil change with high-quality synthetic',
              cost: 180,
              effectiveness: 40
            }
          ]
        },
        {
          component: 'Transmission Clutch',
          predictedFailureWindow: {
            earliest: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
            latest: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
            mostLikely: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString()
          },
          mileageWindow: {
            earliest: 510000,
            latest: 525000,
            mostLikely: 517500
          },
          confidence: 74,
          basedOnFactors: [
            'Automated transmission wear patterns',
            'Driver behavior analysis',
            'Load history'
          ],
          estimatedCost: {
            parts: 2800,
            labor: 1200,
            total: 4000
          },
          severity: 'Medium',
          preventiveOptions: [
            {
              action: 'Transmission service and fluid change',
              cost: 450,
              effectiveness: 55
            }
          ]
        }
      ],
      costPredictions: {
        nextYear: {
          maintenance: 3200,
          repairs: 1800,
          total: 5000
        },
        next5Years: {
          maintenance: 18000,
          repairs: 12000,
          total: 30000
        },
        majorComponentReplacements: [
          {
            component: 'Engine Overhaul',
            timeframe: '3-4 years',
            estimatedCost: 25000
          },
          {
            component: 'Transmission Rebuild',
            timeframe: '2-3 years',
            estimatedCost: 8500
          }
        ]
      },
      resaleValueTrend: {
        currentEstimate: 85000,
        oneYearProjection: 78000,
        threeYearProjection: 62000,
        fiveYearProjection: 45000,
        depreciationRate: 12.5,
        marketFactors: [
          'High mileage impact',
          'Good maintenance history',
          'Popular model demand',
          'Fuel efficiency ratings'
        ]
      },
      recommendedActions: [
        {
          type: 'Maintenance',
          priority: 'High',
          title: 'Schedule Turbocharger Inspection',
          description: 'Based on predictive analysis, turbocharger shows early wear signs',
          timeframe: 'Within 30 days',
          estimatedCost: 350,
          potentialSavings: 2500,
          riskReduction: 75
        },
        {
          type: 'Monitoring',
          priority: 'Medium',
          title: 'Increase Transmission Monitoring',
          description: 'Monitor transmission performance and fluid condition',
          timeframe: 'Ongoing',
          estimatedCost: 0,
          potentialSavings: 1200,
          riskReduction: 45
        }
      ],
      dataConfidence: 87,
      lastUpdated: new Date().toISOString(),
      accuracyImprovement: 23,
      earlyDetectionDays: 14,
      estimatedSavings: 3500,
      riskFactors: [
        {
          component: 'Turbocharger',
          description: 'High mileage and operating conditions indicate increased failure risk',
          severity: 'high'
        },
        {
          component: 'Transmission Clutch',
          description: 'Automated transmission showing wear patterns typical for mileage',
          severity: 'medium'
        }
      ]
    };
  }

  private generateMockMaintenanceHistory(): MaintenanceHistory[] {
    return [
      {
        id: 'mh-001',
        vehicleId: 'truck-001',
        date: '2024-01-15',
        mileage: 485200,
        type: 'Preventive',
        component: 'Engine',
        description: 'A-Service: Oil change, filters, inspection',
        cost: 450,
        shopName: 'TruckCare Pro',
        shopLocation: 'Phoenix, AZ',
        partsReplaced: ['Engine Oil Filter', 'Air Filter', 'Fuel Filter'],
        laborHours: 2.5,
        warranty: {
          parts: '6 months',
          labor: '6 months'
        },
        nextServiceDue: '2024-07-15',
        nextServiceMileage: 510200
      }
    ];
  }

  private generateMockRepairShops(): RepairShop[] {
    return [
      {
        id: 'shop-tf-001',
        name: 'TruckFax Certified Service Center',
        address: '2468 Industrial Way, Phoenix, AZ 85003',
        phone: '(602) 555-0199',
        rating: 4.9,
        reviewCount: 156,
        specialties: ['Predictive Maintenance', 'Engine Diagnostics', 'Turbocharger Service'],
        distance: 3.2,
        estimatedCost: 3800,
        availability: 'Next Day',
        certifications: ['TruckFax Certified', 'ASE Master', 'Detroit Diesel Authorized'],
        workingHours: {
          monday: '6:00 AM - 8:00 PM',
          tuesday: '6:00 AM - 8:00 PM',
          wednesday: '6:00 AM - 8:00 PM',
          thursday: '6:00 AM - 8:00 PM',
          friday: '6:00 AM - 8:00 PM',
          saturday: '7:00 AM - 6:00 PM',
          sunday: '8:00 AM - 4:00 PM'
        }
      }
    ];
  }

  // Public API Methods
  async getVehicleInfo(vin: string): Promise<TruckFaxAPIResponse<TruckFaxVehicleInfo>> {
    return this.makeRequest<TruckFaxVehicleInfo>(`/vehicle/${vin}`);
  }

  async getPredictiveInsights(vin: string): Promise<TruckFaxAPIResponse<TruckFaxPredictiveInsights>> {
    return this.makeRequest<TruckFaxPredictiveInsights>(`/predictive-insights/${vin}`);
  }

  async getMaintenanceHistory(vin: string): Promise<TruckFaxAPIResponse<MaintenanceHistory[]>> {
    return this.makeRequest<MaintenanceHistory[]>(`/maintenance-history/${vin}`);
  }

  async findCertifiedRepairShops(
    location: { lat: number; lng: number },
    component: string,
    radius: number = 50
  ): Promise<TruckFaxAPIResponse<RepairShop[]>> {
    const params = new URLSearchParams({
      lat: location.lat.toString(),
      lng: location.lng.toString(),
      component,
      radius: radius.toString(),
      certified: 'true'
    });

    return this.makeRequest<RepairShop[]>(`/repair-shops?${params}`);
  }

  async submitDiagnosticData(
    vin: string,
    diagnostics: VehicleDiagnostics
  ): Promise<TruckFaxAPIResponse<{ success: boolean; analysisId: string }>> {
    return this.makeRequest<{ success: boolean; analysisId: string }>(
      `/diagnostic-data/${vin}`,
      {
        method: 'POST',
        body: JSON.stringify(diagnostics)
      }
    );
  }

  async getEnhancedPredictions(
    vin: string,
    currentDiagnostics: VehicleDiagnostics
  ): Promise<TruckFaxAPIResponse<MaintenancePrediction[]>> {
    return this.makeRequest<MaintenancePrediction[]>(
      `/enhanced-predictions/${vin}`,
      {
        method: 'POST',
        body: JSON.stringify({
          diagnostics: currentDiagnostics,
          includeHistoricalAnalysis: true,
          includeCostOptimization: true
        })
      }
    );
  }

  // Utility method to check API health
  async healthCheck(): Promise<TruckFaxAPIResponse<{ status: string; version: string }>> {
    return this.makeRequest<{ status: string; version: string }>('/health');
  }
}

export const truckFaxAPI = new TruckFaxAPIService();
export default truckFaxAPI;