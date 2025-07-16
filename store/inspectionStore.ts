import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PreTripInspection, InspectionResult, InspectionStatus } from '@/types';
import { preTripInspectionItems } from '@/constants/mockData';

interface InspectionState {
  inspections: PreTripInspection[];
  currentInspection: InspectionResult[];
  isInspectionRequired: boolean;
  lastInspectionDate: string | null;
  canStartDriving: boolean;
  inspectionInProgress: boolean;
  shouldShowInspectionPrompt: boolean;
  
  // Actions
  startInspection: () => void;
  updateInspectionItem: (itemId: string, status: InspectionStatus, notes?: string, defectDescription?: string) => void;
  completeInspection: (location: string, signature?: string) => PreTripInspection;
  resetCurrentInspection: () => void;
  getInspectionProgress: () => { completed: number; total: number; percentage: number };
  getCategoryProgress: (categoryIndex: number) => { completed: number; total: number; percentage: number };
  hasDefects: () => boolean;
  canCompleteInspection: () => boolean;
  checkInspectionRequirement: () => void;
  forceExitInspection: () => void;
  checkInspectionForTripStart: () => boolean;
  dismissInspectionPrompt: () => void;
}

export const useInspectionStore = create<InspectionState>()(
  persist(
    (set, get) => ({
      inspections: [],
      currentInspection: [],
      isInspectionRequired: false,
      lastInspectionDate: null,
      canStartDriving: true,
      inspectionInProgress: false,
      shouldShowInspectionPrompt: false,
      
      startInspection: () => {
        // Initialize all inspection items as unchecked (no status set)
        const allItems = preTripInspectionItems.flatMap(category => 
          category.items.map(item => ({
            itemId: item.id,
            status: undefined as any, // Start with no status selected
            notes: '',
            defectDescription: '',
          }))
        );
        
        set({
          currentInspection: allItems,
          isInspectionRequired: true,
          canStartDriving: false,
          inspectionInProgress: true,
          shouldShowInspectionPrompt: false,
        });
      },
      
      updateInspectionItem: (itemId, status, notes = '', defectDescription = '') => {
        set((state) => ({
          currentInspection: state.currentInspection.map(item =>
            item.itemId === itemId
              ? { ...item, status, notes, defectDescription }
              : item
          ),
        }));
      },
      
      completeInspection: (location, signature) => {
        const state = get();
        const defectsFound = state.currentInspection.filter(item => item.status === 'Fail' || item.status === 'Defect').length;
        const safeToOperate = defectsFound === 0;
        
        const inspection: PreTripInspection = {
          id: `INS-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          driverId: 'DRIVER-001', // In real app, get from auth
          vehicleId: 'FL-4872', // In real app, get from vehicle settings
          location,
          results: state.currentInspection,
          overallStatus: safeToOperate ? 'Pass' : (defectsFound > 0 ? 'Defect' : 'Pass') as InspectionStatus,
          signature,
          completedAt: new Date().toISOString(),
          defectsFound,
          safeToOperate,
        };
        
        set((state) => ({
          inspections: [inspection, ...state.inspections],
          currentInspection: [],
          isInspectionRequired: false,
          lastInspectionDate: inspection.date,
          canStartDriving: safeToOperate,
          inspectionInProgress: false,
          shouldShowInspectionPrompt: false,
        }));
        
        return inspection;
      },
      
      resetCurrentInspection: () => {
        set({
          currentInspection: [],
          isInspectionRequired: true,
          canStartDriving: false,
          inspectionInProgress: false,
          shouldShowInspectionPrompt: false,
        });
      },
      
      getInspectionProgress: () => {
        const state = get();
        const totalItems = preTripInspectionItems.reduce((sum, category) => sum + category.items.length, 0);
        const completedItems = state.currentInspection.filter(item => 
          item.status && (item.status === 'Pass' || item.status === 'Fail' || item.status === 'Defect')
        ).length;
        
        return {
          completed: completedItems,
          total: totalItems,
          percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
        };
      },
      
      hasDefects: () => {
        const state = get();
        return state.currentInspection.some(item => item.status && (item.status === 'Fail' || item.status === 'Defect'));
      },
      
      canCompleteInspection: () => {
        const state = get();
        const totalItems = preTripInspectionItems.reduce((sum, category) => sum + category.items.length, 0);
        const completedItems = state.currentInspection.filter(item => 
          item.status && (item.status === 'Pass' || item.status === 'Fail' || item.status === 'Defect')
        ).length;
        // Allow completion if at least 50% of items are completed, or if user explicitly wants to complete
        return completedItems >= Math.ceil(totalItems * 0.5);
      },
      
      getCategoryProgress: (categoryIndex: number) => {
        const state = get();
        const category = preTripInspectionItems[categoryIndex];
        if (!category) return { completed: 0, total: 0, percentage: 0 };
        
        const categoryItems = category.items;
        const completedItems = categoryItems.filter(item => {
          const inspectionItem = state.currentInspection.find(i => i.itemId === item.id);
          return inspectionItem && inspectionItem.status && (inspectionItem.status === 'Pass' || inspectionItem.status === 'Fail' || inspectionItem.status === 'Defect');
        }).length;
        
        return {
          completed: completedItems,
          total: categoryItems.length,
          percentage: categoryItems.length > 0 ? Math.round((completedItems / categoryItems.length) * 100) : 0,
        };
      },
      
      checkInspectionRequirement: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const needsInspection = !state.lastInspectionDate || state.lastInspectionDate !== today;
        
        set({
          isInspectionRequired: needsInspection,
          canStartDriving: !needsInspection,
          // Don't automatically show prompt - only when starting trip
          shouldShowInspectionPrompt: false,
        });
      },
      
      checkInspectionForTripStart: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const needsInspection = !state.lastInspectionDate || state.lastInspectionDate !== today;
        
        if (needsInspection) {
          set({ shouldShowInspectionPrompt: true });
        }
        
        return needsInspection;
      },
      
      dismissInspectionPrompt: () => {
        set({ shouldShowInspectionPrompt: false });
      },
      
      forceExitInspection: () => {
        set({
          currentInspection: [],
          inspectionInProgress: false,
          shouldShowInspectionPrompt: false,
          // Keep isInspectionRequired as true since inspection wasn't completed
        });
      },
    }),
    {
      name: 'inspection-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);