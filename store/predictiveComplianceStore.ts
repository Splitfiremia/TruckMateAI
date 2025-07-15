import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  DOTRule, 
  ComplianceViolationPrediction, 
  PredictiveAlert, 
  RuleUpdateNotification,
  ComplianceMetrics,
  PreventionAction,
  ViolationOverride
} from '@/types';

interface PredictiveComplianceState {
  // Core State
  dotRules: DOTRule[];
  violationPredictions: ComplianceViolationPrediction[];
  activeAlerts: PredictiveAlert[];
  ruleUpdates: RuleUpdateNotification[];
  metrics: ComplianceMetrics;
  isMonitoring: boolean;
  lastRuleSync: string;
  
  // AI Analysis State
  isAnalyzing: boolean;
  analysisResults: any;
  riskFactors: string[];
  
  // Actions
  startPredictiveMonitoring: () => void;
  stopPredictiveMonitoring: () => void;
  syncDOTRules: () => Promise<void>;
  analyzePredictiveCompliance: (drivingData: any) => Promise<void>;
  addViolationPrediction: (prediction: ComplianceViolationPrediction) => void;
  resolveViolationPrediction: (id: string) => void;
  overrideViolationPrediction: (id: string, override: ViolationOverride) => Promise<boolean>;
  addAlert: (alert: PredictiveAlert) => void;
  dismissAlert: (id: string) => void;
  executePreventionAction: (actionId: string) => Promise<void>;
  updateMetrics: () => void;
  checkForRuleUpdates: () => Promise<void>;
  getTimeToNextViolation: () => number;
  getRiskLevel: () => 'Low' | 'Medium' | 'High' | 'Critical';
  canOverrideViolation: (predictionId: string) => boolean;
}

// Mock DOT Rules Database
const mockDOTRules: DOTRule[] = [
  {
    id: 'hos-driving-limit',
    category: 'HOS',
    title: '11-Hour Driving Limit',
    description: 'Maximum 11 hours of driving after 10 consecutive hours off duty',
    effectiveDate: '2017-12-18',
    lastUpdated: '2025-07-15',
    source: 'FMCSA',
    severity: 'Critical',
    applicableVehicleTypes: ['CMV'],
    parameters: {
      maxDrivingHours: 11,
      requiredOffDutyHours: 10,
      warningThreshold: 0.5 // 30 minutes before violation
    }
  },
  {
    id: 'hos-30min-break',
    category: 'HOS',
    title: '30-Minute Break Rule',
    description: 'Required 30-minute break after 8 hours of driving',
    effectiveDate: '2013-07-01',
    lastUpdated: '2025-07-15',
    source: 'FMCSA',
    severity: 'Critical',
    applicableVehicleTypes: ['CMV'],
    parameters: {
      drivingHoursBeforeBreak: 8,
      minimumBreakDuration: 0.5,
      warningThreshold: 0.33 // 20 minutes before violation
    }
  },
  {
    id: 'hos-14hour-window',
    category: 'HOS',
    title: '14-Hour On-Duty Window',
    description: 'Cannot drive after 14th hour since coming on duty',
    effectiveDate: '2004-01-04',
    lastUpdated: '2025-07-15',
    source: 'FMCSA',
    severity: 'Critical',
    applicableVehicleTypes: ['CMV'],
    parameters: {
      maxOnDutyWindow: 14,
      warningThreshold: 1 // 1 hour before violation
    }
  },
  {
    id: 'hos-70hour-limit',
    category: 'HOS',
    title: '70-Hour/8-Day Limit',
    description: 'Cannot drive after 70 hours on duty in 8 consecutive days',
    effectiveDate: '1938-08-09',
    lastUpdated: '2025-07-15',
    source: 'FMCSA',
    severity: 'Critical',
    applicableVehicleTypes: ['CMV'],
    parameters: {
      maxWeeklyHours: 70,
      daysPeriod: 8,
      warningThreshold: 5 // 5 hours before violation
    }
  }
];

