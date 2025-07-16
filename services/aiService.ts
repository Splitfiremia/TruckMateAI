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
    let prompt = \"You are an AI assistant specialized in trucking and logistics. \";\n    \n    if (context.currentStatus) {\n      prompt += `The driver is currently ${context.currentStatus}. `;\n    }\n    \n    if (context.hoursRemaining) {\n      prompt += `They have ${context.hoursRemaining} hours remaining on their HOS. `;\n    }\n    \n    if (context.currentLoad) {\n      prompt += `Current load: ${context.currentLoad.weight}lbs from ${context.currentLoad.pickup} to ${context.currentLoad.delivery}. `;\n    }\n    \n    if (context.weatherConditions) {\n      prompt += `Weather conditions: ${context.weatherConditions}. `;\n    }\n    \n    if (context.maintenanceAlerts && context.maintenanceAlerts.length > 0) {\n      prompt += `Maintenance alerts: ${context.maintenanceAlerts.join(', ')}. `;\n    }\n    \n    return prompt;\n  }\n  \n  private buildConversationPrompt(history: Array<{ role: 'user' | 'assistant'; content: string }>): string {\n    return history.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join('\\n');\n  }\n  \n  private generateTruckingResponse(message: string, context: TruckingContext): string {\n    const lowerMessage = message.toLowerCase();\n    \n    // HOS related queries\n    if (lowerMessage.includes('hours') || lowerMessage.includes('hos') || lowerMessage.includes('drive time')) {\n      if (context.hoursRemaining) {\n        return `You have ${context.hoursRemaining} hours remaining on your current duty cycle. ${this.getHOSAdvice(context.hoursRemaining)}`;\n      }\n      return \"I'd be happy to help with Hours of Service questions. Could you tell me your current status and how many hours you've been driving today?\";\n    }\n    \n    // Weather related queries\n    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('snow')) {\n      if (context.weatherConditions) {\n        return `Current weather conditions: ${context.weatherConditions}. ${this.getWeatherAdvice(context.weatherConditions)}`;\n      }\n      return \"I can help with weather-related driving advice. What are the current conditions you're experiencing?\";\n    }\n    \n    // Route and navigation\n    if (lowerMessage.includes('route') || lowerMessage.includes('traffic') || lowerMessage.includes('directions')) {\n      return \"For optimal routing, I recommend checking current traffic conditions and considering truck-specific restrictions. Would you like me to help you plan your route or find truck stops along the way?\";\n    }\n    \n    // Fuel related\n    if (lowerMessage.includes('fuel') || lowerMessage.includes('gas') || lowerMessage.includes('diesel')) {\n      if (context.fuelLevel) {\n        return `Your current fuel level is ${context.fuelLevel}%. ${this.getFuelAdvice(context.fuelLevel)}`;\n      }\n      return \"I can help you find fuel stops and optimize fuel efficiency. What's your current fuel situation?\";\n    }\n    \n    // Maintenance\n    if (lowerMessage.includes('maintenance') || lowerMessage.includes('repair') || lowerMessage.includes('inspection')) {\n      if (context.maintenanceAlerts && context.maintenanceAlerts.length > 0) {\n        return `You have the following maintenance alerts: ${context.maintenanceAlerts.join(', ')}. I recommend addressing these as soon as possible to avoid potential issues.`;\n      }\n      return \"Regular maintenance is crucial for safe operation. What specific maintenance concerns do you have?\";\n    }\n    \n    // Load information\n    if (lowerMessage.includes('load') || lowerMessage.includes('delivery') || lowerMessage.includes('pickup')) {\n      if (context.currentLoad) {\n        return `Your current load is ${context.currentLoad.weight}lbs, picking up from ${context.currentLoad.pickup} and delivering to ${context.currentLoad.delivery}. Need help with anything specific about this load?`;\n      }\n      return \"I can help with load planning and delivery optimization. What would you like to know?\";\n    }\n    \n    // Compliance and regulations\n    if (lowerMessage.includes('dot') || lowerMessage.includes('compliance') || lowerMessage.includes('regulation')) {\n      return \"I can help with DOT compliance, inspection requirements, and regulatory questions. What specific compliance topic would you like assistance with?\";\n    }\n    \n    // Safety\n    if (lowerMessage.includes('safety') || lowerMessage.includes('accident') || lowerMessage.includes('emergency')) {\n      return \"Safety is the top priority. If you're experiencing an emergency, please contact emergency services immediately. For general safety questions, I'm here to help with best practices and procedures.\";\n    }\n    \n    // Default response\n    return \"I'm your AI trucking assistant, here to help with Hours of Service, route planning, weather conditions, maintenance, compliance, and safety. What would you like assistance with today?\";\n  }\n  \n  private getHOSAdvice(hoursRemaining: number): string {\n    if (hoursRemaining <= 2) {\n      return \"You're getting close to your limit. Consider finding a safe place to take your required break soon.\";\n    } else if (hoursRemaining <= 4) {\n      return \"You have some time left, but start planning for your next break location.\";\n    }\n    return \"You have plenty of time remaining on your current cycle.\";\n  }\n  \n  private getWeatherAdvice(conditions: string): string {\n    const lowerConditions = conditions.toLowerCase();\n    if (lowerConditions.includes('rain') || lowerConditions.includes('wet')) {\n      return \"Reduce speed, increase following distance, and use headlights. Be extra cautious on bridges and overpasses.\";\n    } else if (lowerConditions.includes('snow') || lowerConditions.includes('ice')) {\n      return \"Drive slowly, avoid sudden movements, and consider chaining up if required. Check road conditions frequently.\";\n    } else if (lowerConditions.includes('wind')) {\n      return \"Be prepared for crosswinds, especially on bridges and open areas. Reduce speed and maintain firm grip on steering wheel.\";\n    }\n    return \"Monitor conditions closely and adjust driving accordingly.\";\n  }\n  \n  private getFuelAdvice(fuelLevel: number): string {\n    if (fuelLevel <= 25) {\n      return \"Your fuel is getting low. I recommend finding a fuel stop soon to avoid running out.\";\n    } else if (fuelLevel <= 50) {\n      return \"Consider fueling up at the next convenient truck stop.\";\n    }\n    return \"Your fuel level looks good for now.\";\n  }\n}\n\nexport const aiService = new AIService();