export type DutyStatus = 'Off Duty' | 'Sleeper Berth' | 'Driving' | 'On Duty Not Driving';

export interface StatusChangeLog {
  id: string;
  timestamp: string;
  fromStatus: DutyStatus;
  toStatus: DutyStatus;
  location: string;
  tripId?: string;
  reason?: string;
}

export interface BreakLog {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in hours
  location: string;
  tripId?: string;
  type: '30-minute' | 'off-duty' | 'sleeper-berth';
}

export type ComplianceStatus = 'Good Standing' | 'Warning' | 'Violation';

export type ReceiptType = 'Fuel' | 'Toll' | 'Maintenance' | 'Other';

export type LoadStatus = 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';

export type InspectionStatus = 'Pass' | 'Fail' | 'Defect';

export interface Receipt {
  id: string;
  type: ReceiptType;
  vendor: string;
  location: string;
  date: string;
  amount: number;
  gallons?: number;
  pricePerGallon?: number;
  state?: string;
  category: string;
  service?: string;
  imageUrl?: string;
}

export interface Load {
  id: string;
  pickup: {
    location: string;
    time: string;
  };
  delivery: {
    location: string;
    time: string;
  };
  broker: string;
  rate: string;
  miles: number;
  totalPay: string;
  status: LoadStatus;
}

export interface ComplianceIssue {
  type: 'Warning' | 'Violation';
  message: string;
  color: string;
  dueDate?: string;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: string;
  trafficConditions: string;
  weatherConditions: string;
  weighStations: WeighStation[];
  restAreas: RestArea[];
}

export interface WeighStation {
  location: string;
  status: 'Open' | 'Closed';
  bypass: boolean;
}

export interface RestArea {
  name: string;
  location: string;
  amenities: string[];
  distance: number;
}

export interface MaintenanceItem {
  id: string;
  type: string;
  lastPerformed: string;
  mileage: number;
  nextDue: string;
  nextDueMileage: number;
  status: 'Good' | 'Upcoming' | 'Due Soon' | 'Overdue';
  notes: string;
}

export interface VoiceCommand {
  command: string;
  action: string;
}

export interface InspectionItem {
  id: string;
  label: string;
  required: boolean;
}

export interface InspectionCategory {
  category: string;
  items: InspectionItem[];
}

export interface InspectionResult {
  itemId: string;
  status: InspectionStatus;
  notes?: string;
  defectDescription?: string;
}

export interface PreTripInspection {
  id: string;
  date: string;
  driverId: string;
  vehicleId: string;
  location: string;
  results: InspectionResult[];
  overallStatus: InspectionStatus;
  signature?: string;
  completedAt: string;
  defectsFound: number;
  safeToOperate: boolean;
}

export interface DOTInspectionPrediction {
  riskLevel: 'Low' | 'Medium' | 'High';
  probability: number;
  factors: string[];
  recommendations: string[];
  nextLikelyLocation: string;
  estimatedTime: string;
}

export interface DOTInspectionTip {
  id: string;
  category: 'Vehicle' | 'Driver' | 'Documentation' | 'Cargo';
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  actionRequired: boolean;
}

export interface DOTInspectionHistory {
  id: string;
  date: string;
  location: string;
  inspector: string;
  type: 'Level 1' | 'Level 2' | 'Level 3';
  result: 'Pass' | 'Warning' | 'Out of Service';
  violations: DOTViolation[];
  score: number;
  duration: string;
}

export interface DOTViolation {
  code: string;
  description: string;
  severity: 'Critical' | 'Serious' | 'Minor';
  category: string;
  points: number;
  fineAmount?: number;
}

export interface InspectionBlitzAlert {
  id: string;
  location: string;
  startDate: string;
  endDate: string;
  focus: string[];
  severity: 'High' | 'Medium' | 'Low';
  alternativeRoutes: string[];
}

export interface DOTRule {
  id: string;
  category: 'HOS' | 'ELD' | 'Inspection' | 'Medical' | 'Vehicle' | 'Driver';
  title: string;
  description: string;
  effectiveDate: string;
  lastUpdated: string;
  source: 'FMCSA' | 'DOT' | 'State';
  severity: 'Critical' | 'Important' | 'Standard';
  applicableVehicleTypes: string[];
  parameters: Record<string, any>;
}

