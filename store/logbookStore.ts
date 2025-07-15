import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DutyStatus, TripOverrideLog, ViolationOverride } from '@/types';

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
      
      changeStatus: (status, canStartDriving = true) => {
        // Prevent driving if inspection not completed
        if (status === 'Driving' && !canStartDriving) {
          return false;
        }
        
        set({
          currentStatus: status,
          statusStartTime: new Date().toISOString(),
          isOnBreak: status === 'Off Duty' || status === 'Sleeper Berth',
        });
        
        return true;
      },
      
      startBreak: () => set({
        isOnBreak: true,
        breakStartTime: new Date().toISOString(),
        currentStatus: 'Off Duty',
      }),
      
      endBreak: () => set((state) => {
        const breakStartTime = state.breakStartTime ? new Date(state.breakStartTime) : new Date();
        const now = new Date();
        const breakDuration = (now.getTime() - breakStartTime.getTime()) / (1000 * 60 * 60); // in hours
        
        return {
          isOnBreak: false,
          breakStartTime: null,
          breakTime: state.breakTime + breakDuration,
          currentStatus: 'On Duty Not Driving',
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
        tripOverrideLogs: state.tripOverrideLogs
      })
    }
  )
);