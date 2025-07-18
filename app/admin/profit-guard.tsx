import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Shield, TrendingUp, TrendingDown, AlertCircle, DollarSign, Activity } from 'lucide-react-native';

const ProfitGuardDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');

  const profitMetrics = {
    currentRatio: 0.28,
    targetRatio: 0.35,
    monthlyRevenue: 18705,
    apiCosts: 5237,
    savings: 1342,
    riskLevel: 'low'
  };

  const apiUsage = [
    { service: 'Geotab Telematics', cost: 2145, usage: '89%', tier: 'paid' },
    { service: 'Google AI Diagnostics', cost: 1876, usage: '76%', tier: 'trial' },
    { service: 'Mapbox Routing', cost: 892, usage: '45%', tier: 'paid' },
    { service: 'Weather API', cost: 324, usage: '23%', tier: 'trial' }
  ];

  const costBreaches = [
    { user: 'Fleet Corp #1247', breach: 0.42, action: 'Auto-downgraded', time: '2h ago' },
    { user: 'Owner Op #892', breach: 0.38, action: 'Warning sent', time: '4h ago' }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Shield size={32} color="#10b981" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Profit Guard</Text>
            <Text style={styles.headerSubtitle}>Real-time cost monitoring</Text>
          </View>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.primaryMetric}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricTitle}>Cost Ratio</Text>
            <View style={[styles.riskBadge, { backgroundColor: getRiskColor(profitMetrics.riskLevel) }]}>
              <Text style={styles.riskText}>{profitMetrics.riskLevel.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.ratioValue}>
            {(profitMetrics.currentRatio * 100).toFixed(1)}%
          </Text>
          <Text style={styles.ratioTarget}>
            Target: {(profitMetrics.targetRatio * 100).toFixed(0)}%
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(profitMetrics.currentRatio / profitMetrics.targetRatio) * 100}%`,
                  backgroundColor: getRiskColor(profitMetrics.riskLevel)
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.secondaryMetrics}>
          <View style={styles.metricCard}>
            <DollarSign size={20} color="#3b82f6" />
            <Text style={styles.metricValue}>{formatCurrency(profitMetrics.monthlyRevenue)}</Text>
            <Text style={styles.metricLabel}>Monthly Revenue</Text>
          </View>
          <View style={styles.metricCard}>
            <TrendingUp size={20} color="#ef4444" />
            <Text style={styles.metricValue}>{formatCurrency(profitMetrics.apiCosts)}</Text>
            <Text style={styles.metricLabel}>API Costs</Text>
          </View>
          <View style={styles.metricCard}>
            <TrendingDown size={20} color="#10b981" />
            <Text style={styles.metricValue}>{formatCurrency(profitMetrics.savings)}</Text>
            <Text style={styles.metricLabel}>Savings</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Usage Breakdown</Text>
        {apiUsage.map((api, index) => (
          <View key={index} style={styles.apiCard}>
            <View style={styles.apiHeader}>
              <Text style={styles.apiName}>{api.service}</Text>
              <View style={[styles.tierBadge, { 
                backgroundColor: api.tier === 'paid' ? '#3b82f6' : '#6b7280' 
              }]}>
                <Text style={styles.tierText}>{api.tier.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.apiMetrics}>
              <Text style={styles.apiCost}>{formatCurrency(api.cost)}</Text>
              <Text style={styles.apiUsage}>{api.usage} usage</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Cost Breaches</Text>
        {costBreaches.length > 0 ? (
          costBreaches.map((breach, index) => (
            <View key={index} style={styles.breachCard}>
              <AlertCircle size={20} color="#ef4444" />
              <View style={styles.breachContent}>
                <Text style={styles.breachUser}>{breach.user}</Text>
                <Text style={styles.breachDetails}>
                  Ratio: {(breach.breach * 100).toFixed(0)}% • {breach.action}
                </Text>
                <Text style={styles.breachTime}>{breach.time}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noBreach}>
            <Text style={styles.noBreachText}>No cost breaches in the last 24 hours</Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <Text style={styles.controlsTitle}>Time Range</Text>
        <View style={styles.timeButtons}>
          {['24h', '7d', '30d'].map((range) => (
            <Pressable
              key={range}
              style={[
                styles.timeButton,
                timeRange === range && styles.activeTimeButton
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text style={[
                styles.timeButtonText,
                timeRange === range && styles.activeTimeButtonText
              ]}>
                {range}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  metricsContainer: {
    padding: 16,
  },
  primaryMetric: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1f2937',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#fff',
  },
  ratioValue: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: '#1f2937',
    marginBottom: 8,
  },
  ratioTarget: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  secondaryMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1f2937',
    marginBottom: 16,
  },
  apiCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  apiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  apiName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1f2937',
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#fff',
  },
  apiMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  apiCost: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1f2937',
  },
  apiUsage: {
    fontSize: 14,
    color: '#6b7280',
  },
  breachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  breachContent: {
    marginLeft: 12,
    flex: 1,
  },
  breachUser: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: 4,
  },
  breachDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  breachTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  noBreach: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  noBreachText: {
    fontSize: 16,
    color: '#16a34a',
  },
  controls: {
    padding: 16,
  },
  controlsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: 12,
  },
  timeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  activeTimeButton: {
    backgroundColor: '#3b82f6',
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6b7280',
  },
  activeTimeButtonText: {
    color: '#fff',
  },
});

export default ProfitGuardDashboard;