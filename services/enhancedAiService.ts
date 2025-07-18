import { Platform } from 'react-native';
import { hybridApiService } from './hybridApiService';
import { TruckingContext } from '@/store/aiAssistantStore';

interface DiagnosticAnalysis {
  issues: string[];
  severity: number;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost?: number;
  safetyRisk?: boolean;
}

interface AIResponse {
  response: string;
  confidence: number;
  source: 'local' | 'cloud' | 'fallback';
  degraded: boolean;
}

class EnhancedAIService {
  private isInitialized = false;
  private localModel: any = null;
  private fallbackResponses: Map<string, string> = new Map();

  constructor() {
    this.initializeFallbackResponses();
  }

  private initializeFallbackResponses() {
    // Pre-defined responses for common queries when AI services are unavailable
    this.fallbackResponses.set('hours', 'Please check your ELD device for current Hours of Service status. Ensure you comply with DOT regulations.');
    this.fallbackResponses.set('weather', 'Check local weather conditions and road reports. Drive safely in adverse conditions.');
    this.fallbackResponses.set('maintenance', 'Refer to your maintenance schedule and address any warning lights immediately.');
    this.fallbackResponses.set('fuel', 'Plan fuel stops based on your route and tank capacity. Use truck stop apps for current prices.');
    this.fallbackResponses.set('safety', 'If this is an emergency, call 911. For non-emergency safety concerns, contact your dispatcher.');
    this.fallbackResponses.set('load', 'Verify load securement and weight distribution. Check your bills of lading for delivery requirements.');
  }

