import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'voice';
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TruckingContext {
  currentLocation?: string;
  currentStatus?: 'driving' | 'on_duty' | 'off_duty' | 'sleeper';
  hoursRemaining?: number;
  nextDeadline?: Date;
  currentLoad?: {
    id: string;
    pickup: string;
    delivery: string;
    weight: number;
  };
  weatherConditions?: string;
  fuelLevel?: number;
  maintenanceAlerts?: string[];
}

interface AIAssistantState {
  // Conversations
  conversations: AIConversation[];
  activeConversationId: string | null;
  
  // AI State
  isModelLoaded: boolean;
  isProcessing: boolean;
  modelLoadingProgress: number;
  
  // Voice
  isListening: boolean;
  isRecording: boolean;
  isSpeaking: boolean;
  
  // Context
  truckingContext: TruckingContext;
  
  // Settings
  voiceEnabled: boolean;
  autoSpeak: boolean;
  modelSize: 'small' | 'medium' | 'large';
  
  // Actions
  createConversation: (title?: string) => string;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Omit<AIMessage, 'id' | 'timestamp'>) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  
  // AI Actions
  setModelLoaded: (loaded: boolean) => void;
  setProcessing: (processing: boolean) => void;
  setModelLoadingProgress: (progress: number) => void;
  
  // Voice Actions
  setListening: (listening: boolean) => void;
  setRecording: (recording: boolean) => void;
  setSpeaking: (speaking: boolean) => void;
  
  // Context Actions
  updateTruckingContext: (context: Partial<TruckingContext>) => void;
  
  // Settings Actions
  setVoiceEnabled: (enabled: boolean) => void;
  setAutoSpeak: (enabled: boolean) => void;
  setModelSize: (size: 'small' | 'medium' | 'large') => void;
}

export const useAIAssistantStore = create<AIAssistantState>()(persist(
  (set, get) => ({
    // Initial state
    conversations: [],
    activeConversationId: null,
    isModelLoaded: false,
    isProcessing: false,
    modelLoadingProgress: 0,
    isListening: false,
    isRecording: false,
    isSpeaking: false,
    truckingContext: {},
    voiceEnabled: true,
    autoSpeak: false,
    modelSize: 'small',
    
    // Conversation actions
    createConversation: (title) => {
      const id = Date.now().toString();
      const conversation: AIConversation = {
        id,
        title: title || `Chat ${get().conversations.length + 1}`,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      set((state) => ({
        conversations: [conversation, ...state.conversations],
        activeConversationId: id,
      }));
      
      return id;
    },
    
    setActiveConversation: (id) => {
      set({ activeConversationId: id });
    },
    
    addMessage: (conversationId, message) => {
      const newMessage: AIMessage = {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, newMessage],
                updatedAt: new Date(),
              }
            : conv
        ),
      }));
    },
    
    deleteConversation: (id) => {
      set((state) => ({
        conversations: state.conversations.filter((conv) => conv.id !== id),
        activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
      }));
    },
    
    clearAllConversations: () => {
      set({ conversations: [], activeConversationId: null });
    },
    
    // AI actions
    setModelLoaded: (loaded) => set({ isModelLoaded: loaded }),
    setProcessing: (processing) => set({ isProcessing: processing }),
    setModelLoadingProgress: (progress) => set({ modelLoadingProgress: progress }),
    
    // Voice actions
    setListening: (listening) => set({ isListening: listening }),
    setRecording: (recording) => set({ isRecording: recording }),
    setSpeaking: (speaking) => set({ isSpeaking: speaking }),
    
    // Context actions
    updateTruckingContext: (context) => {
      set((state) => ({
        truckingContext: { ...state.truckingContext, ...context },
      }));
    },
    
    // Settings actions
    setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
    setAutoSpeak: (enabled) => set({ autoSpeak: enabled }),
    setModelSize: (size) => set({ modelSize: size }),
  }),
  {
    name: 'ai-assistant-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      conversations: state.conversations,
      voiceEnabled: state.voiceEnabled,
      autoSpeak: state.autoSpeak,
      modelSize: state.modelSize,
    }),
  }
));