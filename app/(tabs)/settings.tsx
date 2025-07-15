import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { User, Truck, Bell, Shield, HelpCircle, LogOut, ChevronRight, AlertTriangle } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { driverInfo } from '@/constants/mockData';
import VoiceCommandButton from '@/components/VoiceCommandButton';
import CommandResponseModal from '@/components/CommandResponseModal';
import { useVoiceCommandStore } from '@/store/voiceCommandStore';
import { useSettingsStore } from '@/store/settingsStore';

export default function SettingsScreen() {
  const [commandModalVisible, setCommandModalVisible] = useState(false);
  const { lastCommand, lastResponse } = useVoiceCommandStore();
  const { 
    autoTrackDriving,
    voiceCommands,
    pushNotifications,
    complianceAlerts,
    dataSync,
    darkMode,
    bypassPreTripHardStop,
    updateSetting 
  } = useSettingsStore();
  
  const settings = {
    autoTrackDriving,
    voiceCommands,
    pushNotifications,
    complianceAlerts,
    dataSync,
    darkMode,
    bypassPreTripHardStop,
  };
  
  const toggleSetting = (setting: keyof typeof settings) => {
    if (setting === 'bypassPreTripHardStop') {
      // Show confirmation dialog for safety-critical setting
      Alert.alert(
        'Safety Setting Change',
        settings[setting] 
          ? 'Re-enabling pre-trip inspection hard stop will require completion of all 21 CDL inspection points before starting a trip. This is the recommended safety setting.'
          : 'WARNING: Disabling the pre-trip inspection hard stop will allow you to start trips without completing the full 21-point CDL inspection. This may violate FMCSA safety regulations and is not recommended.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: settings[setting] ? 'Enable Hard Stop' : 'Disable Hard Stop',
            style: settings[setting] ? 'default' : 'destructive',
            onPress: () => updateSetting(setting, !settings[setting])
          }
        ]
      );
    } else {
      updateSetting(setting, !settings[setting]);
    }
  };
  
  const handleCommandProcessed = () => {
    setCommandModalVisible(true);
  };
  
  const renderSettingSwitch = (
    setting: keyof typeof settings,
    label: string,
    description: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={settings[setting]}
        onValueChange={() => toggleSetting(setting)}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={colors.text}
      />
    </View>
  );
  
  const renderSettingLink = (
    icon: React.ReactNode,
    label: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.settingLink} onPress={onPress}>
      <View style={styles.settingLinkContent}>
        <View style={styles.settingLinkIcon}>
          {icon}
        </View>
        <Text style={styles.settingLinkLabel}>{label}</Text>
      </View>
      <ChevronRight size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Settings',
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.profileAvatar}>
              <User size={32} color={colors.text} />
            </View>
            <View>
              <Text style={styles.profileName}>{driverInfo.name}</Text>
              <Text style={styles.profileDetails}>{driverInfo.company}</Text>
              <Text style={styles.profileDetails}>CDL: {driverInfo.licenseNumber}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>App Settings</Text>
        </View>
        
        <View style={styles.settingsCard}>
          {renderSettingSwitch(
            'autoTrackDriving',
            'Auto-Track Driving',
            'Automatically detect and log driving time'
          )}
          
          {renderSettingSwitch(
            'voiceCommands',
            'Voice Commands',
            'Enable hands-free voice control'
          )}
          
          {renderSettingSwitch(
            'pushNotifications',
            'Push Notifications',
            'Receive alerts for important updates'
          )}
          
          {renderSettingSwitch(
            'complianceAlerts',
            'Compliance Alerts',
            'Get warnings before violations occur'
          )}
          
          {renderSettingSwitch(
            'dataSync',
            'Background Data Sync',
            'Sync data when app is in background'
          )}
          
          {renderSettingSwitch(
            'darkMode',
            'Dark Mode',
            'Use dark theme for night driving'
          )}
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Safety Settings</Text>
        </View>
        
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <View style={styles.settingLabelContainer}>
                <AlertTriangle size={16} color={colors.warning} style={{ marginRight: 8 }} />
                <Text style={styles.settingLabel}>Bypass Pre-Trip Hard Stop</Text>
              </View>
              <Text style={styles.settingDescription}>
                Allow starting trips without completing all 21 CDL inspection points. 
                <Text style={styles.warningText}>Not recommended - may violate FMCSA regulations.</Text>
              </Text>
            </View>
            <Switch
              value={settings.bypassPreTripHardStop}
              onValueChange={() => toggleSetting('bypassPreTripHardStop')}
              trackColor={{ false: colors.border, true: colors.warning }}
              thumbColor={colors.text}
            />
          </View>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account</Text>
        </View>
        
        <View style={styles.settingsCard}>
          {renderSettingLink(
            <User size={20} color={colors.primaryLight} />,
            'Personal Information',
            () => {}
          )}
          
          {renderSettingLink(
            <Truck size={20} color={colors.primaryLight} />,
            'Vehicle Settings',
            () => {}
          )}
          
          {renderSettingLink(
            <Bell size={20} color={colors.primaryLight} />,
            'Notification Preferences',
            () => {}
          )}
          
          {renderSettingLink(
            <Shield size={20} color={colors.primaryLight} />,
            'Privacy & Security',
            () => {}
          )}
          
          {renderSettingLink(
            <HelpCircle size={20} color={colors.primaryLight} />,
            'Help & Support',
            () => {}
          )}
        </View>
        
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>TruckMate v1.0.0</Text>
        
        <View style={styles.footer} />
      </ScrollView>
      
      <View style={styles.voiceButtonContainer}>
        <VoiceCommandButton onCommandProcessed={handleCommandProcessed} />
      </View>
      
      <CommandResponseModal
        visible={commandModalVisible}
        onClose={() => setCommandModalVisible(false)}
        command={lastCommand}
        response={lastResponse}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileSection: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  editProfileButton: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryLight,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  settingsCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  warningText: {
    color: colors.warning,
    fontWeight: '500',
  },
  settingLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLinkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingLinkLabel: {
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  footer: {
    height: 100, // Space for the floating button
  },
  voiceButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});