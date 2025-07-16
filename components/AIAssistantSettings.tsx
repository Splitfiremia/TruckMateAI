import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { 
  Bot, 
  Mic, 
  Volume2, 
  Trash2, 
  Download,
  Settings as SettingsIcon,
  Brain,
  MessageSquare
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAIAssistantStore } from '@/store/aiAssistantStore';

interface AIAssistantSettingsProps {
  onClose?: () => void;
}

export default function AIAssistantSettings({ onClose }: AIAssistantSettingsProps) {
  const {
    conversations,
    voiceEnabled,
    autoSpeak,
    modelSize,
    isModelLoaded,
    modelLoadingProgress,
    setVoiceEnabled,
    setAutoSpeak,
    setModelSize,
    clearAllConversations,
    setModelLoaded,
  } = useAIAssistantStore();

  const handleClearConversations = () => {
    Alert.alert(
      'Clear All Conversations',
      'This will permanently delete all your chat history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAllConversations();
            Alert.alert('Success', 'All conversations have been cleared.');
          },
        },
      ]
    );
  };

  const handleModelSizeChange = (size: 'small' | 'medium' | 'large') => {
    Alert.alert(
      'Change Model Size',
      `Switching to ${size} model will require reloading the AI. This may take a few moments.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            setModelSize(size);
            setModelLoaded(false);
            // The model will be reloaded automatically when needed
          },
        },
      ]
    );
  };

  const getModelSizeDescription = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small':
        return 'Fast responses, basic capabilities';
      case 'medium':
        return 'Balanced performance and capabilities';
      case 'large':
        return 'Best capabilities, slower responses';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Bot size={24} color={colors.primaryLight} />
        <Text style={styles.headerTitle}>AI Assistant Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voice Features</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Mic size={20} color={colors.text.secondary} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Voice Input</Text>
              <Text style={styles.settingDescription}>
                Enable microphone for voice commands
              </Text>
            </View>
          </View>
          <Switch
            value={voiceEnabled}
            onValueChange={setVoiceEnabled}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={voiceEnabled ? colors.white : colors.text.secondary}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Volume2 size={20} color={colors.text.secondary} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Auto-Speak Responses</Text>
              <Text style={styles.settingDescription}>
                Automatically read AI responses aloud
              </Text>
            </View>
          </View>
          <Switch
            value={autoSpeak}
            onValueChange={setAutoSpeak}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={autoSpeak ? colors.white : colors.text.secondary}
            disabled={!voiceEnabled}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Model</Text>
        
        <View style={styles.modelStatus}>
          <Brain size={20} color={isModelLoaded ? colors.success : colors.warning} />
          <Text style={styles.modelStatusText}>
            Status: {isModelLoaded ? 'Ready' : `Loading... ${Math.round(modelLoadingProgress * 100)}%`}
          </Text>
        </View>

        <Text style={styles.modelSizeLabel}>Model Size</Text>
        
        {(['small', 'medium', 'large'] as const).map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.modelOption,
              modelSize === size && styles.modelOptionSelected,
            ]}
            onPress={() => handleModelSizeChange(size)}
          >
            <View style={styles.modelOptionLeft}>
              <View style={[
                styles.radioButton,
                modelSize === size && styles.radioButtonSelected,
              ]} />
              <View>
                <Text style={[
                  styles.modelOptionTitle,
                  modelSize === size && styles.modelOptionTitleSelected,
                ]}>
                  {size.charAt(0).toUpperCase() + size.slice(1)} Model
                </Text>
                <Text style={styles.modelOptionDescription}>
                  {getModelSizeDescription(size)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <View style={styles.dataStats}>
          <MessageSquare size={20} color={colors.text.secondary} />
          <Text style={styles.dataStatsText}>
            {conversations.length} conversations stored
          </Text>
        </View>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleClearConversations}
        >
          <Trash2 size={20} color={colors.error} />
          <Text style={styles.dangerButtonText}>Clear All Conversations</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          The AI Trucking Assistant uses on-device machine learning to provide 
          intelligent assistance with Hours of Service, compliance, route planning, 
          and safety recommendations. Your conversations are stored locally and 
          never sent to external servers.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  modelStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    marginBottom: 16,
  },
  modelStatusText: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 8,
  },
  modelSizeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  modelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  modelOptionSelected: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.background.secondary,
  },
  modelOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primaryLight,
  },
  modelOptionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  modelOptionTitleSelected: {
    color: colors.primaryLight,
  },
  modelOptionDescription: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  dataStats: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    marginBottom: 12,
  },
  dataStatsText: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 8,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: 'transparent',
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.error,
    marginLeft: 8,
  },
  aboutText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});