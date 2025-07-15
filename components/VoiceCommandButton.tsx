import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Mic, MicOff } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useVoiceCommandStore } from '@/store/voiceCommandStore';

interface VoiceCommandButtonProps {
  size?: number;
  onCommandProcessed?: (response: string) => void;
}

export default function VoiceCommandButton({ 
  size = 64,
  onCommandProcessed
}: VoiceCommandButtonProps) {
  const { isListening, startListening, stopListening, processCommand } = useVoiceCommandStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePress = () => {
    if (isListening) {
      stopListening();
      simulateVoiceRecognition();
    } else {
      startListening();
    }
  };
  
  const simulateVoiceRecognition = () => {
    setIsProcessing(true);
    
    // Simulate voice recognition delay
    setTimeout(() => {
      const mockCommands = [
        "Start my shift",
        "Log fuel stop",
        "Start break",
        "Current status",
        "Next load details"
      ];
      
      const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
      const response = processCommand(randomCommand);
      
      if (onCommandProcessed) {
        onCommandProcessed(response);
      }
      
      setIsProcessing(false);
    }, 1500);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            backgroundColor: isListening ? colors.danger : colors.primaryLight
          }
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color={colors.text} size="small" />
        ) : (
          isListening ? (
            <MicOff size={size * 0.4} color={colors.text} />
          ) : (
            <Mic size={size * 0.4} color={colors.text} />
          )
        )}
      </TouchableOpacity>
      
      <Text style={styles.label}>
        {isProcessing ? "Processing..." : isListening ? "Listening..." : "Voice Command"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});