import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateTestCredentials } from '@/constants/testCredentials';

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleId?: string;
  fleetId: string;
  status: 'active' | 'inactive' | 'on-trip' | 'off-duty';
  avatar?: string;
  joinedDate: string;
}

export interface Trip {
  id: string;
  driverId: string;
  startLocation: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  destination: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  startTime?: string;
  endTime?: string;
  distance?: number;
  estimatedDuration?: number;
  actualDuration?: number;
  stops?: {
    id: string;
    address: string;
    coordinates: { lat: number; lng: number };
    completed: boolean;
    completedAt?: string;
  }[];
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  fuelLevel: number;
  mileage: number;
  lastService: string;
  nextService: string;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  maintenanceAlerts: {
    id: string;
    type: 'warning' | 'critical';
    message: string;
    dueDate?: string;
  }[];
}

export interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'text' | 'image' | 'location';
  attachments?: {
    id: string;
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
}

interface DriverState {
  // Authentication
  isAuthenticated: boolean;
  driver: Driver | null;
  
  // Trip Management
  currentTrip: Trip | null;
  tripHistory: Trip[];
  
  // Vehicle
  assignedVehicle: Vehicle | null;
  
  // Messages
  messages: Message[];
  unreadCount: number;
  
  // Today's Summary
  todayStats: {
    tripsCompleted: number;
    hoursWorked: number;
    idleTime: number;
    distanceTraveled: number;
  };
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  socialLogin: (socialData: { provider: 'google' | 'apple'; email: string; name: string; id: string; photo?: string }) => Promise<void>;
  logout: () => void;
  updateDriverProfile: (updates: Partial<Driver>) => void;
  
  // Trip Actions
  startTrip: (trip: Trip) => void;
  pauseTrip: () => void;
  resumeTrip: () => void;
  completeTrip: () => void;
  updateTripLocation: (coordinates: { lat: number; lng: number }) => void;
  
  // Vehicle Actions
  updateVehicleStatus: (status: Vehicle['status']) => void;
  reportIssue: (issue: { type: string; description: string; priority: 'low' | 'medium' | 'high'; photos?: string[] }) => void;
  
  // Message Actions
  sendMessage: (content: string, to: string, attachments?: Message['attachments']) => void;
  markMessageAsRead: (messageId: string) => void;
  
  // Stats Actions
  updateTodayStats: (stats: Partial<DriverState['todayStats']>) => void;
}

