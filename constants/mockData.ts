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

// CDL 21-Point Pre-Trip Inspection Checklist
// Based on FMCSA requirements for commercial vehicle safety
export const preTripInspectionItems = [
  {
    category: "1. Engine Compartment",
    items: [
      { id: "engine_oil", label: "Engine Oil Level & Condition", required: true },
      { id: "coolant", label: "Coolant Level & Condition", required: true },
      { id: "power_steering", label: "Power Steering Fluid", required: true },
    ],
  },
  {
    category: "2. Air Brake System",
    items: [
      { id: "air_compressor", label: "Air Compressor Belt & Mounting", required: true },
      { id: "air_lines", label: "Air Lines & Fittings", required: true },
      { id: "brake_chambers", label: "Brake Chambers & Push Rods", required: true },
      { id: "slack_adjusters", label: "Slack Adjusters", required: true },
    ],
  },
  {
    category: "3. Steering System",
    items: [
      { id: "steering_wheel", label: "Steering Wheel Free Play (Max 2 inches)", required: true },
      { id: "steering_linkage", label: "Steering Linkage & Joints", required: true },
    ],
  },
  {
    category: "4. Suspension System",
    items: [
      { id: "leaf_springs", label: "Leaf Springs & Mounting", required: true },
      { id: "shock_absorbers", label: "Shock Absorbers", required: true },
      { id: "u_bolts", label: "U-Bolts & Spring Hangers", required: true },
    ],
  },
  {
    category: "5. Exhaust System",
    items: [
      { id: "exhaust_pipes", label: "Exhaust Pipes & Muffler", required: true },
      { id: "exhaust_mounting", label: "Exhaust System Mounting", required: true },
    ],
  },
  {
    category: "6. Frame & Body",
    items: [
      { id: "frame_rails", label: "Frame Rails & Cross Members", required: true },
      { id: "body_damage", label: "Body Damage & Doors", required: true },
    ],
  },
  {
    category: "7. Tires & Wheels",
    items: [
      { id: "tire_condition", label: "Tire Condition & Tread Depth (4/32\" min)", required: true },
      { id: "tire_pressure", label: "Tire Pressure & Sidewall Damage", required: true },
      { id: "wheel_rims", label: "Wheel Rims & Lug Nuts", required: true },
    ],
  },
  {
    category: "8. Lights & Reflectors",
    items: [
      { id: "headlights", label: "Headlights (High & Low Beam)", required: true },
      { id: "tail_lights", label: "Tail Lights & Marker Lights", required: true },
      { id: "brake_lights", label: "Brake Lights", required: true },
      { id: "turn_signals", label: "Turn Signals & Hazard Lights", required: true },
      { id: "clearance_lights", label: "Clearance & Identification Lights", required: true },
      { id: "reflectors", label: "Reflectors & Reflective Tape", required: true },
    ],
  },
  {
    category: "9. Windshield & Mirrors",
    items: [
      { id: "windshield", label: "Windshield Condition & Visibility", required: true },
      { id: "mirrors", label: "Mirrors (Left, Right, Convex)", required: true },
      { id: "wipers", label: "Windshield Wipers & Washers", required: true },
    ],
  },
  {
    category: "10. Horn & Warning Devices",
    items: [
      { id: "horn", label: "Horn Operation", required: true },
      { id: "warning_devices", label: "Emergency Warning Devices (3 required)", required: true },
    ],
  },
  {
    category: "11. Fuel System",
    items: [
      { id: "fuel_tanks", label: "Fuel Tanks & Mounting", required: true },
      { id: "fuel_lines", label: "Fuel Lines & Connections", required: true },
      { id: "fuel_cap", label: "Fuel Tank Cap & Venting", required: true },
    ],
  },
  {
    category: "12. Coupling Devices",
    items: [
      { id: "fifth_wheel", label: "Fifth Wheel Mounting & Locking", required: true },
      { id: "kingpin", label: "Kingpin & Upper Coupler", required: true },
      { id: "air_lines_glad", label: "Air Lines & Glad Hands", required: true },
      { id: "electrical_cord", label: "Electrical Cord & Plug", required: true },
    ],
  },
  {
    category: "13. Cargo Securement",
    items: [
      { id: "tie_downs", label: "Tie-Downs & Securing Devices", required: true },
      { id: "cargo_doors", label: "Cargo Doors & Latches", required: true },
      { id: "load_distribution", label: "Load Distribution & Weight", required: true },
    ],
  },
  {
    category: "14. Driver Controls",
    items: [
      { id: "clutch_pedal", label: "Clutch Pedal Free Play", required: true },
      { id: "brake_pedal", label: "Brake Pedal Travel & Feel", required: true },
      { id: "parking_brake", label: "Parking Brake Operation", required: true },
      { id: "gauges", label: "Gauges & Warning Lights", required: true },
    ],
  },
  {
    category: "15. Safety Equipment",
    items: [
      { id: "seatbelt", label: "Seatbelt & Mounting", required: true },
      { id: "fire_extinguisher", label: "Fire Extinguisher", required: true },
      { id: "first_aid_kit", label: "First Aid Kit", required: true },
    ],
  },
];