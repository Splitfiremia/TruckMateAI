import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { X, Eye, EyeOff, ExternalLink, Info } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Integration } from '@/store/integrationStore';

interface IntegrationConnectionModalProps {
  visible: boolean;
  integration: Integration | null;
  onClose: () => void;
  onConnect: (credentials: Record<string, any>) => Promise<boolean>;
  isLoading: boolean;
}

const getConnectionFields = (integration: Integration | null) => {
  if (!integration) return [];
  
  const fieldMap: Record<string, any[]> = {
    gmail: [
      { key: 'email', label: 'Gmail Address', type: 'email', required: true },
      { key: 'appPassword', label: 'App Password', type: 'password', required: true, help: 'Generate an app password in your Google Account settings' },
    ],
    outlook: [
      { key: 'email', label: 'Outlook Email', type: 'email', required: true },
      { key: 'password', label: 'Password', type: 'password', required: true },
      { key: 'clientId', label: 'Client ID (Optional)', type: 'text', required: false },
    ],
    slack: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'url', required: true, help: 'Create a webhook in your Slack workspace settings' },
      { key: 'channel', label: 'Default Channel', type: 'text', required: false, placeholder: '#general' },
    ],
    teams: [
      { key: 'webhookUrl', label: 'Teams Webhook URL', type: 'url', required: true },
      { key: 'tenantId', label: 'Tenant ID (Optional)', type: 'text', required: false },
    ],
    'google-drive': [
      { key: 'email', label: 'Google Account', type: 'email', required: true },
      { key: 'serviceAccountKey', label: 'Service Account Key (JSON)', type: 'textarea', required: true },
      { key: 'folderId', label: 'Folder ID (Optional)', type: 'text', required: false },
    ],
    dropbox: [
      { key: 'accessToken', label: 'Access Token', type: 'password', required: true },
      { key: 'appKey', label: 'App Key', type: 'text', required: true },
    ],
    'google-calendar': [
      { key: 'email', label: 'Google Account', type: 'email', required: true },
      { key: 'calendarId', label: 'Calendar ID', type: 'text', required: false, placeholder: 'primary' },
      { key: 'serviceAccountKey', label: 'Service Account Key (JSON)', type: 'textarea', required: true },
    ],
    webhook: [
      { key: 'url', label: 'Webhook URL', type: 'url', required: true },
      { key: 'method', label: 'HTTP Method', type: 'select', options: ['POST', 'PUT', 'PATCH'], required: true, default: 'POST' },
      { key: 'headers', label: 'Custom Headers (JSON)', type: 'textarea', required: false, placeholder: '{"Authorization": "Bearer token"}' },
      { key: 'secret', label: 'Secret Key (Optional)', type: 'password', required: false },
    ],
  };
  
  return fieldMap[integration.id] || [];
};

export const IntegrationConnectionModal: React.FC<IntegrationConnectionModalProps> = ({
  visible,
  integration,
  onClose,
  onConnect,
  isLoading,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  
  const fields = getConnectionFields(integration);
  
  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const togglePasswordVisibility = (key: string) => {
    setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleConnect = async () => {
    if (!integration) return;
    
    // Validate required fields
    const requiredFields = fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.key]?.trim());
    
    if (missingFields.length > 0) {
      Alert.alert(
        'Missing Information',
        `Please fill in the following required fields: ${missingFields.map(f => f.label).join(', ')}`
      );
      return;
    }
    
    // Process form data
    const processedData = { ...formData };
    
    // Parse JSON fields
    fields.forEach(field => {
      if (field.type === 'textarea' && field.key.includes('JSON') && processedData[field.key]) {
        try {
          processedData[field.key] = JSON.parse(processedData[field.key]);
        } catch (error) {
          Alert.alert('Invalid JSON', `Please check the format of ${field.label}`);
          return;
        }
      }
    });
    
    const success = await onConnect(processedData);
    if (success) {
      setFormData({});
      setShowPasswords({});
      onClose();
    }
  };
  
  const openOAuthHelp = (integration: Integration) => {
    const helpUrls: Record<string, string> = {
      gmail: 'https://support.google.com/accounts/answer/185833',
      outlook: 'https://docs.microsoft.com/en-us/azure/active-directory/develop/',
      slack: 'https://api.slack.com/messaging/webhooks',
      teams: 'https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/',
      'google-drive': 'https://developers.google.com/drive/api/v3/quickstart',
      'google-calendar': 'https://developers.google.com/calendar/api/quickstart',
    };
    
    const url = helpUrls[integration.id];
    if (url) {
      Alert.alert(
        'Setup Help',
        `For detailed setup instructions, visit: ${url}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Link', onPress: () => console.log('Open:', url) },
        ]
      );
    }
  };
  
  if (!integration) return null;
  
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Connect {integration.name}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color={colors.text} size={24} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>
            <Info color={colors.primaryLight} size={20} />
            <Text style={styles.infoText}>
              {integration.description}
            </Text>
          </View>
          
          {fields.map((field) => (
            <View key={field.key} style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                {field.label}
                {field.required && <Text style={styles.required}> *</Text>}
              </Text>
              
              {field.help && (
                <Text style={styles.fieldHelp}>{field.help}</Text>
              )}
              
              {field.type === 'select' ? (
                <View style={styles.selectContainer}>
                  {field.options?.map((option: string) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.selectOption,
                        formData[field.key] === option && styles.selectOptionActive,
                      ]}
                      onPress={() => handleInputChange(field.key, option)}
                    >
                      <Text style={[
                        styles.selectOptionText,
                        formData[field.key] === option && styles.selectOptionTextActive,
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : field.type === 'textarea' ? (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData[field.key] || ''}
                  onChangeText={(value) => handleInputChange(field.key, value)}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              ) : (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={formData[field.key] || ''}
                    onChangeText={(value) => handleInputChange(field.key, value)}
                    placeholder={field.placeholder}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={field.type === 'password' && !showPasswords[field.key]}
                    keyboardType={field.type === 'email' ? 'email-address' : 'default'}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  
                  {field.type === 'password' && (
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => togglePasswordVisibility(field.key)}
                    >
                      {showPasswords[field.key] ? (
                        <EyeOff color={colors.textSecondary} size={20} />
                      ) : (
                        <Eye color={colors.textSecondary} size={20} />
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
          
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => openOAuthHelp(integration)}
          >
            <ExternalLink color={colors.primaryLight} size={16} />
            <Text style={styles.helpButtonText}>Setup Instructions</Text>
          </TouchableOpacity>
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.connectButton, isLoading && styles.connectButtonDisabled]}
            onPress={handleConnect}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.text} size="small" />
            ) : (
              <Text style={styles.connectButtonText}>Connect</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight + '20',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginLeft: 12,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  required: {
    color: colors.danger,
  },
  fieldHelp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  selectContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  selectOption: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  selectOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  selectOptionTextActive: {
    color: colors.text,
    fontWeight: '500',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundLight,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  helpButtonText: {
    fontSize: 14,
    color: colors.primaryLight,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  connectButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  connectButtonDisabled: {
    opacity: 0.6,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});