export interface ComplianceViolationPrediction {
  id: string;
  type: 'HOS' | 'Break' | 'Inspection' | 'Medical' | 'Vehicle';
  severity: 'Critical' | 'Warning' | 'Advisory';
  timeToViolation: number; // minutes
  currentValue: number;
  thresholdValue: number;
  message: string;
  recommendations: string[];
  preventionActions: PreventionAction[];
  location?: string;
  estimatedFine?: number;
  canOverride?: boolean;
  overrideInfo?: ViolationOverride;
}

export interface ViolationOverride {
  id: string;
  timestamp: string;
  reason: string;
  driverId: string;
  supervisorApproval?: {
    supervisorId: string;
    approvedAt: string;
    notes?: string;
  };
  documentedInTrip: boolean;
  tripId?: string;
  riskAcknowledged: boolean;
  estimatedFineAccepted: boolean;
}

export interface PreventionAction {
  id: string;
  type: 'Break' | 'Route' | 'Inspection' | 'Documentation';
  title: string;
  description: string;
  urgency: 'Immediate' | 'Soon' | 'Planned';
  estimatedTime: number; // minutes
  location?: string;
  automated: boolean;
}

export interface PredictiveAlert {
  id: string;
  timestamp: string;
  type: 'Violation Prevention' | 'Rule Update' | 'Inspection Alert' | 'Route Advisory';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  message: string;
  actionRequired: boolean;
  autoResolved: boolean;
  expiresAt?: string;
  relatedRuleId?: string;
}

export interface RuleUpdateNotification {
  id: string;
  ruleId: string;
  changeType: 'New' | 'Modified' | 'Deprecated';
  effectiveDate: string;
  summary: string;
  impactLevel: 'High' | 'Medium' | 'Low';
  actionRequired: boolean;
  deadline?: string;
}

export interface ComplianceMetrics {
  violationRisk: number; // 0-100
  complianceScore: number; // 0-100
  hoursUntilViolation: number;
  predictedViolations: ComplianceViolationPrediction[];
  ruleUpdatesCount: number;
  lastRuleSync: string;
  activeAlerts: number;
  overridesUsed: number;
  overridesThisWeek: number;
}

export interface TripOverrideLog {
  id: string;
  tripId: string;
  timestamp: string;
  violationType: string;
  reason: string;
  driverId: string;
  location: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedFine?: number;
  supervisorApproval?: {
    supervisorId: string;
    approvedAt: string;
    notes?: string;
  };
}

// Predictive Maintenance Types
export interface VehicleDiagnostics {
  id: string;
  vehicleId: string;
  timestamp: string;
  engineRpm: number;
  engineTemp: number;
  oilPressure: number;
  fuelLevel: number;
  batteryVoltage: number;
  coolantTemp: number;
  transmissionTemp: number;
  brakeSystemPressure: number;
  tirePressure: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
  };
  mileage: number;
  faultCodes: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface MaintenancePrediction {
  id: string;
  vehicleId: string;
  component: string;
  componentType: 'Engine' | 'Transmission' | 'Brakes' | 'Tires' | 'Battery' | 'Cooling System' | 'Fuel System' | 'Electrical';
  componentName: string;
  currentCondition: number; // 0-100 (100 = perfect condition)
  predictedFailureDate: string;
  milesUntilFailure: number;
  estimatedMiles: number;
  confidence: number; // 0-100
  confidenceLevel: number; // 0-100
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'high' | 'medium' | 'low';
  estimatedCost: number;
  symptoms: string[];
  recommendations: string[];
  description: string;
  preventiveMaintenance: PreventiveAction[];
  basedOnData: {
    diagnosticReadings: number;
    historicalPatterns: boolean;
    manufacturerSpecs: boolean;
    weatherConditions: boolean;
    drivingPatterns: boolean;
  };
}

export interface PreventiveAction {
  id: string;
  action: string;
  urgency: 'Immediate' | 'This Week' | 'This Month' | 'Next Service';
  estimatedTime: string;
  estimatedCost: number;
  canDelay: boolean;
  delayRisk: string;
}

