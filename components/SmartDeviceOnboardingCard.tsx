import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  Smartphone,
  Zap,
  ArrowRight,
  X,
  CheckCircle,
  Shield,
  Clock,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTelematicsStore } from '@/store/telematicsStore';
import SmartDeviceOnboarding from './SmartDeviceOnboarding';

export default function SmartDeviceOnboardingCard() {
  const { devices, onboardingPreference } = useTelematicsStore();
  const [onboardingVisible, setOnboardingVisible] = useState(false);

  // Don't show if user has devices or explicitly skipped
  if (devices.length > 0 || onboardingPreference.skipDetection) {
    return null;
  }

  const handleStartOnboarding = () => {
    setOnboardingVisible(true);
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={handleStartOnboarding}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Zap size={24} color={colors.warning} />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Smart Device Setup</Text>
            <Text style={styles.subtitle}>Connect your ELD in 2 taps</Text>
          </View>
          <ArrowRight size={20} color={colors.text.secondary} />
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>
            We'll automatically detect your fleet hardware and guide you through a seamless setup process.
          </Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Smartphone size={16} color={colors.primary} />
              <Text style={styles.featureText}>Auto-detect Geotab, Samsara, Motive</Text>
            </View>
            <View style={styles.featureItem}>
              <Shield size={16} color={colors.success} />
              <Text style={styles.featureText}>FMCSA certified devices only</Text>
            </View>
            <View style={styles.featureItem}>
              <Clock size={16} color={colors.warning} />
              <Text style={styles.featureText}>Setup in under 2 minutes</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.benefitsPreview}>
            <CheckCircle size={14} color={colors.success} />
            <Text style={styles.benefitText}>Automatic logbook updates</Text>
          </View>
          <View style={styles.benefitsPreview}>
            <CheckCircle size={14} color={colors.success} />
            <Text style={styles.benefitText}>Real-time compliance monitoring</Text>
          </View>
        </View>

        <View style={styles.ctaContainer}>
          <Text style={styles.ctaText}>Tap to start smart setup</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={onboardingVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SmartDeviceOnboarding
          onBack={() => setOnboardingVisible(false)}
          onComplete={() => setOnboardingVisible(false)}
          onSkip={() => setOnboardingVisible(false)}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: `${colors.warning}30`,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.warning}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '500',
  },
  content: {
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  footer: {
    gap: 8,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.background.secondary,
  },
  benefitsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  ctaContainer: {
    backgroundColor: `${colors.primary}10`,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});