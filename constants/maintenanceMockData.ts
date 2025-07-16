import { VehicleDiagnostics, MaintenanceHistory, RepairShop } from '@/types';

// Mock diagnostic data generator
export const generateMockDiagnostics = (): VehicleDiagnostics => {
  const baseValues = {
    engineRpm: 1800,
    engineTemp: 195,
    oilPressure: 45,
    fuelLevel: 0.6,
    batteryVoltage: 12.6,
    coolantTemp: 185,
    transmissionTemp: 180,
    brakeSystemPressure: 85,
    tirePressure: {
      frontLeft: 35,
      frontRight: 35,
      rearLeft: 35,
      rearRight: 35
    }
  };

  // Add some realistic variation
  const variation = {
    engineRpm: (Math.random() - 0.5) * 400,
    engineTemp: (Math.random() - 0.5) * 30,
    oilPressure: (Math.random() - 0.5) * 20,
    fuelLevel: (Math.random() - 0.5) * 0.4,
    batteryVoltage: (Math.random() - 0.5) * 1.0,
    coolantTemp: (Math.random() - 0.5) * 30,
    transmissionTemp: (Math.random() - 0.5) * 40,
    brakeSystemPressure: (Math.random() - 0.5) * 30,
    tirePressure: {
      frontLeft: (Math.random() - 0.5) * 10,
      frontRight: (Math.random() - 0.5) * 10,
      rearLeft: (Math.random() - 0.5) * 10,
      rearRight: (Math.random() - 0.5) * 10
    }
  };

  // Occasionally simulate issues
  const hasIssue = Math.random() < 0.3;
  let faultCodes: string[] = [];
  
  if (hasIssue) {
    const possibleCodes = ['P0171', 'P0300', 'P0420', 'P0128', 'P0442', 'P0455'];
    faultCodes = [possibleCodes[Math.floor(Math.random() * possibleCodes.length)]];
    
    // Adjust values to reflect issues
    if (faultCodes.includes('P0171')) {
      variation.engineTemp += 15; // Running lean, higher temp
    }
    if (faultCodes.includes('P0300')) {
      variation.engineRpm -= 200; // Misfire, lower RPM
    }
    if (faultCodes.includes('P0128')) {
      variation.coolantTemp -= 20; // Thermostat stuck open
    }
  }

  return {
    id: `diag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    vehicleId: 'truck-001',
    timestamp: new Date().toISOString(),
    engineRpm: Math.max(800, baseValues.engineRpm + variation.engineRpm),
    engineTemp: Math.max(160, Math.min(250, baseValues.engineTemp + variation.engineTemp)),
    oilPressure: Math.max(20, Math.min(80, baseValues.oilPressure + variation.oilPressure)),
    fuelLevel: Math.max(0.05, Math.min(1.0, baseValues.fuelLevel + variation.fuelLevel)),
    batteryVoltage: Math.max(11.5, Math.min(14.5, baseValues.batteryVoltage + variation.batteryVoltage)),
    coolantTemp: Math.max(160, Math.min(220, baseValues.coolantTemp + variation.coolantTemp)),
    transmissionTemp: Math.max(140, Math.min(250, baseValues.transmissionTemp + variation.transmissionTemp)),
    brakeSystemPressure: Math.max(60, Math.min(120, baseValues.brakeSystemPressure + variation.brakeSystemPressure)),
    tirePressure: {
      frontLeft: Math.max(25, Math.min(45, baseValues.tirePressure.frontLeft + variation.tirePressure.frontLeft)),
      frontRight: Math.max(25, Math.min(45, baseValues.tirePressure.frontRight + variation.tirePressure.frontRight)),
      rearLeft: Math.max(25, Math.min(45, baseValues.tirePressure.rearLeft + variation.tirePressure.rearLeft)),
      rearRight: Math.max(25, Math.min(45, baseValues.tirePressure.rearRight + variation.tirePressure.rearRight))
    },
    mileage: 487650 + Math.floor(Math.random() * 100), // Simulate mileage increase
    faultCodes,
    location: {
      latitude: 33.4484 + (Math.random() - 0.5) * 0.1,
      longitude: -112.0740 + (Math.random() - 0.5) * 0.1,
      address: 'Phoenix, AZ'
    }
  };
};

// Mock maintenance history
export const mockMaintenanceHistory: MaintenanceHistory[] = [
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
  },
  {
    id: 'mh-002',
    vehicleId: 'truck-001',
    date: '2023-10-08',
    mileage: 472100,
    type: 'Repair',
    component: 'Brakes',
    description: 'Front brake pad replacement',
    cost: 680,
    shopName: 'Highway Truck Service',
    shopLocation: 'Phoenix, AZ',
    partsReplaced: ['Front Brake Pads', 'Brake Hardware Kit'],
    laborHours: 3.0,
    warranty: {
      parts: '12 months',
      labor: '6 months'
    }
  },
  {
    id: 'mh-003',
    vehicleId: 'truck-001',
    date: '2023-07-22',
    mileage: 465800,
    type: 'Preventive',
    component: 'Transmission',
    description: 'Transmission service and fluid change',
    cost: 320,
    shopName: 'Desert Fleet Maintenance',
    shopLocation: 'Phoenix, AZ',
    partsReplaced: ['Transmission Filter', 'Transmission Fluid'],
    laborHours: 2.0,
    warranty: {
      parts: '6 months',
      labor: '3 months'
    }
  },
  {
    id: 'mh-004',
    vehicleId: 'truck-001',
    date: '2023-05-10',
    mileage: 458900,
    type: 'Emergency',
    component: 'Cooling System',
    description: 'Radiator hose replacement - emergency repair',
    cost: 180,
    shopName: 'Roadside Truck Repair',
    shopLocation: 'Flagstaff, AZ',
    partsReplaced: ['Upper Radiator Hose', 'Hose Clamps'],
    laborHours: 1.5,
    warranty: {
      parts: '3 months',
      labor: '30 days'
    }
  }
];

// Mock repair shops
export const mockRepairShops: RepairShop[] = [
  {
    id: 'shop-1',
    name: 'TruckCare Pro',
    address: '1234 Highway 95, Phoenix, AZ 85001',
    phone: '(602) 555-0123',
    rating: 4.8,
    reviewCount: 127,
    specialties: ['Brake Systems', 'Engine Repair', 'Transmission'],
    distance: 2.3,
    estimatedCost: 420,
    availability: 'Same Day',
    certifications: ['ASE Certified', 'Cummins Authorized'],
    truckFaxCertified: true,
    workingHours: {
      monday: '7:00 AM - 6:00 PM',
      tuesday: '7:00 AM - 6:00 PM',
      wednesday: '7:00 AM - 6:00 PM',
      thursday: '7:00 AM - 6:00 PM',
      friday: '7:00 AM - 6:00 PM',
      saturday: '8:00 AM - 4:00 PM',
      sunday: 'Closed'
    }
  },
  {
    id: 'shop-2',
    name: 'Highway Truck Service',
    address: '5678 Industrial Blvd, Phoenix, AZ 85003',
    phone: '(602) 555-0456',
    rating: 4.5,
    reviewCount: 89,
    specialties: ['Cooling Systems', 'Electrical', 'Preventive Maintenance'],
    distance: 4.7,
    estimatedCost: 480,
    availability: 'Next Day',
    certifications: ['ASE Certified', 'Volvo Certified'],
    truckFaxCertified: false,
    workingHours: {
      monday: '6:00 AM - 7:00 PM',
      tuesday: '6:00 AM - 7:00 PM',
      wednesday: '6:00 AM - 7:00 PM',
      thursday: '6:00 AM - 7:00 PM',
      friday: '6:00 AM - 7:00 PM',
      saturday: '7:00 AM - 5:00 PM',
      sunday: '9:00 AM - 3:00 PM'
    }
  },
  {
    id: 'shop-3',
    name: 'Desert Fleet Maintenance',
    address: '9012 Truck Route 17, Phoenix, AZ 85007',
    phone: '(602) 555-0789',
    rating: 4.6,
    reviewCount: 203,
    specialties: ['Fleet Service', 'Tire Service', 'DOT Inspections'],
    distance: 6.1,
    estimatedCost: 395,
    availability: '2-3 Days',
    certifications: ['ASE Certified', 'Peterbilt Authorized', 'DOT Inspector'],
    truckFaxCertified: true,
    workingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    }
  }
];