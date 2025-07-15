import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ComplianceIssue } from '@/types';
import { colors } from '@/constants/colors';
import { mockComplianceRules } from '@/constants/mockData';

interface ComplianceState {
  status: 'Good Standing' | 'Warning' | 'Violation';
  issues: ComplianceIssue[];
  rules: typeof mockComplianceRules;
  lastInspectionDate: string | null;
  
  // Actions
  addIssue: (issue: ComplianceIssue) => void;
  resolveIssue: (index: number) => void;
  updateStatus: () => void;
  logInspection: (location: string) => void;
  getTimeUntilBreakRequired: (drivingHours: number) => string;
}

export const useComplianceStore = create<ComplianceState>()(
  persist(
    (set, get) => ({
      status: 'Good Standing',
      issues: [
        {
          type: 'Warning',
          message: "Medical certificate expires in 30 days",
          color: colors.warning,
          dueDate: "2025-06-15",
        },
      ],
      rules: mockComplianceRules,
      lastInspectionDate: "2025-07-14",
      
      addIssue: (issue) => set((state) => ({
        issues: [...state.issues, issue],
      })),
      
      resolveIssue: (index) => set((state) => ({
        issues: state.issues.filter((_, i) => i !== index),
      })),
      
      updateStatus: () => set((state) => {
        const hasViolations = state.issues.some((issue) => issue.type === 'Violation');
        const hasWarnings = state.issues.some((issue) => issue.type === 'Warning');
        
        let newStatus: 'Good Standing' | 'Warning' | 'Violation' = 'Good Standing';
        if (hasViolations) {
          newStatus = 'Violation';
        } else if (hasWarnings) {
          newStatus = 'Warning';
        }
        
        return { status: newStatus };
      }),
      
      logInspection: (location) => set({
        lastInspectionDate: new Date().toISOString(),
      }),
      
      getTimeUntilBreakRequired: (drivingHours) => {
        const { breakRequired } = get().rules.hoursOfService;
        const timeUntilBreak = breakRequired.after - drivingHours;
        
        if (timeUntilBreak <= 0) {
          return "Break required now";
        }
        
        const hours = Math.floor(timeUntilBreak);
        const minutes = Math.round((timeUntilBreak - hours) * 60);
        
        return `${hours}h ${minutes}m`;
      },
    }),
    {
      name: 'compliance-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);