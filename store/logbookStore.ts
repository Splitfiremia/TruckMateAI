import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DutyStatus } from '@/types';

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
  
  // Actions
  changeStatus: (status: DutyStatus, canStartDriving?: boolean) => boolean;
  startBreak: () => void;
  endBreak: () => void;
  updateLocation: (location: string) => void;
  resetDailyHours: () => void;
  addDrivingTime: (hours: number) => void;
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
    }),
    {
      name: 'logbook-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);