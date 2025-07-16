import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as geotabService from '../services/geotabService';
import { GeotabCredentials, GeotabDevice, GeotabAlert, WeighStationBypassResponse } from '../types/index';
import * as geotabService from '../services/geotabService';
import { GeotabCredentials, GeotabDevice, GeotabAlert, WeighStationBypassResponse } from '../types/index';

export interface Integration {
  id: string;
  name: string;
  type: 'email' | 'messaging' | 'storage' | 'crm' | 'calendar' | 'other';
  icon: string;
  description: string;
  isConnected: boolean;
  connectedAt?: Date;
  lastSync?: Date;
  config?: Record<string, any>;
  webhookUrl?: string;
  apiKey?: string;
  refreshToken?: string;
  accessToken?: string;
  expiresAt?: Date;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: {
    integrationId: string;
    event: string;
    conditions?: Record<string, any>;
  };
  actions: Array<{
    integrationId: string;
    action: string;
    parameters: Record<string, any>;
  }>;
  isActive: boolean;
  createdAt: Date;
  lastRun?: Date;
  runCount: number;
}

export interface IntegrationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  trigger: {
    integration: string;
    event: string;
  };
  actions: Array<{
    integration: string;
    action: string;
  }>;
  popular: boolean;
}

interface IntegrationState {
  integrations: Integration[];
  automations: Automation[];
  templates: IntegrationTemplate[];
  isLoading: boolean;
  error: string | null;
  geotabDevices: GeotabDevice[];
  geotabAlerts: GeotabAlert[];
  geotabBypassResponses: WeighStationBypassResponse[];
  
  // Actions
  addIntegration: (integration: Omit<Integration, 'id' | 'connectedAt'>) => void;
  updateIntegration: (id: string, updates: Partial<Integration>) => void;
  removeIntegration: (id: string) => void;
  connectIntegration: (id: string, credentials: Record<string, any>) => Promise<boolean>;
  disconnectIntegration: (id: string) => void;
  
  addAutomation: (automation: Omit<Automation, 'id' | 'createdAt' | 'runCount'>) => void;
  updateAutomation: (id: string, updates: Partial<Automation>) => void;
  removeAutomation: (id: string) => void;
  toggleAutomation: (id: string) => void;
  
  syncIntegration: (id: string) => Promise<void>;
  testConnection: (id: string) => Promise<boolean>;
  fetchGeotabDevices: () => Promise<void>;
  fetchGeotabAlerts: () => Promise<void>;
  requestWeighStationBypass: (deviceId: string, weighStationId: string) => Promise<void>;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const defaultIntegrations: Integration[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    type: 'email',
    icon: 'Mail',
    description: 'Connect your Gmail account to receive load notifications and send compliance reports',
    isConnected: false,
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    type: 'email',
    icon: 'Mail',
    description: 'Connect your Outlook account for email notifications and calendar integration',
    isConnected: false,
  },
  {
    id: 'slack',
    name: 'Slack',
    type: 'messaging',
    icon: 'MessageSquare',
    description: 'Send compliance alerts and load updates to your Slack channels',
    isConnected: false,
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    type: 'messaging',
    icon: 'Users',
    description: 'Integrate with Microsoft Teams for fleet communication',
    isConnected: false,
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    type: 'storage',
    icon: 'HardDrive',
    description: 'Automatically backup receipts and documents to Google Drive',
    isConnected: false,
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    type: 'storage',
    icon: 'Cloud',
    description: 'Sync your trucking documents with Dropbox',
    isConnected: false,
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    type: 'calendar',
    icon: 'Calendar',
    description: 'Sync load schedules and compliance deadlines with Google Calendar',
    isConnected: false,
  },
  {
    id: 'webhook',
    name: 'Custom Webhook',
    type: 'other',
    icon: 'Webhook',
    description: 'Send data to any custom webhook endpoint',
    isConnected: false,
  },
  {
    id: 'geotab',
    name: 'Geotab Drivewyze',
    type: 'other',
    icon: 'Truck',
    description: 'Integrate with Geotab for GPS tracking, weigh station bypass, and safety alerts',
    isConnected: false,
  },
];

const defaultTemplates: IntegrationTemplate[] = [
  {
    id: 'load-email-notification',
    name: 'Load Assignment Email',
    description: 'Send email notification when a new load is assigned',
    category: 'Load Management',
    trigger: { integration: 'app', event: 'load_assigned' },
    actions: [{ integration: 'gmail', action: 'send_email' }],
    popular: true,
  },
  {
    id: 'compliance-slack-alert',
    name: 'Compliance Alert to Slack',
    description: 'Send compliance violations to Slack channel',
    category: 'Compliance',
    trigger: { integration: 'app', event: 'compliance_violation' },
    actions: [{ integration: 'slack', action: 'send_message' }],
    popular: true,
  },
  {
    id: 'receipt-backup',
    name: 'Auto Receipt Backup',
    description: 'Automatically backup receipts to cloud storage',
    category: 'Document Management',
    trigger: { integration: 'app', event: 'receipt_uploaded' },
    actions: [{ integration: 'google-drive', action: 'upload_file' }],
    popular: true,
  },
  {
    id: 'calendar-sync',
    name: 'Load Schedule Sync',
    description: 'Sync load schedules with your calendar',
    category: 'Scheduling',
    trigger: { integration: 'app', event: 'load_scheduled' },
    actions: [{ integration: 'google-calendar', action: 'create_event' }],
    popular: false,
  },
];

