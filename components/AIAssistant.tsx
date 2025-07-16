import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  Animated,
  Modal,
} from 'react-native';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  User,
  Loader,
  MessageSquare,
  Settings as SettingsIcon
} from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { colors } from '@/constants/colors';
import { useAIAssistantStore, AIMessage } from '@/store/aiAssistantStore';
import { aiService } from '@/services/aiService';
import AIAssistantSettings from './AIAssistantSettings';

interface AIAssistantProps {
  onClose?: () => void;
  showHeader?: boolean;
}

export default function AIAssistant({ onClose, showHeader = true }: AIAssistantProps) {
  const {
    conversations,
    activeConversationId,
    isModelLoaded,
    isProcessing,
    modelLoadingProgress,
    isListening,
    isRecording,
    isSpeaking,
    truckingContext,
    voiceEnabled,
    autoSpeak,
    createConversation,
    setActiveConversation,
    addMessage,
    setModelLoaded,
    setProcessing,
    setModelLoadingProgress,
    setListening,
    setRecording,
    setSpeaking,
  } = useAIAssistantStore();

  const [inputText, setInputText] = useState('');
  const [audioRecording, setAudioRecording] = useState<Audio.Recording | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  useEffect(() => {
    if (!activeConversationId && conversations.length === 0) {
      createConversation('New Chat');
    }
  }, [activeConversationId, conversations.length, createConversation]);

  useEffect(() => {
    if (!isModelLoaded) {
      initializeAI();
    }
  }, [isModelLoaded]);

  useEffect(() => {
    if (isRecording) {
      startPulseAnimation();
    } else {
      stopPulseAnimation();
    }
  }, [isRecording]);

  const initializeAI = async () => {
    try {
      await aiService.initializeModel('small', (progress) => {
        setModelLoadingProgress(progress);
      });
      setModelLoaded(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize AI model');
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.setValue(1);
  };

  const sendMessage = async (text: string, type: 'text' | 'voice' = 'text') => {
    if (!text.trim() || !activeConversationId) return;

    // Add user message
    addMessage(activeConversationId, {
      role: 'user',
      content: text,
      type,
    });

    setProcessing(true);

    try {
      // Get conversation history for context
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Generate AI response
      const response = await aiService.generateResponse(
        text,
        truckingContext,
        conversationHistory
      );

      // Add AI response
      addMessage(activeConversationId, {
        role: 'assistant',
        content: response,
        type: 'text',
      });

      // Auto-speak if enabled
      if (autoSpeak && voiceEnabled) {
        speakText(response);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get AI response');
    } finally {
      setProcessing(false);
    }
  };

  const startRecording = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Voice Input', 'Voice recording is not available on web');
      return;
    }

    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setAudioRecording(recording);
      setRecording(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!audioRecording) return;

    try {
      setRecording(false);
      await audioRecording.stopAndUnloadAsync();
      const uri = audioRecording.getURI();
      
      if (uri) {
        // In a real app, you would transcribe the audio here
        // For now, we'll just show a placeholder
        Alert.alert('Voice Input', 'Voice transcription would happen here');
      }
      
      setAudioRecording(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const speakText = async (text: string) => {
    if (!voiceEnabled) return;

    try {
      setSpeaking(true);
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
      });
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setSpeaking(false);
    }
  };

  const renderMessage = (message: AIMessage, index: number) => {
    const isUser = message.role === 'user';
    const isVoice = message.type === 'voice';

    return (
      <View key={index} style={[styles.messageContainer, isUser ? styles.userMessage : styles.assistantMessage]}>
        <View style={styles.messageHeader}>
          {isUser ? (
            <User size={16} color={colors.primary} />
          ) : (
            <Bot size={16} color={colors.secondary} />
          )}
          <Text style={styles.messageRole}>
            {isUser ? 'You' : 'AI Assistant'}
          </Text>
          {isVoice && (
            <Volume2 size={14} color={colors.text.secondary} style={styles.voiceIcon} />
          )}
        </View>
        <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.assistantMessageText]}>
          {message.content}
        </Text>
        {!isUser && (
          <TouchableOpacity
            style={styles.speakButton}
            onPress={() => speakText(message.content)}
            disabled={isSpeaking}
          >
            {isSpeaking ? (
              <VolumeX size={16} color={colors.text.secondary} />
            ) : (
              <Volume2 size={16} color={colors.text.secondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (!isModelLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Bot size={48} color={colors.primary} />
        <Text style={styles.loadingTitle}>Initializing AI Assistant</Text>
        <Text style={styles.loadingText}>
          Loading model... {Math.round(modelLoadingProgress * 100)}%
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${modelLoadingProgress * 100}%` }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Bot size={24} color={colors.primary} />
            <Text style={styles.headerTitle}>AI Assistant</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setSettingsVisible(true)}
            >
              <SettingsIcon size={20} color={colors.text.secondary} />
            </TouchableOpacity>
            {onClose && (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={onClose}
              >
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageSquare size={48} color={colors.text.secondary} />
            <Text style={styles.emptyStateTitle}>Welcome to AI Assistant</Text>
            <Text style={styles.emptyStateText}>
              I'm here to help with trucking questions, HOS compliance, weather updates, and more.
            </Text>
          </View>
        ) : (
          messages.map(renderMessage)
        )}
        
        {isProcessing && (
          <View style={[styles.messageContainer, styles.assistantMessage]}>
            <View style={styles.messageHeader}>
              <Bot size={16} color={colors.secondary} />
              <Text style={styles.messageRole}>AI Assistant</Text>
            </View>
            <View style={styles.typingIndicator}>
              <Loader size={16} color={colors.secondary} />
              <Text style={styles.typingText}>Thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask me anything about trucking..."
          placeholderTextColor={colors.text.secondary}
          multiline
          maxLength={500}
        />
        <View style={styles.inputActions}>
          {voiceEnabled && (
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={[styles.actionButton, isRecording && styles.recordingButton]}
                onPress={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
              >
                {isRecording ? (
                  <MicOff size={20} color={colors.white} />
                ) : (
                  <Mic size={20} color={colors.text.secondary} />
                )}
              </TouchableOpacity>
            </Animated.View>
          )}
          <TouchableOpacity
            style={[styles.actionButton, styles.sendButton]}
            onPress={() => {
              if (inputText.trim()) {
                sendMessage(inputText);
                setInputText('');
              }
            }}
            disabled={!inputText.trim() || isProcessing}
          >
            <Send size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={settingsVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AIAssistantSettings onClose={() => setSettingsVisible(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: 20,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  closeButton: {
    fontSize: 24,
    color: colors.text.secondary,
    fontWeight: '300',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  messageContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageRole: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
    marginLeft: 6,
  },
  voiceIcon: {
    marginLeft: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.white,
  },
  assistantMessageText: {
    color: colors.text.primary,
  },
  speakButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    padding: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    maxHeight: 100,
  },
  inputActions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: 8,
  },
  recordingButton: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});