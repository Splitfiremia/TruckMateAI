import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ELDProvider, 
  ELDConnection, 
  ELDVehicle, 
  ELDDriver, 
  ELDAlert, 
  HOSViolation,
  ELDComplianceDashboard,
  ELDIntegrationSettings,
  ELDFuelData,
  ELDSafetyEvent,
  ELDMaintenanceAlert
} from '@/types';

interface ELDState {
  // Connection state
  connection: ELDConnection | null;
  isConnecting: boolean;
  connectionError: string | null;
  
  // Data
  vehicles: ELDVehicle[];
  drivers: ELDDriver[];
  alerts: ELDAlert[];
  hosViolations: HOSViolation[];
  complianceDashboard: ELDComplianceDashboard | null;
  fuelData: ELDFuelData[];
  safetyEvents: ELDSafetyEvent[];
  maintenanceAlerts: ELDMaintenanceAlert[];
  
  // Settings
  settings: ELDIntegrationSettings | null;
  
  // Sync state
  lastSync: string | null;
  isSyncing: boolean;
  syncError: string | null;
  
  // Actions
  connectProvider: (provider: ELDProvider, credentials: any) => Promise<void>;
  disconnectProvider: () => void;
  syncData: () => Promise<void>;
  updateSettings: (settings: Partial<ELDIntegrationSettings>) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  addVehicle: (vehicle: ELDVehicle) => void;
  updateVehicle: (vehicleId: string, updates: Partial<ELDVehicle>) => void;
  addDriver: (driver: ELDDriver) => void;
  updateDriver: (driverId: string, updates: Partial<ELDDriver>) => void;
  clearData: () => void;
  
  // Getters
  getActiveViolations: () => HOSViolation[];
  getCriticalAlerts: () => ELDAlert[];
  getVehicleById: (id: string) => ELDVehicle | undefined;
  getDriverById: (id: string) => ELDDriver | undefined;
  getComplianceScore: () => number;
}

