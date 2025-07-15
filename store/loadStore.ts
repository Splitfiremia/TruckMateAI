import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Load } from '@/types';
import { upcomingLoads } from '@/constants/mockData';

interface LoadState {
  loads: Load[];
  currentLoad: Load | null;
  
  // Actions
  addLoad: (load: Load) => void;
  updateLoad: (id: string, updates: Partial<Load>) => void;
  deleteLoad: (id: string) => void;
  setCurrentLoad: (id: string) => void;
  getUpcomingLoads: () => Load[];
  negotiateRate: (id: string, newRate: string) => void;
}

export const useLoadStore = create<LoadState>()(
  persist(
    (set, get) => ({
      loads: upcomingLoads,
      currentLoad: null,
      
      addLoad: (load) => set((state) => ({
        loads: [...state.loads, load],
      })),
      
      updateLoad: (id, updates) => set((state) => ({
        loads: state.loads.map((load) => 
          load.id === id ? { ...load, ...updates } : load
        ),
        currentLoad: state.currentLoad?.id === id 
          ? { ...state.currentLoad, ...updates } 
          : state.currentLoad,
      })),
      
      deleteLoad: (id) => set((state) => ({
        loads: state.loads.filter((load) => load.id !== id),
        currentLoad: state.currentLoad?.id === id ? null : state.currentLoad,
      })),
      
      setCurrentLoad: (id) => set((state) => ({
        currentLoad: state.loads.find((load) => load.id === id) || null,
      })),
      
      getUpcomingLoads: () => {
        return get().loads.filter((load) => 
          load.status === 'Confirmed' || load.status === 'Pending'
        );
      },
      
      negotiateRate: (id, newRate) => set((state) => {
        const load = state.loads.find((l) => l.id === id);
        if (!load) return state;
        
        const rateValue = parseFloat(newRate.replace('$', ''));
        const totalPay = `$${(rateValue * load.miles).toFixed(2)}`;
        
        return {
          loads: state.loads.map((l) => 
            l.id === id ? { ...l, rate: newRate, totalPay } : l
          ),
          currentLoad: state.currentLoad?.id === id 
            ? { ...state.currentLoad, rate: newRate, totalPay } 
            : state.currentLoad,
        };
      }),
    }),
    {
      name: 'load-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);