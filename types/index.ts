export type DutyStatus = 'Off Duty' | 'Sleeper Berth' | 'Driving' | 'On Duty Not Driving';

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