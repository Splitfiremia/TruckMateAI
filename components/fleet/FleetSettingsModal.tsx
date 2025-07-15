import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Switch,
  TextInput,
  Alert
} from 'react-native';
import { X, Palette, Shield, Bell, BarChart, Save } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useFleetStore } from '@/store/fleetStore';

interface FleetSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function FleetSettingsModal({ visible, onClose }: FleetSettingsModalProps) {
  const { settings, updateFleetSettings } = useFleetStore();
  const [activeTab, setActiveTab] = useState<'branding' | 'compliance' | 'features' | 'notifications'>('branding');
  const [localSettings, setLocalSettings] = useState(settings);
  
  if (!settings || !localSettings) {
    return null;
  }
  
  const handleSave = () => {
    updateFleetSettings(localSettings);
    Alert.alert('Settings Saved', 'Fleet settings have been updated successfully.');
    onClose();
  };
  
  const updateSetting = (section: keyof typeof localSettings, key: string, value: any) => {
    setLocalSettings(prev => {
      if (!prev) return null;
      const currentSection = prev[section];
      if (typeof currentSection === 'object' && currentSection !== null) {
        return {
          ...prev,
          [section]: {
            ...currentSection,
            [key]: value,
          },
        };
      }
      return prev;
    });
  };
  
  const renderTabButton = (tab: typeof activeTab, icon: React.ReactNode, label: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && styles.activeTabButton
      ]}
      onPress={() => setActiveTab(tab)}
    >
      {icon}
      <Text style={[
        styles.tabButtonText,
        activeTab === tab && styles.activeTabButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  const renderSwitch = (
    section: keyof typeof localSettings,
    key: string,
    label: string,
    description: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={(() => {
          const sectionData = localSettings[section];
          if (typeof sectionData === 'object' && sectionData !== null) {
            return (sectionData as any)[key] as boolean;
          }
          return false;
        })()}
        onValueChange={(value) => updateSetting(section, key, value)}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={colors.text}
      />
    </View>
  );
  
  const renderBrandingTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Company Branding</Text>
      
      {renderSwitch(
        'companyBranding',
        'showLogo',
        'Show Company Logo',
        'Display company logo in the app header'
      )}
      
      {renderSwitch(
        'companyBranding',
        'customColors',
        'Custom Brand Colors',
        'Use company colors throughout the app'
      )}
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Welcome Message</Text>
        <TextInput
          style={styles.textInput}
          value={localSettings.companyBranding.welcomeMessage || ''}
          onChangeText={(text) => updateSetting('companyBranding', 'welcomeMessage', text)}
          placeholder="Enter custom welcome message"
          placeholderTextColor={colors.textSecondary}
          multiline
        />
      </View>
    </ScrollView>
  );
  
  const renderComplianceTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Compliance Rules</Text>
      
      {renderSwitch(
        'complianceRules',
        'stricterHosRules',
        'Stricter HOS Rules',
        'Enforce company-specific hours of service rules'
      )}
      
      {renderSwitch(
        'complianceRules',
        'mandatoryPreTrip',
        'Mandatory Pre-Trip',
        'Require pre-trip inspection before driving'
      )}
      
      {renderSwitch(
        'complianceRules',
        'requirePostTrip',
        'Require Post-Trip',
        'Require post-trip inspection after driving'
      )}
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Custom Break Requirement (hours)</Text>
        <TextInput
          style={styles.numberInput}
          value={localSettings.complianceRules.customBreakRequirements?.toString() || '8'}
          onChangeText={(text) => updateSetting('complianceRules', 'customBreakRequirements', parseInt(text) || 8)}
          placeholder="8"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
        />
      </View>
    </ScrollView>
  );
  
  const renderFeaturesTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>App Features</Text>
      
      {renderSwitch(
        'features',
        'voiceCommands',
        'Voice Commands',
        'Enable hands-free voice control'
      )}
      
      {renderSwitch(
        'features',
        'receiptScanning',
        'Receipt Scanning',
        'Allow drivers to scan receipts with camera'
      )}
      
      {renderSwitch(
        'features',
        'loadNegotiation',
        'Load Negotiation',
        'Enable load rate negotiation features'
      )}
      
      {renderSwitch(
        'features',
        'routeOptimization',
        'Route Optimization',
        'Provide optimized routing suggestions'
      )}
      
      {renderSwitch(
        'features',
        'maintenanceTracking',
        'Maintenance Tracking',
        'Track vehicle maintenance schedules'
      )}
    </ScrollView>
  );
  
  const renderNotificationsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      
      {renderSwitch(
        'notifications',
        'complianceAlerts',
        'Compliance Alerts',
        'Send alerts for compliance violations'
      )}
      
      {renderSwitch(
        'notifications',
        'maintenanceReminders',
        'Maintenance Reminders',
        'Remind drivers of upcoming maintenance'
      )}
      
      {renderSwitch(
        'notifications',
        'loadUpdates',
        'Load Updates',
        'Notify drivers of load changes'
      )}
      
      <Text style={styles.sectionTitle}>Reporting</Text>
      
      {renderSwitch(
        'reporting',
        'dailyReports',
        'Daily Reports',
        'Generate daily driver reports'
      )}
      
      {renderSwitch(
        'reporting',
        'weeklyReports',
        'Weekly Reports',
        'Generate weekly fleet summaries'
      )}
      
      {renderSwitch(
        'reporting',
        'complianceReports',
        'Compliance Reports',
        'Generate compliance violation reports'
      )}
    </ScrollView>
  );
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Fleet Settings</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabBar}>
          {renderTabButton('branding', <Palette size={18} color={activeTab === 'branding' ? colors.text : colors.textSecondary} />, 'Branding')}
          {renderTabButton('compliance', <Shield size={18} color={activeTab === 'compliance' ? colors.text : colors.textSecondary} />, 'Compliance')}
          {renderTabButton('features', <BarChart size={18} color={activeTab === 'features' ? colors.text : colors.textSecondary} />, 'Features')}
          {renderTabButton('notifications', <Bell size={18} color={activeTab === 'notifications' ? colors.text : colors.textSecondary} />, 'Notifications')}
        </View>
        
        {activeTab === 'branding' && renderBrandingTab()}
        {activeTab === 'compliance' && renderComplianceTab()}
        {activeTab === 'features' && renderFeaturesTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={20} color={colors.text} />
            <Text style={styles.saveButtonText}>Save Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryLight,
  },
  tabButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activeTabButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    color: colors.text,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  numberInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    color: colors.text,
    width: 80,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});