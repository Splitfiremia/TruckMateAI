import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Truck, Building2, User, Mail, Hash, Phone } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useUserStore, UserRole, UserProfile } from '@/store/userStore';
import DeviceDetectionStep from '@/components/DeviceDetectionStep';

type OnboardingStep = 'role-selection' | 'profile-setup' | 'company-details' | 'device-setup';

export default function OnboardingScreen() {
  const { setUser, completeOnboarding: completeUserOnboarding } = useUserStore();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('role-selection');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    fleetSize: '',
    cdlNumber: '',
    dotNumber: '',
    mcNumber: '',
    phone: '',
  });

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep('profile-setup');
  };

  const handleProfileSetup = () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (selectedRole === 'fleet-company') {
      setCurrentStep('company-details');
    } else {
      setCurrentStep('device-setup');
    }
  };

  const handleCompanyDetails = () => {
    if (!formData.companyName) {
      Alert.alert('Error', 'Please enter your company name');
      return;
    }
    
    setCurrentStep('device-setup');
  };

  const handleDeviceSetupComplete = () => {
    handleCompleteOnboarding();
  };

  const handleDeviceSetupSkip = () => {
    handleCompleteOnboarding();
  };

  const handleCompleteOnboarding = () => {
    const userProfile: UserProfile = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: selectedRole!,
      companyName: selectedRole === 'fleet-company' ? formData.companyName : undefined,
      fleetSize: selectedRole === 'fleet-company' && formData.fleetSize ? parseInt(formData.fleetSize) : undefined,
      cdlNumber: selectedRole === 'owner-operator' ? formData.cdlNumber : undefined,
      dotNumber: formData.dotNumber || undefined,
      mcNumber: formData.mcNumber || undefined,
      createdAt: new Date().toISOString(),
      onboardingCompleted: true,
    };
    
    setUser(userProfile);
    completeUserOnboarding();
    router.replace('/(tabs)');
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderRoleSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose Your Role</Text>
      <Text style={styles.stepSubtitle}>
        Select the option that best describes your trucking operation
      </Text>
      
      <View style={styles.roleOptions}>
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelection('owner-operator')}
        >
          <View style={styles.roleIcon}>
            <Truck size={32} color={colors.primary} />
          </View>
          <Text style={styles.roleTitle}>Owner/Operator</Text>
          <Text style={styles.roleDescription}>
            Independent driver with your own truck and business
          </Text>
          <View style={styles.roleFeatures}>
            <Text style={styles.roleFeature}>• Personal logbook management</Text>
            <Text style={styles.roleFeature}>• Load tracking</Text>
            <Text style={styles.roleFeature}>• Compliance monitoring</Text>
            <Text style={styles.roleFeature}>• Receipt management</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelection('fleet-company')}
        >
          <View style={styles.roleIcon}>
            <Building2 size={32} color={colors.secondary} />
          </View>
          <Text style={styles.roleTitle}>Fleet Company</Text>
          <Text style={styles.roleDescription}>
            Manage multiple drivers and vehicles in your fleet
          </Text>
          <View style={styles.roleFeatures}>
            <Text style={styles.roleFeature}>• Multi-driver management</Text>
            <Text style={styles.roleFeature}>• Fleet-wide compliance</Text>
            <Text style={styles.roleFeature}>• White-label customization</Text>
            <Text style={styles.roleFeature}>• Advanced reporting</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProfileSetup = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Create Your Profile</Text>
      <Text style={styles.stepSubtitle}>
        Tell us a bit about yourself to personalize your experience
      </Text>
      
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name *</Text>
          <View style={styles.inputContainer}>
            <User size={20} color={colors.text.secondary} />
            <TextInput
              style={styles.textInput}
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              placeholder="Enter your full name"
              placeholderTextColor={colors.text.secondary}
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address *</Text>
          <View style={styles.inputContainer}>
            <Mail size={20} color={colors.text.secondary} />
            <TextInput
              style={styles.textInput}
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              placeholder="Enter your email"
              placeholderTextColor={colors.text.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Phone size={20} color={colors.text.secondary} />
            <TextInput
              style={styles.textInput}
              value={formData.phone}
              onChangeText={(text) => updateFormData('phone', text)}
              placeholder="(555) 123-4567"
              placeholderTextColor={colors.text.secondary}
              keyboardType="phone-pad"
            />
          </View>
        </View>
        
        {selectedRole === 'owner-operator' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>CDL Number</Text>
            <View style={styles.inputContainer}>
              <Hash size={20} color={colors.text.secondary} />
              <TextInput
                style={styles.textInput}
                value={formData.cdlNumber}
                onChangeText={(text) => updateFormData('cdlNumber', text)}
                placeholder="Enter your CDL number"
                placeholderTextColor={colors.text.secondary}
              />
            </View>
          </View>
        )}
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>DOT Number</Text>
          <View style={styles.inputContainer}>
            <Hash size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.textInput}
              value={formData.dotNumber}
              onChangeText={(text) => updateFormData('dotNumber', text)}
              placeholder="Enter your DOT number"
              placeholderTextColor={colors.text.secondary}
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>MC Number</Text>
          <View style={styles.inputContainer}>
            <Hash size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.textInput}
              value={formData.mcNumber}
              onChangeText={(text) => updateFormData('mcNumber', text)}
              placeholder="Enter your MC number"
              placeholderTextColor={colors.text.secondary}
            />
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.continueButton} onPress={handleProfileSetup}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCompanyDetails = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Company Information</Text>
      <Text style={styles.stepSubtitle}>
        Set up your fleet company details for white-label customization
      </Text>
      
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Company Name *</Text>
          <View style={styles.inputContainer}>
            <Building2 size={20} color={colors.text.secondary} />
            <TextInput
              style={styles.textInput}
              value={formData.companyName}
              onChangeText={(text) => updateFormData('companyName', text)}
              placeholder="Enter your company name"
              placeholderTextColor={colors.text.secondary}
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Fleet Size</Text>
          <View style={styles.inputContainer}>
            <Truck size={20} color={colors.text.secondary} />
            <TextInput
              style={styles.textInput}
              value={formData.fleetSize}
              onChangeText={(text) => updateFormData('fleetSize', text)}
              placeholder="Number of vehicles"
              placeholderTextColor={colors.text.secondary}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.continueButton} onPress={handleCompanyDetails}>
        <Text style={styles.continueButtonText}>Complete Setup</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to TruckMate AI</Text>
          <View style={styles.progressIndicator}>
            <View style={[styles.progressDot, currentStep === 'role-selection' && styles.progressDotActive]} />
            <View style={[styles.progressDot, currentStep === 'profile-setup' && styles.progressDotActive]} />
            {selectedRole === 'fleet-company' && (
              <View style={[styles.progressDot, currentStep === 'company-details' && styles.progressDotActive]} />
            )}
            <View style={[styles.progressDot, currentStep === 'device-setup' && styles.progressDotActive]} />
          </View>
        </View>
        
        {currentStep === 'role-selection' && renderRoleSelection()}
        {currentStep === 'profile-setup' && renderProfileSetup()}
        {currentStep === 'company-details' && renderCompanyDetails()}
        {currentStep === 'device-setup' && (
          <DeviceDetectionStep
            onComplete={handleDeviceSetupComplete}
            onSkip={handleDeviceSetupSkip}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  progressIndicator: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.secondary,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  roleOptions: {
    gap: 16,
  },
  roleCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  roleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  roleFeatures: {
    alignSelf: 'stretch',
  },
  roleFeature: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 4,
  },
  form: {
    gap: 20,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
});