export interface MaintenanceAlert {
  id: string;
  vehicleId: string;
  type: 'Prediction' | 'Immediate' | 'Scheduled' | 'Overdue';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  message: string;
  description: string;
  component: string;
  actionRequired: boolean;
  dueDate: string;
  estimatedCost: number;
  milesUntilFailure?: number;
  nearbyShops: RepairShop[];
  dismissed: boolean;
  dismissedAt?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface RepairShop {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  distance: number;
  estimatedCost: number;
  availability: 'Same Day' | 'Next Day' | '2-3 Days' | '1 Week+';
  certifications: string[];
  truckFaxCertified?: boolean;
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

export interface MaintenanceHistory {
  id: string;
  vehicleId: string;
  date: string;
  mileage: number;
  type: 'Preventive' | 'Repair' | 'Emergency' | 'Inspection';
  component: string;
  description: string;
  cost: number;
  shopName: string;
  shopLocation: string;
  partsReplaced: string[];
  laborHours: number;
  warranty: {
    parts: string;
    labor: string;
  };
  nextServiceDue?: string;
  nextServiceMileage?: number;
}

export interface VehicleHealth {
  vehicleId: string;
  overallScore: number; // 0-100
  lastUpdated: string;
  lastAnalysis: string;
  criticalIssues: number;
  upcomingMaintenance: number;
  systemHealth: {
    engine: number;
    transmission: number;
    brakes: number;
    tires: number;
    electrical: number;
    cooling: number;
    fuel: number;
  };
  predictedReliability: number; // 0-100 for next 30 days
  recommendedActions: string[];
}

export interface TelematiicsData {
  vehicleId: string;
  timestamp: string;
  speed: number;
  acceleration: number;
  braking: number;
  idleTime: number;
  fuelConsumption: number;
  engineLoad: number;
  gpsLocation: {
    latitude: number;
    longitude: number;
  };
  drivingScore: number;
  harshEvents: {
    acceleration: number;
    braking: number;
    cornering: number;
  };
}

// TruckFax API Integration Types
export interface TruckFaxVehicleInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  engineType: string;
  transmissionType: string;
  mileage: number;
  lastReportedDate: string;
  ownershipHistory: TruckFaxOwnership[];
  accidentHistory: TruckFaxAccident[];
  maintenanceRecords: TruckFaxMaintenanceRecord[];
  recallInformation: TruckFaxRecall[];
  inspectionHistory: TruckFaxInspection[];
  titleHistory: TruckFaxTitle[];
  lienHistory: TruckFaxLien[];
  commercialUse: boolean;
  fleetVehicle: boolean;
}

export interface TruckFaxOwnership {
  ownerType: 'Individual' | 'Commercial' | 'Fleet' | 'Lease';
  startDate: string;
  endDate?: string;
  state: string;
  estimatedMileage?: number;
}

export interface TruckFaxAccident {
  date: string;
  severity: 'Minor' | 'Moderate' | 'Severe' | 'Total Loss';
  damageType: string[];
  estimatedDamage: number;
  airbagDeployment: boolean;
  location: string;
  reportNumber?: string;
}

export interface TruckFaxMaintenanceRecord {
  date: string;
  mileage: number;
  serviceType: 'Oil Change' | 'Brake Service' | 'Transmission Service' | 'Engine Repair' | 'Preventive Maintenance' | 'Other';
  description: string;
  cost?: number;
  shopName?: string;
  partsReplaced: string[];
  warrantyInfo?: {
    type: string;
    duration: string;
    mileageLimit?: number;
  };
}

export interface TruckFaxRecall {
  recallNumber: string;
  date: string;
  component: string;
  description: string;
  severity: 'Safety' | 'Emissions' | 'Performance';
  status: 'Open' | 'Completed' | 'Not Applicable';
  remedy: string;
}

export interface TruckFaxInspection {
  date: string;
  type: 'DOT' | 'State' | 'Annual' | 'Random';
  result: 'Pass' | 'Fail' | 'Conditional';
  violations: string[];
  inspector: string;
  location: string;
  nextDueDate?: string;
}

export interface TruckFaxTitle {
  issueDate: string;
  state: string;
  titleType: 'Clean' | 'Salvage' | 'Flood' | 'Lemon' | 'Rebuilt';
  brandHistory: string[];
  mileageReported: number;
  mileageAccurate: boolean;
}

export interface TruckFaxLien {
  lienHolder: string;
  date: string;
  amount?: number;
  status: 'Active' | 'Released' | 'Satisfied';
  type: 'Purchase' | 'Refinance' | 'Equity';
}

export interface TruckFaxPredictiveInsights {
  vehicleId: string;
  riskScore: number; // 0-100 (higher = more risk)
  reliabilityScore: number; // 0-100 (higher = more reliable)
  maintenancePredictions: TruckFaxMaintenancePrediction[];
  costPredictions: TruckFaxCostPrediction;
  resaleValueTrend: TruckFaxResaleValue;
  recommendedActions: TruckFaxRecommendation[];
  dataConfidence: number; // 0-100
  lastUpdated: string;
  accuracyImprovement: number;
  earlyDetectionDays: number;
  estimatedSavings: number;
  riskFactors: {
    component: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }[];
}

export interface TruckFaxMaintenancePrediction {
  component: string;
  predictedFailureWindow: {
    earliest: string;
    latest: string;
    mostLikely: string;
  };
  mileageWindow: {
    earliest: number;
    latest: number;
    mostLikely: number;
  };
  confidence: number;
  basedOnFactors: string[];
  estimatedCost: {
    parts: number;
    labor: number;
    total: number;
  };
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  preventiveOptions: {
    action: string;
    cost: number;
    effectiveness: number;
  }[];
}

export interface TruckFaxCostPrediction {
  nextYear: {
    maintenance: number;
    repairs: number;
    total: number;
  };
  next5Years: {
    maintenance: number;
    repairs: number;
    total: number;
  };
  majorComponentReplacements: {
    component: string;
    timeframe: string;
    estimatedCost: number;
  }[];
}

export interface TruckFaxResaleValue {
  currentEstimate: number;
  oneYearProjection: number;
  threeYearProjection: number;
  fiveYearProjection: number;
  depreciationRate: number;
  marketFactors: string[];
}

export interface TruckFaxRecommendation {
  type: 'Maintenance' | 'Inspection' | 'Repair' | 'Replacement' | 'Monitoring';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  timeframe: string;
  estimatedCost: number;
  potentialSavings: number;
  riskReduction: number;
}

export interface TruckFaxAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    requestId: string;
    timestamp: string;
    rateLimitRemaining: number;
    dataFreshness: string;
  };
}

