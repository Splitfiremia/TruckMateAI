import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AlertTriangle, TrendingUp, X, Zap } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { UsageAlert } from '@/types/pricing';
import { usePricingStore } from '@/store/pricingStore';

interface UsageAlertBannerProps {
  alert: UsageAlert;
}

export default function UsageAlertBanner({ alert }: UsageAlertBannerProps) {
  const { dismissAlert } = usePricingStore();

  const getAlertIcon = () => {
    switch (alert.type) {
      case 'upgrade_nudge':
        return TrendingUp;
      case 'cost_saving':
        return Zap;
      default:
        return AlertTriangle;
    }
  };

  const getAlertColor = () => {
    switch (alert.severity) {
      case 'critical':
        return colors.status.error;
      case 'warning':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  const IconComponent = getAlertIcon();
  const alertColor = getAlertColor();

  const handleDismiss = () => {
    if (alert.dismissible) {
      dismissAlert(alert.id);
    }
  };

  const handleUpgrade = () => {
    // Navigate to pricing page or upgrade flow
    console.log('Navigate to upgrade:', alert.upgradeRecommendation);
  };

  return (
    <View style={[styles.container, { borderLeftColor: alertColor }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: alertColor }]}>
            <IconComponent color={colors.white} size={16} />
          </View>
          <Text style={styles.title}>{alert.title}</Text>
          {alert.dismissible && (
            <Pressable style={styles.dismissButton} onPress={handleDismiss}>
              <X color={colors.text.secondary} size={16} />
            </Pressable>
          )}
        </View>

        <Text style={styles.message}>{alert.message}</Text>

        {alert.type === 'tier_limit' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min((alert.currentUsage / alert.threshold) * 100, 100)}%`,
                    backgroundColor: alertColor,
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {alert.currentUsage} / {alert.threshold} used
            </Text>
          </View>
        )}

        {alert.upgradeRecommendation && (
          <View style={styles.upgradeContainer}>
            <Text style={styles.upgradeText}>
              Upgrade to {alert.upgradeRecommendation.tier.toUpperCase()} for {alert.upgradeRecommendation.benefit}
            </Text>
            {alert.upgradeRecommendation.estimatedSavings && (
              <Text style={styles.savingsText}>
                Potential savings: ${alert.upgradeRecommendation.estimatedSavings}/month
              </Text>
            )}
            <Pressable style={styles.upgradeButton} onPress={handleUpgrade}>
              <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
            </Pressable>
          </View>
        )}

        {alert.actionRequired && (
          <View style={styles.actionContainer}>
            <Text style={styles.actionText}>Action Required</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderLeftWidth: 4,
    margin: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  dismissButton: {
    padding: 4,
  },
  message: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'right',
  },
  upgradeContainer: {
    backgroundColor: colors.background.tertiary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  savingsText: {
    fontSize: 12,
    color: colors.status.success,
    fontWeight: '500',
    marginBottom: 8,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  upgradeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  actionContainer: {
    backgroundColor: colors.status.error,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
});