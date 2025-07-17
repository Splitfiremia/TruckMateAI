import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { 
  Settings, 
  Bell, 
  Shield, 
  Clock, 
  Smartphone, 
  Mail, 
  Database,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Unlink
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useELDStore } from '@/store/eldStore';

interface SettingItemProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  value?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  showArrow?: boolean;
  disabled?: boolean;
}

function SettingItem({ title, description, icon, value, onToggle, onPress, showArrow = false, disabled = false }: SettingItemProps) {
  return (
    <Pressable 
      style={[styles.settingItem, disabled && styles.disabledItem]} 
      onPress={onPress}
      disabled={disabled || (!onPress && !onToggle)}
    >
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, disabled && styles.disabledText]}>{title}</Text>
        {description && (
          <Text style={[styles.settingDescription, disabled && styles.disabledText]}>
            {description}
          </Text>
        )}
      </View>
      {onToggle && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary + '40' }}
          thumbColor={value ? colors.primary : colors.textSecondary}
          disabled={disabled}
        />
      )}
      {showArrow && (
        <Text style={styles.arrow}>›</Text>
      )}
    </Pressable>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
}

export default function ELDSettings() {
  const { 
    connection, 
    settings, 
    updateSettings, 
    disconnectProvider, 
    syncData, 
    isSyncing,
    clearData 
  } = useELDStore();

  const [localSettings, setLocalSettings] = useState(settings);

  if (!connection || !settings) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Settings size={48} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No ELD Connection</Text>
          <Text style={styles.emptySubtitle}>
            Connect your ELD system to access integration settings
          </Text>
        </View>
      </View>
    );
  }

  const handleSettingChange = (key: string, value: any) => {
    const updatedSettings = { ...localSettings, [key]: value };
    setLocalSettings(updatedSettings);
    updateSettings(updatedSettings);
  };

  const handleFeatureToggle = (feature: string, value: boolean) => {
    const updatedFeatures = { ...localSettings?.enabledFeatures, [feature]: value };
    handleSettingChange('enabledFeatures', updatedFeatures);
  };

  const handleAlertToggle = (alert: string, value: boolean) => {
    const updatedAlerts = { ...localSettings?.alertPreferences, [alert]: value };
    handleSettingChange('alertPreferences', updatedAlerts);
  };

  const handlePrivacyToggle = (privacy: string, value: boolean) => {
    const updatedPrivacy = { ...localSettings?.privacySettings, [privacy]: value };
    handleSettingChange('privacySettings', updatedPrivacy);
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect ELD Provider',
      'This will remove all synced data and disable ELD features. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            disconnectProvider();
            Alert.alert('Disconnected', 'ELD provider has been disconnected successfully.');
          }
        }
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear ELD Data',
      'This will remove all cached ELD data but keep your connection. Data will be re-synced on next update.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: () => {
            clearData();
            Alert.alert('Data Cleared', 'ELD data has been cleared successfully.');
          }
        }
      ]
    );
  };

  const handleSyncFrequencyChange = () => {
    Alert.alert(
      'Sync Frequency',
      'Choose how often to sync data with your ELD provider',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '1 minute', onPress: () => handleSettingChange('syncFrequency', 1) },
        { text: '5 minutes', onPress: () => handleSettingChange('syncFrequency', 5) },
        { text: '15 minutes', onPress: () => handleSettingChange('syncFrequency', 15) },
        { text: '30 minutes', onPress: () => handleSettingChange('syncFrequency', 30) },
      ]
    );
  };

  const handleDataRetentionChange = () => {
    Alert.alert(
      'Data Retention',
      'Choose how long to keep ELD data locally',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '30 days', onPress: () => handleSettingChange('dataRetention', 30) },
        { text: '60 days', onPress: () => handleSettingChange('dataRetention', 60) },
        { text: '90 days', onPress: () => handleSettingChange('dataRetention', 90) },
        { text: '180 days', onPress: () => handleSettingChange('dataRetention', 180) },
        { text: '1 year', onPress: () => handleSettingChange('dataRetention', 365) },
      ]
    );
  };

  const getConnectionStatusColor = () => {
    switch (connection.status) {
      case 'connected': return colors.success;
      case 'error': return colors.error;
      case 'pending': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connection.status) {
      case 'connected': return <CheckCircle size={20} color={colors.success} />;
      case 'error': return <AlertCircle size={20} color={colors.error} />;
      case 'pending': return <Clock size={20} color={colors.warning} />;
      default: return <AlertCircle size={20} color={colors.textSecondary} />;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Connection Status */}
      <View style={styles.connectionCard}>
        <View style={styles.connectionHeader}>
          <View style={styles.connectionInfo}>
            <Text style={styles.connectionProvider}>{connection.provider}</Text>
            <View style={styles.connectionStatus}>
              {getConnectionStatusIcon()}
              <Text style={[styles.connectionStatusText, { color: getConnectionStatusColor() }]}>
                {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
              </Text>
            </View>
          </View>
          <Pressable style={styles.syncButton} onPress={() => syncData()} disabled={isSyncing}>
            <RefreshCw size={16} color={colors.primary} />
            <Text style={styles.syncButtonText}>
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.connectionDetails}>
          Last sync: {new Date(connection.lastSync).toLocaleString()}
        </Text>
        <Text style={styles.connectionDetails}>
          Vehicles: {connection.vehicleCount} • Drivers: {connection.driverCount}
        </Text>
      </View>

      {/* Data Sync Settings */}
      <Section title="Data Synchronization">
        <SettingItem
          title="Sync Frequency"
          description={`Update data every ${localSettings?.syncFrequency} minutes`}
          icon={<RefreshCw size={20} color={colors.primary} />}
          onPress={handleSyncFrequencyChange}
          showArrow
        />
        <SettingItem
          title="Data Retention"
          description={`Keep data for ${localSettings?.dataRetention} days`}
          icon={<Database size={20} color={colors.primary} />}
          onPress={handleDataRetentionChange}
          showArrow
        />
      </Section>

      {/* Feature Settings */}
      <Section title="Enabled Features">
        <SettingItem
          title="Real-time Alerts"
          description="Receive immediate notifications for critical events"
          icon={<Bell size={20} color={colors.primary} />}
          value={localSettings?.enabledFeatures.realTimeAlerts}
          onToggle={(value) => handleFeatureToggle('realTimeAlerts', value)}
        />
        <SettingItem
          title="HOS Monitoring"
          description="Track hours of service and compliance violations"
          icon={<Clock size={20} color={colors.primary} />}
          value={localSettings?.enabledFeatures.hosMonitoring}
          onToggle={(value) => handleFeatureToggle('hosMonitoring', value)}
        />
        <SettingItem
          title="Maintenance Alerts"
          description="Get notified about vehicle maintenance needs"
          icon={<Settings size={20} color={colors.primary} />}
          value={localSettings?.enabledFeatures.maintenanceAlerts}
          onToggle={(value) => handleFeatureToggle('maintenanceAlerts', value)}
        />
        <SettingItem
          title="Fuel Tracking"
          description="Monitor fuel consumption and efficiency"
          icon={<Database size={20} color={colors.primary} />}
          value={localSettings?.enabledFeatures.fuelTracking}
          onToggle={(value) => handleFeatureToggle('fuelTracking', value)}
        />
        <SettingItem
          title="Safety Events"
          description="Track harsh braking, speeding, and other safety events"
          icon={<Shield size={20} color={colors.primary} />}
          value={localSettings?.enabledFeatures.safetyEvents}
          onToggle={(value) => handleFeatureToggle('safetyEvents', value)}
        />
        <SettingItem
          title="Automatic Reports"
          description="Generate compliance and performance reports"
          icon={<Database size={20} color={colors.primary} />}
          value={localSettings?.enabledFeatures.automaticReports}
          onToggle={(value) => handleFeatureToggle('automaticReports', value)}
        />
      </Section>

      {/* Notification Preferences */}
      <Section title="Notification Preferences">
        <SettingItem
          title="Critical Alerts"
          description="Immediate notifications for critical issues"
          icon={<AlertCircle size={20} color={colors.error} />}
          value={localSettings?.alertPreferences.criticalAlerts}
          onToggle={(value) => handleAlertToggle('criticalAlerts', value)}
        />
        <SettingItem
          title="HOS Warnings"
          description="Notifications for approaching HOS violations"
          icon={<Clock size={20} color={colors.warning} />}
          value={localSettings?.alertPreferences.hosWarnings}
          onToggle={(value) => handleAlertToggle('hosWarnings', value)}
        />
        <SettingItem
          title="Maintenance Reminders"
          description="Notifications for scheduled maintenance"
          icon={<Settings size={20} color={colors.primary} />}
          value={localSettings?.alertPreferences.maintenanceReminders}
          onToggle={(value) => handleAlertToggle('maintenanceReminders', value)}
        />
        <SettingItem
          title="Fuel Alerts"
          description="Notifications for fuel-related events"
          icon={<Database size={20} color={colors.primary} />}
          value={localSettings?.alertPreferences.fuelAlerts}
          onToggle={(value) => handleAlertToggle('fuelAlerts', value)}
        />
        <SettingItem
          title="Safety Alerts"
          description="Notifications for safety events"
          icon={<Shield size={20} color={colors.primary} />}
          value={localSettings?.alertPreferences.safetyAlerts}
          onToggle={(value) => handleAlertToggle('safetyAlerts', value)}
        />
        <SettingItem
          title="Push Notifications"
          description="Receive notifications on your device"
          icon={<Smartphone size={20} color={colors.primary} />}
          value={localSettings?.alertPreferences.pushNotifications}
          onToggle={(value) => handleAlertToggle('pushNotifications', value)}
        />
        <SettingItem
          title="Email Notifications"
          description="Receive notifications via email"
          icon={<Mail size={20} color={colors.primary} />}
          value={localSettings?.alertPreferences.emailNotifications}
          onToggle={(value) => handleAlertToggle('emailNotifications', value)}
        />
      </Section>

      {/* Privacy Settings */}
      <Section title="Privacy & Security">
        <SettingItem
          title="Personal Conveyance"
          description="Allow drivers to disable tracking during personal use"
          icon={<Shield size={20} color={colors.primary} />}
          value={localSettings?.privacySettings.personalConveyance}
          onToggle={(value) => handlePrivacyToggle('personalConveyance', value)}
        />
        <SettingItem
          title="Off-duty Tracking"
          description="Track vehicle location when driver is off-duty"
          icon={<Clock size={20} color={colors.primary} />}
          value={localSettings?.privacySettings.offDutyTracking}
          onToggle={(value) => handlePrivacyToggle('offDutyTracking', value)}
        />
        <SettingItem
          title="Location Sharing"
          description="Share location data with fleet managers"
          icon={<Database size={20} color={colors.primary} />}
          value={localSettings?.privacySettings.locationSharing}
          onToggle={(value) => handlePrivacyToggle('locationSharing', value)}
        />
      </Section>

      {/* Advanced Actions */}
      <Section title="Advanced">
        <SettingItem
          title="Clear ELD Data"
          description="Remove all cached ELD data (keeps connection)"
          icon={<Trash2 size={20} color={colors.warning} />}
          onPress={handleClearData}
          showArrow
        />
        <SettingItem
          title="Disconnect Provider"
          description="Remove ELD connection and all data"
          icon={<Unlink size={20} color={colors.error} />}
          onPress={handleDisconnect}
          showArrow
        />
      </Section>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ELD integration uses secure OAuth 2.0 authentication. Your credentials are never stored on our servers.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  connectionCard: {
    backgroundColor: colors.white,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  connectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionProvider: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectionStatusText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  syncButtonText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.primary,
  },
  connectionDetails: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  disabledItem: {
    opacity: 0.5,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  disabledText: {
    color: colors.textSecondary,
  },
  arrow: {
    fontSize: 20,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    paddingTop: 0,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});