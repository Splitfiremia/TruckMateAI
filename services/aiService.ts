import { Platform } from 'react-native';
import { TruckingContext } from '@/store/aiAssistantStore';

// For web compatibility, we'll use a mock implementation
// In a real app, you'd use @xenova/transformers for on-device inference
class AIService {
  private isInitialized = false;
  private model: any = null;
  
  async initializeModel(modelSize: 'small' | 'medium' | 'large' = 'small', onProgress?: (progress: number) => void) {
    if (this.isInitialized) return;
    
    try {
      // Simulate model loading progress
      const steps = 10;
      for (let i = 0; i <= steps; i++) {
        onProgress?.(i / steps);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // In a real implementation, you would load the actual model here:
      // const { pipeline } = await import('@xenova/transformers');
      // this.model = await pipeline('text-generation', 'microsoft/DialoGPT-small');
      
      this.isInitialized = true;
      onProgress?.(1);
    } catch (error) {
      console.error('Failed to initialize AI model:', error);
      throw error;
    }
  }
  
  async generateResponse(
    message: string, 
    context: TruckingContext,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<string> {
    if (!this.isInitialized) {
      await this.initializeModel();
    }
    
    // Build context-aware prompt
    const contextPrompt = this.buildContextPrompt(context);
    const conversationPrompt = this.buildConversationPrompt(conversationHistory);
    
    // For demo purposes, we'll use rule-based responses
    // In production, this would use the actual transformer model
    return this.generateTruckingResponse(message, context);
  }
  
  private buildContextPrompt(context: TruckingContext): string {
    let prompt = "You are an AI assistant specialized in trucking and logistics. ";
    
    if (context.currentStatus) {
      prompt += `The driver is currently ${context.currentStatus}. `;
    }
    
    if (context.hoursRemaining) {
      prompt += `They have ${context.hoursRemaining} hours remaining on their HOS. `;
    }
    
    if (context.currentLoad) {
      prompt += `Current load: ${context.currentLoad.weight}lbs from ${context.currentLoad.pickup} to ${context.currentLoad.delivery}. `;
    }
    
    if (context.weatherConditions) {
      prompt += `Weather conditions: ${context.weatherConditions}. `;
    }
    
    if (context.maintenanceAlerts && context.maintenanceAlerts.length > 0) {
      prompt += `Maintenance alerts: ${context.maintenanceAlerts.join(', ')}. `;
    }
    
    return prompt;
  }
  
  private buildConversationPrompt(history: Array<{ role: 'user' | 'assistant'; content: string }>): string {
    return history.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join('\n');
  }
  
  private generateTruckingResponse(message: string, context: TruckingContext): string {
    const lowerMessage = message.toLowerCase();
    
    // HOS related queries
    if (lowerMessage.includes('hours') || lowerMessage.includes('hos') || lowerMessage.includes('drive time')) {
      if (context.hoursRemaining) {
        return `You have ${context.hoursRemaining} hours remaining on your current duty cycle. ${this.getHOSAdvice(context.hoursRemaining)}`;
      }
      return "I'd be happy to help with Hours of Service questions. Could you tell me your current status and how many hours you've been driving today?";
    }
    
    // Weather related queries
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('snow')) {
      if (context.weatherConditions) {
        return `Current weather conditions: ${context.weatherConditions}. ${this.getWeatherAdvice(context.weatherConditions)}`;
      }
      return "I can help you with weather information. What's your current location or route?";
    }
    
    // Load related queries
    if (lowerMessage.includes('load') || lowerMessage.includes('delivery') || lowerMessage.includes('pickup')) {
      if (context.currentLoad) {
        return `Your current load is ${context.currentLoad.weight}lbs going from ${context.currentLoad.pickup} to ${context.currentLoad.delivery}. ${this.getLoadAdvice(context.currentLoad)}`;
      }
      return "I can help you with load information. Do you have a current load assignment?";
    }
    
    // Maintenance related queries
    if (lowerMessage.includes('maintenance') || lowerMessage.includes('repair') || lowerMessage.includes('inspection')) {
      if (context.maintenanceAlerts && context.maintenanceAlerts.length > 0) {
        return `You have the following maintenance alerts: ${context.maintenanceAlerts.join(', ')}. I recommend addressing these as soon as possible.`;
      }
      return "I can help you with maintenance questions. Are you experiencing any issues with your vehicle?";
    }
    
    // Route and navigation queries
    if (lowerMessage.includes('route') || lowerMessage.includes('directions') || lowerMessage.includes('traffic')) {
      return "I can help you with route planning and traffic information. What's your destination?";
    }
    
    // Fuel related queries
    if (lowerMessage.includes('fuel') || lowerMessage.includes('gas') || lowerMessage.includes('diesel')) {
      return "I can help you find fuel stops along your route. What's your current location and destination?";
    }
    
    // Safety related queries
    if (lowerMessage.includes('safety') || lowerMessage.includes('accident') || lowerMessage.includes('emergency')) {
      return "Safety is our top priority. If this is an emergency, please call 911 immediately. For non-emergency safety questions, I'm here to help.";
    }
    
    // General trucking advice
    if (lowerMessage.includes('advice') || lowerMessage.includes('tip') || lowerMessage.includes('help')) {
      return "I'm here to help with all aspects of trucking! I can assist with HOS compliance, route planning, weather updates, maintenance schedules, and general trucking advice. What specific area would you like help with?";
    }
    
    // Default response
    return "I'm your AI trucking assistant. I can help with Hours of Service, weather conditions, route planning, maintenance alerts, and general trucking questions. How can I assist you today?";
  }
  
  private getHOSAdvice(hoursRemaining: number): string {
    if (hoursRemaining <= 2) {
      return "You're getting close to your limit. Consider finding a safe place to take your required break soon.";
    } else if (hoursRemaining <= 4) {
      return "You have some time left, but start planning for your next break.";
    } else {
      return "You have plenty of driving time remaining.";
    }
  }
  
  private getWeatherAdvice(conditions: string): string {
    const lowerConditions = conditions.toLowerCase();
    if (lowerConditions.includes('rain') || lowerConditions.includes('wet')) {
      return "Drive carefully in wet conditions. Reduce speed and increase following distance.";
    } else if (lowerConditions.includes('snow') || lowerConditions.includes('ice')) {
      return "Exercise extreme caution in winter conditions. Consider chaining up if required.";
    } else if (lowerConditions.includes('wind')) {
      return "Be aware of crosswinds, especially when passing or being passed by other vehicles.";
    } else {
      return "Current conditions look manageable. Drive safely!";
    }
  }
  
  private getLoadAdvice(load: any): string {
    if (load.weight > 70000) {
      return "This is a heavy load. Make sure you're compliant with weight restrictions and have proper permits.";
    } else if (load.hazmat) {
      return "This is a hazmat load. Ensure you have proper documentation and follow all safety protocols.";
    } else {
      return "Standard load parameters. Drive safely and maintain proper following distance.";
    }
  }
  
  async generateSuggestions(context: TruckingContext): Promise<string[]> {
    const suggestions: string[] = [];
    
    // Context-based suggestions
    if (context.hoursRemaining && context.hoursRemaining <= 3) {
      suggestions.push("Find rest areas near me");
      suggestions.push("How much time until mandatory break?");
    }
    
    if (context.weatherConditions) {
      suggestions.push("Weather safety tips");
      suggestions.push("Check weather along my route");
    }
    
    if (context.currentLoad) {
      suggestions.push("Load delivery requirements");
      suggestions.push("Best route to destination");
    }
    
    if (context.maintenanceAlerts && context.maintenanceAlerts.length > 0) {
      suggestions.push("Nearest service centers");
      suggestions.push("Maintenance priority levels");
    }
    
    // Default suggestions
    if (suggestions.length === 0) {
      suggestions.push(
        "Check my HOS status",
        "Weather conditions ahead",
        "Find fuel stops",
        "Maintenance reminders",
        "Route optimization tips"
      );
    }
    
    return suggestions.slice(0, 4); // Return max 4 suggestions
  }
  
  async processVoiceCommand(transcript: string, context: TruckingContext): Promise<string> {
    // Process voice commands with trucking-specific intents
    const lowerTranscript = transcript.toLowerCase();
    
    if (lowerTranscript.includes('status') || lowerTranscript.includes('how am i doing')) {
      let status = "Here's your current status: ";
      
      if (context.currentStatus) {
        status += `You are currently ${context.currentStatus}. `;
      }
      
      if (context.hoursRemaining) {
        status += `You have ${context.hoursRemaining} hours remaining on your HOS. `;
      }
      
      if (context.currentLoad) {
        status += `Your load is ${context.currentLoad.weight}lbs going to ${context.currentLoad.delivery}. `;
      }
      
      return status;
    }
    
    // Delegate to regular text processing
    return this.generateResponse(transcript, context, []);
  }
}

export const aiService = new AIService();