// Additional TruckFax Integration Types
export interface TruckFaxData {
  vin: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  mileage: number;
  maintenanceHistory: {
    date: string;
    mileage: number;
    description: string;
    cost: number;
  }[];
}

export interface TruckFaxInsights {
  accuracyImprovement: number;
  earlyDetectionDays: number;
  estimatedSavings: number;
  riskFactors: {
    component: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }[];
}

// Google Maps Route Optimization Types
export interface RouteWaypoint {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'pickup' | 'delivery' | 'fuel' | 'rest' | 'weigh_station';
  timeWindow?: {
    start: string;
    end: string;
  };
  serviceTime?: number; // minutes
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface OptimizedRoute {
  id: string;
  waypoints: RouteWaypoint[];
  totalDistance: number; // miles
  totalDuration: number; // minutes
  estimatedFuelCost: number;
  tollCosts: number;
  routePolyline: string;
  alternativeRoutes?: OptimizedRoute[];
  trafficConditions: 'light' | 'moderate' | 'heavy';
  weatherAlerts: WeatherAlert[];
  truckRestrictions: TruckRestriction[];
  optimizationScore: number; // 0-100
  createdAt: string;
  lastUpdated: string;
}

export interface TruckRestriction {
  type: 'height' | 'weight' | 'length' | 'hazmat' | 'no_trucks';
  value?: number;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  severity: 'warning' | 'restriction' | 'prohibited';
}

export interface WeatherAlert {
  id: string;
  type: 'snow' | 'ice' | 'rain' | 'wind' | 'fog' | 'extreme_temp';
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  startTime: string;
  endTime: string;
  impact: 'low' | 'medium' | 'high';
}

export interface RouteOptimizationPreferences {
  prioritizeTime: boolean;
  prioritizeFuel: boolean;
  avoidTolls: boolean;
  avoidHighways: boolean;
  preferTruckRoutes: boolean;
  maxDrivingHours: number;
  requiredBreakDuration: number; // minutes
  fuelTankCapacity: number; // gallons
  mpg: number;
  truckDimensions: {
    height: number; // feet
    width: number; // feet
    length: number; // feet
    weight: number; // pounds
  };
  hazmatEndorsement: boolean;
}

export interface TrafficIncident {
  id: string;
  type: 'accident' | 'construction' | 'road_closure' | 'weather' | 'event';
  severity: 'minor' | 'moderate' | 'major';
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  estimatedDelay: number; // minutes
  startTime: string;
  estimatedEndTime?: string;
  alternativeRoute?: string;
}

export interface FuelStop {
  id: string;
  name: string;
  brand: string;
  address: string;
  latitude: number;
  longitude: number;
  currentPrice: number;
  amenities: string[];
  truckParking: boolean;
  showers: boolean;
  restaurant: boolean;
  distance: number; // miles from current location
  detourTime: number; // additional minutes
  rating: number;
  reviewCount: number;
}

export interface RouteAnalytics {
  routeId: string;
  actualDistance: number;
  actualDuration: number;
  fuelConsumed: number;
  tollsPaid: number;
  delaysEncountered: TrafficIncident[];
  fuelStopsUsed: FuelStop[];
  complianceIssues: string[];
  driverFeedback: {
    rating: number;
    comments: string;
  };
  accuracyScore: number; // how accurate the prediction was
  completedAt: string;
}

export interface GoogleMapsConfig {
  apiKey: string;
  enableTraffic: boolean;
  enableWeather: boolean;
  enableTruckRestrictions: boolean;
  updateInterval: number; // minutes
  maxAlternativeRoutes: number;
}

// Drivewyze API Types
export interface DrivewyzeWeighStation {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    state: string;
    highway: string;
    mileMarker?: number;
  };
  status: 'open' | 'closed' | 'bypass_available' | 'maintenance';
  operatingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  bypassEligible: boolean;
  bypassStatus?: 'approved' | 'denied' | 'pending' | 'not_applicable';
  services: string[];
  restrictions: {
    maxWeight?: number;
    maxHeight?: number;
    maxLength?: number;
    hazmatRestrictions?: string[];
  };
  contact: {
    phone?: string;
    website?: string;
  };
  lastUpdated: string;
  distance?: number; // miles from current location
  estimatedArrival?: string;
}

