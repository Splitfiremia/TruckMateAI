import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  VehicleDiagnostics,
  MaintenancePrediction,
  MaintenanceAlert,
  RepairShop,
  MaintenanceHistory,
  VehicleHealth,
  TelematiicsData,
  PreventiveAction
} from '@/types';
import { generateMockDiagnostics, mockMaintenanceHistory, mockRepairShops } from '@/constants/maintenanceMockData';

interface PredictiveMaintenanceState {
  // Vehicle diagnostics data
  diagnostics: VehicleDiagnostics[];
  currentDiagnostics: VehicleDiagnostics | null;
  
  // AI predictions
  predictions: MaintenancePrediction[];
  alerts: MaintenanceAlert[];
  
  // Repair shops and history
  nearbyShops: RepairShop[];
  maintenanceHistory: MaintenanceHistory[];
  
  // Vehicle health
  vehicleHealth: VehicleHealth | null;
  telematics: TelematiicsData[];
  
  // Settings
  alertsEnabled: boolean;
  predictionSensitivity: 'Conservative' | 'Balanced' | 'Aggressive';
  autoScheduleMaintenance: boolean;
  preferredShops: string[];
  
  // Loading states
  isAnalyzing: boolean;
  isLoadingShops: boolean;
  lastAnalysis: string | null;
  
  // Simulation
  isSimulating: boolean;
  simulationInterval: NodeJS.Timeout | null;
  
  // Actions
  updateDiagnostics: (data: VehicleDiagnostics) => void;
  runPredictiveAnalysis: () => Promise<void>;
  dismissAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  addMaintenanceRecord: (record: MaintenanceHistory) => void;
  findNearbyShops: (component: string, location: { lat: number; lng: number }) => Promise<void>;
  updateSettings: (settings: Partial<Pick<PredictiveMaintenanceState, 'alertsEnabled' | 'predictionSensitivity' | 'autoScheduleMaintenance'>>) => void;
  addPreferredShop: (shopId: string) => void;
  removePreferredShop: (shopId: string) => void;
  clearOldDiagnostics: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
}

