import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Check, Truck, Shield, Zap, BarChart, Wrench, Users } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ELDProvider, ELDProviderInfo } from '@/types';

interface ELDProviderSelectionProps {
  onProviderSelect: (provider: ELDProvider) => void;
  selectedProvider?: ELDProvider;
}

const ELD_PROVIDERS: ELDProviderInfo[] = [
  {
    id: 'geotab',
    name: 'Geotab',
    description: 'Industry-leading fleet management with comprehensive analytics',
    logo: '🚛',
    features: [
      'Real-time GPS tracking',
      'HOS compliance monitoring',
      'Engine diagnostics',
      'Fuel management',
      'Driver behavior analysis',
      'Maintenance scheduling'
    ],
    apiVersion: 'v2.0',
    supportedFeatures: {
      realTimeTracking: true,
      hosCompliance: true,
      faultCodes: true,
      fuelData: true,
      maintenanceAlerts: true,
      driverBehavior: true,
    },
    pricingModel: 'paid',
    trialAvailable: true,
  },
  {
    id: 'samsara',
    name: 'Samsara',
    description: 'Modern fleet operations platform with AI-powered insights',
    logo: '📊',
    features: [
      'AI dash cams',
      'Real-time alerts',
      'Route optimization',
      'Safety scoring',
      'Compliance automation',
      'Mobile app integration'
    ],
    apiVersion: 'v1.0',
    supportedFeatures: {
      realTimeTracking: true,
      hosCompliance: true,
      faultCodes: true,
      fuelData: true,
      maintenanceAlerts: true,
      driverBehavior: true,
    },
    pricingModel: 'freemium',
    trialAvailable: true,
  },
  {
    id: 'motive',
    name: 'Motive (KeepTruckin)',
    description: 'All-in-one fleet management for trucking companies',
    logo: '🛣️',
    features: [
      'ELD compliance',
      'Fleet tracking',
      'IFTA reporting',
      'Load management',
      'Driver mobile app',
      'Maintenance tracking'
    ],
    apiVersion: 'v3.0',
    supportedFeatures: {
      realTimeTracking: true,
      hosCompliance: true,
      faultCodes: true,
      fuelData: true,
      maintenanceAlerts: true,
      driverBehavior: true,
    },
    pricingModel: 'paid',
    trialAvailable: true,
  },
  {
    id: 'verizon',
    name: 'Verizon Connect',
    description: 'Enterprise fleet management with robust connectivity',
    logo: '📡',
    features: [
      'Fleet tracking',
      'Route planning',
      'Compliance management',
      'Field service tools',
      'Asset tracking',
      'Reporting & analytics'
    ],
    apiVersion: 'v2.1',
    supportedFeatures: {
      realTimeTracking: true,
      hosCompliance: true,
      faultCodes: true,
      fuelData: true,
      maintenanceAlerts: true,
      driverBehavior: false,
    },
    pricingModel: 'paid',
    trialAvailable: false,
  },
  {
    id: 'omnitracs',
    name: 'Omnitracs',
    description: 'Comprehensive transportation management solutions',
    logo: '🌐',
    features: [
      'Fleet management',
      'Compliance solutions',
      'Route optimization',
      'Driver workflow',
      'Analytics platform',
      'Integration APIs'
    ],
    apiVersion: 'v1.5',
    supportedFeatures: {
      realTimeTracking: true,
      hosCompliance: true,
      faultCodes: true,
      fuelData: false,
      maintenanceAlerts: true,
      driverBehavior: true,
    },
    pricingModel: 'paid',
    trialAvailable: true,
  },
];

const getFeatureIcon = (feature: string) => {
  if (feature.toLowerCase().includes('tracking') || feature.toLowerCase().includes('gps')) {
    return <Truck size={16} color={colors.primary} />;
  }
  if (feature.toLowerCase().includes('compliance') || feature.toLowerCase().includes('hos')) {
    return <Shield size={16} color={colors.primary} />;
  }
  if (feature.toLowerCase().includes('alert') || feature.toLowerCase().includes('real-time')) {
    return <Zap size={16} color={colors.primary} />;
  }
  if (feature.toLowerCase().includes('analytic') || feature.toLowerCase().includes('report')) {
    return <BarChart size={16} color={colors.primary} />;
  }
  if (feature.toLowerCase().includes('maintenance')) {
    return <Wrench size={16} color={colors.primary} />;
  }
  if (feature.toLowerCase().includes('driver') || feature.toLowerCase().includes('mobile')) {
    return <Users size={16} color={colors.primary} />;
  }
  return <Check size={16} color={colors.primary} />;
};