export interface DrivewyzeBypassRequest {
  weighStationId: string;
  vehicleInfo: {
    type: string;
    weight: number;
    height: number;
    length: number;
    hazmat: boolean;
  };
  driverInfo: {
    licenseNumber: string;
    dotNumber: string;
  };
  timestamp: string;
}

export interface DrivewyzeBypassResponse {
  requestId: string;
  weighStationId: string;
  status: 'approved' | 'denied' | 'pending';
  message: string;
  instructions?: string;
  expiresAt?: string;
  alternativeInstructions?: string;
  reasonCode?: string;
  estimatedProcessingTime?: number; // minutes
}

export interface DrivewyzeNotification {
  id: string;
  type: 'bypass_approved' | 'bypass_denied' | 'weigh_station_ahead' | 'status_change' | 'inspection_required';
  weighStationId: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  expiresAt?: string;
  actionRequired: boolean;
  actions?: {
    label: string;
    action: string;
  }[];
  location?: {
    latitude: number;
    longitude: number;
    distance: number;
  };
}

export interface DrivewyzeRoute {
  id: string;
  origin: string;
  destination: string;
  weighStations: DrivewyzeWeighStation[];
  totalWeighStations: number;
  bypassEligibleStations: number;
  estimatedBypassSavings: {
    time: number; // minutes
    fuel: number; // gallons
    cost: number; // dollars
  };
  routeAlerts: DrivewyzeNotification[];
  lastUpdated: string;
}

export interface DrivewyzeConfig {
  apiKey: string;
  deviceId: string;
  enableNotifications: boolean;
  autoBypassRequest: boolean;
  notificationRadius: number; // miles
  updateInterval: number; // minutes
}

export interface DrivewyzeAnalytics {
  totalBypassRequests: number;
  approvedBypasses: number;
  deniedBypasses: number;
  timeSaved: number; // minutes
  fuelSaved: number; // gallons
  costSaved: number; // dollars
  complianceScore: number; // 0-100
  lastUpdated: string;
  monthlyStats: {
    month: string;
    bypasses: number;
    timeSaved: number;
    fuelSaved: number;
    costSaved: number;
  }[];
}