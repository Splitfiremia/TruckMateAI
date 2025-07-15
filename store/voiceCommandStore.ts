import { create } from 'zustand';
import { mockVoiceCommands } from '@/constants/mockData';
import { VoiceCommand } from '@/types';

interface VoiceCommandState {
  isListening: boolean;
  commands: VoiceCommand[];
  lastCommand: string | null;
  lastResponse: string | null;
  
  // Actions
  startListening: () => void;
  stopListening: () => void;
  processCommand: (command: string) => string;
  addCustomCommand: (command: VoiceCommand) => void;
}

export const useVoiceCommandStore = create<VoiceCommandState>()((set, get) => ({
  isListening: false,
  commands: mockVoiceCommands,
  lastCommand: null,
  lastResponse: null,
  
  startListening: () => set({ isListening: true }),
  
  stopListening: () => set({ isListening: false }),
  
  processCommand: (command) => {
    const response = simulateCommandResponse(command);
    set({ 
      lastCommand: command,
      lastResponse: response,
      isListening: false,
    });
    return response;
  },
  
  addCustomCommand: (command) => set((state) => ({
    commands: [...state.commands, command],
  })),
}));

function simulateCommandResponse(command: string): string {
  const lowerCommand = command.toLowerCase();
  
  if (lowerCommand.includes('start my shift') || lowerCommand.includes('begin shift')) {
    return "Starting your shift. Duty status set to Driving. Tracking hours of service.";
  }
  
  if (lowerCommand.includes('end my shift') || lowerCommand.includes('stop shift')) {
    return "Ending your shift. Duty status set to Off Duty. Total driving time recorded.";
  }
  
  if (lowerCommand.includes('start break') || lowerCommand.includes('begin break')) {
    return "Starting your 30-minute break. Timer activated. Duty status set to Off Duty.";
  }
  
  if (lowerCommand.includes('end break') || lowerCommand.includes('finish break')) {
    return "Break completed. Duty status returned to On Duty Not Driving.";
  }
  
  if (lowerCommand.includes('log fuel') || lowerCommand.includes('fuel stop')) {
    return "Fuel stop logged at current location. Would you like to scan a receipt?";
  }
  
  if (lowerCommand.includes('log inspection') || lowerCommand.includes('inspection')) {
    return "Inspection logged at current location. DVIR form ready for completion.";
  }
  
  if (lowerCommand.includes('current status') || lowerCommand.includes('status update')) {
    return "Current status: Driving. You have 7 hours 15 minutes of driving time remaining today. Break required in 1 hour 15 minutes.";
  }
  
  if (lowerCommand.includes('next load') || lowerCommand.includes('load details')) {
    return "Your next load is from Atlanta, GA to Nashville, TN. Pickup tomorrow at 8:00 AM. 248 miles at $2.35 per mile.";
  }
  
  return "I didn't understand that command. Please try again.";
}