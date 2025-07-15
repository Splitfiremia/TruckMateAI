import { colors } from './colors';
import { Load, Receipt, LoadStatus, ReceiptType } from '@/types';

export const driverInfo = {
  name: "Michael Johnson",
  licenseNumber: "CDL-123456789",
  licenseExpiry: "2025-12-31",
  medicalCertExpiry: "2025-06-15",
  company: "Freedom Logistics LLC",
  truckNumber: "FL-4872",
  homeTerminal: "Atlanta, GA",
};

export const dutyStatus = {
  currentStatus: "Driving",
  timeInCurrentStatus: "03:45", // hours:minutes
  timeRemaining: "07:15", // hours:minutes until 11-hour limit
  cycleTimeRemaining: "42:30", // hours:minutes until 70-hour limit
  breakRequired: {
    required: true,
    timeUntilRequired: "01:15", // hours:minutes
  },
};

export const complianceStatus = {
  overall: "Good Standing",
  color: colors.secondary,
  issues: [
    {
      type: "Warning",
      message: "Medical certificate expires in 30 days",
      color: colors.warning,
      dueDate: "2025-06-15",
    },
  ],
};

export const upcomingLoads: Load[] = [
  {
    id: "L-78945",
    pickup: {
      location: "Atlanta, GA",
      time: "2025-07-16 08:00 AM",
    },
    delivery: {
      location: "Nashville, TN",
      time: "2025-07-16 04:00 PM",
    },
    broker: "Premium Freight Inc.",
    rate: "$2.35/mile",
    miles: 248,
    totalPay: "$582.80",
    status: "Confirmed" as LoadStatus,
  },
  {
    id: "L-78946",
    pickup: {
      location: "Nashville, TN",
      time: "2025-07-17 09:00 AM",
    },
    delivery: {
      location: "St. Louis, MO",
      time: "2025-07-17 06:00 PM",
    },
    broker: "Midwest Logistics",
    rate: "$2.42/mile",
    miles: 309,
    totalPay: "$747.78",
    status: "Pending" as LoadStatus,
  },
];

export const recentReceipts = [
  {
    id: "R-12345",
    type: "Fuel",
    vendor: "Love's Travel Stop",
    location: "Atlanta, GA",
    date: "2025-07-14",
    amount: 187.45,
    gallons: 56.8,
    pricePerGallon: 3.29,
    state: "GA",
    category: "Fuel",
  },
  {
    id: "R-12346",
    type: "Toll",
    vendor: "Florida Turnpike",
    location: "Orlando, FL",
    date: "2025-07-12",
    amount: 23.75,
    category: "Tolls",
  },
  {
    id: "R-12347",
    type: "Maintenance",
    vendor: "Truck Care Center",
    location: "Macon, GA",
    date: "2025-07-10",
    amount: 149.99,
    service: "Oil Change & Inspection",
    category: "Maintenance",
  },
];

export const weeklyStats = {
  drivingHours: 42.5,
  milesLogged: 2345,
  fuelExpenses: 756.23,
  revenue: 5842.50,
  violations: 0,
};

export const mockVoiceCommands = [
  {
    command: "Start my shift",
    action: "Begins driving time tracking",
  },
  {
    command: "End my shift",
    action: "Ends driving time tracking",
  },
  {
    command: "Start break",
    action: "Begins 30-minute break period",
  },
  {
    command: "End break",
    action: "Ends break period",
  },
  {
    command: "Log fuel stop",
    action: "Records fuel purchase location and time",
  },
  {
    command: "Log inspection",
    action: "Records inspection location and time",
  },
  {
    command: "Current status",
    action: "Reports current duty status and remaining hours",
  },
  {
    command: "Next load details",
    action: "Provides information about upcoming load",
  },
];

