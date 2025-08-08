export interface TestCredential {
  email: string;
  password: string;
  role: 'driver' | 'dispatcher' | 'fleet_manager';
  name: string;
  description: string;
  vehicleAssigned?: string;
  fleetId: string;
}

export const TEST_CREDENTIALS: TestCredential[] = [
  // Driver Accounts
  {
    email: 'john.driver@fleet.com',
    password: 'driver123',
    role: 'driver',
    name: 'John Smith',
    description: 'Long-haul driver with 5+ years experience',
    vehicleAssigned: 'Freightliner Cascadia 2022',
    fleetId: 'fleet-001',
  },
  {
    email: 'sarah.driver@fleet.com',
    password: 'driver123',
    role: 'driver',
    name: 'Sarah Johnson',
    description: 'Local delivery driver, excellent safety record',
    vehicleAssigned: 'Ford Transit 2023',
    fleetId: 'fleet-001',
  },
  {
    email: 'mike.driver@fleet.com',
    password: 'driver123',
    role: 'driver',
    name: 'Mike Rodriguez',
    description: 'Regional driver specializing in refrigerated transport',
    vehicleAssigned: 'Volvo VNL 2021',
    fleetId: 'fleet-001',
  },
  {
    email: 'lisa.driver@fleet.com',
    password: 'driver123',
    role: 'driver',
    name: 'Lisa Chen',
    description: 'New driver in training program',
    vehicleAssigned: 'Peterbilt 579 2020',
    fleetId: 'fleet-001',
  },
  
  // Dispatcher Accounts
  {
    email: 'dispatch@fleet.com',
    password: 'dispatch123',
    role: 'dispatcher',
    name: 'Robert Wilson',
    description: 'Senior dispatcher managing 20+ drivers',
    fleetId: 'fleet-001',
  },
  {
    email: 'dispatch2@fleet.com',
    password: 'dispatch123',
    role: 'dispatcher',
    name: 'Amanda Davis',
    description: 'Night shift dispatcher',
    fleetId: 'fleet-001',
  },
  
  // Fleet Manager Accounts
  {
    email: 'manager@fleet.com',
    password: 'manager123',
    role: 'fleet_manager',
    name: 'David Thompson',
    description: 'Fleet operations manager',
    fleetId: 'fleet-001',
  },
  {
    email: 'admin@fleet.com',
    password: 'admin123',
    role: 'fleet_manager',
    name: 'Jennifer Martinez',
    description: 'Fleet administrator with full access',
    fleetId: 'fleet-001',
  },
];

// Quick access credentials for development
export const QUICK_LOGIN = {
  DRIVER: {
    email: 'john.driver@fleet.com',
    password: 'driver123',
  },
  DISPATCHER: {
    email: 'dispatch@fleet.com',
    password: 'dispatch123',
  },
  FLEET_MANAGER: {
    email: 'manager@fleet.com',
    password: 'manager123',
  },
};

// Fleet Management Test Credentials Summary
export const FLEET_TEST_SUMMARY = {
  description: 'Test credentials for Fleet Management System',
  drivers: [
    { email: 'john.driver@fleet.com', password: 'driver123', name: 'John Smith' },
    { email: 'sarah.driver@fleet.com', password: 'driver123', name: 'Sarah Johnson' },
    { email: 'mike.driver@fleet.com', password: 'driver123', name: 'Mike Rodriguez' },
    { email: 'lisa.driver@fleet.com', password: 'driver123', name: 'Lisa Chen' },
  ],
  dispatchers: [
    { email: 'dispatch@fleet.com', password: 'dispatch123', name: 'Robert Wilson' },
    { email: 'dispatch2@fleet.com', password: 'dispatch123', name: 'Amanda Davis' },
  ],
  managers: [
    { email: 'manager@fleet.com', password: 'manager123', name: 'David Thompson' },
    { email: 'admin@fleet.com', password: 'admin123', name: 'Jennifer Martinez' },
  ],
  socialLogin: {
    google: 'Mock Google Sign-In available for all roles',
    apple: 'Mock Apple Sign-In available for all roles (iOS simulation on other platforms)',
  },
  notes: [
    'All passwords are simple for testing purposes',
    'Social login creates mock accounts automatically',
    'Driver portal accessible at /driver-login',
    'Fleet management accessible through main app flow',
  ],
};

// Helper function to get test credential by email
export const getTestCredential = (email: string): TestCredential | undefined => {
  return TEST_CREDENTIALS.find(cred => cred.email === email);
};

// Helper function to validate test credentials
export const validateTestCredentials = (email: string, password: string): TestCredential | null => {
  const credential = TEST_CREDENTIALS.find(
    cred => cred.email === email && cred.password === password
  );
  return credential || null;
};