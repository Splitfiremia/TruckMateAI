import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DutyStatus, TripOverrideLog, ViolationOverride } from '@/types';

interface StatusChangeLog {
  id: string;
  timestamp: string;
  fromStatus: DutyStatus;
  toStatus: DutyStatus;
  location: string;
  tripId?: string;
  reason?: string;
}

interface BreakLog {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in hours
  location: string;
  tripId?: string;
  type: '30-minute' | 'off-duty' | 'sleeper-berth';
}

interface LogbookState {
  currentStatus: DutyStatus;
  statusStartTime: string;
  drivingHoursToday: number;
  drivingHoursWeek: number;
  breakTime: number;
  isOnBreak: boolean;
  breakStartTime: string | null;
  lastLocation: string;
  violations: number;
  currentTripId: string | null;
  tripOverrideLogs: TripOverrideLog[];
  statusChangeLogs: StatusChangeLog[];
  breakLogs: BreakLog[];
  
  // Actions
  changeStatus: (status: DutyStatus, canStartDriving?: boolean) => boolean;
  startBreak: () => void;
  endBreak: () => void;
  updateLocation: (location: string) => void;
  resetDailyHours: () => void;
  addDrivingTime: (hours: number) => void;
  startTrip: () => string;
  endTrip: () => void;
  logViolationOverride: (override: ViolationOverride, violationType: string, riskLevel: 'Low' | 'Medium' | 'High' | 'Critical', estimatedFine?: number) => void;
  getTripOverrides: (tripId: string) => TripOverrideLog[];
  getWeeklyOverrideCount: () => number;
  getStatusChangeLogs: (days?: number) => StatusChangeLog[];
  getBreakLogs: (days?: number) => BreakLog[];
  getTotalDrivingTime: (days?: number) => number;
  getTotalOnDutyTime: (days?: number) => number;
}

export const useLogbookStore = create<LogbookState>()(
  persist(
    (set, get) => ({
      currentStatus: 'Off Duty',
      statusStartTime: new Date().toISOString(),
      drivingHoursToday: 0,
      drivingHoursWeek: 42.5,
      breakTime: 0,
      isOnBreak: false,
      breakStartTime: null,
      lastLocation: 'Atlanta, GA',
      violations: 0,
      currentTripId: null,
      tripOverrideLogs: [],
      statusChangeLogs: [],
      breakLogs: [],
      
      changeStatus: (status, canStartDriving = true) => {
        const state = get();
        
        // Prevent driving if inspection not completed
        if (status === 'Driving' && !canStartDriving) {
          return false;
        }
        
        // Log the status change
        const statusChangeLog: StatusChangeLog = {
          id: `status-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          fromStatus: state.currentStatus,
          toStatus: status,
          location: state.lastLocation,
          tripId: state.currentTripId || undefined
        };
        
        set(state => ({
          currentStatus: status,
          statusStartTime: new Date().toISOString(),
          isOnBreak: status === 'Off Duty' || status === 'Sleeper Berth',
          statusChangeLogs: [statusChangeLog, ...state.statusChangeLogs]
        }));
        
        return true;
      },
      
      startBreak: () => {
        const state = get();
        const breakLog: BreakLog = {
          id: `break-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          startTime: new Date().toISOString(),
          location: state.lastLocation,
          tripId: state.currentTripId || undefined,
          type: '30-minute'
        };
        
        set(state => ({
          isOnBreak: true,
          breakStartTime: new Date().toISOString(),
          currentStatus: 'Off Duty',
          breakLogs: [breakLog, ...state.breakLogs]
        }));
      },
      
      endBreak: () => set((state) => {
        const breakStartTime = state.breakStartTime ? new Date(state.breakStartTime) : new Date();
        const now = new Date();
        const breakDuration = (now.getTime() - breakStartTime.getTime()) / (1000 * 60 * 60); // in hours
        
        // Update the most recent break log with end time and duration
        const updatedBreakLogs = state.breakLogs.map((log, index) => {
          if (index === 0 && !log.endTime) {
            return {
              ...log,
              endTime: now.toISOString(),
              duration: breakDuration
            };
          }
          return log;
        });
        
        return {
          isOnBreak: false,
          breakStartTime: null,
          breakTime: state.breakTime + breakDuration,
          currentStatus: 'On Duty Not Driving',
          breakLogs: updatedBreakLogs
        };
      }),
      
      updateLocation: (location) => set({ lastLocation: location }),
      
      resetDailyHours: () => set({ drivingHoursToday: 0 }),
      
      addDrivingTime: (hours) => set((state) => ({
        drivingHoursToday: state.drivingHoursToday + hours,
        drivingHoursWeek: state.drivingHoursWeek + hours,
      })),
      
      startTrip: () => {
        const tripId = `trip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        set({ currentTripId: tripId });
        return tripId;
      },
      
      endTrip: () => set({ currentTripId: null }),
      
      logViolationOverride: (override, violationType, riskLevel, estimatedFine) => {
        const state = get();
        const tripOverrideLog: TripOverrideLog = {
          id: `override-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          tripId: state.currentTripId || 'no-trip',
          timestamp: override.timestamp,
          violationType,
          reason: override.reason,
          driverId: override.driverId,
          location: state.lastLocation,
          riskLevel,
          estimatedFine,
          supervisorApproval: override.supervisorApproval
        };
        
        set(state => ({
          tripOverrideLogs: [tripOverrideLog, ...state.tripOverrideLogs]
        }));
      },
      
      getTripOverrides: (tripId) => {
        const state = get();
        return state.tripOverrideLogs.filter(log => log.tripId === tripId);
      },
      
      getWeeklyOverrideCount: () => {
        const state = get();
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return state.tripOverrideLogs.filter(log => 
          new Date(log.timestamp) >= oneWeekAgo
        ).length;
      },
      
      getStatusChangeLogs: (days = 7) => {
        const state = get();
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        return state.statusChangeLogs.filter(log => 
          new Date(log.timestamp) >= cutoffDate
        );
      },
      
      getBreakLogs: (days = 7) => {
        const state = get();
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        return state.breakLogs.filter(log => 
          new Date(log.startTime) >= cutoffDate
        );
      },
      
      getTotalDrivingTime: (days = 1) => {
        const state = get();
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const drivingLogs = state.statusChangeLogs.filter(log => 
          log.toStatus === 'Driving' && new Date(log.timestamp) >= cutoffDate
        );
        
        // This is a simplified calculation - in a real app you'd track actual driving time
        return drivingLogs.length * 2; // Assume 2 hours per driving session on average
      },
      
      getTotalOnDutyTime: (days = 1) => {
        const state = get();
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const onDutyLogs = state.statusChangeLogs.filter(log => 
          (log.toStatus === 'Driving' || log.toStatus === 'On Duty Not Driving') && 
          new Date(log.timestamp) >= cutoffDate
        );
        
        // This is a simplified calculation - in a real app you'd track actual on-duty time
        return onDutyLogs.length * 3; // Assume 3 hours per on-duty session on average
      },
    }),
    {
      name: 'logbook-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentStatus: state.currentStatus,
        statusStartTime: state.statusStartTime,
        drivingHoursToday: state.drivingHoursToday,
        drivingHoursWeek: state.drivingHoursWeek,
        breakTime: state.breakTime,
        isOnBreak: state.isOnBreak,
        breakStartTime: state.breakStartTime,
        lastLocation: state.lastLocation,
        violations: state.violations,
        currentTripId: state.currentTripId,
        tripOverrideLogs: state.tripOverrideLogs,
        statusChangeLogs: state.statusChangeLogs,
        breakLogs: state.breakLogs
      })
    }
  )
);