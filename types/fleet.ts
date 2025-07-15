export interface FleetCompany {
  id: string;
  name: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  dotNumber: string;
  mcNumber: string;
  subscription: 'basic' | 'premium' | 'enterprise';
  createdAt: string;
  isActive: boolean;
}

export interface FleetDriver {
  id: string;
  fleetId: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  medicalCertExpiry: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'suspended';
  vehicleAssigned?: string;
  role: 'driver' | 'owner_operator' | 'fleet_manager';
  permissions: string[];
}

export interface FleetVehicle {
  id: string;
  fleetId: string;
  unitNumber: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  assignedDriverId?: string;
  status: 'active' | 'maintenance' | 'out_of_service';
  lastInspection: string;
  nextMaintenanceDue: string;
  mileage: number;
}

export interface FleetSettings {
  fleetId: string;
  companyBranding: {
    showLogo: boolean;
    customColors: boolean;
    welcomeMessage?: string;
  };
  complianceRules: {
    stricterHosRules: boolean;
    customBreakRequirements?: number;
    mandatoryPreTrip: boolean;
    requirePostTrip: boolean;
    customInspectionItems?: string[];
  };
  features: {
    voiceCommands: boolean;
    receiptScanning: boolean;
    loadNegotiation: boolean;
    routeOptimization: boolean;
    maintenanceTracking: boolean;
  };
  notifications: {
    complianceAlerts: boolean;
    maintenanceReminders: boolean;
    loadUpdates: boolean;
    emergencyContacts: string[];
  };
  reporting: {
    dailyReports: boolean;
    weeklyReports: boolean;
    complianceReports: boolean;
    customReports: string[];
  };
}

export interface FleetDashboardStats {
  totalDrivers: number;
  activeDrivers: number;
  totalVehicles: number;
  activeVehicles: number;
  complianceScore: number;
  violationsThisWeek: number;
  maintenanceOverdue: number;
  revenue: number;
  miles: number;
  fuelCosts: number;
}

export interface ComplianceViolation {
  id: string;
  driverId: string;
  driverName: string;
  type: 'hos' | 'inspection' | 'maintenance' | 'documentation';
  severity: 'minor' | 'major' | 'critical';
  description: string;
  date: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  notes?: string;
}