export const useELDStore = create<ELDState>()(persist(
  (set, get) => ({
    // Initial state
    connection: null,
    isConnecting: false,
    connectionError: null,
    vehicles: [],
    drivers: [],
    alerts: [],
    hosViolations: [],
    complianceDashboard: null,
    fuelData: [],
    safetyEvents: [],
    maintenanceAlerts: [],
    settings: null,
    lastSync: null,
    isSyncing: false,
    syncError: null,
    
    // Actions
    connectProvider: async (provider: ELDProvider, credentials: any) => {
      set({ isConnecting: true, connectionError: null });
      
      try {
        // Simulate OAuth flow and API connection
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const connection: ELDConnection = {
          id: `${provider}-${Date.now()}`,
          provider,
          status: 'connected',
          connectedAt: new Date().toISOString(),
          lastSync: new Date().toISOString(),
          vehicleCount: 0,
          driverCount: 0,
          syncFrequency: 5,
          enabledFeatures: ['realTimeTracking', 'hosCompliance', 'faultCodes'],
        };
        
        const defaultSettings: ELDIntegrationSettings = {
          provider,
          syncFrequency: 5,
          enabledFeatures: {
            realTimeAlerts: true,
            hosMonitoring: true,
            maintenanceAlerts: true,
            fuelTracking: true,
            safetyEvents: true,
            automaticReports: false,
          },
          alertPreferences: {
            criticalAlerts: true,
            hosWarnings: true,
            maintenanceReminders: true,
            fuelAlerts: true,
            safetyAlerts: true,
            emailNotifications: false,
            pushNotifications: true,
          },
          dataRetention: 90,
          privacySettings: {
            personalConveyance: true,
            offDutyTracking: false,
            locationSharing: true,
          },
        };
        
        set({ 
          connection, 
          settings: defaultSettings,
          isConnecting: false 
        });
        
        // Auto-sync after connection
        get().syncData();
        
      } catch (error) {
        set({ 
          isConnecting: false, 
          connectionError: 'Failed to connect to ELD provider' 
        });
      }
    },
    
    disconnectProvider: () => {
      set({
        connection: null,
        settings: null,
        vehicles: [],
        drivers: [],
        alerts: [],
        hosViolations: [],
        complianceDashboard: null,
        fuelData: [],
        safetyEvents: [],
        maintenanceAlerts: [],
        lastSync: null,
      });
    },
    
    syncData: async () => {
      const { connection } = get();
      if (!connection || connection.status !== 'connected') return;
      
      set({ isSyncing: true, syncError: null });
      
      try {
        // Simulate API calls to sync data
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Mock data for demonstration
        const mockVehicles: ELDVehicle[] = [
          {
            id: 'vehicle-1',
            eldId: 'eld-vehicle-1',
            vin: '1HGBH41JXMN109186',
            make: 'Freightliner',
            model: 'Cascadia',
            year: 2022,
            licensePlate: 'TRK-001',
            unitNumber: 'Unit-001',
            status: 'active',
            location: {
              latitude: 40.7128,
              longitude: -74.0060,
              address: 'New York, NY',
              timestamp: new Date().toISOString(),
            },
            diagnostics: {
              engineHours: 1250,
              odometer: 125000,
              fuelLevel: 75,
              engineRpm: 1200,
              speed: 65,
              engineTemp: 190,
              oilPressure: 45,
              batteryVoltage: 12.6,
            },
            faultCodes: [],
            lastUpdated: new Date().toISOString(),
          },
        ];
        
        const mockDrivers: ELDDriver[] = [
          {
            id: 'driver-1',
            eldId: 'eld-driver-1',
            name: 'John Smith',
            cdlNumber: 'CDL123456789',
            employeeId: 'EMP001',
            status: 'driving',
            currentVehicleId: 'vehicle-1',
            hosStatus: {
              driveTime: 480, // 8 hours remaining
              onDutyTime: 840, // 14 hours
              cycleTime: 4200, // 70 hours
              shiftTime: 480,
              lastBreak: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              nextBreakRequired: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
              violationRisk: 'low',
            },
            location: {
              latitude: 40.7128,
              longitude: -74.0060,
              address: 'New York, NY',
              timestamp: new Date().toISOString(),
            },
            lastActivity: new Date().toISOString(),
          },
        ];
        
        const mockComplianceDashboard: ELDComplianceDashboard = {
          overallScore: 92,
          hosCompliance: {
            activeViolations: 0,
            warningsCount: 1,
            driversAtRisk: 0,
            averageUtilization: 78,
          },
          vehicleHealth: {
            activeFaults: 0,
            maintenanceDue: 1,
            averageHealth: 95,
            criticalIssues: 0,
          },
          safetyMetrics: {
            harshBrakingEvents: 2,
            speedingEvents: 1,
            idlingTime: 45,
            fuelEfficiency: 7.2,
          },
          inspectionReadiness: {
            score: 98,
            lastInspection: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            nextDue: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            documentsReady: true,
          },
          lastUpdated: new Date().toISOString(),
        };
        
        set({
          vehicles: mockVehicles,
          drivers: mockDrivers,
          complianceDashboard: mockComplianceDashboard,
          lastSync: new Date().toISOString(),
          isSyncing: false,
          connection: {
            ...connection,
            lastSync: new Date().toISOString(),
            vehicleCount: mockVehicles.length,
            driverCount: mockDrivers.length,
          },
        });
        
      } catch (error) {
        set({ 
          isSyncing: false, 
          syncError: 'Failed to sync ELD data' 
        });
      }
    },
    
    updateSettings: (newSettings: Partial<ELDIntegrationSettings>) => {
      const { settings } = get();
      if (settings) {
        set({ 
          settings: { 
            ...settings, 
            ...newSettings 
          } 
        });
      }
    },
    
    acknowledgeAlert: (alertId: string) => {
      const { alerts } = get();
      const updatedAlerts = alerts.map(alert =>
        alert.id === alertId
          ? { ...alert, acknowledged: true, acknowledgedAt: new Date().toISOString() }
          : alert
      );
      set({ alerts: updatedAlerts });
    },
    
    resolveAlert: (alertId: string) => {
      const { alerts } = get();
      const updatedAlerts = alerts.map(alert =>
        alert.id === alertId
          ? { ...alert, resolvedAt: new Date().toISOString() }
          : alert
      );
      set({ alerts: updatedAlerts });
    },
    
    addVehicle: (vehicle: ELDVehicle) => {
      const { vehicles } = get();
      set({ vehicles: [...vehicles, vehicle] });
    },
    
    updateVehicle: (vehicleId: string, updates: Partial<ELDVehicle>) => {
      const { vehicles } = get();
      const updatedVehicles = vehicles.map(vehicle =>
        vehicle.id === vehicleId ? { ...vehicle, ...updates } : vehicle
      );
      set({ vehicles: updatedVehicles });
    },
    
    addDriver: (driver: ELDDriver) => {
      const { drivers } = get();
      set({ drivers: [...drivers, driver] });
    },
    
    updateDriver: (driverId: string, updates: Partial<ELDDriver>) => {
      const { drivers } = get();
      const updatedDrivers = drivers.map(driver =>
        driver.id === driverId ? { ...driver, ...updates } : driver
      );
      set({ drivers: updatedDrivers });
    },
    
    clearData: () => {
      set({
        vehicles: [],
        drivers: [],
        alerts: [],
        hosViolations: [],
        complianceDashboard: null,
        fuelData: [],
        safetyEvents: [],
        maintenanceAlerts: [],
      });
    },
    
    // Getters
    getActiveViolations: () => {
      const { hosViolations } = get();
      return hosViolations.filter(violation => violation.severity === 'violation');
    },
    
    getCriticalAlerts: () => {
      const { alerts } = get();
      return alerts.filter(alert => 
        alert.priority === 'critical' && !alert.acknowledged
      );
    },
    
    getVehicleById: (id: string) => {
      const { vehicles } = get();
      return vehicles.find(vehicle => vehicle.id === id);
    },
    
    getDriverById: (id: string) => {
      const { drivers } = get();
      return drivers.find(driver => driver.id === id);
    },
    
    getComplianceScore: () => {
      const { complianceDashboard } = get();
      return complianceDashboard?.overallScore || 0;
    },
  }),
  {
    name: 'eld-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      connection: state.connection,
      settings: state.settings,
      lastSync: state.lastSync,
      // Don't persist real-time data to avoid stale data
    }),
  }
));