import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert, Modal, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { User, Truck, Bell, Shield, HelpCircle, LogOut, ChevronRight, AlertTriangle, X, Save, Cloud } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { driverInfo } from '@/constants/mockData';
import VoiceCommandButton from '@/components/VoiceCommandButton';
import CommandResponseModal from '@/components/CommandResponseModal';
import { useVoiceCommandStore } from '@/store/voiceCommandStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useLogbookStore } from '@/store/logbookStore';

export default function SettingsScreen() {
  const [commandModalVisible, setCommandModalVisible] = useState(false);
  const [personalInfoModalVisible, setPersonalInfoModalVisible] = useState(false);
  const [vehicleSettingsModalVisible, setVehicleSettingsModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  
  const { lastCommand, lastResponse } = useVoiceCommandStore();
  const { currentStatus, changeStatus } = useLogbookStore();
  const { 
    autoTrackDriving,
    voiceCommands,
    pushNotifications,
    complianceAlerts,
    dataSync,
    darkMode,
    emergencyContacts,
    speedLimitAlerts,
    fatigueMonitoring,
    weatherAlertsEnabled,
    severeWeatherOnly,
    updateSetting 
  } = useSettingsStore();
  
  const settings = {
    autoTrackDriving,
    voiceCommands,
    pushNotifications,
    complianceAlerts,
    dataSync,
    darkMode,
    emergencyContacts,
    speedLimitAlerts,
    fatigueMonitoring,
    weatherAlertsEnabled,
    severeWeatherOnly,
  };
  
  const toggleSetting = (setting: keyof typeof settings) => {
    updateSetting(setting, !settings[setting]);
  };
  
  const handleCommandProcessed = () => {
    setCommandModalVisible(true);
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: () => {
            // Reset driver status and navigate to login
            changeStatus('Off Duty');
            Alert.alert('Logged Out', 'You have been successfully logged out.');
          }
        }
      ]
    );
  };
  
  const renderSettingSwitch = (
    setting: keyof typeof settings,
    label: string,
    description: string
  ) => {
    const currentValue = settings[setting];
    return (
      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>{label}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
        <Switch
          value={currentValue}
          onValueChange={() => toggleSetting(setting)}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={currentValue ? colors.background : colors.text}
          ios_backgroundColor={colors.border}
        />
      </View>
    );
  };
  
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
          {renderSettingSwitch(
            'emergencyContacts',
            'Emergency Contacts',
            'Enable emergency contact notifications'
          )}
          
          {renderSettingSwitch(
            'speedLimitAlerts',
            'Speed Limit Alerts',
            'Get alerts when exceeding speed limits'
          )}
          
          {renderSettingSwitch(
            'fatigueMonitoring',
            'Fatigue Monitoring',
            'Monitor driving patterns for fatigue signs'
          )}
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weather Settings</Text>
        </View>
        
        <View style={styles.settingsCard}>
          {renderSettingSwitch(
            'weatherAlertsEnabled',
            'Weather Alerts',
            'Receive NOAA weather alerts for your location'
          )}
          
          {renderSettingSwitch(
            'severeWeatherOnly',
            'Severe Weather Only',
            'Only show severe and extreme weather alerts'
          )}
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account</Text>
        </View>
        
        <View style={styles.settingsCard}>
          {renderSettingLink(
            <User size={20} color={colors.primaryLight} />,
            'Personal Information',
            () => setPersonalInfoModalVisible(true)
          )}
          
          {renderSettingLink(
            <Truck size={20} color={colors.primaryLight} />,
            'Vehicle Settings',
            () => setVehicleSettingsModalVisible(true)
          )}
          
          {renderSettingLink(
            <Bell size={20} color={colors.primaryLight} />,
            'Notification Preferences',
            () => setNotificationModalVisible(true)
          )}
          
          {renderSettingLink(
            <Shield size={20} color={colors.primaryLight} />,
            'Privacy & Security',
            () => setPrivacyModalVisible(true)
          )}
          
          {renderSettingLink(
            <HelpCircle size={20} color={colors.primaryLight} />,
            'Help & Support',
            () => setHelpModalVisible(true)
          )}
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
      
      {/* Personal Information Modal */}
      <Modal
        visible={personalInfoModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Personal Information</Text>
            <TouchableOpacity onPress={() => setPersonalInfoModalVisible(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={driverInfo.name}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Company</Text>
              <TextInput
                style={styles.textInput}
                value={driverInfo.company}
                placeholder="Enter company name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CDL Number</Text>
              <TextInput
                style={styles.textInput}
                value={driverInfo.licenseNumber}
                placeholder="Enter CDL number"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter email address"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </ScrollView>
          
          <TouchableOpacity style={styles.saveButton}>
            <Save size={20} color={colors.background} />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      
      {/* Vehicle Settings Modal */}
      <Modal
        visible={vehicleSettingsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Vehicle Settings</Text>
            <TouchableOpacity onPress={() => setVehicleSettingsModalVisible(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Vehicle Make</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Freightliner"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Vehicle Model</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Cascadia"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Vehicle Year</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 2023"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>License Plate</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter license plate"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="characters"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>VIN Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter VIN number"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="characters"
              />
            </View>
          </ScrollView>
          
          <TouchableOpacity style={styles.saveButton}>
            <Save size={20} color={colors.background} />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      
      {/* Notification Preferences Modal */}
      <Modal
        visible={notificationModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notification Preferences</Text>
            <TouchableOpacity onPress={() => setNotificationModalVisible(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionSubtitle}>Push Notifications</Text>
            <View style={styles.notificationCard}>
              {renderSettingSwitch(
                'pushNotifications',
                'Enable Push Notifications',
                'Receive notifications on your device'
              )}
              
              {renderSettingSwitch(
                'complianceAlerts',
                'Compliance Alerts',
                'Get notified about compliance issues'
              )}
            </View>
            
            <Text style={styles.sectionSubtitle}>Email Notifications</Text>
            <View style={styles.notificationCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>Weekly Reports</Text>
                  <Text style={styles.settingDescription}>Receive weekly driving reports</Text>
                </View>
                <Switch
                  value={true}
                  onValueChange={() => {}}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={colors.background}
                  ios_backgroundColor={colors.border}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>Maintenance Reminders</Text>
                  <Text style={styles.settingDescription}>Get vehicle maintenance alerts</Text>
                </View>
                <Switch
                  value={true}
                  onValueChange={() => {}}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={colors.background}
                  ios_backgroundColor={colors.border}
                />
              </View>
            </View>
          </ScrollView>
          
          <TouchableOpacity style={styles.saveButton}>
            <Save size={20} color={colors.background} />
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      
      {/* Privacy & Security Modal */}
      <Modal
        visible={privacyModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Privacy & Security</Text>
            <TouchableOpacity onPress={() => setPrivacyModalVisible(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionSubtitle}>Data Privacy</Text>
            <View style={styles.privacyCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>Location Tracking</Text>
                  <Text style={styles.settingDescription}>Allow app to track your location</Text>
                </View>
                <Switch
                  value={true}
                  onValueChange={() => {}}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={colors.background}
                  ios_backgroundColor={colors.border}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>Analytics</Text>
                  <Text style={styles.settingDescription}>Share usage data to improve the app</Text>
                </View>
                <Switch
                  value={false}
                  onValueChange={() => {}}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={colors.background}
                  ios_backgroundColor={colors.border}
                />
              </View>
            </View>
            
            <Text style={styles.sectionSubtitle}>Security</Text>
            <View style={styles.privacyCard}>
              <TouchableOpacity style={styles.securityOption}>
                <Text style={styles.settingLabel}>Change Password</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.securityOption}>
                <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.securityOption}>
                <Text style={styles.settingLabel}>Download My Data</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.securityOption, styles.dangerOption]}>
                <Text style={[styles.settingLabel, styles.dangerText]}>Delete Account</Text>
                <ChevronRight size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
      
      {/* Help & Support Modal */}
      <Modal
        visible={helpModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Help & Support</Text>
            <TouchableOpacity onPress={() => setHelpModalVisible(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.helpCard}>
              <TouchableOpacity style={styles.helpOption}>
                <Text style={styles.settingLabel}>Frequently Asked Questions</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.helpOption}>
                <Text style={styles.settingLabel}>Contact Support</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.helpOption}>
                <Text style={styles.settingLabel}>Report a Bug</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.helpOption}>
                <Text style={styles.settingLabel}>Feature Request</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.helpOption}>
                <Text style={styles.settingLabel}>Terms of Service</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.helpOption}>
                <Text style={styles.settingLabel}>Privacy Policy</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.supportInfo}>
              <Text style={styles.supportTitle}>Need immediate help?</Text>
              <Text style={styles.supportText}>Call our 24/7 support line:</Text>
              <Text style={styles.supportPhone}>1-800-TRUCKMATE</Text>
              
              <Text style={styles.supportText}>Or email us at:</Text>
              <Text style={styles.supportEmail}>support@truckmate.com</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  switchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  notificationCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  privacyCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  securityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dangerOption: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: colors.danger,
  },
  helpCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  helpOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  supportInfo: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  supportPhone: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryLight,
    marginBottom: 12,
  },
  supportEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryLight,
  },
});