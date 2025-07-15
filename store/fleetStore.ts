import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface FleetDriver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  medicalCertExpiry: string;
  status: 'Active' | 'Off Duty' | 'Driving' | 'On Break' | 'Inactive';
  currentLocation: string;
  hoursToday: number;
  hoursWeek: number;
  complianceScore: number;
  lastActivity: string;
  vehicleAssigned?: string;
  violations: number;
}

export interface FleetInfo {
  id: string;
  name: string;
  dotNumber: string;
  mcNumber: string;
  address: string;
  phone: string;
  email: string;
  totalDrivers: number;
  totalVehicles: number;
  operatingStates: string[];
}

export interface FleetStats {
  activeDrivers: number;
  availableDrivers: number;
  drivingDrivers: number;
  onBreakDrivers: number;
  hosViolations: number;
  complianceScore: number;
  weeklyRevenue: number;
  totalMiles: number;
  fuelEfficiency: number;
}

export interface ComplianceOverview {
  totalDrivers: number;
  compliantDrivers: number;
  warningDrivers: number;
  violationDrivers: number;
  expiringDocuments: number;
  overdueInspections: number;
}

export interface BrandingSettings {
  companyName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  appName: string;
  welcomeMessage: string;
  supportEmail: string;
  supportPhone: string;
}

export interface FleetSettings {
  enforcePreTrip: boolean;
  autoHOSTracking: boolean;
  speedAlerts: boolean;
  realtimeAlerts: boolean;
  dailyReports: boolean;
  locationTracking: boolean;
  maxSpeedLimit: number;
  breakReminderTime: number;
  inspectionFrequency: 'daily' | 'weekly' | 'monthly';
}

interface FleetState {
  fleetInfo: FleetInfo;
  drivers: FleetDriver[];
  fleetStats: FleetStats;
  complianceOverview: ComplianceOverview;
  brandingSettings: BrandingSettings;
  fleetSettings: FleetSettings;
  
  // Actions
  updateFleetInfo: (updates: Partial<FleetInfo>) => void;
  addDriver: (driver: Omit<FleetDriver, 'id'>) => void;
  updateDriver: (id: string, updates: Partial<FleetDriver>) => void;
  updateDriverStatus: (id: string, status: FleetDriver['status']) => void;
  removeDriver: (id: string) => void;
  updateBrandingSettings: (updates: Partial<BrandingSettings>) => void;
  updateFleetSettings: (updates: Partial<FleetSettings>) => void;
  getDriversByStatus: (status: FleetDriver['status']) => FleetDriver[];
  getComplianceAlerts: () => Array<{ type: string; message: string; driverId: string; severity: 'low' | 'medium' | 'high' }>;
}

const mockFleetInfo: FleetInfo = {
  id: 'fleet-001',
  name: 'Freedom Logistics LLC',
  dotNumber: '3456789',
  mcNumber: 'MC-987654',
  address: '1234 Logistics Blvd, Atlanta, GA 30309',
  phone: '(555) 123-4567',
  email: 'admin@freedomlogistics.com',
  totalDrivers: 24,
  totalVehicles: 18,
  operatingStates: ['GA', 'FL', 'AL', 'TN', 'SC', 'NC'],
};

const mockDrivers: FleetDriver[] = [
  {
    id: 'driver-001',
    name: 'Michael Johnson',
    email: 'mjohnson@freedomlogistics.com',
    phone: '(555) 234-5678',
    licenseNumber: 'CDL-123456789',
    licenseExpiry: '2025-12-31',
    medicalCertExpiry: '2025-06-15',
    status: 'Driving',
    currentLocation: 'I-75 North, Mile 285',
    hoursToday: 6.5,
    hoursWeek: 42.5,
    complianceScore: 94,
    lastActivity: '2025-07-15T14:30:00Z',
    vehicleAssigned: 'FL-4872',
    violations: 0,
  },
  {
    id: 'driver-002',
    name: 'Sarah Williams',
    email: 'swilliams@freedomlogistics.com',
    phone: '(555) 345-6789',
    licenseNumber: 'CDL-987654321',
    licenseExpiry: '2026-03-15',
    medicalCertExpiry: '2025-09-20',
    status: 'On Break',
    currentLocation: 'Love\'s Travel Stop, Macon GA',
    hoursToday: 4.2,
    hoursWeek: 38.7,
    complianceScore: 98,
    lastActivity: '2025-07-15T13:45:00Z',
    vehicleAssigned: 'FL-4873',
    violations: 0,
  },
  {
    id: 'driver-003',
    name: 'Robert Davis',
    email: 'rdavis@freedomlogistics.com',
    phone: '(555) 456-7890',
    licenseNumber: 'CDL-456789123',
    licenseExpiry: '2025-08-30',
    medicalCertExpiry: '2025-04-10',
    status: 'Off Duty',
    currentLocation: 'Atlanta Terminal',
    hoursToday: 0,
    hoursWeek: 35.2,
    complianceScore: 87,
    lastActivity: '2025-07-15T08:00:00Z',
    vehicleAssigned: 'FL-4874',
    violations: 1,
  },
  {
    id: 'driver-004',
    name: 'Jennifer Martinez',
    email: 'jmartinez@freedomlogistics.com',
    phone: '(555) 567-8901',
    licenseNumber: 'CDL-789123456',
    licenseExpiry: '2026-01-20',
    medicalCertExpiry: '2025-11-05',
    status: 'Active',
    currentLocation: 'Pilot Flying J, Valdosta GA',
    hoursToday: 8.1,
    hoursWeek: 45.3,
    complianceScore: 96,
    lastActivity: '2025-07-15T15:20:00Z',
    vehicleAssigned: 'FL-4875',
    violations: 0,
  },
];