export const usePredictiveComplianceStore = create<PredictiveComplianceState>()(
  persist(
    (set, get) => ({
      // Initial State
      dotRules: mockDOTRules,
      violationPredictions: [],
      activeAlerts: [],
      ruleUpdates: [],
      metrics: {
        violationRisk: 15,
        complianceScore: 92,
        hoursUntilViolation: 3.5,
        predictedViolations: [],
        ruleUpdatesCount: 0,
        lastRuleSync: new Date().toISOString(),
        activeAlerts: 0,
        overridesUsed: 0,
        overridesThisWeek: 0
      },
      isMonitoring: false,
      lastRuleSync: new Date().toISOString(),
      isAnalyzing: false,
      analysisResults: null,
      riskFactors: [],

      startPredictiveMonitoring: () => {
        set({ isMonitoring: true });
        
        // Start continuous monitoring
        const monitoringInterval = setInterval(() => {
          const state = get();
          if (!state.isMonitoring) {
            clearInterval(monitoringInterval);
            return;
          }
          
          // Simulate real-time analysis
          state.analyzePredictiveCompliance({
            currentDrivingHours: 7.5,
            timeSinceLastBreak: 7.8,
            onDutyTime: 12.5,
            weeklyHours: 65
          });
        }, 30000); // Check every 30 seconds
      },

      stopPredictiveMonitoring: () => {
        set({ isMonitoring: false });
      },

      syncDOTRules: async () => {
        try {
          // Simulate API call to FMCSA/DOT
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Mock rule update detection
          const newRuleUpdate: RuleUpdateNotification = {
            id: `rule-update-${Date.now()}`,
            ruleId: 'hos-30min-break',
            changeType: 'Modified',
            effectiveDate: '2025-08-01',
            summary: 'Break rule clarification for short-haul operations',
            impactLevel: 'Medium',
            actionRequired: false
          };

          set(state => ({
            lastRuleSync: new Date().toISOString(),
            ruleUpdates: [newRuleUpdate, ...state.ruleUpdates.slice(0, 9)],
            metrics: {
              ...state.metrics,
              ruleUpdatesCount: state.ruleUpdates.length + 1,
              lastRuleSync: new Date().toISOString()
            }
          }));

          // Add alert for rule update
          get().addAlert({
            id: `alert-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'Rule Update',
            priority: 'Medium',
            title: 'DOT Rule Update Available',
            message: 'New clarification on 30-minute break rule effective August 1st',
            actionRequired: false,
            autoResolved: false,
            relatedRuleId: 'hos-30min-break'
          });

        } catch (error) {
          console.error('Failed to sync DOT rules:', error);
        }
      },

      analyzePredictiveCompliance: async (drivingData) => {
        set({ isAnalyzing: true });
        
        try {
          // Simulate AI analysis
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const { currentDrivingHours, timeSinceLastBreak, onDutyTime, weeklyHours } = drivingData;
          const predictions: ComplianceViolationPrediction[] = [];
          
          // Analyze 30-minute break rule
          if (timeSinceLastBreak >= 7.5) {
            const timeToViolation = Math.max(0, (8 - timeSinceLastBreak) * 60);
            predictions.push({
              id: `prediction-break-${Date.now()}`,
              type: 'Break',
              severity: timeToViolation <= 20 ? 'Critical' : 'Warning',
              timeToViolation,
              currentValue: timeSinceLastBreak,
              thresholdValue: 8,
              message: timeToViolation <= 0 
                ? 'Break required now - 30-minute break overdue'
                : `30-minute break required in ${Math.round(timeToViolation)} minutes`,
              recommendations: [
                'Find nearest rest area or truck stop',
                'Take minimum 30-minute off-duty break',
                'Log break time in ELD system'
              ],
              preventionActions: [
                {
                  id: 'action-break-now',
                  type: 'Break',
                  title: 'Take Required Break',
                  description: 'Start 30-minute off-duty break immediately',
                  urgency: 'Immediate',
                  estimatedTime: 30,
                  automated: false
                }
              ],
              estimatedFine: 395,
              canOverride: true
            });
          }

          // Analyze 11-hour driving limit
          if (currentDrivingHours >= 10) {
            const timeToViolation = Math.max(0, (11 - currentDrivingHours) * 60);
            predictions.push({
              id: `prediction-driving-${Date.now()}`,
              type: 'HOS',
              severity: timeToViolation <= 30 ? 'Critical' : 'Warning',
              timeToViolation,
              currentValue: currentDrivingHours,
              thresholdValue: 11,
              message: timeToViolation <= 0
                ? 'Driving time limit exceeded - stop driving immediately'
                : `Driving limit reached in ${Math.round(timeToViolation)} minutes`,
              recommendations: [
                'Plan to stop driving before limit',
                'Find safe parking location',
                'Take required 10-hour off-duty period'
              ],
              preventionActions: [
                {
                  id: 'action-stop-driving',
                  type: 'Route',
                  title: 'Find Parking',
                  description: 'Locate nearest truck stop or rest area',
                  urgency: 'Soon',
                  estimatedTime: 15,
                  automated: true
                }
              ],
              estimatedFine: 1150,
              canOverride: false // Cannot override driving time limits
            });
          }

          // Analyze 14-hour window
          if (onDutyTime >= 13) {
            const timeToViolation = Math.max(0, (14 - onDutyTime) * 60);
            predictions.push({
              id: `prediction-window-${Date.now()}`,
              type: 'HOS',
              severity: timeToViolation <= 60 ? 'Critical' : 'Warning',
              timeToViolation,
              currentValue: onDutyTime,
              thresholdValue: 14,
              message: `14-hour window expires in ${Math.round(timeToViolation)} minutes`,
              recommendations: [
                'Complete current trip segment',
                'Cannot drive after 14th hour',
                'Plan 10-hour reset period'
              ],
              preventionActions: [
                {
                  id: 'action-plan-reset',
                  type: 'Route',
                  title: 'Plan Reset Location',
                  description: 'Find location for 10-hour off-duty period',
                  urgency: 'Soon',
                  estimatedTime: 20,
                  automated: true
                }
              ],
              estimatedFine: 1150,
              canOverride: false // Cannot override 14-hour window
            });
          }

          // Update predictions and create alerts for critical ones
          set(state => {
            const criticalPredictions = predictions.filter(p => p.severity === 'Critical');
            const newAlerts = criticalPredictions.map(p => ({
              id: `alert-${Date.now()}-${Math.random()}`,
              timestamp: new Date().toISOString(),
              type: 'Violation Prevention' as const,
              priority: 'Critical' as const,
              title: 'Violation Prevention Alert',
              message: p.message,
              actionRequired: true,
              autoResolved: false,
              expiresAt: new Date(Date.now() + p.timeToViolation * 60000).toISOString()
            }));

            return {
              violationPredictions: predictions,
              activeAlerts: [...newAlerts, ...state.activeAlerts],
              isAnalyzing: false,
              analysisResults: {
                timestamp: new Date().toISOString(),
                predictionsCount: predictions.length,
                criticalCount: criticalPredictions.length
              },
              metrics: {
                ...state.metrics,
                violationRisk: Math.min(100, predictions.length * 25),
                complianceScore: Math.max(0, 100 - predictions.length * 15),
                hoursUntilViolation: predictions.length > 0 
                  ? Math.min(...predictions.map(p => p.timeToViolation / 60))
                  : 24,
                predictedViolations: predictions,
                activeAlerts: state.activeAlerts.length + newAlerts.length
              }
            };
          });

        } catch (error) {
          console.error('Predictive compliance analysis failed:', error);
          set({ isAnalyzing: false });
        }
      },

      addViolationPrediction: (prediction) => {
        set(state => ({
          violationPredictions: [prediction, ...state.violationPredictions]
        }));
      },

      resolveViolationPrediction: (id) => {
        set(state => ({
          violationPredictions: state.violationPredictions.filter(p => p.id !== id)
        }));
      },

      overrideViolationPrediction: async (id, override) => {
        try {
          // In a real app, this would make an API call to log the override
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => {
            const updatedPredictions = state.violationPredictions.map(p => 
              p.id === id ? { ...p, overrideInfo: override } : p
            );
            
            return {
              violationPredictions: updatedPredictions,
              metrics: {
                ...state.metrics,
                overridesUsed: state.metrics.overridesUsed + 1,
                overridesThisWeek: state.metrics.overridesThisWeek + 1
              }
            };
          });
          
          // Add alert about the override
          get().addAlert({
            id: `alert-override-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'Violation Prevention',
            priority: 'Medium',
            title: 'Violation Override Applied',
            message: `Override documented: ${override.reason}`,
            actionRequired: false,
            autoResolved: true,
            expiresAt: new Date(Date.now() + 300000).toISOString() // 5 minutes
          });
          
          return true;
        } catch (error) {
          console.error('Failed to override violation prediction:', error);
          return false;
        }
      },

      canOverrideViolation: (predictionId) => {
        const state = get();
        const prediction = state.violationPredictions.find(p => p.id === predictionId);
        return prediction?.canOverride === true;
      },

      addAlert: (alert) => {
        set(state => ({
          activeAlerts: [alert, ...state.activeAlerts.slice(0, 19)] // Keep max 20 alerts
        }));
      },

      dismissAlert: (id) => {
        set(state => ({
          activeAlerts: state.activeAlerts.filter(a => a.id !== id),
          metrics: {
            ...state.metrics,
            activeAlerts: state.activeAlerts.length - 1
          }
        }));
      },

      executePreventionAction: async (actionId) => {
        const state = get();
        const prediction = state.violationPredictions.find(p => 
          p.preventionActions.some(a => a.id === actionId)
        );
        
        if (!prediction) return;
        
        const action = prediction.preventionActions.find(a => a.id === actionId);
        if (!action) return;

        try {
          // Simulate action execution
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (action.automated) {
            // Auto-execute action (e.g., find parking, plan route)
            get().addAlert({
              id: `alert-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: 'Route Advisory',
              priority: 'Medium',
              title: 'Action Completed',
              message: `${action.title} completed automatically`,
              actionRequired: false,
              autoResolved: true,
              expiresAt: new Date(Date.now() + 300000).toISOString() // 5 minutes
            });
          }
          
          // Mark prediction as addressed
          get().resolveViolationPrediction(prediction.id);
          
        } catch (error) {
          console.error('Failed to execute prevention action:', error);
        }
      },

      updateMetrics: () => {
        set(state => {
          const criticalPredictions = state.violationPredictions.filter(p => p.severity === 'Critical');
          const warningPredictions = state.violationPredictions.filter(p => p.severity === 'Warning');
          
          return {
            metrics: {
              ...state.metrics,
              violationRisk: Math.min(100, criticalPredictions.length * 40 + warningPredictions.length * 20),
              complianceScore: Math.max(0, 100 - criticalPredictions.length * 25 - warningPredictions.length * 10),
              hoursUntilViolation: state.violationPredictions.length > 0
                ? Math.min(...state.violationPredictions.map(p => p.timeToViolation / 60))
                : 24,
              predictedViolations: state.violationPredictions,
              activeAlerts: state.activeAlerts.length
            }
          };
        });
      },

      checkForRuleUpdates: async () => {
        try {
          // Simulate checking for rule updates
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock finding a rule update
          if (Math.random() > 0.7) { // 30% chance of finding update
            const ruleUpdate: RuleUpdateNotification = {
              id: `update-${Date.now()}`,
              ruleId: 'hos-driving-limit',
              changeType: 'Modified',
              effectiveDate: '2025-09-01',
              summary: 'Updated guidance on adverse driving conditions exception',
              impactLevel: 'Medium',
              actionRequired: true,
              deadline: '2025-08-15'
            };

            set(state => ({
              ruleUpdates: [ruleUpdate, ...state.ruleUpdates],
              metrics: {
                ...state.metrics,
                ruleUpdatesCount: state.ruleUpdates.length + 1
              }
            }));

            get().addAlert({
              id: `alert-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: 'Rule Update',
              priority: 'High',
              title: 'Important Rule Update',
              message: ruleUpdate.summary,
              actionRequired: ruleUpdate.actionRequired,
              autoResolved: false,
              relatedRuleId: ruleUpdate.ruleId
            });
          }
        } catch (error) {
          console.error('Failed to check for rule updates:', error);
        }
      },

      getTimeToNextViolation: () => {
        const state = get();
        if (state.violationPredictions.length === 0) return 24 * 60; // 24 hours in minutes
        
        return Math.min(...state.violationPredictions.map(p => p.timeToViolation));
      },

      getRiskLevel: () => {
        const state = get();
        const riskScore = state.metrics.violationRisk;
        
        if (riskScore >= 80) return 'Critical';
        if (riskScore >= 60) return 'High';
        if (riskScore >= 30) return 'Medium';
        return 'Low';
      }
    }),
    {
      name: 'predictive-compliance-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        dotRules: state.dotRules,
        ruleUpdates: state.ruleUpdates,
        lastRuleSync: state.lastRuleSync,
        metrics: state.metrics
      })
    }
  )
);