import { GeotabCredentials, GeotabDevice, GeotabAlert, WeighStationBypassResponse } from '../types/index';

// Mock API for Geotab integration
export async function getDevices(credentials: GeotabCredentials): Promise<GeotabDevice[]> {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return [
    {
      id: 'device1',
      name: 'Truck 001',
      serialNumber: 'GT123456789',
      vehicleIdentificationNumber: '1FUJGLDR0JL123456',
      licensePlate: 'TRK-1234',
      lastLocation: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Main St, New York, NY',
      },
      status: 'Online',
      lastUpdate: new Date().toISOString(),
    },
    {
      id: 'device2',
      name: 'Truck 002',
      serialNumber: 'GT987654321',
      vehicleIdentificationNumber: '1FUJGLDR0JL654321',
      licensePlate: 'TRK-5678',
      lastLocation: {
        latitude: 34.0522,
        longitude: -118.2437,
        address: '456 Oak Ave, Los Angeles, CA',
      },
      status: 'Online',
      lastUpdate: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'device3',
      name: 'Truck 003',
      serialNumber: 'GT112233445',
      vehicleIdentificationNumber: '1FUJGLDR0JL112233',
      licensePlate: 'TRK-9012',
      lastLocation: {
        latitude: 41.8781,
        longitude: -87.6298,
        address: '789 Pine Rd, Chicago, IL',
      },
      status: 'Offline',
      lastUpdate: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

export async function getAlerts(credentials: GeotabCredentials): Promise<GeotabAlert[]> {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return [
    {
      id: 'alert1',
      deviceId: 'device1',
      message: 'Speeding detected: 75 mph in 65 mph zone',
      severity: 'Medium',
      type: 'Safety',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: 'I-95 Near Exit 12',
      },
      acknowledged: false,
      actionRequired: true,
    },
    {
      id: 'alert2',
      deviceId: 'device2',
      message: 'HOS Violation: Driving time exceeded',
      severity: 'High',
      type: 'Compliance',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      location: {
        latitude: 34.0522,
        longitude: -118.2437,
        address: 'I-10 Near Exit 45',
      },
      acknowledged: false,
      actionRequired: true,
    },
    {
      id: 'alert3',
      deviceId: 'device1',
      message: 'Maintenance due: Oil change in 500 miles',
      severity: 'Low',
      type: 'Maintenance',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      acknowledged: true,
      actionRequired: false,
    },
    {
      id: 'alert4',
      deviceId: 'device3',
      message: 'Device offline for 24 hours',
      severity: 'Critical',
      type: 'Operational',
      timestamp: new Date(Date.now() - 90000000).toISOString(),
      acknowledged: false,
      actionRequired: true,
    },
  ];
}

export async function requestWeighStationBypass(
  credentials: GeotabCredentials, 
  deviceId: string, 
  weighStationId: string
): Promise<WeighStationBypassResponse> {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Mock logic for bypass response
  const bypassGranted = Math.random() > 0.3; // 70% chance of approval
  
  return {
    requestId: `req_${Date.now()}`,
    deviceId,
    weighStationId,
    weighStationName: 'I-80 Weigh Station #42',
    location: {
      latitude: 41.2524,
      longitude: -95.8995,
      address: 'I-80 Mile Marker 440',
    },
    bypassGranted,
    reason: bypassGranted ? 'Vehicle pre-cleared based on safety record' : 'Random inspection required',
    validUntil: new Date(Date.now() + 3600000).toISOString(), // Valid for 1 hour
    timestamp: new Date().toISOString(),
  };
}
