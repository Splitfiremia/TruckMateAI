import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import {
  User,
  Phone,
  Mail,
  CreditCard,
  Truck,
  Bell,
  Moon,
  Shield,
  LogOut,
  Edit3,
  Save,
  X,
  Settings,
  MapPin,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useDriverStore } from '@/store/driverStore';
import { useRouter } from 'expo-router';

export default function DriverProfileScreen() {
  const router = useRouter();
  const { driver, logout, updateDriverProfile, assignedVehicle } = useDriverStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: driver?.name || '',
    email: driver?.email || '',
    phone: driver?.phone || '',
  });
  
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    locationSharing: true,
    emergencyAlerts: true,
  });

  const handleSaveProfile = () => {
    if (!editedProfile.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    
    if (!editedProfile.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    
    updateDriverProfile({
      name: editedProfile.name,
      email: editedProfile.email,
      phone: editedProfile.phone,
    });
    
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      name: driver?.name || '',
      email: driver?.email || '',
      phone: driver?.phone || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/driver-login');
          },
        },
      ]
    );
  };

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!driver) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please log in to view profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <User color={colors.primary} size={32} />
          </View>
          <Text style={styles.driverName}>{driver.name}</Text>
          <Text style={styles.driverStatus}>
            Status: {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
          </Text>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            {!isEditing ? (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Edit3 color={colors.primary} size={16} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelEdit}
                >
                  <X color={colors.text.tertiary} size={16} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveProfile}
                >
                  <Save color={colors.white} size={16} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.profileCard}>
            <View style={styles.profileField}>
              <User color={colors.primary} size={20} />
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.fieldInput}
                    value={editedProfile.name}
                    onChangeText={(text) => setEditedProfile(prev => ({ ...prev, name: text }))}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.text.tertiary}
                  />
                ) : (
                  <Text style={styles.fieldValue}>{driver.name}</Text>
                )}
              </View>
            </View>

            <View style={styles.profileField}>
              <Mail color={colors.primary} size={20} />
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Email</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.fieldInput}
                    value={editedProfile.email}
                    onChangeText={(text) => setEditedProfile(prev => ({ ...prev, email: text }))}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.text.tertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                ) : (
                  <Text style={styles.fieldValue}>{driver.email}</Text>
                )}
              </View>
            </View>

            <View style={styles.profileField}>
              <Phone color={colors.primary} size={20} />
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Phone</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.fieldInput}
                    value={editedProfile.phone}
                    onChangeText={(text) => setEditedProfile(prev => ({ ...prev, phone: text }))}
                    placeholder="Enter your phone number"
                    placeholderTextColor={colors.text.tertiary}
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.fieldValue}>{driver.phone}</Text>
                )}
              </View>
            </View>

            <View style={styles.profileField}>
              <CreditCard color={colors.primary} size={20} />
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>License Number</Text>
                <Text style={styles.fieldValue}>{driver.licenseNumber}</Text>
              </View>
            </View>

            <View style={styles.profileField}>
              <Text style={styles.fieldLabel}>Member Since</Text>
              <Text style={styles.fieldValue}>
                {new Date(driver.joinedDate).toLocaleDateString([], {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Vehicle Information */}
        {assignedVehicle && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assigned Vehicle</Text>
            
            <View style={styles.vehicleCard}>
              <View style={styles.vehicleHeader}>
                <Truck color={colors.primary} size={24} />
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleTitle}>
                    {assignedVehicle.year} {assignedVehicle.make} {assignedVehicle.model}
                  </Text>
                  <Text style={styles.vehicleSubtitle}>
                    {assignedVehicle.licensePlate}
                  </Text>
                </View>
              </View>
              
              <View style={styles.vehicleDetails}>
                <View style={styles.vehicleDetail}>
                  <Text style={styles.vehicleDetailLabel}>VIN</Text>
                  <Text style={styles.vehicleDetailValue}>{assignedVehicle.vin}</Text>
                </View>
                <View style={styles.vehicleDetail}>
                  <Text style={styles.vehicleDetailLabel}>Mileage</Text>
                  <Text style={styles.vehicleDetailValue}>
                    {assignedVehicle.mileage.toLocaleString()} miles
                  </Text>
                </View>
                <View style={styles.vehicleDetail}>
                  <Text style={styles.vehicleDetailLabel}>Status</Text>
                  <Text style={[styles.vehicleDetailValue, {
                    color: assignedVehicle.status === 'available' ? colors.success : colors.warning
                  }]}>
                    {assignedVehicle.status.charAt(0).toUpperCase() + assignedVehicle.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell color={colors.primary} size={20} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>Receive trip and alert notifications</Text>
                </View>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={(value) => handleSettingChange('notifications', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Moon color={colors.primary} size={20} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Dark Mode</Text>
                  <Text style={styles.settingDescription}>Use dark theme for night driving</Text>
                </View>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => handleSettingChange('darkMode', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MapPin color={colors.primary} size={20} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Location Sharing</Text>
                  <Text style={styles.settingDescription}>Share location with dispatcher</Text>
                </View>
              </View>
              <Switch
                value={settings.locationSharing}
                onValueChange={(value) => handleSettingChange('locationSharing', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Shield color={colors.primary} size={20} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Emergency Alerts</Text>
                  <Text style={styles.settingDescription}>Receive safety and emergency notifications</Text>
                </View>
              </View>
              <Switch
                value={settings.emergencyAlerts}
                onValueChange={(value) => handleSettingChange('emergencyAlerts', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton}>
            <Settings color={colors.text.secondary} size={20} />
            <Text style={styles.actionButtonText}>App Preferences</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Shield color={colors.text.secondary} size={20} />
            <Text style={styles.actionButtonText}>Privacy & Security</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color={colors.white} size={20} />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  driverName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  driverStatus: {
    fontSize: 14,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    padding: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    padding: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  profileCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileField: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  fieldContent: {
    flex: 1,
    marginLeft: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  fieldInput: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 4,
  },
  vehicleCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  vehicleSubtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  vehicleDetails: {
    gap: 12,
  },
  vehicleDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleDetailLabel: {
    fontSize: 14,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  vehicleDetailValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
  },
  settingsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.text.secondary,
  },
});