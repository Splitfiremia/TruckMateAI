import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Stack, router } from 'expo-router';
import { ChevronLeft, Check } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { usePricingStore } from '@/store/pricingStore';
import { useUserStore } from '@/store/userStore';

// Import onboarding step components
import VehicleCountStep from '@/components/onboarding/VehicleCountStep';
import UserTypeStep from '@/components/onboarding/UserTypeStep';
import FeatureSelectionStep from '@/components/onboarding/FeatureSelectionStep';

export default function OnboardingFlowScreen() {
  const { onboardingFlow, updateOnboardingStep, completeOnboarding, trackEvent } = usePricingStore();
  const { user, updateUser } = useUserStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    trackEvent('onboarding_started');
  }, []);

  if (!onboardingFlow) {
    router.replace('/pricing');
    return null;
  }

  const currentStep = onboardingFlow.steps[currentStepIndex];
  const isLastStep = currentStepIndex === onboardingFlow.steps.length - 1;
  const canGoBack = currentStepIndex > 0;

  const handleNext = (stepData: any) => {
    updateOnboardingStep(currentStep.id, stepData);
    
    // Update user store based on step data
    if (stepData.userType && user) {
      updateUser({ role: stepData.userType });
    }

    if (isLastStep) {
      completeOnboarding();
      trackEvent('onboarding_completed');
      router.replace('/pricing');
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (canGoBack) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep.component) {
      case 'VehicleCountStep':
        return (
          <VehicleCountStep
            initialCount={onboardingFlow.vehicleCount || 1}
            onCountChange={(count) => {}}
            onNext={handleNext}
          />
        );
      case 'UserTypeStep':
        return <UserTypeStep onNext={handleNext} />;
      case 'FeatureSelectionStep':
        return <FeatureSelectionStep onNext={handleNext} />;
      default:
        return (
          <View style={styles.defaultStep}>
            <Text style={styles.stepTitle}>{currentStep.title}</Text>
            <Text style={styles.stepDescription}>{currentStep.description}</Text>
            <Pressable style={styles.nextButton} onPress={() => handleNext({})}>
              <Text style={styles.nextButtonText}>Continue</Text>
            </Pressable>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Setup Your Account',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
          headerLeft: canGoBack ? () => (
            <Pressable style={styles.backButton} onPress={handleBack}>
              <ChevronLeft color={colors.text.primary} size={24} />
            </Pressable>
          ) : undefined,
        }} 
      />

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${((currentStepIndex + 1) / onboardingFlow.steps.length) * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStepIndex + 1} of {onboardingFlow.steps.length}
        </Text>
      </View>

      {/* Step Indicators */}
      <View style={styles.stepIndicators}>
        {onboardingFlow.steps.map((step, index) => (
          <View key={step.id} style={styles.stepIndicator}>
            <View style={[
              styles.stepCircle,
              index < currentStepIndex && styles.completedStep,
              index === currentStepIndex && styles.activeStep,
            ]}>
              {index < currentStepIndex ? (
                <Check color={colors.white} size={16} />
              ) : (
                <Text style={[
                  styles.stepNumber,
                  index === currentStepIndex && styles.activeStepNumber,
                ]}>
                  {index + 1}
                </Text>
              )}
            </View>
            <Text style={[
              styles.stepLabel,
              index === currentStepIndex && styles.activeStepLabel,
            ]}>
              {step.title.split(' ').slice(0, 2).join(' ')}
            </Text>
          </View>
        ))}
      </View>

      {/* Step Content */}
      <View style={styles.stepContent}>
        {renderStepContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.background.tertiary,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  completedStep: {
    backgroundColor: colors.status.success,
    borderColor: colors.status.success,
  },
  activeStep: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  activeStepNumber: {
    color: colors.white,
  },
  stepLabel: {
    fontSize: 10,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 12,
  },
  activeStepLabel: {
    color: colors.text.primary,
    fontWeight: '500',
  },
  stepContent: {
    flex: 1,
  },
  defaultStep: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
});