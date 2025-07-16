import { 
  DrivewyzeWeighStation, 
  DrivewyzeBypassRequest, 
  DrivewyzeBypassResponse, 
  DrivewyzeNotification,
  DrivewyzeRoute,
  DrivewyzeAnalytics 
} from '@/types';

// Mock Drivewyze API Service
// In production, this would connect to the actual Drivewyze API
class DrivewyzeApiService {
  private apiKey: string;
  private baseUrl: string = 'https://api.drivewyze.com/v1';
  private deviceId: string;

  constructor(apiKey: string, deviceId: string) {
    this.apiKey = apiKey;
    this.deviceId = deviceId;
  }

  // Get weigh stations along a route
  async getWeighStationsOnRoute(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
    radius: number = 50 // miles
  ): Promise<DrivewyzeWeighStation[]> {
    // Mock implementation - in production, this would make actual API calls
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockWeighStations());
      }, 1000);
    });
  }

  // Get nearby weigh stations
  async getNearbyWeighStations(
    location: { latitude: number; longitude: number },
    radius: number = 25 // miles
  ): Promise<DrivewyzeWeighStation[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stations = this.getMockWeighStations();
        // Filter by distance (mock calculation)
        const nearbyStations = stations.filter(station => {
          const distance = this.calculateDistance(
            location.latitude,
            location.longitude,
            station.location.latitude,
            station.location.longitude
          );
          station.distance = distance;
          return distance <= radius;
        });
        resolve(nearbyStations.sort((a, b) => (a.distance || 0) - (b.distance || 0)));
      }, 800);
    });
  }

  // Request bypass for a weigh station
  async requestBypass(request: DrivewyzeBypassRequest): Promise<DrivewyzeBypassResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock bypass logic
        const isApproved = Math.random() > 0.3; // 70% approval rate
        const response: DrivewyzeBypassResponse = {
          requestId: `bypass_${Date.now()}`,
          weighStationId: request.weighStationId,
          status: isApproved ? 'approved' : 'denied',
          message: isApproved 
            ? 'Bypass approved. Proceed past weigh station.' 
            : 'Bypass denied. Please enter weigh station for inspection.',
          instructions: isApproved 
            ? 'Stay in right lane and maintain speed limit. Bypass expires in 30 minutes.'
            : 'Take next exit and follow signs to weigh station entrance.',
          expiresAt: isApproved ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : undefined,
          reasonCode: isApproved ? undefined : 'RANDOM_INSPECTION',
          estimatedProcessingTime: 2
        };
        resolve(response);
      }, 2000);
    });
  }

  // Get weigh station status updates
  async getWeighStationStatus(stationId: string): Promise<DrivewyzeWeighStation | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stations = this.getMockWeighStations();
        const station = stations.find(s => s.id === stationId);
        resolve(station || null);
      }, 500);
    });
  }

  // Get notifications
  async getNotifications(): Promise<DrivewyzeNotification[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockNotifications());
      }, 600);
    });
  }

  // Get route with weigh station information
  async getRouteWithWeighStations(
    origin: string,
    destination: string
  ): Promise<DrivewyzeRoute> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const weighStations = this.getMockWeighStations();
        const route: DrivewyzeRoute = {
          id: `route_${Date.now()}`,
          origin,
          destination,
          weighStations,
          totalWeighStations: weighStations.length,
          bypassEligibleStations: weighStations.filter(s => s.bypassEligible).length,
          estimatedBypassSavings: {
            time: 45, // minutes
            fuel: 2.3, // gallons
            cost: 12.50 // dollars
          },
          routeAlerts: this.getMockNotifications(),
          lastUpdated: new Date().toISOString()
        };
        resolve(route);
      }, 1200);
    });
  }

  // Get analytics data
  async getAnalytics(): Promise<DrivewyzeAnalytics> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockAnalytics());
      }, 800);
    });
  }

  // Helper method to calculate distance between two points
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
      Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Mock data generators
  private getMockWeighStations(): DrivewyzeWeighStation[] {
    return [
      {
        id: 'ws_001',
        name: 'I-75 Northbound Weigh Station',
        location: {
          latitude: 39.1612,
          longitude: -84.4569,
          address: 'I-75 North, Mile Marker 185',
          state: 'OH',
          highway: 'I-75',
          mileMarker: 185
        },
        status: 'open',
        operatingHours: {
          monday: '6:00 AM - 10:00 PM',
          tuesday: '6:00 AM - 10:00 PM',
          wednesday: '6:00 AM - 10:00 PM',
          thursday: '6:00 AM - 10:00 PM',
          friday: '6:00 AM - 10:00 PM',
          saturday: '8:00 AM - 6:00 PM',
          sunday: 'Closed'
        },
        bypassEligible: true,
        services: ['Weight Check', 'DOT Inspection', 'Permit Verification'],
        restrictions: {
          maxWeight: 80000,
          maxHeight: 13.5,
          maxLength: 65
        },
        contact: {
          phone: '(513) 555-0123'
        },
        lastUpdated: new Date().toISOString(),
        distance: 12.5
      },
      {
        id: 'ws_002',
        name: 'I-70 Eastbound Weigh Station',
        location: {
          latitude: 39.9612,
          longitude: -83.0007,
          address: 'I-70 East, Mile Marker 112',
          state: 'OH',
          highway: 'I-70',
          mileMarker: 112
        },
        status: 'bypass_available',
        operatingHours: {
          monday: '24 Hours',
          tuesday: '24 Hours',
          wednesday: '24 Hours',
          thursday: '24 Hours',
          friday: '24 Hours',
          saturday: '24 Hours',
          sunday: '24 Hours'
        },
        bypassEligible: true,
        bypassStatus: 'approved',
        services: ['Weight Check', 'Safety Inspection', 'Fuel Tax Audit'],
        restrictions: {
          maxWeight: 80000,
          maxHeight: 13.5,
          hazmatRestrictions: ['Explosives', 'Radioactive']
        },
        contact: {
          phone: '(614) 555-0456',
          website: 'https://dot.state.oh.us'
        },
        lastUpdated: new Date().toISOString(),
        distance: 28.3
      },
      {
        id: 'ws_003',
        name: 'I-71 Southbound Weigh Station',
        location: {
          latitude: 40.0583,
          longitude: -82.9988,
          address: 'I-71 South, Mile Marker 131',
          state: 'OH',
          highway: 'I-71',
          mileMarker: 131
        },
        status: 'closed',
        operatingHours: {
          monday: '7:00 AM - 7:00 PM',
          tuesday: '7:00 AM - 7:00 PM',
          wednesday: '7:00 AM - 7:00 PM',
          thursday: '7:00 AM - 7:00 PM',
          friday: '7:00 AM - 7:00 PM',
          saturday: 'Closed',
          sunday: 'Closed'
        },
        bypassEligible: false,
        services: ['Weight Check', 'Vehicle Inspection'],
        restrictions: {
          maxWeight: 80000,
          maxHeight: 13.5,
          maxLength: 65
        },
        contact: {
          phone: '(614) 555-0789'
        },
        lastUpdated: new Date().toISOString(),
        distance: 35.7
      },
      {
        id: 'ws_004',
        name: 'I-77 Northbound Weigh Station',
        location: {
          latitude: 40.4173,
          longitude: -81.4784,
          address: 'I-77 North, Mile Marker 93',
          state: 'OH',
          highway: 'I-77',
          mileMarker: 93
        },
        status: 'maintenance',
        operatingHours: {
          monday: 'Closed for Maintenance',
          tuesday: 'Closed for Maintenance',
          wednesday: 'Closed for Maintenance',
          thursday: 'Closed for Maintenance',
          friday: 'Closed for Maintenance',
          saturday: 'Closed for Maintenance',
          sunday: 'Closed for Maintenance'
        },
        bypassEligible: false,
        services: ['Weight Check'],
        restrictions: {
          maxWeight: 80000
        },
        contact: {
          phone: '(330) 555-0321'
        },
        lastUpdated: new Date().toISOString(),
        distance: 42.1
      }
    ];
  }

  private getMockNotifications(): DrivewyzeNotification[] {
    return [
      {
        id: 'notif_001',
        type: 'bypass_approved',
        weighStationId: 'ws_001',
        title: 'Bypass Approved',
        message: 'Your bypass request for I-75 Northbound Weigh Station has been approved.',
        priority: 'high',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
        actionRequired: false,
        location: {
          latitude: 39.1612,
          longitude: -84.4569,
          distance: 12.5
        }
      },
      {
        id: 'notif_002',
        type: 'weigh_station_ahead',
        weighStationId: 'ws_002',
        title: 'Weigh Station Ahead',
        message: 'I-70 Eastbound Weigh Station is 15 miles ahead. Bypass available.',
        priority: 'medium',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        actionRequired: true,
        actions: [
          {
            label: 'Request Bypass',
            action: 'request_bypass'
          },
          {
            label: 'View Details',
            action: 'view_details'
          }
        ],
        location: {
          latitude: 39.9612,
          longitude: -83.0007,
          distance: 28.3
        }
      },
      {
        id: 'notif_003',
        type: 'status_change',
        weighStationId: 'ws_003',
        title: 'Station Status Changed',
        message: 'I-71 Southbound Weigh Station is now closed.',
        priority: 'low',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        actionRequired: false
      }
    ];
  }

  private getMockAnalytics(): DrivewyzeAnalytics {
    return {
      totalBypassRequests: 156,
      approvedBypasses: 134,
      deniedBypasses: 22,
      timeSaved: 1680, // minutes
      fuelSaved: 89.5, // gallons
      costSaved: 485.75, // dollars
      complianceScore: 94,
      lastUpdated: new Date().toISOString(),
      monthlyStats: [
        {
          month: 'January 2024',
          bypasses: 45,
          timeSaved: 540,
          fuelSaved: 28.5,
          costSaved: 155.25
        },
        {
          month: 'February 2024',
          bypasses: 52,
          timeSaved: 624,
          fuelSaved: 33.2,
          costSaved: 180.50
        },
        {
          month: 'March 2024',
          bypasses: 59,
          timeSaved: 708,
          fuelSaved: 37.8,
          costSaved: 205.75
        }
      ]
    };
  }
}

// Export singleton instance
export const drivewyzeApi = new DrivewyzeApiService(
  process.env.EXPO_PUBLIC_DRIVEWYZE_API_KEY || 'demo_key',
  process.env.EXPO_PUBLIC_DRIVEWYZE_DEVICE_ID || 'demo_device'
);

export default DrivewyzeApiService;