export default function ELDProviderSelection({ onProviderSelect, selectedProvider }: ELDProviderSelectionProps) {
  const [expandedProvider, setExpandedProvider] = useState<ELDProvider | null>(null);

  const handleProviderSelect = (provider: ELDProvider) => {
    const providerInfo = ELD_PROVIDERS.find(p => p.id === provider);
    if (!providerInfo) return;

    Alert.alert(
      `Connect to ${providerInfo.name}`,
      `You'll be redirected to ${providerInfo.name} to authorize access to your fleet data. This is secure and follows industry standards.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => onProviderSelect(provider),
          style: 'default'
        }
      ]
    );
  };

  const toggleExpanded = (provider: ELDProvider) => {
    setExpandedProvider(expandedProvider === provider ? null : provider);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your ELD Provider</Text>
        <Text style={styles.subtitle}>
          Connect your existing ELD system to unlock advanced compliance and fleet management features
        </Text>
      </View>

      <View style={styles.providersContainer}>
        {ELD_PROVIDERS.map((provider) => {
          const isSelected = selectedProvider === provider.id;
          const isExpanded = expandedProvider === provider.id;

          return (
            <View key={provider.id} style={styles.providerCard}>
              <Pressable
                style={[
                  styles.providerHeader,
                  isSelected && styles.selectedProvider
                ]}
                onPress={() => toggleExpanded(provider.id)}
              >
                <View style={styles.providerInfo}>
                  <View style={styles.providerTitleRow}>
                    <Text style={styles.providerLogo}>{provider.logo}</Text>
                    <View style={styles.providerTitleContainer}>
                      <Text style={styles.providerName}>{provider.name}</Text>
                      <View style={styles.pricingBadge}>
                        <Text style={styles.pricingText}>
                          {provider.pricingModel === 'free' ? 'Free' : 
                           provider.pricingModel === 'freemium' ? 'Freemium' : 'Paid'}
                        </Text>
                        {provider.trialAvailable && (
                          <Text style={styles.trialText}>• Trial Available</Text>
                        )}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.providerDescription}>{provider.description}</Text>
                </View>
                
                {isSelected && (
                  <View style={styles.selectedIcon}>
                    <Check size={20} color={colors.white} />
                  </View>
                )}
              </Pressable>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <View style={styles.featuresSection}>
                    <Text style={styles.sectionTitle}>Key Features</Text>
                    <View style={styles.featuresList}>
                      {provider.features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                          {getFeatureIcon(feature)}
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.capabilitiesSection}>
                    <Text style={styles.sectionTitle}>Supported Capabilities</Text>
                    <View style={styles.capabilitiesGrid}>
                      {Object.entries(provider.supportedFeatures).map(([key, supported]) => (
                        <View key={key} style={styles.capabilityItem}>
                          <View style={[
                            styles.capabilityIndicator,
                            supported ? styles.supportedIndicator : styles.unsupportedIndicator
                          ]}>
                            <Check size={12} color={supported ? colors.white : colors.textSecondary} />
                          </View>
                          <Text style={[
                            styles.capabilityText,
                            !supported && styles.unsupportedText
                          ]}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <Pressable
                    style={styles.connectButton}
                    onPress={() => handleProviderSelect(provider.id)}
                  >
                    <Text style={styles.connectButtonText}>
                      Connect to {provider.name}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't see your ELD provider? Contact us to request integration support.
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
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  providersContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  providerCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  providerHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedProvider: {
    backgroundColor: colors.primaryLight + '10',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  providerInfo: {
    flex: 1,
  },
  providerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  providerLogo: {
    fontSize: 24,
    marginRight: 12,
  },
  providerTitleContainer: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  pricingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pricingText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.primary,
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trialText: {
    fontSize: 12,
    color: colors.success,
    marginLeft: 4,
  },
  providerDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  selectedIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
    paddingTop: 20,
  },
  featuresSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  capabilitiesSection: {
    marginBottom: 20,
  },
  capabilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  capabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  capabilityIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportedIndicator: {
    backgroundColor: colors.success,
  },
  unsupportedIndicator: {
    backgroundColor: colors.textSecondary + '30',
  },
  capabilityText: {
    fontSize: 12,
    color: colors.text.primary,
  },
  unsupportedText: {
    color: colors.textSecondary,
  },
  connectButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.white,
  },
  footer: {
    padding: 20,
    paddingTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});