export const useIntegrationStore = create<IntegrationState>()(persist(
  (set, get) => ({
    integrations: defaultIntegrations,
    automations: [],
    templates: defaultTemplates,
    isLoading: false,
    error: null,
    geotabDevices: [],
    geotabAlerts: [],
    geotabBypassResponses: [],
    
    addIntegration: (integration) => {
      const newIntegration: Integration = {
        ...integration,
        id: Date.now().toString(),
        connectedAt: new Date(),
      };
      set((state) => ({
        integrations: [...state.integrations, newIntegration],
      }));
    },
    
    updateIntegration: (id, updates) => {
      set((state) => ({
        integrations: state.integrations.map((integration) =>
          integration.id === id ? { ...integration, ...updates } : integration
        ),
      }));
    },
    
    removeIntegration: (id) => {
      set((state) => ({
        integrations: state.integrations.filter((integration) => integration.id !== id),
        automations: state.automations.filter((automation) => 
          automation.trigger.integrationId !== id &&
          !automation.actions.some(action => action.integrationId === id)
        ),
      }));
    },
    
    connectIntegration: async (id, credentials) => {
      set({ isLoading: true, error: null });
      
      try {
        // Simulate API call to connect integration
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const integration = get().integrations.find(i => i.id === id);
        if (!integration) throw new Error('Integration not found');
        
        // Mock OAuth flow or API key validation
        const mockSuccess = Math.random() > 0.2; // 80% success rate
        
        if (!mockSuccess) {
          throw new Error('Failed to connect. Please check your credentials.');
        }
        
        get().updateIntegration(id, {
          isConnected: true,
          connectedAt: new Date(),
          lastSync: new Date(),
          config: credentials,
          accessToken: 'mock_access_token_' + Date.now(),
          expiresAt: new Date(Date.now() + 3600000), // 1 hour
        });
        
        set({ isLoading: false });
        return true;
      } catch (error) {
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Connection failed' 
        });
        return false;
      }
    },
    
    disconnectIntegration: (id) => {
      get().updateIntegration(id, {
        isConnected: false,
        connectedAt: undefined,
        lastSync: undefined,
        config: undefined,
        accessToken: undefined,
        refreshToken: undefined,
        expiresAt: undefined,
      });
    },
    
    addAutomation: (automation) => {
      const newAutomation: Automation = {
        ...automation,
        id: Date.now().toString(),
        createdAt: new Date(),
        runCount: 0,
      };
      set((state) => ({
        automations: [...state.automations, newAutomation],
      }));
    },
    
    updateAutomation: (id, updates) => {
      set((state) => ({
        automations: state.automations.map((automation) =>
          automation.id === id ? { ...automation, ...updates } : automation
        ),
      }));
    },
    
    removeAutomation: (id) => {
      set((state) => ({
        automations: state.automations.filter((automation) => automation.id !== id),
      }));
    },
    
    toggleAutomation: (id) => {
      const automation = get().automations.find(a => a.id === id);
      if (automation) {
        get().updateAutomation(id, { isActive: !automation.isActive });
      }
    },
    
    syncIntegration: async (id) => {
      set({ isLoading: true, error: null });
      
      try {
        // Simulate sync operation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        get().updateIntegration(id, {
          lastSync: new Date(),
        });
        
        set({ isLoading: false });
      } catch (error) {
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Sync failed' 
        });
      }
    },
    
    testConnection: async (id) => {
      set({ isLoading: true, error: null });
      
      try {
        // Simulate connection test
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const integration = get().integrations.find(i => i.id === id);
        if (!integration?.isConnected) {
          throw new Error('Integration not connected');
        }
        
        // Mock test result
        const testSuccess = Math.random() > 0.1; // 90% success rate
        
        if (!testSuccess) {
          throw new Error('Connection test failed. Please reconnect.');
        }
        
        set({ isLoading: false });
        return true;
      } catch (error) {
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Test failed' 
        });
        return false;
      }
    },
    
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    fetchGeotabDevices: async () => {
      set({ isLoading: true, error: null });
      try {
        const integration = get().integrations.find(i => i.id === 'geotab');
        if (!integration || !integration.isConnected) {
          throw new Error('Geotab integration not connected');
        }
        const credentials = integration.config as GeotabCredentials;
        const devices = await geotabService.getDevices(credentials);
        set({ geotabDevices: devices });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch Geotab devices' 
        });
      } finally {
        set({ isLoading: false });
      }
    },
    fetchGeotabAlerts: async () => {
      set({ isLoading: true, error: null });
      try {
        const integration = get().integrations.find(i => i.id === 'geotab');
        if (!integration || !integration.isConnected) {
          throw new Error('Geotab integration not connected');
        }
        const credentials = integration.config as GeotabCredentials;
        const alerts = await geotabService.getAlerts(credentials);
        set({ geotabAlerts: alerts });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch Geotab alerts' 
        });
      } finally {
        set({ isLoading: false });
      }
    },
    requestWeighStationBypass: async (deviceId, weighStationId) => {
      set({ isLoading: true, error: null });
      try {
        const integration = get().integrations.find(i => i.id === 'geotab');
        if (!integration || !integration.isConnected) {
          throw new Error('Geotab integration not connected');
        }
        const credentials = integration.config as GeotabCredentials;
        const response = await geotabService.requestWeighStationBypass(credentials, deviceId, weighStationId);
        set((state) => ({
          geotabBypassResponses: [...state.geotabBypassResponses, response],
        }));
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to request weigh station bypass' 
        });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
  }),
  {
    name: 'integration-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      integrations: state.integrations,
      automations: state.automations,
      geotabDevices: state.geotabDevices,
      geotabAlerts: state.geotabAlerts,
      geotabBypassResponses: state.geotabBypassResponses,
    }),
  }
));