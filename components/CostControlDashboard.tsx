import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Settings } from 'lucide-react-native';
import { hybridApiService } from '@/services/hybridApiService';
import { colors } from '@/constants/colors';

interface CostData {
  currentMonth: number;
  projectedMonth: number;
  lastMonth: number;
  yearToDate: number;
  savings: number;
  breakdown: {
    primary: number;
    fallback: number;
    cache: number;
  };
}

interface CostControlDashboardProps {
  onSettingsPress?: () => void;
}

export default function CostControlDashboard({ onSettingsPress }: CostControlDashboardProps) {
  const [costData, setCostData] = useState<CostData>({
    currentMonth: 0,
    projectedMonth: 0,
    lastMonth: 0,
    yearToDate: 0,
    savings: 0,
    breakdown: { primary: 0, fallback: 0, cache: 0 }
  });
  const [usageStats, setUsageStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCostData();
    const interval = setInterval(loadCostData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const loadCostData = async () => {
    try {
      const usageStatus = await hybridApiService.getUsageStatus();
      setUsageStats(usageStatus.apis);
      
      // Calculate mock cost data based on usage
      const totalDailyCalls = usageStatus.apis.reduce((sum, api) => sum + api.dailyUsage, 0);
      const totalMonthlyCalls = usageStatus.apis.reduce((sum, api) => sum + api.monthlyUsage, 0);
      
      // Mock cost calculations (in a real app, these would come from actual billing APIs)
      const estimatedMonthlyCost = totalMonthlyCalls * 0.001; // $0.001 per call
      const projectedCost = (totalDailyCalls * 30) * 0.001;
      const lastMonthCost = estimatedMonthlyCost * 0.8; // Assume 20% increase
      const yearToDateCost = estimatedMonthlyCost * 8; // 8 months
      const savings = (projectedCost - estimatedMonthlyCost) * 0.6; // 60% savings from fallbacks
      
      setCostData({
        currentMonth: estimatedMonthlyCost,
        projectedMonth: projectedCost,
        lastMonth: lastMonthCost,
        yearToDate: yearToDateCost,
        savings: Math.max(savings, 0),
        breakdown: {
          primary: estimatedMonthlyCost * 0.7,
          fallback: estimatedMonthlyCost * 0.2,
          cache: estimatedMonthlyCost * 0.1
        }
      });
    } catch (error) {
      console.error('Failed to load cost data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp size={16} color={colors.danger} />;
    } else if (current < previous) {
      return <TrendingDown size={16} color={colors.success} />;
    }
    return null;
  };

  const getTrendColor = (current: number, previous: number): string => {
    if (current > previous) return colors.danger;
    if (current < previous) return colors.success;
    return colors.text.secondary;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading cost data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>API Cost Control</Text>
        {onSettingsPress && (
          <Pressable style={styles.settingsButton} onPress={onSettingsPress}>
            <Settings size={20} color={colors.text.secondary} />
          </Pressable>
        )}
      </View>

      {/* Cost Overview Cards */}
      <View style={styles.overviewGrid}>
        <View style={styles.costCard}>
          <View style={styles.cardHeader}>
            <DollarSign size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>This Month</Text>
          </View>
          <Text style={styles.costAmount}>{formatCurrency(costData.currentMonth)}</Text>
          <View style={styles.trendContainer}>
            {getTrendIcon(costData.currentMonth, costData.lastMonth)}
            <Text style={[styles.trendText, { color: getTrendColor(costData.currentMonth, costData.lastMonth) }]}>
              vs last month
            </Text>
          </View>
        </View>

        <View style={styles.costCard}>
          <View style={styles.cardHeader}>
            <TrendingUp size={20} color={colors.warning} />
            <Text style={styles.cardTitle}>Projected</Text>
          </View>
          <Text style={styles.costAmount}>{formatCurrency(costData.projectedMonth)}</Text>
          <Text style={styles.projectionText}>End of month</Text>
        </View>

        <View style={styles.costCard}>
          <View style={styles.cardHeader}>
            <TrendingDown size={20} color={colors.success} />
            <Text style={styles.cardTitle}>Savings</Text>
          </View>
          <Text style={[styles.costAmount, { color: colors.success }]}>
            {formatCurrency(costData.savings)}
          </Text>
          <Text style={styles.savingsText}>From fallback APIs</Text>
        </View>

        <View style={styles.costCard}>
          <View style={styles.cardHeader}>
            <DollarSign size={20} color={colors.accent} />
            <Text style={styles.cardTitle}>Year to Date</Text>
          </View>
          <Text style={styles.costAmount}>{formatCurrency(costData.yearToDate)}</Text>
          <Text style={styles.ytdText}>Total spent</Text>
        </View>
      </View>

      {/* Cost Breakdown */}
      <View style={styles.breakdownCard}>
        <Text style={styles.sectionTitle}>Cost Breakdown</Text>
        
        <View style={styles.breakdownItem}>
          <View style={styles.breakdownLabel}>
            <View style={[styles.colorIndicator, { backgroundColor: colors.primary }]} />
            <Text style={styles.breakdownText}>Primary APIs</Text>
          </View>
          <Text style={styles.breakdownAmount}>{formatCurrency(costData.breakdown.primary)}</Text>
        </View>

        <View style={styles.breakdownItem}>
          <View style={styles.breakdownLabel}>
            <View style={[styles.colorIndicator, { backgroundColor: colors.secondary }]} />
            <Text style={styles.breakdownText}>Fallback APIs</Text>
          </View>
          <Text style={styles.breakdownAmount}>{formatCurrency(costData.breakdown.fallback)}</Text>
        </View>

        <View style={styles.breakdownItem}>
          <View style={styles.breakdownLabel}>
            <View style={[styles.colorIndicator, { backgroundColor: colors.success }]} />
            <Text style={styles.breakdownText}>Cache Hits (Free)</Text>
          </View>
          <Text style={styles.breakdownAmount}>{formatCurrency(costData.breakdown.cache)}</Text>
        </View>
      </View>

      {/* Usage Efficiency */}
      <View style={styles.efficiencyCard}>
        <Text style={styles.sectionTitle}>Usage Efficiency</Text>
        
        {usageStats.map((api, index) => {
          const efficiency = ((api.dailyLimit - api.dailyUsage) / api.dailyLimit) * 100;
          const efficiencyColor = efficiency > 70 ? colors.success : 
                                 efficiency > 40 ? colors.warning : colors.danger;
          
          return (
            <View key={index} style={styles.efficiencyItem}>
              <View style={styles.efficiencyHeader}>
                <Text style={styles.apiName}>{api.name}</Text>
                <Text style={[styles.efficiencyPercent, { color: efficiencyColor }]}>
                  {efficiency.toFixed(0)}% available
                </Text>
              </View>
              
              <View style={styles.usageBar}>
                <View 
                  style={[
                    styles.usageBarFill,
                    { 
                      width: `${(api.dailyUsage / api.dailyLimit) * 100}%`,
                      backgroundColor: api.status === 'critical' ? colors.danger : 
                                     api.status === 'warning' ? colors.warning : colors.primary
                    }
                  ]} 
                />
              </View>
              
              <Text style={styles.usageText}>
                {api.dailyUsage} / {api.dailyLimit} daily calls
              </Text>
            </View>
          );
        })}
      </View>

      {/* Cost Optimization Tips */}
      <View style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <AlertCircle size={20} color={colors.accent} />
          <Text style={styles.sectionTitle}>Optimization Tips</Text>
        </View>
        
        <View style={styles.tip}>
          <Text style={styles.tipText}>
            • Cache frequently requested data to reduce API calls
          </Text>
        </View>
        
        <View style={styles.tip}>
          <Text style={styles.tipText}>
            • Use fallback APIs for non-critical features during peak usage
          </Text>
        </View>
        
        <View style={styles.tip}>
          <Text style={styles.tipText}>
            • Monitor usage patterns to optimize call timing
          </Text>
        </View>
        
        <View style={styles.tip}>
          <Text style={styles.tipText}>
            • Consider upgrading plans when consistently hitting limits
          </Text>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text.primary,
  },
  settingsButton: {
    padding: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: colors.text.secondary,
    fontSize: 16,
    marginTop: 50,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  costCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    width: '48%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  costAmount: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    marginLeft: 4,
  },
  projectionText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  savingsText: {
    fontSize: 12,
    color: colors.success,
  },
  ytdText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  breakdownCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  breakdownText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  breakdownAmount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  efficiencyCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  efficiencyItem: {
    marginBottom: 16,
  },
  efficiencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  apiName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.text.primary,
  },
  efficiencyPercent: {
    fontSize: 12,
    fontWeight: '600' as const,
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
  tipsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tip: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});