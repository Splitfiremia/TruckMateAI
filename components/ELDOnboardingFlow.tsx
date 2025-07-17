import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, ArrowRight, Check, AlertCircle, Truck, Shield, BarChart } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ELDProvider } from '@/types';
import { useELDStore } from '@/store/eldStore';
import ELDProviderSelection from './ELDProviderSelection';

interface ELDOnboardingFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

type OnboardingStep = 'welcome' | 'provider-selection' | 'connecting' | 'permissions' | 'sync' | 'complete';

export default function ELDOnboardingFlow({ onComplete, onCancel }: ELDOnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [selectedProvider, setSelectedProvider] = useState<ELDProvider | null>(null);
  const { connectProvider, isConnecting, connectionError, syncData, isSyncing } = useELDStore();

  const handleProviderSelect = async (provider: ELDProvider) => {
    setSelectedProvider(provider);
    setCurrentStep('connecting');
    
    try {
      // Simulate OAuth flow
      await connectProvider(provider, {});
      setCurrentStep('permissions');
    } catch (error) {
      Alert.alert('Connection Failed', 'Unable to connect to the ELD provider. Please try again.');
      setCurrentStep('provider-selection');
    }
  };

  const handlePermissionsAccept = () => {
    setCurrentStep('sync');
    syncData().then(() => {
      setCurrentStep('complete');
    });
  };

  const handleComplete = () => {
    onComplete();
  };

  const renderWelcomeStep = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeHeader}>
        <View style={styles.iconContainer}>
          <Truck size={48} color={colors.primary} />
        </View>
        <Text style={styles.welcomeTitle}>Connect Your ELD System</Text>
        <Text style={styles.welcomeSubtitle}>
          Integrate your existing Electronic Logging Device to unlock powerful compliance and fleet management features
        </Text>
      </View>

      <View style={styles.benefitsContainer}>
        <View style={styles.benefitItem}>
          <Shield size={24} color={colors.primary} />
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Automated Compliance</Text>
            <Text style={styles.benefitDescription}>
              Real-time HOS monitoring and violation prevention
            </Text>
          </View>
        </View>

        <View style={styles.benefitItem}>
          <BarChart size={24} color={colors.primary} />
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Advanced Analytics</Text>
            <Text style={styles.benefitDescription}>
              Fuel efficiency insights and cost optimization
            </Text>
          </View>
        </View>

        <View style={styles.benefitItem}>
          <AlertCircle size={24} color={colors.primary} />
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Predictive Maintenance</Text>
            <Text style={styles.benefitDescription}>
              AI-powered maintenance alerts based on engine data
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.securityNote}>
        <Text style={styles.securityTitle}>🔒 Your Data is Secure</Text>
        <Text style={styles.securityText}>
          We use industry-standard OAuth 2.0 authentication and encrypt all data in transit. 
          Your ELD credentials are never stored on our servers.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.secondaryButton} onPress={onCancel}>
          <Text style={styles.secondaryButtonText}>Skip for Now</Text>
        </Pressable>
        <Pressable 
          style={styles.primaryButton} 
          onPress={() => setCurrentStep('provider-selection')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <ArrowRight size={20} color={colors.white} />
        </Pressable>
      </View>
    </ScrollView>
  );

  const renderProviderSelectionStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Pressable style={styles.backButton} onPress={() => setCurrentStep('welcome')}>
          <ArrowLeft size={20} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.stepTitle}>Select ELD Provider</Text>
      </View>
      <ELDProviderSelection 
        onProviderSelect={handleProviderSelect}
        selectedProvider={selectedProvider || undefined}
      />
    </View>
  );

  const renderConnectingStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.connectingTitle}>Connecting to {selectedProvider}</Text>
        <Text style={styles.connectingSubtitle}>
          Please complete the authorization in your browser...
        </Text>
        
        {connectionError && (
          <View style={styles.errorContainer}>
            <AlertCircle size={20} color={colors.error} />
            <Text style={styles.errorText}>{connectionError}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderPermissionsStep = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.permissionsHeader}>
        <Check size={48} color={colors.success} />
        <Text style={styles.permissionsTitle}>Connection Successful!</Text>
        <Text style={styles.permissionsSubtitle}>
          Review the data permissions we'll access from your ELD system
        </Text>
      </View>

      <View style={styles.permissionsList}>
        <View style={styles.permissionItem}>
          <Check size={20} color={colors.success} />
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Vehicle Location & Status</Text>
            <Text style={styles.permissionDescription}>
              Real-time GPS location and vehicle diagnostics
            </Text>
          </View>
        </View>

        <View style={styles.permissionItem}>
          <Check size={20} color={colors.success} />
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Hours of Service Data</Text>
            <Text style={styles.permissionDescription}>
              Driver duty status and HOS compliance information
            </Text>
          </View>
        </View>

        <View style={styles.permissionItem}>
          <Check size={20} color={colors.success} />
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Engine Diagnostics</Text>
            <Text style={styles.permissionDescription}>
              Fault codes and maintenance-related data
            </Text>
          </View>
        </View>

        <View style={styles.permissionItem}>
          <Check size={20} color={colors.success} />
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Fuel & Performance Data</Text>
            <Text style={styles.permissionDescription}>
              Fuel consumption and efficiency metrics
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.privacyNote}>
        <Text style={styles.privacyTitle}>Privacy Controls</Text>
        <Text style={styles.privacyText}>
          You can enable "Personal Conveyance" mode to disable tracking during off-duty hours. 
          All data is encrypted and only used for compliance and fleet optimization.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.secondaryButton} onPress={onCancel}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={handlePermissionsAccept}>
          <Text style={styles.primaryButtonText}>Accept & Continue</Text>
        </Pressable>
      </View>
    </ScrollView>
  );

  const renderSyncStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.syncTitle}>Syncing Your Fleet Data</Text>
        <Text style={styles.syncSubtitle}>
          Importing vehicles, drivers, and compliance data...
        </Text>
        <Text style={styles.syncNote}>This may take a few moments</Text>
      </View>
    </View>
  );

  const renderCompleteStep = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.completeHeader}>
        <View style={styles.successIcon}>
          <Check size={48} color={colors.white} />
        </View>
        <Text style={styles.completeTitle}>Setup Complete!</Text>
        <Text style={styles.completeSubtitle}>
          Your ELD system is now connected and syncing data
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>What's Next?</Text>
        
        <View style={styles.nextStepItem}>
          <Text style={styles.nextStepNumber}>1</Text>
          <View style={styles.nextStepContent}>
            <Text style={styles.nextStepTitle}>Monitor Compliance</Text>
            <Text style={styles.nextStepDescription}>
              Check your compliance dashboard for HOS status and violation alerts
            </Text>
          </View>
        </View>

        <View style={styles.nextStepItem}>
          <Text style={styles.nextStepNumber}>2</Text>
          <View style={styles.nextStepContent}>
            <Text style={styles.nextStepTitle}>Review Maintenance Alerts</Text>
            <Text style={styles.nextStepDescription}>
              Get predictive maintenance recommendations based on your engine data
            </Text>
          </View>
        </View>

        <View style={styles.nextStepItem}>
          <Text style={styles.nextStepNumber}>3</Text>
          <View style={styles.nextStepContent}>
            <Text style={styles.nextStepTitle}>Optimize Fuel Efficiency</Text>
            <Text style={styles.nextStepDescription}>
              Track fuel consumption and get tips to reduce costs
            </Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.completeButton} onPress={handleComplete}>
        <Text style={styles.completeButtonText}>Go to Dashboard</Text>
      </Pressable>
    </ScrollView>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeStep();
      case 'provider-selection':
        return renderProviderSelectionStep();
      case 'connecting':
        return renderConnectingStep();
      case 'permissions':
        return renderPermissionsStep();
      case 'sync':
        return renderSyncStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderWelcomeStep();
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  stepContainer: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  welcomeHeader: {
    alignItems: 'center',
    padding: 40,
    paddingBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  benefitsContainer: {
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  securityNote: {
    margin: 20,
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.white,
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  connectingTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginTop: 24,
    marginBottom: 8,
  },
  connectingSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '10',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
  },
  permissionsHeader: {
    alignItems: 'center',
    padding: 40,
    paddingBottom: 32,
  },
  permissionsTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  permissionsSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  permissionsList: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  privacyNote: {
    margin: 20,
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  syncTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginTop: 24,
    marginBottom: 8,
  },
  syncSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  syncNote: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  completeHeader: {
    alignItems: 'center',
    padding: 40,
    paddingBottom: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: 8,
  },
  completeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 20,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 16,
  },
  nextStepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center',
    lineHeight: 32,
  },
  nextStepContent: {
    flex: 1,
  },
  nextStepTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  nextStepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  completeButton: {
    margin: 20,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.white,
  },
});