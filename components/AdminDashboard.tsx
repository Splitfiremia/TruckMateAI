import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { DollarSign, Users, AlertTriangle, TrendingUp, TrendingDown, RefreshCw, Download, Settings } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAdminStore } from '@/store/adminStore';
import { ProfitWidget } from './ProfitWidget';
import { UserTierMap } from './UserTierMap';
import { CostControlPanel } from './CostControlPanel';
import { AlertsPanel } from './AlertsPanel';

export function AdminDashboard() {
  const {
    profitMetrics,
    users,
    alerts,
    unreadAlerts,
    isLoading,
    loadAdminData,
    refreshMetrics,
    exportUserData
  } = useAdminStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshMetrics();
    setRefreshing(false);
  };

  const handleExport = async () => {
    try {
      const data = await exportUserData();
      
      if (Platform.OS === 'web') {
        // Web export
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fleetpilot-admin-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Mobile - show data in alert for now
        Alert.alert('Export Data', 'Data exported to console. In production, this would save to device storage.');
        console.log('Exported Admin Data:', data);
      }
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export admin data');
    }
  };

  const getStatusColor = (value: number, threshold: number, inverse: boolean = false) => {
    const isGood = inverse ? value < threshold : value > threshold;
    return isGood ? colors.success : colors.error;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <RefreshCw color={colors.primary} size={32} />
        <Text style={styles.loadingText}>Loading admin dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>FleetPilot Admin</Text>
          <Text style={styles.subtitle}>Cost-Optimized Hybrid Dashboard</Text>
        </View>
        
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.actionButton, { opacity: refreshing ? 0.6 : 1 }]}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw 
              color={colors.white} 
              size={20} 
              style={{ transform: [{ rotate: refreshing ? '180deg' : '0deg' }] }}
            />
          </Pressable>
          
          <Pressable style={styles.actionButton} onPress={handleExport}>
            <Download color={colors.white} size={20} />
          </Pressable>
        </View>
      </View>

      {/* Key Metrics Cards */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <DollarSign color={colors.primary} size={24} />
            <Text style={styles.metricValue}>
              ${profitMetrics.monthlyRevenue.toFixed(0)}
            </Text>
          </View>
          <Text style={styles.metricLabel}>Monthly Revenue</Text>
          <View style={styles.metricTrend}>
            <TrendingUp color={colors.success} size={16} />
            <Text style={[styles.trendText, { color: colors.success }]}>+12%</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <DollarSign color={colors.error} size={24} />
            <Text style={styles.metricValue}>
              ${profitMetrics.totalApiCosts.toFixed(2)}
            </Text>
          </View>
          <Text style={styles.metricLabel}>API Costs</Text>
          <View style={styles.metricTrend}>
            <TrendingDown color={colors.success} size={16} />
            <Text style={[styles.trendText, { color: colors.success }]}>-5%</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <TrendingUp 
              color={getStatusColor(profitMetrics.profitMargin, 0.2)} 
              size={24} 
            />
            <Text style={styles.metricValue}>
              {(profitMetrics.profitMargin * 100).toFixed(1)}%
            </Text>
          </View>
          <Text style={styles.metricLabel}>Profit Margin</Text>
          <Text style={[
            styles.statusText,
            { color: getStatusColor(profitMetrics.profitMargin, 0.2) }
          ]}>
            {profitMetrics.profitMargin >= 0.2 ? 'Healthy' : 'Below Target'}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Users color={colors.primary} size={24} />
            <Text style={styles.metricValue}>
              {profitMetrics.userCount.trial + profitMetrics.userCount.paid}
            </Text>
          </View>
          <Text style={styles.metricLabel}>Total Users</Text>
          <Text style={styles.userBreakdown}>
            {profitMetrics.userCount.paid} paid • {profitMetrics.userCount.trial} trial
          </Text>
        </View>
      </View>

      {/* Alerts Banner */}
      {unreadAlerts > 0 && (
        <View style={styles.alertsBanner}>
          <AlertTriangle color={colors.warning} size={20} />
          <Text style={styles.alertsText}>
            {unreadAlerts} unresolved alert{unreadAlerts > 1 ? 's' : ''} require attention
          </Text>
        </View>
      )}

      {/* Main Dashboard Components */}
      <ProfitWidget />
      
      <UserTierMap />
      
      <CostControlPanel />
      
      <AlertsPanel />

      {/* Configuration Panel */}
      <View style={styles.configPanel}>
        <View style={styles.sectionHeader}>
          <Settings color={colors.primary} size={20} />
          <Text style={styles.sectionTitle}>System Configuration</Text>
        </View>
        
        <View style={styles.configGrid}>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Cost Threshold</Text>
            <Text style={styles.configValue}>30%</Text>
          </View>
          
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Profit Target</Text>
            <Text style={styles.configValue}>65%</Text>
          </View>
          
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Max API Cost/User</Text>
            <Text style={styles.configValue}>$4.50</Text>
          </View>
          
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Auto-Fallback</Text>
            <Text style={[styles.configValue, { color: colors.success }]}>Enabled</Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  metricLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  userBreakdown: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  alertsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    borderColor: colors.warning,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 16,
    gap: 8,
  },
  alertsText: {
    flex: 1,
    fontSize: 14,
    color: colors.warning,
    fontWeight: '500',
  },
  configPanel: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  configGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  configItem: {
    flex: 1,
    minWidth: 120,
  },
  configLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  configValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
});