import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { 
  Fuel, 
  Wrench, 
  Shield, 
  Navigation, 
  Bot, 
  BarChart3,
  Zap,
  DollarSign,
  Check,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface FeatureSelectionStepProps {
  onNext: (data: { selectedFeatures: string[] }) => void;
}

export default function FeatureSelectionStep({ onNext }: FeatureSelectionStepProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const features = [
    {
      id: 'fuel_optimization',
      name: 'Fuel Savings',
      description: 'Route optimization and fuel station finder',
      icon: Fuel,
      price: 15,
      savings: 200,
      category: 'Cost Savings',
      popular: true,
    },
    {
      id: 'predictive_maintenance',
      name: 'Predictive Maintenance',
      description: 'AI-powered breakdown prevention',
      icon: Wrench,
      price: 25,
      savings: 800,
      category: 'Maintenance',
      popular: true,
    },
    {
      id: 'compliance_monitoring',
      name: 'DOT Compliance',
      description: 'Violation prevention and inspection prep',
      icon: Shield,
      price: 0,
      savings: 1500,
      category: 'Compliance',
      included: true,
    },
    {
      id: 'route_optimization',
      name: 'Smart Routing',
      description: 'Traffic-aware routing with weather alerts',
      icon: Navigation,
      price: 20,
      savings: 150,
      category: 'Efficiency',
    },
    {
      id: 'ai_assistant',
      name: 'AI Assistant',
      description: 'Voice commands and smart recommendations',
      icon: Bot,
      price: 35,
      savings: 300,
      category: 'Innovation',
    },
    {
      id: 'advanced_analytics',
      name: 'Business Analytics',
      description: 'Custom reports and performance insights',
      icon: BarChart3,
      price: 30,
      savings: 400,
      category: 'Analytics',
    },
    {
      id: 'load_board_integration',
      name: 'Load Board Connect',
      description: 'Direct integration with major load boards',
      icon: Zap,
      price: 49,
      savings: 500,
      category: 'Integration',
    },
  ];

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleNext = () => {
    onNext({ selectedFeatures });
  };

  const totalMonthlyCost = features
    .filter(f => selectedFeatures.includes(f.id))
    .reduce((sum, f) => sum + f.price, 0);

  const totalMonthlySavings = features
    .filter(f => selectedFeatures.includes(f.id))
    .reduce((sum, f) => sum + f.savings, 0);

  const roi = totalMonthlyCost > 0 ? Math.round(((totalMonthlySavings - totalMonthlyCost) / totalMonthlyCost) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Which features matter most?</Text>
        <Text style={styles.subtitle}>
          Select the features that will help your business the most. You can always add more later.
        </Text>
      </View>

      <ScrollView style={styles.featuresContainer} showsVerticalScrollIndicator={false}>
        {features.map((feature) => {
          const IconComponent = feature.icon;
          const isSelected = selectedFeatures.includes(feature.id);
          const isIncluded = feature.included;
          
          return (
            <Pressable
              key={feature.id}
              style={[
                styles.featureCard,
                isSelected && styles.selectedFeature,
                isIncluded && styles.includedFeature,
              ]}
              onPress={() => !isIncluded && toggleFeature(feature.id)}
              disabled={isIncluded}
            >
              <View style={styles.featureHeader}>
                <View style={[styles.iconContainer, isSelected && styles.selectedIcon]}>
                  <IconComponent 
                    color={isSelected || isIncluded ? colors.white : colors.primary} 
                    size={24} 
                  />
                </View>
                
                <View style={styles.featureInfo}>
                  <View style={styles.featureTitleRow}>
                    <Text style={styles.featureName}>{feature.name}</Text>
                    {feature.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>Popular</Text>
                      </View>
                    )}
                    {isIncluded && (
                      <View style={styles.includedBadge}>
                        <Text style={styles.includedText}>Included</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                  <Text style={styles.featureCategory}>{feature.category}</Text>
                </View>

                {isSelected && !isIncluded && (
                  <View style={styles.checkmark}>
                    <Check color={colors.white} size={16} />
                  </View>
                )}
              </View>

              <View style={styles.featureFooter}>
                <View style={styles.pricingInfo}>
                  <Text style={styles.priceText}>
                    {isIncluded ? 'Free' : `$${feature.price}/mo`}
                  </Text>
                  <Text style={styles.savingsText}>
                    Saves ~${feature.savings}/mo
                  </Text>
                </View>
                
                <View style={styles.roiContainer}>
                  <Text style={styles.roiText}>
                    {isIncluded ? '∞' : Math.round(((feature.savings - feature.price) / feature.price) * 100)}% ROI
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {selectedFeatures.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Monthly Cost:</Text>
            <Text style={styles.summaryValue}>${totalMonthlyCost}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Monthly Savings:</Text>
            <Text style={[styles.summaryValue, styles.savingsValue]}>
              ${totalMonthlySavings}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Net Benefit:</Text>
            <Text style={[styles.summaryValue, styles.benefitValue]}>
              ${totalMonthlySavings - totalMonthlyCost}
            </Text>
          </View>
          {roi > 0 && (
            <View style={styles.roiHighlight}>
              <DollarSign color={colors.status.success} size={20} />
              <Text style={styles.roiHighlightText}>
                {roi}% Return on Investment
              </Text>
            </View>
          )}
        </View>
      )}

      <Pressable style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {selectedFeatures.length > 0 ? 'Continue with Selected Features' : 'Skip for Now'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  featureCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedFeature: {
    borderColor: colors.primary,
    backgroundColor: colors.background.tertiary,
  },
  includedFeature: {
    borderColor: colors.status.success,
    backgroundColor: colors.background.tertiary,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedIcon: {
    backgroundColor: colors.primary,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: 8,
  },
  popularBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
  includedBadge: {
    backgroundColor: colors.status.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  includedText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  featureCategory: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingInfo: {
    flex: 1,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  savingsText: {
    fontSize: 12,
    color: colors.status.success,
    fontWeight: '500',
  },
  roiContainer: {
    backgroundColor: colors.status.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roiText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  summaryContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  savingsValue: {
    color: colors.status.success,
  },
  benefitValue: {
    color: colors.primary,
    fontSize: 18,
  },
  roiHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.status.success,
    borderRadius: 8,
  },
  roiHighlightText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 4,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
});