// Mock AI analysis function
const analyzeVehicleData = async (diagnostics: VehicleDiagnostics[]): Promise<{
  predictions: MaintenancePrediction[];
  alerts: MaintenanceAlert[];
  vehicleHealth: VehicleHealth;
}> => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const latest = diagnostics[diagnostics.length - 1];
  if (!latest) {
    return { predictions: [], alerts: [], vehicleHealth: {
      vehicleId: 'default',
      overallScore: 85,
      lastUpdated: new Date().toISOString(),
      criticalIssues: 0,
      upcomingMaintenance: 0,
      systemHealth: {
        engine: 85,
        transmission: 90,
        brakes: 75,
        tires: 80,
        electrical: 95,
        cooling: 88,
        fuel: 92
      },
      predictedReliability: 88,
      recommendedActions: []
    }};
  }
  
  const predictions: MaintenancePrediction[] = [];
  const alerts: MaintenanceAlert[] = [];
  
  // Analyze brake system
  if (latest.brakeSystemPressure < 80) {
    const prediction: MaintenancePrediction = {
      id: `pred-${Date.now()}-brakes`,
      vehicleId: latest.vehicleId,
      componentType: 'Brakes',
      componentName: 'Brake Pads',
      currentCondition: 65,
      predictedFailureDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      milesUntilFailure: 2500,
      confidenceLevel: 87,
      severity: 'High',
      estimatedCost: 450,
      symptoms: ['Reduced brake pressure', 'Longer stopping distances', 'Brake pedal feels soft'],
      recommendations: ['Schedule brake inspection within 2 weeks', 'Avoid heavy loads', 'Check brake fluid level'],
      preventiveMaintenance: [
        {
          id: 'prev-1',
          action: 'Replace brake pads',
          urgency: 'This Week',
          estimatedTime: '2-3 hours',
          estimatedCost: 450,
          canDelay: false,
          delayRisk: 'Critical safety risk - brake failure possible'
        }
      ],
      basedOnData: {
        diagnosticReadings: 15,
        historicalPatterns: true,
        manufacturerSpecs: true,
        weatherConditions: false,
        drivingPatterns: true
      }
    };
    predictions.push(prediction);
    
    alerts.push({
      id: `alert-${Date.now()}-brakes`,
      vehicleId: latest.vehicleId,
      type: 'Prediction',
      priority: 'High',
      title: 'Brake System Alert',
      message: 'AI predicts brake pad replacement needed in ~2,500 miles',
      component: 'Brake Pads',
      actionRequired: true,
      dueDate: prediction.predictedFailureDate,
      estimatedCost: 450,
      nearbyShops: [],
      dismissed: false
    });
  }
  
  // Analyze engine temperature
  if (latest.engineTemp > 210) {
    const prediction: MaintenancePrediction = {
      id: `pred-${Date.now()}-cooling`,
      vehicleId: latest.vehicleId,
      componentType: 'Cooling System',
      componentName: 'Thermostat',
      currentCondition: 70,
      predictedFailureDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      milesUntilFailure: 3200,
      confidenceLevel: 78,
      severity: 'Medium',
      estimatedCost: 280,
      symptoms: ['Engine running hot', 'Coolant temperature fluctuating', 'Reduced fuel efficiency'],
      recommendations: ['Monitor coolant levels daily', 'Check for leaks', 'Schedule cooling system inspection'],
      preventiveMaintenance: [
        {
          id: 'prev-2',
          action: 'Replace thermostat and coolant flush',
          urgency: 'This Month',
          estimatedTime: '1.5-2 hours',
          estimatedCost: 280,
          canDelay: true,
          delayRisk: 'Engine overheating risk increases'
        }
      ],
      basedOnData: {
        diagnosticReadings: 12,
        historicalPatterns: true,
        manufacturerSpecs: true,
        weatherConditions: true,
        drivingPatterns: false
      }
    };
    predictions.push(prediction);
    
    alerts.push({
      id: `alert-${Date.now()}-cooling`,
      vehicleId: latest.vehicleId,
      type: 'Prediction',
      priority: 'Medium',
      title: 'Cooling System Warning',
      message: 'Engine temperature trending high - thermostat may need replacement',
      component: 'Thermostat',
      actionRequired: false,
      dueDate: prediction.predictedFailureDate,
      estimatedCost: 280,
      nearbyShops: [],
      dismissed: false
    });
  }
  
  // Analyze tire pressure
  const avgTirePressure = (
    latest.tirePressure.frontLeft + 
    latest.tirePressure.frontRight + 
    latest.tirePressure.rearLeft + 
    latest.tirePressure.rearRight
  ) / 4;
  
  if (avgTirePressure < 32) {
    alerts.push({
      id: `alert-${Date.now()}-tires`,
      vehicleId: latest.vehicleId,
      type: 'Immediate',
      priority: 'Medium',
      title: 'Low Tire Pressure',
      message: 'Multiple tires showing low pressure - check and inflate',
      component: 'Tires',
      actionRequired: true,
      dueDate: new Date().toISOString(),
      estimatedCost: 0,
      nearbyShops: [],
      dismissed: false
    });
  }
  
  // Calculate vehicle health
  const systemHealth = {
    engine: latest.engineTemp > 210 ? 70 : 85,
    transmission: latest.transmissionTemp > 200 ? 75 : 90,
    brakes: latest.brakeSystemPressure < 80 ? 65 : 85,
    tires: avgTirePressure < 32 ? 70 : 80,
    electrical: latest.batteryVoltage < 12.4 ? 75 : 95,
    cooling: latest.coolantTemp > 200 ? 70 : 88,
    fuel: latest.fuelLevel < 0.25 ? 60 : 92
  };
  
  const overallScore = Math.round(
    Object.values(systemHealth).reduce((sum, score) => sum + score, 0) / 
    Object.keys(systemHealth).length
  );
  
  const vehicleHealth: VehicleHealth = {
    vehicleId: latest.vehicleId,
    overallScore,
    lastUpdated: new Date().toISOString(),
    criticalIssues: alerts.filter(a => a.priority === 'Critical').length,
    upcomingMaintenance: predictions.length,
    systemHealth,
    predictedReliability: Math.max(60, overallScore - 5),
    recommendedActions: [
      ...(latest.brakeSystemPressure < 80 ? ['Schedule brake inspection'] : []),
      ...(latest.engineTemp > 210 ? ['Monitor engine temperature'] : []),
      ...(avgTirePressure < 32 ? ['Check tire pressure'] : [])
    ]
  };
  
  return { predictions, alerts, vehicleHealth };
};

