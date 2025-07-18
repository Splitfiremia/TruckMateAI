import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAdminStore } from '@/store/adminStore';

const { width } = Dimensions.get('window');

export function ProfitWidget() {
  const { profitMetrics } = useAdminStore();

  const profitMarginColor = profitMetrics.profitMargin >= 0.2 
    ? colors.success 
    : profitMetrics.profitMargin >= 0.1 
      ? colors.warning 
      : colors.error;

  const netProfitTrend = profitMetrics.netProfit > 0 ? 'positive' : 'negative';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <DollarSign color={colors.primary} size={24} />
        <Text style={styles.title}>Profit Analysis</Text>
      </View>

      {/* Main Profit Display */}
      <View style={styles.profitDisplay}>
        <Text style={styles.netProfitLabel}>Net Profit</Text>
        <View style={styles.profitRow}>
          <Text style={[
            styles.netProfitValue,
            { color: netProfitTrend === 'positive' ? colors.success : colors.error }
          ]}>
            ${profitMetrics.netProfit.toFixed(2)}
          </Text>
          {netProfitTrend === 'positive' ? (
            <TrendingUp color={colors.success} size={20} />
          ) : (
            <TrendingDown color={colors.error} size={20} />
          )}
        </View>
      </View>

      {/* Profit Breakdown */}
      <View style={styles.breakdown}>
        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>Revenue</Text>
          <Text style={[styles.breakdownValue, { color: colors.success }]}>
            +${profitMetrics.monthlyRevenue.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>API Costs</Text>
          <Text style={[styles.breakdownValue, { color: colors.error }]}>
            -${profitMetrics.totalApiCosts.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Profit Margin Indicator */}
      <View style={styles.marginSection}>
        <View style={styles.marginHeader}>
          <Text style={styles.marginLabel}>Profit Margin</Text>
          <Text style={[styles.marginValue, { color: profitMarginColor }]}>
            {(profitMetrics.profitMargin * 100).toFixed(1)}%
          </Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${Math.min(profitMetrics.profitMargin * 100, 100)}%`,
                  backgroundColor: profitMarginColor
                }
              ]} 
            />
          </View>
          <Text style={styles.targetLabel}>Target: 65%</Text>
        </View>
      </View>

      {/* Alert if below threshold */}
      {profitMetrics.profitMargin < 0.2 && (
        <View style={styles.alertContainer}>
          <AlertTriangle color={colors.warning} size={16} />
          <Text style={styles.alertText}>
            Profit margin below 20% threshold. Consider cost optimization.
          </Text>
        </View>
      )}

      {/* Key Insights */}
      <View style={styles.insights}>
        <Text style={styles.insightsTitle}>Key Insights</Text>
        
        <View style={styles.insightItem}>
          <Text style={styles.insightText}>
            • Cost per user: ${profitMetrics.userCount.paid > 0 
              ? (profitMetrics.totalApiCosts / profitMetrics.userCount.paid).toFixed(2) 
              : '0.00'}
          </Text>
        </View>
        
        <View style={styles.insightItem}>
          <Text style={styles.insightText}>
            • Revenue per user: ${profitMetrics.userCount.paid > 0 
              ? (profitMetrics.monthlyRevenue / profitMetrics.userCount.paid).toFixed(2) 
              : '0.00'}
          </Text>
        </View>
        
        <View style={styles.insightItem}>
          <Text style={styles.insightText}>
            • {profitMetrics.userCount.trial} trial users (0% cost)
          </Text>
        </View>
        
        {profitMetrics.profitMargin >= 0.65 && (
          <View style={styles.insightItem}>
            <Text style={[styles.insightText, { color: colors.success }]}>
              ✓ Exceeding 65% profit target
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  profitDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  netProfitLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  profitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  netProfitValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  breakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  marginSection: {
    marginBottom: 16,
  },
  marginHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  marginLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  marginValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressContainer: {
    gap: 4,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  targetLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'right',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    borderColor: colors.warning,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
  },
  insights: {
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 16,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  insightItem: {
    marginBottom: 6,
  },
  insightText: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 16,
  },
});