  async initializeModel(modelSize: 'small' | 'medium' | 'large' = 'small', onProgress?: (progress: number) => void) {
    if (this.isInitialized) return;
    
    try {
      // Simulate model loading for demo
      const steps = 10;
      for (let i = 0; i <= steps; i++) {
        onProgress?.(i / steps);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      this.isInitialized = true;
      onProgress?.(1);
    } catch (error) {
      console.error('Failed to initialize AI model:', error);
      // Continue with fallback responses
      this.isInitialized = true;
    }
  }

  async generateResponse(
    message: string, 
    context: TruckingContext,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<AIResponse> {
    if (!this.isInitialized) {
      await this.initializeModel();
    }

    const isDegraded = hybridApiService.isDegradedMode();
    
    // Try cloud AI first if not in degraded mode
    if (!isDegraded) {
      try {
        const cloudResponse = await this.getCloudAIResponse(message, context);
        if (cloudResponse) {
          return {
            response: cloudResponse,
            confidence: 0.9,
            source: 'cloud',
            degraded: false
          };
        }
      } catch (error) {
        console.log('Cloud AI failed, falling back to local processing');
      }
    }

    // Fallback to rule-based responses
    const fallbackResponse = this.generateFallbackResponse(message, context);
    
    return {
      response: fallbackResponse,
      confidence: 0.7,
      source: 'fallback',
      degraded: isDegraded
    };
  }

  private async getCloudAIResponse(message: string, context: TruckingContext): Promise<string | null> {
    try {
      // Build context-aware prompt
      const contextPrompt = this.buildContextPrompt(context);
      const fullPrompt = `${contextPrompt}\n\nUser: ${message}\n\nAssistant:`;

      // Use hybrid API service for NLP
      const analysis = await hybridApiService.analyzeDiagnostics(fullPrompt);
      
      if (analysis) {
        return this.formatAIResponse(message, context, analysis);
      }
    } catch (error) {
      console.error('Cloud AI request failed:', error);
    }
    
    return null;
  }

  private formatAIResponse(message: string, context: TruckingContext, analysis: any): string {
    const lowerMessage = message.toLowerCase();
    
    // Customize response based on analysis and context
    if (lowerMessage.includes('diagnostic') || lowerMessage.includes('engine')) {
      return `Based on the diagnostic analysis, I've identified ${analysis.issues?.length || 0} potential issues. ${this.getEngineAdvice(context)}`;
    }
    
    if (lowerMessage.includes('hours') || lowerMessage.includes('hos')) {
      return `${this.getHOSAdvice(context.hoursRemaining || 8)} Current analysis shows severity level ${analysis.severity || 1}.`;
    }
    
    return this.generateFallbackResponse(message, context);
  }

  private generateFallbackResponse(message: string, context: TruckingContext): string {
    const lowerMessage = message.toLowerCase();
    
    // Find the best matching fallback response
    for (const [key, response] of this.fallbackResponses) {
      if (lowerMessage.includes(key)) {
        return this.personalizeResponse(response, context);
      }
    }
    
    // Default response with context
    return this.personalizeResponse(
      "I'm here to help with trucking questions. I can assist with Hours of Service, weather, maintenance, and safety concerns.",
      context
    );
  }

  private personalizeResponse(response: string, context: TruckingContext): string {
    let personalizedResponse = response;
    
    if (context.currentStatus) {
      personalizedResponse += ` You are currently ${context.currentStatus}.`;
    }
    
    if (context.hoursRemaining && context.hoursRemaining <= 3) {
      personalizedResponse += " Note: You have limited driving time remaining.";
    }
    
    if (context.maintenanceAlerts && context.maintenanceAlerts.length > 0) {
      personalizedResponse += ` You have ${context.maintenanceAlerts.length} maintenance alert(s) that need attention.`;
    }
    
    return personalizedResponse;
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

  private getHOSAdvice(hoursRemaining: number): string {
    if (hoursRemaining <= 2) {
      return "You're getting close to your limit. Find a safe place to take your required break soon.";
    } else if (hoursRemaining <= 4) {
      return "You have some time left, but start planning for your next break.";
    } else {
      return "You have plenty of driving time remaining.";
    }
  }

  private getEngineAdvice(context: TruckingContext): string {
    if (context.maintenanceAlerts && context.maintenanceAlerts.length > 0) {
      return "Address maintenance alerts promptly to avoid breakdowns.";
    }
    return "Regular maintenance helps prevent costly repairs.";
  }

  async analyzeDiagnosticCodes(codes: string[]): Promise<DiagnosticAnalysis> {
    try {
      // Try cloud analysis first
      const analysis = await hybridApiService.analyzeDiagnostics(codes.join(', '));
      
      if (analysis) {
        return {
          issues: analysis.issues || [],
          severity: analysis.severity || 1,
          recommendations: this.generateRecommendations(codes),
          urgency: this.determineUrgency(analysis.severity || 1),
          safetyRisk: this.assessSafetyRisk(codes)
        };
      }
    } catch (error) {
      console.error('Diagnostic analysis failed:', error);
    }

    // Fallback to rule-based analysis
    return this.fallbackDiagnosticAnalysis(codes);
  }

  private fallbackDiagnosticAnalysis(codes: string[]): DiagnosticAnalysis {
    const criticalCodes = ['P0001', 'P0002', 'P0003', 'P0016', 'P0017'];
    const hasCritical = codes.some(code => criticalCodes.includes(code));
    
    return {
      issues: codes.map(code => `Diagnostic code: ${code}`),
      severity: hasCritical ? 4 : 2,
      recommendations: this.generateRecommendations(codes),
      urgency: hasCritical ? 'critical' : 'medium',
      safetyRisk: hasCritical
    };
  }

  private generateRecommendations(codes: string[]): string[] {
    const recommendations = [
      'Contact your maintenance department',
      'Schedule service appointment',
      'Monitor vehicle performance closely'
    ];
    
    if (codes.some(code => code.startsWith('P00'))) {
      recommendations.unshift('Stop driving immediately - engine issue detected');
    }
    
    return recommendations;
  }

  private determineUrgency(severity: number): 'low' | 'medium' | 'high' | 'critical' {
    if (severity >= 4) return 'critical';
    if (severity >= 3) return 'high';
    if (severity >= 2) return 'medium';
    return 'low';
  }

  private assessSafetyRisk(codes: string[]): boolean {
    const safetyRelatedCodes = ['P0001', 'P0002', 'P0003', 'P0016', 'P0017', 'P0300'];
    return codes.some(code => safetyRelatedCodes.includes(code));
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
        "Maintenance reminders"
      );
    }
    
    return suggestions.slice(0, 4);
  }

  async processVoiceCommand(transcript: string, context: TruckingContext): Promise<AIResponse> {
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
      
      return {
        response: status,
        confidence: 0.95,
        source: 'local',
        degraded: false
      };
    }
    
    // Delegate to regular text processing
    return this.generateResponse(transcript, context, []);
  }

  // Get service status
  getServiceStatus(): {
    aiAvailable: boolean;
    degradedMode: boolean;
    lastUpdate: string;
    capabilities: string[];
  } {
    const isDegraded = hybridApiService.isDegradedMode();
    
    return {
      aiAvailable: this.isInitialized,
      degradedMode: isDegraded,
      lastUpdate: new Date().toISOString(),
      capabilities: isDegraded 
        ? ['Basic responses', 'Rule-based analysis', 'Cached suggestions']
        : ['Advanced AI responses', 'Real-time analysis', 'Context awareness', 'Voice processing']
    };
  }
}

export const enhancedAiService = new EnhancedAIService();
export default enhancedAiService;