export const useDriverStore = create<DriverState>()(
  persist(
    (set, get) => ({
      // Initial State
      isAuthenticated: false,
      driver: null,
      currentTrip: null,
      tripHistory: [],
      assignedVehicle: null,
      messages: [],
      unreadCount: 0,
      todayStats: {
        tripsCompleted: 0,
        hoursWorked: 0,
        idleTime: 0,
        distanceTraveled: 0,
      },
      
      // Authentication Actions
      login: async (email: string, password: string) => {
        // Validate credentials against test data
        const credential = validateTestCredentials(email, password);
        
        if (!credential) {
          throw new Error('Invalid credentials');
        }
        
        // Only allow driver role to login to driver portal
        if (credential.role !== 'driver') {
          throw new Error('Access denied. Driver credentials required.');
        }
        
        // Create driver profile based on test credential
        const mockDriver: Driver = {
          id: credential.email.split('@')[0], // Use email prefix as ID
          name: credential.name,
          email: credential.email,
          phone: '+1 (555) 123-4567',
          licenseNumber: `CDL${Math.random().toString().substr(2, 9)}`,
          vehicleId: `vehicle-${credential.email.split('@')[0]}`,
          fleetId: credential.fleetId,
          status: 'active',
          joinedDate: '2023-01-15',
        };
        
        // Create vehicle based on assigned vehicle from credential
        const vehicleInfo = credential.vehicleAssigned?.split(' ') || ['Unknown', 'Vehicle'];
        const mockVehicle: Vehicle = {
          id: `vehicle-${credential.email.split('@')[0]}`,
          make: vehicleInfo[0] || 'Freightliner',
          model: vehicleInfo[1] || 'Cascadia',
          year: parseInt(vehicleInfo[2]) || 2022,
          licensePlate: `${credential.name.split(' ').map(n => n[0]).join('')}-${Math.floor(Math.random() * 999)}`,
          vin: `1FUJGHDV8NL${Math.random().toString().substr(2, 6)}`,
          fuelLevel: Math.floor(Math.random() * 40) + 60, // 60-100%
          mileage: Math.floor(Math.random() * 50000) + 100000,
          lastService: '2024-01-15',
          nextService: '2024-04-15',
          status: 'available',
          maintenanceAlerts: [
            {
              id: '1',
              type: 'warning',
              message: 'Oil change due in 500 miles',
              dueDate: '2024-02-15',
            },
          ],
        };
        
        // Generate some sample messages
        const sampleMessages: Message[] = [
          {
            id: '1',
            from: 'dispatcher',
            to: mockDriver.id,
            content: 'Your next pickup is scheduled for 2:00 PM at Warehouse District.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            read: false,
            priority: 'medium',
            type: 'text',
          },
          {
            id: '2',
            from: 'fleet-manager',
            to: mockDriver.id,
            content: 'Great job on maintaining your safety record this month!',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            read: true,
            priority: 'low',
            type: 'text',
          },
        ];
        
        set({
          isAuthenticated: true,
          driver: mockDriver,
          assignedVehicle: mockVehicle,
          messages: sampleMessages,
          unreadCount: sampleMessages.filter(m => !m.read).length,
          todayStats: {
            tripsCompleted: Math.floor(Math.random() * 5) + 1,
            hoursWorked: Math.floor(Math.random() * 4) + 6,
            idleTime: Math.floor(Math.random() * 30) + 15,
            distanceTraveled: Math.floor(Math.random() * 200) + 150,
          },
        });
      },
      
      socialLogin: async (socialData: { provider: 'google' | 'apple'; email: string; name: string; id: string; photo?: string }) => {
        // For social login, we'll create a mock driver profile
        // In a real app, you'd validate the social login with your backend
        
        const mockDriver: Driver = {
          id: socialData.id,
          name: socialData.name,
          email: socialData.email,
          phone: '+1 (555) 123-4567',
          licenseNumber: `CDL${Math.random().toString().substr(2, 9)}`,
          vehicleId: `vehicle-${socialData.id}`,
          fleetId: 'social-fleet-001', // Default fleet for social logins
          status: 'active',
          avatar: socialData.photo,
          joinedDate: '2023-01-15',
        };
        
        // Create a mock vehicle
        const mockVehicle: Vehicle = {
          id: `vehicle-${socialData.id}`,
          make: 'Freightliner',
          model: 'Cascadia',
          year: 2022,
          licensePlate: `${socialData.name.split(' ').map(n => n[0]).join('')}-${Math.floor(Math.random() * 999)}`,
          vin: `1FUJGHDV8NL${Math.random().toString().substr(2, 6)}`,
          fuelLevel: Math.floor(Math.random() * 40) + 60, // 60-100%
          mileage: Math.floor(Math.random() * 50000) + 100000,
          lastService: '2024-01-15',
          nextService: '2024-04-15',
          status: 'available',
          maintenanceAlerts: [
            {
              id: '1',
              type: 'warning',
              message: 'Oil change due in 500 miles',
              dueDate: '2024-02-15',
            },
          ],
        };
        
        // Generate some sample messages
        const sampleMessages: Message[] = [
          {
            id: '1',
            from: 'dispatcher',
            to: mockDriver.id,
            content: `Welcome ${mockDriver.name}! Your vehicle assignment is ready.`,
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            read: false,
            priority: 'medium',
            type: 'text',
          },
          {
            id: '2',
            from: 'fleet-manager',
            to: mockDriver.id,
            content: 'Please complete your profile setup when you have a moment.',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            read: false,
            priority: 'low',
            type: 'text',
          },
        ];
        
        set({
          isAuthenticated: true,
          driver: mockDriver,
          assignedVehicle: mockVehicle,
          messages: sampleMessages,
          unreadCount: sampleMessages.filter(m => !m.read).length,
          todayStats: {
            tripsCompleted: Math.floor(Math.random() * 3) + 1,
            hoursWorked: Math.floor(Math.random() * 4) + 4,
            idleTime: Math.floor(Math.random() * 20) + 10,
            distanceTraveled: Math.floor(Math.random() * 150) + 100,
          },
        });
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          driver: null,
          currentTrip: null,
          assignedVehicle: null,
          messages: [],
          unreadCount: 0,
          todayStats: {
            tripsCompleted: 0,
            hoursWorked: 0,
            idleTime: 0,
            distanceTraveled: 0,
          },
        });
      },
      
      updateDriverProfile: (updates: Partial<Driver>) => {
        const { driver } = get();
        if (driver) {
          set({ driver: { ...driver, ...updates } });
        }
      },
      
      // Trip Actions
      startTrip: (trip: Trip) => {
        set({
          currentTrip: {
            ...trip,
            status: 'in-progress',
            startTime: new Date().toISOString(),
          },
        });
      },
      
      pauseTrip: () => {
        const { currentTrip } = get();
        if (currentTrip) {
          set({
            currentTrip: {
              ...currentTrip,
              status: 'pending',
            },
          });
        }
      },
      
      resumeTrip: () => {
        const { currentTrip } = get();
        if (currentTrip) {
          set({
            currentTrip: {
              ...currentTrip,
              status: 'in-progress',
            },
          });
        }
      },
      
      completeTrip: () => {
        const { currentTrip, tripHistory, todayStats } = get();
        if (currentTrip) {
          const completedTrip = {
            ...currentTrip,
            status: 'completed' as const,
            endTime: new Date().toISOString(),
          };
          
          set({
            currentTrip: null,
            tripHistory: [completedTrip, ...tripHistory],
            todayStats: {
              ...todayStats,
              tripsCompleted: todayStats.tripsCompleted + 1,
            },
          });
        }
      },
      
      updateTripLocation: (coordinates: { lat: number; lng: number }) => {
        const { currentTrip } = get();
        if (currentTrip) {
          // Update current location logic here
          console.log('Location updated:', coordinates);
        }
      },
      
      // Vehicle Actions
      updateVehicleStatus: (status: Vehicle['status']) => {
        const { assignedVehicle } = get();
        if (assignedVehicle) {
          set({
            assignedVehicle: {
              ...assignedVehicle,
              status,
            },
          });
        }
      },
      
      reportIssue: (issue: { type: string; description: string; priority: 'low' | 'medium' | 'high'; photos?: string[] }) => {
        // Mock issue reporting - replace with actual API call
        console.log('Issue reported:', issue);
        
        // Add to maintenance alerts
        const { assignedVehicle } = get();
        if (assignedVehicle) {
          const newAlert = {
            id: Date.now().toString(),
            type: issue.priority === 'high' ? 'critical' as const : 'warning' as const,
            message: `${issue.type}: ${issue.description}`,
          };
          
          set({
            assignedVehicle: {
              ...assignedVehicle,
              maintenanceAlerts: [...assignedVehicle.maintenanceAlerts, newAlert],
            },
          });
        }
      },
      
      // Message Actions
      sendMessage: (content: string, to: string, attachments?: Message['attachments']) => {
        const { driver, messages } = get();
        if (driver) {
          const newMessage: Message = {
            id: Date.now().toString(),
            from: driver.id,
            to,
            content,
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'medium',
            type: 'text',
            attachments,
          };
          
          set({ messages: [newMessage, ...messages] });
        }
      },
      
      markMessageAsRead: (messageId: string) => {
        const { messages, unreadCount } = get();
        const updatedMessages = messages.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        );
        
        set({
          messages: updatedMessages,
          unreadCount: Math.max(0, unreadCount - 1),
        });
      },
      
      // Stats Actions
      updateTodayStats: (stats: Partial<DriverState['todayStats']>) => {
        const { todayStats } = get();
        set({
          todayStats: { ...todayStats, ...stats },
        });
      },
    }),
    {
      name: 'driver-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        driver: state.driver,
        assignedVehicle: state.assignedVehicle,
        todayStats: state.todayStats,
      }),
    }
  )
);