// Mock function to find nearby repair shops
const findRepairShops = async (component: string, location: { lat: number; lng: number }): Promise<RepairShop[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const mockShops: RepairShop[] = [
    {
      id: 'shop-1',
      name: 'TruckCare Pro',
      address: '1234 Highway 95, Phoenix, AZ 85001',
      phone: '(602) 555-0123',
      rating: 4.8,
      reviewCount: 127,
      specialties: ['Brake Systems', 'Engine Repair', 'Transmission'],
      distance: 2.3,
      estimatedCost: component === 'Brake Pads' ? 420 : 260,
      availability: 'Same Day',
      certifications: ['ASE Certified', 'Cummins Authorized'],
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
      estimatedCost: component === 'Brake Pads' ? 480 : 290,
      availability: 'Next Day',
      certifications: ['ASE Certified', 'Volvo Certified'],
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
      estimatedCost: component === 'Brake Pads' ? 395 : 245,
      availability: '2-3 Days',
      certifications: ['ASE Certified', 'Peterbilt Authorized', 'DOT Inspector'],
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
  
  return mockShops.sort((a, b) => a.distance - b.distance);
};

export const usePredictiveMaintenanceStore = create<PredictiveMaintenanceState>()(
  persist(
    (set, get) => ({
      // Initial state
      diagnostics: [],
      currentDiagnostics: null,
      predictions: [],
      alerts: [],
      nearbyShops: [],
      maintenanceHistory: [],
      vehicleHealth: null,
      telematics: [],
      
      // Settings
      alertsEnabled: true,
      predictionSensitivity: 'Balanced',
      autoScheduleMaintenance: false,
      preferredShops: [],
      
      // Loading states
      isAnalyzing: false,
      isLoadingShops: false,
      lastAnalysis: null,
      
      // Simulation
      isSimulating: false,
      simulationInterval: null,
      
      // Actions
      updateDiagnostics: (data: VehicleDiagnostics) => {
        set(state => ({
          diagnostics: [...state.diagnostics.slice(-49), data], // Keep last 50 readings
          currentDiagnostics: data
        }));
        
        // Auto-run analysis if enabled
        const { runPredictiveAnalysis } = get();
        runPredictiveAnalysis();
      },
      
      runPredictiveAnalysis: async () => {
        const { diagnostics, isAnalyzing } = get();
        
        if (isAnalyzing || diagnostics.length === 0) return;
        
        set({ isAnalyzing: true });
        
        try {
          const { predictions, alerts, vehicleHealth } = await analyzeVehicleData(diagnostics);
          
          set({
            predictions,
            alerts: [...get().alerts.filter(a => !a.dismissed), ...alerts],
            vehicleHealth,
            lastAnalysis: new Date().toISOString(),
            isAnalyzing: false
          });
        } catch (error) {
          console.error('Predictive analysis failed:', error);
          set({ isAnalyzing: false });
        }
      },
      
      dismissAlert: (alertId: string) => {
        set(state => ({
          alerts: state.alerts.map(alert =>
            alert.id === alertId
              ? { ...alert, dismissed: true, dismissedAt: new Date().toISOString() }
              : alert
          )
        }));
      },
      
      resolveAlert: (alertId: string) => {
        set(state => ({
          alerts: state.alerts.map(alert =>
            alert.id === alertId
              ? { ...alert, resolvedAt: new Date().toISOString() }
              : alert
          )
        }));
      },
      
      addMaintenanceRecord: (record: MaintenanceHistory) => {
        set(state => ({
          maintenanceHistory: [record, ...state.maintenanceHistory]
        }));
      },
      
      findNearbyShops: async (component: string, location: { lat: number; lng: number }) => {
        set({ isLoadingShops: true });
        
        try {
          const shops = await findRepairShops(component, location);
          set({ nearbyShops: shops, isLoadingShops: false });
        } catch (error) {
          console.error('Failed to find nearby shops:', error);
          set({ isLoadingShops: false });
        }
      },
      
      updateSettings: (settings) => {
        set(state => ({ ...state, ...settings }));
      },
      
      addPreferredShop: (shopId: string) => {
        set(state => ({
          preferredShops: [...state.preferredShops, shopId]
        }));
      },
      
      removePreferredShop: (shopId: string) => {
        set(state => ({
          preferredShops: state.preferredShops.filter(id => id !== shopId)
        }));
      },
      
      clearOldDiagnostics: () => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30); // Keep last 30 days
        
        set(state => ({
          diagnostics: state.diagnostics.filter(
            d => new Date(d.timestamp) > cutoffDate
          )
        }));
      },
      
      // Simulation methods
      startSimulation: () => {
        const { isSimulating, simulationInterval } = get();
        
        if (isSimulating || simulationInterval) return;
        
        // Initialize with mock history
        set({
          maintenanceHistory: mockMaintenanceHistory,
          isSimulating: true
        });
        
        // Generate diagnostic data every 5 seconds
        const interval = setInterval(() => {
          const mockData = generateMockDiagnostics();
          get().updateDiagnostics(mockData);
        }, 5000);
        
        set({ simulationInterval: interval });
        
        // Generate initial data
        const initialData = generateMockDiagnostics();
        get().updateDiagnostics(initialData);
      },
      
      stopSimulation: () => {
        const { simulationInterval } = get();
        
        if (simulationInterval) {
          clearInterval(simulationInterval);
        }
        
        set({
          isSimulating: false,
          simulationInterval: null
        });
      }
    }),
    {
      name: 'predictive-maintenance-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        maintenanceHistory: state.maintenanceHistory,
        preferredShops: state.preferredShops,
        alertsEnabled: state.alertsEnabled,
        predictionSensitivity: state.predictionSensitivity,
        autoScheduleMaintenance: state.autoScheduleMaintenance
      })
    }
  )
);