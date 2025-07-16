import { GeotabCredentials, GeotabDevice, GeotabAlert, WeighStationBypassResponse } from '@/types';

// Mock API for development purposes
export class GeotabService {
  private credentials: GeotabCredentials | null = null;
  private isConnected: boolean = false;

  async connect(credentials: GeotabCredentials): Promise<boolean> {
    try {
      // Simulate API call to authenticate with Geotab
      console.log('Connecting to Geotab with credentials:', credentials);
      this.credentials = credentials;
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('Failed to connect to Geotab:', error);
      this.isConnected = false;
      return false;
    }
  }

  async disconnect(): Promise<void> {
    this.credentials = null;
    this.isConnected = false;
  }

  async getDevices(): Promise<GeotabDevice[]> {
    if (!this.isConnected) {
      throw new Error('Not connected to Geotab');
    }

    // Mock data for devices
    return [
      {
        id: 'device1',
        name: 'Truck 1',
        vin: '1FUJGLDR0CSBN1234',
        licensePlate: 'ABC-1234',
        lastLocation: { latitude: 40.7128, longitude: -74.0060, address: 'New York, NY' },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'device2',
        name: 'Truck 2',
        vin: '1FUJGLDR0CSBN5678',
        licensePlate: 'XYZ-5678',
        lastLocation: { latitude: 34.0522, longitude: -118.2437, address: 'Los Angeles, CA' },
        lastUpdated: new Date().toISOString(),
      },
    ];
  }

  async getAlerts(): Promise<GeotabAlert[]> {
    if (!this.isConnected) {
      throw new Error('Not connected to Geotab');
    }

    // Mock data for alerts
    return [
      {
        id: 'alert1',
        deviceId: 'device1',
        type: 'Safety Alert',
        message: 'Hard braking detected',
        severity: 'high',
        location: { latitude: 40.7128, longitude: -74.0060, address: 'New York, NY' },
        timestamp: new Date().toISOString(),
      },
      {
        id: 'alert2',
        deviceId: 'device2',
        type: 'Weigh Station Alert',
        message: 'Weigh station ahead in 5 miles',
        severity: 'medium',
        location: { latitude: 34.0522, longitude: -118.2437, address: 'Los Angeles, CA' },
        timestamp: new Date().toISOString(),
      },
    ];
  }

  async requestWeighStationBypass(deviceId: string): Promise<WeighStationBypassResponse> {
    if (!this.isConnected) {
      throw new Error('Not connected to Geotab');
    }

    // Mock response for weigh station bypass request
    return {
      deviceId,
      requestId: `req_${Math.random().toString(36).substring(7)}`,
      status: 'approved',
      message: 'Bypass approved for weigh station at current location',
      validUntil: new Date(Date.now() + 30 * 60000).toISOString(), // Valid for 30 minutes
    };
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const geotabService = new GeotabService();
