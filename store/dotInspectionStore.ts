import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  DOTInspectionPrediction, 
  DOTInspectionTip, 
  DOTInspectionHistory, 
  InspectionBlitzAlert 
} from '@/types';

interface DOTInspectionState {
  currentPrediction: DOTInspectionPrediction | null;
  inspectionTips: DOTInspectionTip[];
  inspectionHistory: DOTInspectionHistory[];
  blitzAlerts: InspectionBlitzAlert[];
  isAnalyzing: boolean;
  lastAnalysisDate: string | null;
  
  // Actions
  generatePrediction: (location: string, route: string) => Promise<void>;
  getInspectionTips: () => Promise<void>;
  addInspectionHistory: (inspection: DOTInspectionHistory) => void;
  getBlitzAlerts: (route: string) => Promise<void>;
  analyzeVehicleReadiness: () => Promise<{ score: number; issues: string[] }>;
  getAIGuidance: (question: string) => Promise<string>;
  dismissBlitzAlert: (alertId: string) => void;
}

// Mock data for demonstration
const mockInspectionTips: DOTInspectionTip[] = [
  {
    id: 'tip-1',
    category: 'Vehicle',
    title: 'Check Tire Tread Depth',
    description: 'Ensure all tires have at least 4/32" tread depth on steering axle and 2/32" on other axles.',
    priority: 'High',
    actionRequired: true,
  },
  {
    id: 'tip-2',
    category: 'Documentation',
    title: 'Update Medical Certificate',
    description: 'Your medical certificate expires in 15 days. Schedule renewal to avoid violations.',
    priority: 'High',
    actionRequired: true,
  },
  {
    id: 'tip-3',
    category: 'Driver',
    title: 'Hours of Service Compliance',
    description: 'Ensure your ELD is functioning properly and logs are up to date.',
    priority: 'Medium',
    actionRequired: false,
  },
  {
    id: 'tip-4',
    category: 'Vehicle',
    title: 'Brake System Check',
    description: 'Inspect brake lines, chambers, and adjustment. Listen for air leaks.',
    priority: 'High',
    actionRequired: true,
  },
];

const mockInspectionHistory: DOTInspectionHistory[] = [
  {
    id: 'hist-1',
    date: '2024-01-15',
    location: 'I-75 Weigh Station, GA',
    inspector: 'Officer Johnson',
    type: 'Level 1',
    result: 'Pass',
    violations: [],
    score: 95,
    duration: '45 minutes',
  },
  {
    id: 'hist-2',
    date: '2024-01-02',
    location: 'I-40 Weigh Station, TN',
    inspector: 'Officer Smith',
    type: 'Level 2',
    result: 'Warning',
    violations: [
      {
        code: '393.75(a)(3)',
        description: 'Tire tread depth less than 4/32 inch on steering axle',
        severity: 'Serious',
        category: 'Vehicle',
        points: 8,
        fineAmount: 250,
      },
    ],
    score: 78,
    duration: '30 minutes',
  },
];

export const useDOTInspectionStore = create<DOTInspectionState>()( 
  persist(
    (set, get) => ({
      currentPrediction: null,
      inspectionTips: mockInspectionTips,
      inspectionHistory: mockInspectionHistory,
      blitzAlerts: [],
      isAnalyzing: false,
      lastAnalysisDate: null,
      
      generatePrediction: async (location: string, route: string) => {
        set({ isAnalyzing: true });
        
        // Simulate AI analysis
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock prediction based on various factors
        const riskFactors = [
          'High traffic volume area',
          'Recent inspection blitz reported',
          'Holiday weekend approaching',
          'Vehicle due for maintenance',
        ];
        
        const recommendations = [
          'Complete pre-trip inspection thoroughly',
          'Ensure all documentation is current',
          'Check tire condition and tread depth',
          'Verify ELD is functioning properly',
          'Consider alternative route through I-85',
        ];
        
        const prediction: DOTInspectionPrediction = {
          riskLevel: 'Medium',
          probability: 35,
          factors: riskFactors,
          recommendations,
          nextLikelyLocation: 'I-75 Weigh Station, Macon GA',
          estimatedTime: '2.5 hours',
        };
        
        set({ 
          currentPrediction: prediction, 
          isAnalyzing: false,
          lastAnalysisDate: new Date().toISOString(),
        });
      },
      
      getInspectionTips: async () => {
        // In a real app, this would fetch personalized tips based on vehicle, driver history, etc.
        set({ inspectionTips: mockInspectionTips });
      },
      
      addInspectionHistory: (inspection: DOTInspectionHistory) => {
        set((state) => ({
          inspectionHistory: [inspection, ...state.inspectionHistory],
        }));
      },
      
      getBlitzAlerts: async (route: string) => {
        // Simulate fetching blitz alerts for the route
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const alerts: InspectionBlitzAlert[] = [
          {
            id: 'blitz-1',
            location: 'I-75 Corridor, Georgia',
            startDate: '2024-01-20',
            endDate: '2024-01-22',
            focus: ['Hours of Service', 'Vehicle Maintenance', 'Load Securement'],
            severity: 'High',
            alternativeRoutes: ['I-85 North', 'US-441 North'],
          },
        ];
        
        set({ blitzAlerts: alerts });
      },
      
      analyzeVehicleReadiness: async () => {
        set({ isAnalyzing: true });
        
        // Simulate AI analysis of vehicle readiness
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const issues = [
          'Tire tread depth on rear axle approaching minimum',
          'Last oil change was 8,000 miles ago',
          'ELD has not been updated in 30 days',
        ];
        
        const score = 82; // Out of 100
        
        set({ isAnalyzing: false });
        return { score, issues };
      },
      
      getAIGuidance: async (question: string) => {
        // Simulate AI-powered guidance
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const responses: { [key: string]: string } = {
          'tire inspection': 'Check tire tread depth using a penny test or tread depth gauge. Steering axle tires must have at least 4/32" tread depth, while drive and trailer axles need 2/32". Look for irregular wear patterns, cuts, or bulges.',
          'brake inspection': 'Inspect brake chambers for cracks or leaks. Check brake lines and fittings. Test brake adjustment - should not exceed 1" for manual slack adjusters or 1.25" for automatic adjusters. Listen for air leaks.',
          'documentation': 'Ensure you have: Valid CDL, current medical certificate, vehicle registration, insurance card, IFTA permit, and current logbook or ELD records. Keep originals, not copies.',
          'hours of service': 'You cannot drive more than 11 hours after 10 consecutive hours off duty, or more than 14 hours after coming on duty. You must take a 30-minute break before 8 hours of driving.',
        };
        
        const lowerQuestion = question.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
          if (lowerQuestion.includes(key)) {
            return response;
          }
        }
        
        return 'I can help with tire inspection, brake inspection, documentation requirements, and hours of service questions. What specific area would you like guidance on?';
      },
      
      dismissBlitzAlert: (alertId: string) => {
        set((state) => ({
          blitzAlerts: state.blitzAlerts.filter(alert => alert.id !== alertId),
        }));
      },
    }),
    {
      name: 'dot-inspection-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);