export const mockReceipts: Receipt[] = [
  {
    id: "R-12345",
    type: "Fuel" as ReceiptType,
    vendor: "Love's Travel Stop",
    location: "Atlanta, GA",
    date: "2025-07-14",
    amount: 187.45,
    gallons: 56.8,
    pricePerGallon: 3.29,
    state: "GA",
    category: "Fuel",
    imageUrl: "https://images.unsplash.com/photo-1622644989151-33a3ced5ec8a?q=80&w=1000",
  },
  {
    id: "R-12346",
    type: "Toll" as ReceiptType,
    vendor: "Florida Turnpike",
    location: "Orlando, FL",
    date: "2025-07-12",
    amount: 23.75,
    category: "Tolls",
    imageUrl: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?q=80&w=1000",
  },
  {
    id: "R-12347",
    type: "Maintenance" as ReceiptType,
    vendor: "Truck Care Center",
    location: "Macon, GA",
    date: "2025-07-10",
    amount: 149.99,
    service: "Oil Change & Inspection",
    category: "Maintenance",
    imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1000",
  },
  {
    id: "R-12348",
    type: "Fuel" as ReceiptType,
    vendor: "Pilot Flying J",
    location: "Chattanooga, TN",
    date: "2025-07-08",
    amount: 201.34,
    gallons: 62.1,
    pricePerGallon: 3.24,
    state: "TN",
    category: "Fuel",
    imageUrl: "https://images.unsplash.com/photo-1545459720-aac8509eb149?q=80&w=1000",
  },
  {
    id: "R-12349",
    type: "Toll" as ReceiptType,
    vendor: "Pennsylvania Turnpike",
    location: "Harrisburg, PA",
    date: "2025-07-05",
    amount: 45.50,
    category: "Tolls",
    imageUrl: "https://images.unsplash.com/photo-1621953945477-31686523c3c5?q=80&w=1000",
  },
];

export const mockComplianceRules = {
  hoursOfService: {
    drivingLimit: 11, // hours
    dutyLimit: 14, // hours
    restRequired: 10, // hours
    weeklyLimit: 70, // hours in 8 days
    breakRequired: {
      after: 8, // hours
      duration: 0.5, // hours (30 minutes)
    },
  },
  inspections: {
    preTrip: {
      required: true,
      frequency: "daily",
    },
    postTrip: {
      required: true,
      frequency: "daily",
    },
    annual: {
      required: true,
      nextDue: "2025-09-15",
    },
  },
  documents: {
    cdl: {
      required: true,
      expiration: "2025-12-31",
    },
    medicalCard: {
      required: true,
      expiration: "2025-06-15",
    },
    insurancePolicy: {
      required: true,
      expiration: "2026-01-15",
    },
  },
};

export const mockRoutes = [
  {
    id: "RT-1001",
    origin: "Atlanta, GA",
    destination: "Nashville, TN",
    distance: 248,
    estimatedTime: "4h 15m",
    trafficConditions: "Light",
    weatherConditions: "Clear",
    weighStations: [
      {
        location: "I-75 North, Mile 338",
        status: "Open",
        bypass: true,
      },
    ],
    restAreas: [
      {
        name: "Chattanooga Travel Plaza",
        location: "I-75 North, Mile 385",
        amenities: ["Fuel", "Food", "Restrooms", "Parking"],
        distance: 125,
      },
    ],
  },
  {
    id: "RT-1002",
    origin: "Nashville, TN",
    destination: "St. Louis, MO",
    distance: 309,
    estimatedTime: "5h 30m",
    trafficConditions: "Moderate",
    weatherConditions: "Rain",
    weighStations: [
      {
        location: "I-24 West, Mile 89",
        status: "Closed",
        bypass: false,
      },
    ],
    restAreas: [
      {
        name: "Paducah Truck Stop",
        location: "I-24 West, Mile 45",
        amenities: ["Fuel", "Food", "Restrooms", "Parking", "Shower"],
        distance: 178,
      },
    ],
  },
];

