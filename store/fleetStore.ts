import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  FleetCompany, 
  FleetDriver, 
  FleetVehicle, 
  FleetSettings, 
  FleetDashboardStats,
  ComplianceViolation 
} from '@/types/fleet';
import { mockFleetData } from '@/constants/mockFleetData';

interface FleetState {
  currentFleet: FleetCompany | null;
  drivers: FleetDriver[];
  vehicles: FleetVehicle[];
  settings: FleetSettings | null;
  dashboardStats: FleetDashboardStats | null;
  violations: ComplianceViolation[];
  isFleetManager: boolean;
  
  // Actions
  setCurrentFleet: (fleet: FleetCompany) => void;
  updateFleetSettings: (settings: Partial<FleetSettings>) => void;
  addDriver: (driver: FleetDriver) => void;
  updateDriver: (id: string, updates: Partial<FleetDriver>) => void;
  removeDriver: (id: string) => void;
  addVehicle: (vehicle: FleetVehicle) => void;
  updateVehicle: (id: string, updates: Partial<FleetVehicle>) => void;
  assignDriverToVehicle: (driverId: string, vehicleId: string) => void;
  updateDashboardStats: () => void;
  addViolation: (violation: ComplianceViolation) => void;
  resolveViolation: (id: string, resolvedBy: string, notes?: string) => void;
  getDriversByStatus: (status: FleetDriver['status']) => FleetDriver[];
  getVehiclesByStatus: (status: FleetVehicle['status']) => FleetVehicle[];
  getUnresolvedViolations: () => ComplianceViolation[];
  initializeMockData: () => void;
}

export const useFleetStore = create<FleetState>()(
  persist(
    (set, get) => ({
      currentFleet: null,
      drivers: [],
      vehicles: [],
      settings: null,
      dashboardStats: null,
      violations: [],
      isFleetManager: false,
      
      setCurrentFleet: (fleet) => set({ 
        currentFleet: fleet,
        isFleetManager: true,
      }),
      
      updateFleetSettings: (updates) => set((state) => ({
        settings: state.settings ? { ...state.settings, ...updates } : null,
      })),
      
      addDriver: (driver) => set((state) => ({
        drivers: [...state.drivers, driver],
      })),
      
      updateDriver: (id, updates) => set((state) => ({
        drivers: state.drivers.map(driver => 
          driver.id === id ? { ...driver, ...updates } : driver
        ),
      })),
      
      removeDriver: (id) => set((state) => ({
        drivers: state.drivers.filter(driver => driver.id !== id),
      })),
      
      addVehicle: (vehicle) => set((state) => ({
        vehicles: [...state.vehicles, vehicle],
      })),
      
      updateVehicle: (id, updates) => set((state) => ({
        vehicles: state.vehicles.map(vehicle => 
          vehicle.id === id ? { ...vehicle, ...updates } : vehicle
        ),
      })),
      
      assignDriverToVehicle: (driverId, vehicleId) => set((state) => ({
        drivers: state.drivers.map(driver => 
          driver.id === driverId ? { ...driver, vehicleAssigned: vehicleId } : driver
        ),
        vehicles: state.vehicles.map(vehicle => 
          vehicle.id === vehicleId ? { ...vehicle, assignedDriverId: driverId } : vehicle
        ),
      })),
      
      updateDashboardStats: () => set((state) => {
        const activeDrivers = state.drivers.filter(d => d.status === 'active').length;
        const activeVehicles = state.vehicles.filter(v => v.status === 'active').length;
        const unresolvedViolations = state.violations.filter(v => !v.resolved).length;
        const maintenanceOverdue = state.vehicles.filter(v => 
          new Date(v.nextMaintenanceDue) < new Date()
        ).length;
        
        return {
          dashboardStats: {
            totalDrivers: state.drivers.length,
            activeDrivers,
            totalVehicles: state.vehicles.length,
            activeVehicles,
            complianceScore: Math.max(0, 100 - (unresolvedViolations * 5)),
            violationsThisWeek: unresolvedViolations,
            maintenanceOverdue,
            revenue: 125000,
            miles: 45000,
            fuelCosts: 18500,
          },
        };
      }),
      
      addViolation: (violation) => set((state) => ({
        violations: [violation, ...state.violations],
      })),
      
      resolveViolation: (id, resolvedBy, notes) => set((state) => ({
        violations: state.violations.map(violation => 
          violation.id === id 
            ? { 
                ...violation, 
                resolved: true, 
                resolvedBy, 
                resolvedAt: new Date().toISOString(),
                notes 
              } 
            : violation
        ),
      })),
      
      getDriversByStatus: (status) => {
        return get().drivers.filter(driver => driver.status === status);
      },
      
      getVehiclesByStatus: (status) => {
        return get().vehicles.filter(vehicle => vehicle.status === status);
      },
      
      getUnresolvedViolations: () => {
        return get().violations.filter(violation => !violation.resolved);
      },
      
      initializeMockData: () => set({
        currentFleet: mockFleetData.company,
        drivers: mockFleetData.drivers,
        vehicles: mockFleetData.vehicles,
        settings: mockFleetData.settings,
        violations: mockFleetData.violations,
        isFleetManager: true,
      }),
    }),
    {
      name: 'fleet-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);