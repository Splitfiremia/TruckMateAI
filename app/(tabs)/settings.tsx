import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert, Modal, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { User, Truck, Bell, Shield, HelpCircle, LogOut, ChevronRight, AlertTriangle, X, Save, Cloud, Palette, Building2, Sparkles, Smartphone } from 'lucide-react-native';

import { colors, deprecatedColors } from '@/constants/colors';
import { useTheme } from '@/store/themeStore';
import { driverInfo } from '@/constants/mockData';
import VoiceCommandButton from '@/components/VoiceCommandButton';
import CommandResponseModal from '@/components/CommandResponseModal';
import BrandingCustomizer from '@/components/BrandingCustomizer';
import LogoGenerator from '@/components/LogoGenerator';
import TelematicsDeviceSettings from '@/components/TelematicsDeviceSettings';
import { useVoiceCommandStore } from '@/store/voiceCommandStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useLogbookStore } from '@/store/logbookStore';
import { useUserStore } from '@/store/userStore';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [commandModalVisible, setCommandModalVisible] = useState(false);
  const [personalInfoModalVisible, setPersonalInfoModalVisible] = useState(false);
  const [vehicleSettingsModalVisible, setVehicleSettingsModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [showBrandingModal, setShowBrandingModal] = useState(false);
  const [showLogoGeneratorModal, setShowLogoGeneratorModal] = useState(false);
  const [showTelematicsModal, setShowTelematicsModal] = useState(false);
  
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { lastCommand, lastResponse } = useVoiceCommandStore();
  const { currentStatus, changeStatus } = useLogbookStore();
  const { user, isFleetCompany, logout } = useUserStore();
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
            // Reset driver status and logout
            changeStatus('Off Duty');
            logout();
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
          trackColor={{ false: theme.border, true: theme.primaryLight }}
          thumbColor={currentValue ? theme.white : theme.text.primary}
          ios_backgroundColor={theme.border}
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
      <ChevronRight size={20} color={theme.text.secondary} />
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
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.profileAvatar}>
              <User size={32} color={theme.text.primary} />
            </View>
            <View>
              <Text style={styles.profileName}>{user?.name || driverInfo.name}</Text>
              <Text style={styles.profileDetails}>{user?.companyName || driverInfo.company}</Text>
              <Text style={styles.profileDetails}>
                {user?.role === 'owner-operator' ? 'Owner/Operator' : 'Fleet Company'}
              </Text>
              {user?.cdlNumber && (
                <Text style={styles.profileDetails}>CDL: {user.cdlNumber}</Text>
              )}
            </View>
          </View>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        {/* Fleet Branding Section - Only for Fleet Companies */}
        {isFleetCompany() && (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>White-Label Branding</Text>
          </View>
        )}
        
        {isFleetCompany() && (
          <View style={styles.settingsCard}>
            {renderSettingLink(
              <Palette size={20} color={theme.primaryLight} />,
              'Customize Branding',
              () => setShowBrandingModal(true)
            )}
            {renderSettingLink(
              <Sparkles size={20} color={theme.primaryLight} />,
              'Generate Company Logo',
              () => setShowLogoGeneratorModal(true)
            )}
          </View>
        )}
        
        {/* Logo Generator Section - Available for all users */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Branding & Design</Text>
        </View>
        
        <View style={styles.settingsCard}>
          {renderSettingLink(
            <Sparkles size={20} color={theme.primaryLight} />,
            'AI Logo Generator',
            () => setShowLogoGeneratorModal(true)
          )}
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
            <User size={20} color={theme.primaryLight} />,
            'Profile & Credentials',
            () => setPersonalInfoModalVisible(true)
          )}
          
          {renderSettingLink(
            <Truck size={20} color={theme.primaryLight} />,
            'Vehicle Settings',
            () => setVehicleSettingsModalVisible(true)
          )}
          
          {renderSettingLink(
            <Bell size={20} color={theme.primaryLight} />,
            'Notification Preferences',
            () => setNotificationModalVisible(true)
          )}
          
          {renderSettingLink(
            <Shield size={20} color={theme.primaryLight} />,
            'Privacy & Security',
            () => setPrivacyModalVisible(true)
          )}
          
          {renderSettingLink(
            <HelpCircle size={20} color={theme.primaryLight} />,
            'Help & Support',
            () => setHelpModalVisible(true)
          )}
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={theme.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>TruckMate AI v1.0.0</Text>
        
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
            <Text style={styles.modalTitle}>Profile & Credentials</Text>
            <TouchableOpacity onPress={() => setPersonalInfoModalVisible(false)}>
              <X size={24} color={theme.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionSubtitle}>Personal Information</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={user?.name || driverInfo.name}
                placeholder="Enter your full name"
                placeholderTextColor={theme.text.secondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={user?.email}
                placeholder="Enter email address"
                placeholderTextColor={theme.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false}
              />
              <Text style={styles.helpText}>Email cannot be changed after sign-in</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={user?.phone}
                placeholder="Enter phone number"
                placeholderTextColor={theme.text.secondary}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Company Name</Text>
              <TextInput
                style={styles.textInput}
                value={user?.companyName || driverInfo.company}
                placeholder="Enter company name"
                placeholderTextColor={theme.text.secondary}
              />
            </View>

            <Text style={styles.sectionSubtitle}>Professional Credentials</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CDL Number</Text>
              <TextInput
                style={styles.textInput}
                value={user?.cdlNumber || driverInfo.licenseNumber}
                placeholder="Enter CDL number"
                placeholderTextColor={theme.text.secondary}
                autoCapitalize="characters"
              />
              <Text style={styles.helpText}>Commercial Driver's License number</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>DOT Number</Text>
              <TextInput
                style={styles.textInput}
                value={user?.dotNumber}
                placeholder="Enter DOT number"
                placeholderTextColor={theme.text.secondary}
                keyboardType="numeric"
              />
              <Text style={styles.helpText}>Department of Transportation number</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>MC Number</Text>
              <TextInput
                style={styles.textInput}
                value={user?.mcNumber}
                placeholder="Enter MC number"
                placeholderTextColor={theme.text.secondary}
                keyboardType="numeric"
              />
              <Text style={styles.helpText}>Motor Carrier authority number</Text>
            </View>
          </ScrollView>
          
          <TouchableOpacity style={styles.saveButton}>
            <Save size={20} color={theme.white} />
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
              <X size={24} color={theme.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Vehicle Make</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Freightliner"
                placeholderTextColor={theme.text.secondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Vehicle Model</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Cascadia"
                placeholderTextColor={theme.text.secondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Vehicle Year</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 2023"
                placeholderTextColor={theme.text.secondary}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>License Plate</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter license plate"
                placeholderTextColor={theme.text.secondary}
                autoCapitalize="characters"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>VIN Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter VIN number"
                placeholderTextColor={theme.text.secondary}
                autoCapitalize="characters"
              />
            </View>
          </ScrollView>
          
          <TouchableOpacity style={styles.saveButton}>
            <Save size={20} color={theme.white} />
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
              <X size={24} color={theme.text.primary} />
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
                  trackColor={{ false: theme.border, true: theme.primaryLight }}
                  thumbColor={theme.white}
                  ios_backgroundColor={theme.border}
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
                  trackColor={{ false: theme.border, true: theme.primaryLight }}
                  thumbColor={theme.white}
                  ios_backgroundColor={theme.border}
                />
              </View>
            </View>
          </ScrollView>
          
          <TouchableOpacity style={styles.saveButton}>
            <Save size={20} color={theme.white} />
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
              <X size={24} color={theme.text.primary} />
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
                  trackColor={{ false: theme.border, true: theme.primaryLight }}
                  thumbColor={theme.white}
                  ios_backgroundColor={theme.border}
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
                  trackColor={{ false: theme.border, true: theme.primaryLight }}
                  thumbColor={theme.white}
                  ios_backgroundColor={theme.border}
                />
              </View>
            </View>
            
            <Text style={styles.sectionSubtitle}>Security</Text>
            <View style={styles.privacyCard}>
              <TouchableOpacity style={styles.securityOption}>
                <Text style={styles.settingLabel}>Change Password</Text>
                <ChevronRight size={20} color={theme.text.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.securityOption}>
                <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                <ChevronRight size={20} color={theme.text.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.securityOption}>
                <Text style={styles.settingLabel}>Download My Data</Text>
                <ChevronRight size={20} color={theme.text.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.securityOption, styles.dangerOption]}>
                <Text style={[styles.settingLabel, styles.dangerText]}>Delete Account</Text>
                <ChevronRight size={20} color={theme.danger} />
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
              <X size={24} color={theme.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.helpCard}>
              <TouchableOpacity style={styles.helpOption}>
                <Text style={styles.settingLabel}>Frequently Asked Questions</Text>
                <ChevronRight size={20} color={theme.text.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.helpOption}>
                <Text style={styles.settingLabel}>Contact Support</Text>
                <ChevronRight size={20} color={theme.text.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.helpOption}>
                <Text style={styles.settingLabel}>Report a Bug</Text>
                <ChevronRight size={20} color={theme.text.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.helpOption}>
                <Text style={styles.settingLabel}>Feature Request</Text>
                <ChevronRight size={20} color={theme.text.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.helpOption}>
                <Text style={styles.settingLabel}>Terms of Service</Text>
                <ChevronRight size={20} color={theme.text.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.helpOption}>
                <Text style={styles.settingLabel}>Privacy Policy</Text>
                <ChevronRight size={20} color={theme.text.secondary} />
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
      
      {/* Branding Customizer Modal */}
      <Modal
        visible={showBrandingModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Customize Branding</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowBrandingModal(false)}
            >
              <X size={24} color={theme.text.primary} />
            </TouchableOpacity>
          </View>
          <BrandingCustomizer onClose={() => setShowBrandingModal(false)} />
        </View>
      </Modal>
      
      {/* Logo Generator Modal */}
      <Modal
        visible={showLogoGeneratorModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Logo Generator</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLogoGeneratorModal(false)}
            >
              <X size={24} color={theme.text.primary} />
            </TouchableOpacity>
          </View>
          <LogoGenerator />
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileSection: {
    backgroundColor: theme.background.secondary,
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
    backgroundColor: theme.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: theme.text.secondary,
    marginBottom: 2,
  },
  editProfileButton: {
    backgroundColor: theme.background.secondary,
    borderWidth: 1,
    borderColor: theme.primaryLight,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.primaryLight,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text.primary,
  },
  settingsCard: {
    backgroundColor: theme.background.secondary,
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
    borderBottomColor: theme.border,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: theme.text.secondary,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  warningText: {
    color: theme.warning,
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
    borderBottomColor: theme.border,
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
    color: theme.text.primary,
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
    color: theme.danger,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 14,
    color: theme.text.secondary,
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
    backgroundColor: theme.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text.primary,
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
    color: theme.text.primary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: theme.background.secondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.text.primary,
    borderWidth: 1,
    borderColor: theme.border,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primaryLight,
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.white,
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  notificationCard: {
    backgroundColor: theme.background.secondary,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  privacyCard: {
    backgroundColor: theme.background.secondary,
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
    borderBottomColor: theme.border,
  },
  dangerOption: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: theme.danger,
  },
  helpCard: {
    backgroundColor: theme.background.secondary,
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
    borderBottomColor: theme.border,
  },
  supportInfo: {
    backgroundColor: theme.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: theme.text.secondary,
    marginBottom: 4,
  },
  supportPhone: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.primaryLight,
    marginBottom: 12,
  },
  supportEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.primaryLight,
  },
  modalCloseButton: {
    padding: 4,
  },
  disabledInput: {
    backgroundColor: theme.border,
    opacity: 0.6,
  },
  helpText: {
    fontSize: 12,
    color: theme.text.secondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
});