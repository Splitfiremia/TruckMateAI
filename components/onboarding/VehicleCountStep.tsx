import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Truck, Plus, Minus } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface VehicleCountStepProps {
  initialCount?: number;
  onCountChange: (count: number) => void;
  onNext: (data: { vehicleCount: number }) => void;
}

export default function VehicleCountStep({ 
  initialCount = 1, 
  onCountChange, 
  onNext 
}: VehicleCountStepProps) {
  const [count, setCount] = useState(initialCount);

  const handleCountChange = (newCount: number) => {
    const validCount = Math.max(1, Math.min(100, newCount));
    setCount(validCount);
    onCountChange(validCount);
  };

  const handleNext = () => {
    onNext({ vehicleCount: count });
  };

  const presetCounts = [1, 2, 5, 10, 25, 50];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Truck color={colors.primary} size={48} />
        <Text style={styles.title}>How many trucks need tracking?</Text>
        <Text style={styles.subtitle}>
          This helps us recommend the right plan and pricing for your operation
        </Text>
      </View>

      <View style={styles.counterContainer}>
        <Pressable
          style={styles.counterButton}
          onPress={() => handleCountChange(count - 1)}
        >
          <Minus color={colors.white} size={24} />
        </Pressable>
        
        <View style={styles.countDisplay}>
          <Text style={styles.countNumber}>{count}</Text>
          <Text style={styles.countLabel}>
            {count === 1 ? 'Vehicle' : 'Vehicles'}
          </Text>
        </View>
        
        <Pressable
          style={styles.counterButton}
          onPress={() => handleCountChange(count + 1)}
        >
          <Plus color={colors.white} size={24} />
        </Pressable>
      </View>

      <View style={styles.presetsContainer}>
        <Text style={styles.presetsLabel}>Quick Select:</Text>
        <View style={styles.presetButtons}>
          {presetCounts.map((presetCount) => (
            <Pressable
              key={presetCount}
              style={[
                styles.presetButton,
                count === presetCount && styles.activePreset,
              ]}
              onPress={() => handleCountChange(presetCount)}
            >
              <Text style={[
                styles.presetText,
                count === presetCount && styles.activePresetText,
              ]}>
                {presetCount}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>What this means for you:</Text>
        {count === 1 && (
          <Text style={styles.infoText}>
            • Perfect for owner-operators
            • Focus on individual efficiency
            • Personal compliance tracking
          </Text>
        )}
        {count >= 2 && count <= 5 && (
          <Text style={styles.infoText}>
            • Small fleet management
            • Multi-vehicle dashboard
            • Driver coordination tools
          </Text>
        )}
        {count > 5 && (
          <Text style={styles.infoText}>
            • Enterprise fleet management
            • Advanced analytics & reporting
            • Dedicated account support
          </Text>
        )}
      </View>

      <Pressable style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background.primary,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  counterButton: {
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countDisplay: {
    alignItems: 'center',
    marginHorizontal: 40,
  },
  countNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
  },
  countLabel: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 4,
  },
  presetsContainer: {
    marginBottom: 40,
  },
  presetsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  presetButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activePreset: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  presetText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  activePresetText: {
    color: colors.white,
  },
  infoContainer: {
    backgroundColor: colors.background.secondary,
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
});