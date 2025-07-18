import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  Settings,
  DollarSign,
  Zap,
  Award,
  Users,
  CheckCircle,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { usePricingStore } from '@/store/pricingStore';
import { useUserStore } from '@/store/userStore';
import { paymentService } from '@/services/paymentService';
import { usageMonitoringService } from '@/services/usageMonitoringService';
import UsageAlertBanner from '@/components/UsageAlertBanner';

const { width } = Dimensions.get('window');

export default function PricingTabScreen() {
  const {
    currentSubscription,
    usageAlerts,
    calculation,
    savingsCalculation,
    trackEvent,
    startOnboarding,
  } = usePricingStore();
  
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [usageStats, setUsageStats] = useState<any[]>([]);

  useEffect(() => {
    trackEvent('pricing_tab_viewed');
    loadUsageStats();
  }, []);

  const loadUsageStats = () => {
    const stats = usageMonitoringService.getAllUsage();
    setUsageStats(stats);
  };

  const handleStartTrial = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to start your free trial.');
      return;
    }

    setLoading(true);
    try {
      const subscription = await paymentService.createSubscription({
        userId: user.id,
        planId: 'pro',
        billingCycle: 'monthly',
        vehicleCount: 1,
        addons: [],
        paymentMethodToken: 'mock_token',
      });

      Alert.alert(
        'Trial Started!',
        'Your 30-day free trial has begun. Enjoy all Pro features!',
        [{ text: 'OK', onPress: () => router.push('/(tabs)') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to start trial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    if (!user) {
      startOnboarding('guest');
      router.push('/onboarding-flow');
    } else {
      router.push('/pricing');
    }
  };

  const handleManageSubscription = () => {
    router.push('/subscription-management');
  };

  const renderSubscriptionStatus = () => {
    if (!currentSubscription) {
      return (
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <CreditCard color={colors.primary} size={24} />
            <Text style={styles.statusTitle}>No Active Subscription</Text>
          </View>
          <Text style={styles.statusDescription}>
            Start your free trial to unlock all features
          </Text>
          <Pressable 
            style={styles.trialButton} 
            onPress={handleStartTrial}
            disabled={loading}
          >
            <Text style={styles.trialButtonText}>
              {loading ? 'Starting Trial...' : 'Start 30-Day Free Trial'}
            </Text>
          </Pressable>
        </View>
      );
    }

    const isTrialing = currentSubscription.status === 'trialing';
    const trialDaysLeft = isTrialing && currentSubscription.trialEndsAt 
      ? Math.ceil((new Date(currentSubscription.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 0;

    return (
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <CheckCircle color={colors.status.success} size={24} />
          <Text style={styles.statusTitle}>
            {currentSubscription.planId.toUpperCase()} Plan
          </Text>
          {isTrialing && (
            <View style={styles.trialBadge}>
              <Text style={styles.trialBadgeText}>TRIAL</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.statusDescription}>
          {isTrialing 
            ? `${trialDaysLeft} days left in your free trial`
            : `Next billing: ${new Date(currentSubscription.nextBillingDate).toLocaleDateString()}`
          }
        </Text>
        
        <View style={styles.subscriptionDetails}>
          <Text style={styles.detailText}>
            ${currentSubscription.totalAmount}/{currentSubscription.billingCycle}
          </Text>
          <Text style={styles.detailText}>
            {currentSubscription.vehicleCount} vehicle{currentSubscription.vehicleCount > 1 ? 's' : ''}
          </Text>
        </View>

        <Pressable style={styles.manageButton} onPress={handleManageSubscription}>
          <Text style={styles.manageButtonText}>Manage Subscription</Text>
        </Pressable>
      </View>
    );
  };

  const renderUsageOverview = () => (
    <View style={styles.usageCard}>
      <View style={styles.cardHeader}>
        <TrendingUp color={colors.primary} size={20} />
        <Text style={styles.cardTitle}>Usage Overview</Text>
      </View>

      {usageStats.slice(0, 3).map((stat, index) => {
        const usagePercentage = (stat.current / stat.limit) * 100;
        const statusColor = usagePercentage > 90 ? colors.status.error :
                           usagePercentage > 70 ? colors.warning : colors.status.success;

        return (
          <View key={index} style={styles.usageItem}>
            <View style={styles.usageHeader}>
              <Text style={styles.usageName}>{stat.name}</Text>
              <Text style={[styles.usagePercentage, { color: statusColor }]}>
                {usagePercentage.toFixed(0)}%
              </Text>
            </View>
            <View style={styles.usageBar}>
              <View 
                style={[
                  styles.usageBarFill,
                  { 
                    width: `${Math.min(usagePercentage, 100)}%`,
                    backgroundColor: statusColor,
                  }
                ]} 
              />
            </View>
            <Text style={styles.usageText}>
              {stat.current.toLocaleString()} / {stat.limit.toLocaleString()}
            </Text>
          </View>
        );
      })}

      <Pressable style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>View All Usage</Text>
      </Pressable>
    </View>
  );

  const renderSavingsHighlight = () => (
    <View style={styles.savingsCard}>
      <View style={styles.savingsHeader}>
        <DollarSign color={colors.status.success} size={24} />
        <Text style={styles.savingsTitle}>Your Savings</Text>
      </View>

      <View style={styles.savingsGrid}>
        <View style={styles.savingsItem}>
          <Text style={styles.savingsAmount}>
            ${savingsCalculation.fuelSavings}
          </Text>
          <Text style={styles.savingsLabel}>Fuel/Month</Text>
        </View>
        
        <View style={styles.savingsItem}>
          <Text style={styles.savingsAmount}>
            ${savingsCalculation.maintenanceSavings}
          </Text>
          <Text style={styles.savingsLabel}>Maintenance/Month</Text>
        </View>
        
        <View style={styles.savingsItem}>
          <Text style={styles.savingsAmount}>
            ${savingsCalculation.totalMonthlySavings}
          </Text>
          <Text style={styles.savingsLabel}>Total/Month</Text>
        </View>
        
        <View style={styles.savingsItem}>
          <Text style={styles.savingsAmount}>
            {savingsCalculation.roiPercentage}%
          </Text>
          <Text style={styles.savingsLabel}>ROI</Text>
        </View>
      </View>

      <Text style={styles.savingsNote}>
        Based on your current usage patterns and industry averages
      </Text>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.actionsCard}>
      <Text style={styles.cardTitle}>Quick Actions</Text>
      
      <View style={styles.actionButtons}>
        <Pressable style={styles.actionButton} onPress={handleUpgrade}>
          <Award color={colors.primary} size={20} />
          <Text style={styles.actionButtonText}>Upgrade Plan</Text>
        </Pressable>
        
        <Pressable style={styles.actionButton} onPress={() => router.push('/pricing')}>
          <Users color={colors.secondary} size={20} />
          <Text style={styles.actionButtonText}>Compare Plans</Text>
        </Pressable>
        
        <Pressable style={styles.actionButton}>
          <Settings color={colors.accent} size={20} />
          <Text style={styles.actionButtonText}>Billing Settings</Text>
        </Pressable>
        
        <Pressable style={styles.actionButton}>
          <Zap color={colors.warning} size={20} />
          <Text style={styles.actionButtonText}>Usage Alerts</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Pricing & Billing',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Usage Alerts */}
        {usageAlerts.map((alert, index) => (
          <UsageAlertBanner key={alert.id || ('alert-' + index)} alert={alert} />
        ))}

        {/* Subscription Status */}
        {renderSubscriptionStatus()}

        {/* Usage Overview */}
        {renderUsageOverview()}

        {/* Savings Highlight */}
        {renderSavingsHighlight()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Upgrade CTA */}
        {!currentSubscription && (
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Ready to Save Money?</Text>
            <Text style={styles.ctaSubtitle}>
              Join thousands of truckers saving money with Rork
            </Text>
            <Pressable style={styles.ctaButton} onPress={handleUpgrade}>
              <Text style={styles.ctaButtonText}>View All Plans</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  trialBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trialBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
  statusDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  subscriptionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  trialButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  trialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  manageButton: {
    backgroundColor: colors.background.tertiary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  manageButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  usageCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  usageItem: {
    marginBottom: 16,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  usageName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  usagePercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  usageBar: {
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  usageBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  usageText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  savingsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.status.success,
  },
  savingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  savingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  savingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  savingsItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
  },
  savingsAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.status.success,
    marginBottom: 4,
  },
  savingsLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  savingsNote: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    width: '48%',
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  ctaCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    margin: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});