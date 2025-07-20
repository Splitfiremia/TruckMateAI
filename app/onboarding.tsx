import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Truck, Building2, User, Mail, Hash, Phone } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useUserStore, UserRole, UserProfile } from '@/store/userStore';
import DeviceDetectionStep from '@/components/DeviceDetectionStep';
import ValidatedTextInput from '@/components/ValidatedTextInput';
import AppBrand from '@/components/AppBrand';
import { useFormValidation, commonValidationRules } from '@/utils/validation';

type OnboardingStep = 'role-selection' | 'profile-setup' | 'company-details' | 'device-setup';

export default function OnboardingScreen() {
  const { user, setUser, completeOnboarding: completeUserOnboarding } = useUserStore();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('role-selection');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  // All refs at the top level to avoid hooks order issues
  const nameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const companyNameInputRef = useRef<TextInput>(null);
  const fleetSizeInputRef = useRef<TextInput>(null);
  
  // Define validation rules based on selected role
  const getValidationRules = () => {
    const baseRules = {
      name: commonValidationRules.name,
      email: commonValidationRules.email,
      phone: commonValidationRules.phone,
    };

    if (selectedRole === 'fleet-company') {
      return {
        ...baseRules,
        companyName: commonValidationRules.companyName,
        fleetSize: commonValidationRules.fleetSize,
      };
    }

    return baseRules;
  };

  const {
    formData,
    errors,
    touched,
    hasErrors,
    handleFieldChange,
    handleFieldBlur,
    validateAllFields,
    resetForm,
  } = useFormValidation(
    {
      name: user?.name || '',
      email: user?.email || '',
      companyName: '',
      fleetSize: '',
      phone: user?.phone || '',
    },
    getValidationRules()
  );

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep('profile-setup');
  };

  const handleProfileSetup = () => {
    if (!validateAllFields()) {
      Alert.alert('Validation Error', 'Please fix the errors below before continuing.');
      return;
    }
    
    if (selectedRole === 'fleet-company') {
      setCurrentStep('company-details');
    } else {
      setCurrentStep('device-setup');
    }
  };

  const handleCompanyDetails = () => {
    if (!validateAllFields()) {
      Alert.alert('Validation Error', 'Please fix the errors below before continuing.');
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
    const { user } = useUserStore.getState();
    if (!user) return;

    const updatedProfile: UserProfile = {
      ...user,
      name: formData.name || user.name,
      email: formData.email || user.email,
      phone: formData.phone,
      role: selectedRole!,
      companyName: selectedRole === 'fleet-company' ? formData.companyName : undefined,
      fleetSize: selectedRole === 'fleet-company' && formData.fleetSize ? parseInt(formData.fleetSize) : undefined,
      onboardingCompleted: true,
    };
    
    setUser(updatedProfile);
    completeUserOnboarding();
    router.replace('/(tabs)');
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

  const renderProfileSetup = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Create Your Profile</Text>
        <Text style={styles.stepSubtitle}>
          Tell us a bit about yourself to personalize your experience
        </Text>
        
        <View style={styles.form}>
          <ValidatedTextInput
            label="Full Name"
            required
            value={formData.name}
            onChangeText={(text) => handleFieldChange('name', text)}
            onBlur={() => handleFieldBlur('name')}
            placeholder="Enter your full name"
            icon={<User size={20} color={colors.text.secondary} />}
            error={errors.name}
            touched={touched.name}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => emailInputRef.current?.focus()}
            blurOnSubmit={false}
          />
          
          <ValidatedTextInput
            ref={emailInputRef}
            label="Email Address"
            required
            value={formData.email}
            onChangeText={(text) => handleFieldChange('email', text)}
            onBlur={() => handleFieldBlur('email')}
            placeholder="Enter your email"
            icon={<Mail size={20} color={colors.text.secondary} />}
            error={errors.email}
            touched={touched.email}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => phoneInputRef.current?.focus()}
            blurOnSubmit={false}
          />
          
          <ValidatedTextInput
            ref={phoneInputRef}
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => handleFieldChange('phone', text)}
            onBlur={() => handleFieldBlur('phone')}
            placeholder="(555) 123-4567"
            icon={<Phone size={20} color={colors.text.secondary} />}
            error={errors.phone}
            touched={touched.phone}
            keyboardType="phone-pad"
            helpText="Optional - for account recovery and notifications"
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              if (!hasErrors) {
                handleProfileSetup();
              }
            }}
          />
          </View>
        
        <TouchableOpacity 
          style={[
            styles.continueButton,
            hasErrors && styles.continueButtonDisabled
          ]} 
          onPress={handleProfileSetup}
          disabled={hasErrors}
        >
          <Text style={[
            styles.continueButtonText,
            hasErrors && styles.continueButtonTextDisabled
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCompanyDetails = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Company Information</Text>
        <Text style={styles.stepSubtitle}>
          Set up your fleet company details for white-label customization
        </Text>
        
        <View style={styles.form}>
          <ValidatedTextInput
            ref={companyNameInputRef}
            label="Company Name"
            required
            value={formData.companyName}
            onChangeText={(text) => handleFieldChange('companyName', text)}
            onBlur={() => handleFieldBlur('companyName')}
            placeholder="Enter your company name"
            icon={<Building2 size={20} color={colors.text.secondary} />}
            error={errors.companyName}
            touched={touched.companyName}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => fleetSizeInputRef.current?.focus()}
            blurOnSubmit={false}
          />
          
          <ValidatedTextInput
            ref={fleetSizeInputRef}
            label="Fleet Size"
            value={formData.fleetSize}
            onChangeText={(text) => handleFieldChange('fleetSize', text)}
            onBlur={() => handleFieldBlur('fleetSize')}
            placeholder="Number of vehicles"
            icon={<Truck size={20} color={colors.text.secondary} />}
            error={errors.fleetSize}
            touched={touched.fleetSize}
            keyboardType="numeric"
            helpText="Optional - helps customize features for your fleet size"
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              if (!hasErrors) {
                handleCompanyDetails();
              }
            }}
          />
          </View>
        
        <TouchableOpacity 
          style={[
            styles.continueButton,
            hasErrors && styles.continueButtonDisabled
          ]} 
          onPress={handleCompanyDetails}
          disabled={hasErrors}
        >
          <Text style={[
            styles.continueButtonText,
            hasErrors && styles.continueButtonTextDisabled
          ]}>
            Complete Setup
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={() => Keyboard.dismiss()}
        >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <AppBrand size="large" />
          </View>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 16,
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
    marginTop: 16,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  continueButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  continueButtonTextDisabled: {
    color: colors.text.secondary,
  },
});