export const mockMaintenanceItems = [
  {
    id: "M-1001",
    type: "Oil Change",
    lastPerformed: "2025-06-15",
    mileage: 245780,
    nextDue: "2025-07-15",
    nextDueMileage: 255780,
    status: "Upcoming",
    notes: "Use synthetic oil 15W-40",
  },
  {
    id: "M-1002",
    type: "Tire Rotation",
    lastPerformed: "2025-06-01",
    mileage: 243500,
    nextDue: "2025-08-01",
    nextDueMileage: 258500,
    status: "Good",
    notes: "Check tire pressure and tread depth",
  },
  {
    id: "M-1003",
    type: "Brake Inspection",
    lastPerformed: "2025-05-10",
    mileage: 240000,
    nextDue: "2025-07-10",
    nextDueMileage: 255000,
    status: "Due Soon",
    notes: "Front pads at 40% remaining",
  },
];

export const preTripInspectionItems = [
  {
    category: "Engine Compartment",
    items: [
      { id: "engine_oil", label: "Engine Oil Level", required: true },
      { id: "coolant", label: "Coolant Level", required: true },
      { id: "power_steering", label: "Power Steering Fluid", required: true },
      { id: "windshield_washer", label: "Windshield Washer Fluid", required: true },
      { id: "battery", label: "Battery & Connections", required: true },
      { id: "belts_hoses", label: "Belts & Hoses", required: true },
    ],
  },
  {
    category: "Air Brake System",
    items: [
      { id: "air_compressor", label: "Air Compressor", required: true },
      { id: "air_lines", label: "Air Lines & Fittings", required: true },
      { id: "brake_chambers", label: "Brake Chambers", required: true },
      { id: "slack_adjusters", label: "Slack Adjusters", required: true },
      { id: "brake_drums", label: "Brake Drums/Rotors", required: true },
    ],
  },
  {
    category: "Steering System",
    items: [
      { id: "steering_wheel", label: "Steering Wheel Play", required: true },
      { id: "steering_linkage", label: "Steering Linkage", required: true },
      { id: "power_steering_pump", label: "Power Steering Pump", required: true },
    ],
  },
  {
    category: "Suspension System",
    items: [
      { id: "leaf_springs", label: "Leaf Springs", required: true },
      { id: "shock_absorbers", label: "Shock Absorbers", required: true },
      { id: "u_bolts", label: "U-Bolts", required: true },
    ],
  },
  {
    category: "Tires & Wheels",
    items: [
      { id: "tire_condition", label: "Tire Condition & Tread", required: true },
      { id: "tire_pressure", label: "Tire Pressure", required: true },
      { id: "wheel_rims", label: "Wheel Rims", required: true },
      { id: "lug_nuts", label: "Lug Nuts", required: true },
    ],
  },
  {
    category: "Lights & Electrical",
    items: [
      { id: "headlights", label: "Headlights", required: true },
      { id: "tail_lights", label: "Tail Lights", required: true },
      { id: "brake_lights", label: "Brake Lights", required: true },
      { id: "turn_signals", label: "Turn Signals", required: true },
      { id: "hazard_lights", label: "Hazard Lights", required: true },
      { id: "clearance_lights", label: "Clearance Lights", required: true },
    ],
  },
  {
    category: "Cab & Controls",
    items: [
      { id: "mirrors", label: "Mirrors", required: true },
      { id: "windshield", label: "Windshield", required: true },
      { id: "wipers", label: "Windshield Wipers", required: true },
      { id: "horn", label: "Horn", required: true },
      { id: "seatbelt", label: "Seatbelt", required: true },
      { id: "gauges", label: "Gauges & Warning Lights", required: true },
    ],
  },
  {
    category: "Coupling System",
    items: [
      { id: "fifth_wheel", label: "Fifth Wheel", required: true },
      { id: "kingpin", label: "Kingpin", required: true },
      { id: "air_lines_glad", label: "Air Lines (Glad Hands)", required: true },
      { id: "electrical_cord", label: "Electrical Cord", required: true },
    ],
  },
];