const mockFleetStats: FleetStats = {
  activeDrivers: 18,
  availableDrivers: 6,
  drivingDrivers: 12,
  onBreakDrivers: 3,
  hosViolations: 2,
  complianceScore: 94,
  weeklyRevenue: 125750,
  totalMiles: 45280,
  fuelEfficiency: 6.8,
};

const mockComplianceOverview: ComplianceOverview = {
  totalDrivers: 24,
  compliantDrivers: 20,
  warningDrivers: 3,
  violationDrivers: 1,
  expiringDocuments: 5,
  overdueInspections: 2,
};

const mockBrandingSettings: BrandingSettings = {
  companyName: 'Freedom Logistics LLC',
  logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200',
  primaryColor: '#1E3A8A',
  secondaryColor: '#10B981',
  accentColor: '#F59E0B',
  appName: 'TruckMate Pro',
  welcomeMessage: 'Welcome to Freedom Logistics',
  supportEmail: 'support@freedomlogistics.com',
  supportPhone: '(555) 123-4567',
};

const mockFleetSettings: FleetSettings = {
  enforcePreTrip: true,
  autoHOSTracking: true,
  speedAlerts: true,
  realtimeAlerts: true,
  dailyReports: true,
  locationTracking: true,
  maxSpeedLimit: 65,
  breakReminderTime: 30,
  inspectionFrequency: 'daily',
};

export const useFleetStore = create<FleetState>()(
  persist(
    (set, get) => ({
      fleetInfo: mockFleetInfo,
      drivers: mockDrivers,
      fleetStats: mockFleetStats,
      complianceOverview: mockComplianceOverview,
      brandingSettings: mockBrandingSettings,
      fleetSettings: mockFleetSettings,
      
      updateFleetInfo: (updates) => set((state) => ({
        fleetInfo: { ...state.fleetInfo, ...updates },
      })),
      
      addDriver: (driverData) => set((state) => ({
        drivers: [
          ...state.drivers,
          {
            ...driverData,
            id: `driver-${Date.now()}`,
          },
        ],
      })),
      
      updateDriver: (id, updates) => set((state) => ({
        drivers: state.drivers.map((driver) =>
          driver.id === id ? { ...driver, ...updates } : driver
        ),
      })),
      
      updateDriverStatus: (id, status) => set((state) => ({
        drivers: state.drivers.map((driver) =>
          driver.id === id 
            ? { 
                ...driver, 
                status, 
                lastActivity: new Date().toISOString() 
              } 
            : driver
        ),
      })),
      
      removeDriver: (id) => set((state) => ({
        drivers: state.drivers.filter((driver) => driver.id !== id),
      })),
      
      updateBrandingSettings: (updates) => set((state) => ({
        brandingSettings: { ...state.brandingSettings, ...updates },
      })),
      
      updateFleetSettings: (updates) => set((state) => ({
        fleetSettings: { ...state.fleetSettings, ...updates },
      })),
      
      getDriversByStatus: (status) => {
        return get().drivers.filter((driver) => driver.status === status);
      },
      
      getComplianceAlerts: () => {
        const drivers = get().drivers;
        const alerts: Array<{ type: string; message: string; driverId: string; severity: 'low' | 'medium' | 'high' }> = [];
        
        drivers.forEach((driver) => {
          // Check medical cert expiry
          const medicalExpiry = new Date(driver.medicalCertExpiry);
          const daysUntilExpiry = Math.ceil((medicalExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          
          if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
            alerts.push({
              type: 'Medical Certificate',
              message: `${driver.name}'s medical certificate expires in ${daysUntilExpiry} days`,
              driverId: driver.id,
              severity: daysUntilExpiry <= 7 ? 'high' : 'medium',
            });
          }
          
          // Check HOS violations
          if (driver.hoursToday > 11) {
            alerts.push({
              type: 'HOS Violation',
              message: `${driver.name} has exceeded daily driving limit`,
              driverId: driver.id,
              severity: 'high',
            });
          }
          
          // Check break requirements
          if (driver.hoursToday > 8 && driver.status === 'Driving') {
            alerts.push({
              type: 'Break Required',
              message: `${driver.name} needs a 30-minute break`,
              driverId: driver.id,
              severity: 'medium',
            });
          }
        });
        
        return alerts;
      },
    }),
    {
      name: 'fleet-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);