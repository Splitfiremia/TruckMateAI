import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { User, Users, Truck, BarChart3 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { UserType } from '@/types/pricing';

interface UserTypeStepProps {
  onNext: (data: { userType: UserType }) => void;
}

export default function UserTypeStep({ onNext }: UserTypeStepProps) {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  const handleNext = () => {
    if (selectedType) {
      onNext({ userType: selectedType });
    }
  };

  const userTypes = [
    {
      id: 'owner-operator' as UserType,
      title: 'Owner-Operator',
      description: 'I own and operate my own truck(s)',
      icon: User,
      features: [
        'Personal compliance tracking',
        'Individual route optimization',
        'Direct expense management',
        'Solo driver focus',
      ],
      color: colors.primary,
    },
    {
      id: 'fleet' as UserType,
      title: 'Fleet Manager',
      description: 'I manage multiple trucks and drivers',
      icon: Users,
      features: [
        'Multi-vehicle dashboard',
        'Driver management tools',
        'Fleet-wide analytics',
        'Team coordination',
      ],
      color: colors.secondary,
    },
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.header}>
        <Text style={styles.title}>Tell us about your operation</Text>
        <Text style={styles.subtitle}>
          This helps us customize your experience and show relevant features
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {userTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <Pressable
              key={type.id}
              style={[
                styles.optionCard,
                isSelected && styles.selectedCard,
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: type.color }]}>
                  <IconComponent color={colors.white} size={32} />
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.optionTitle}>{type.title}</Text>
                  <Text style={styles.optionDescription}>{type.description}</Text>
                </View>
              </View>

              <View style={styles.featuresContainer}>
                {type.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedText}>Selected</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.comparisonContainer}>
        <Text style={styles.comparisonTitle}>Quick Comparison</Text>
        <View style={styles.comparisonTable}>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>Typical Fleet Size</Text>
            <Text style={styles.comparisonValue}>1-3 trucks</Text>
            <Text style={styles.comparisonValue}>5+ trucks</Text>
          </View>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>Primary Focus</Text>
            <Text style={styles.comparisonValue}>Personal efficiency</Text>
            <Text style={styles.comparisonValue}>Team management</Text>
          </View>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>Recommended Plan</Text>
            <Text style={styles.comparisonValue}>Pro</Text>
            <Text style={styles.comparisonValue}>Elite</Text>
          </View>
        </View>
      </View>

        <Pressable 
          style={[styles.nextButton, !selectedType && styles.disabledButton]} 
          onPress={handleNext}
          disabled={!selectedType}
        >
          <Text style={[styles.nextButtonText, !selectedType && styles.disabledText]}>
            Continue
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
  optionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.background.tertiary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  featuresContainer: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  comparisonContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  comparisonTable: {
    gap: 8,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonLabel: {
    flex: 1,
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  comparisonValue: {
    flex: 1,
    fontSize: 12,
    color: colors.text.primary,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: colors.border,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  disabledText: {
    color: colors.text.secondary,
  },
});