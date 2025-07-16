import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Clock, Fuel, DollarSign, CheckCircle, XCircle } from 'lucide-react-native';
import type { DrivewyzeAnalytics } from '@/types';
import { colors } from '@/constants/colors';

interface DrivewyzeAnalyticsCardProps {
  analytics: DrivewyzeAnalytics;
}

export const DrivewyzeAnalyticsCard: React.FC<DrivewyzeAnalyticsCardProps> = ({ analytics }) => {
  const approvalRate = analytics.totalBypassRequests > 0 
    ? (analytics.approvedBypasses / analytics.totalBypassRequests) * 100 
    : 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={24} color={colors.primary} />
        <Text style={styles.title}>Drivewyze Analytics</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <CheckCircle size={20} color={colors.success} />
            <Text style={styles.statValue}>{analytics.approvedBypasses}</Text>
          </View>
          <Text style={styles.statLabel}>Approved Bypasses</Text>
          <Text style={styles.statSubtext}>
            {approvalRate.toFixed(1)}% approval rate
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <XCircle size={20} color={colors.danger} />
            <Text style={styles.statValue}>{analytics.deniedBypasses}</Text>
          </View>
          <Text style={styles.statLabel}>Denied Bypasses</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Clock size={20} color={colors.info} />
            <Text style={styles.statValue}>{formatTime(analytics.timeSaved)}</Text>
          </View>
          <Text style={styles.statLabel}>Time Saved</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Fuel size={20} color={colors.warning} />
            <Text style={styles.statValue}>{analytics.fuelSaved.toFixed(1)} gal</Text>
          </View>
          <Text style={styles.statLabel}>Fuel Saved</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <DollarSign size={20} color={colors.success} />
            <Text style={styles.statValue}>{formatCurrency(analytics.costSaved)}</Text>
          </View>
          <Text style={styles.statLabel}>Cost Saved</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
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
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    minWidth: 140,
    marginBottom: 8,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 12,
    color: '#888',
  },
});
