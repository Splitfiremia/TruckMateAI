import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react-native';
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
          <Text style={styles.statSubtext}>
            {analytics.totalBypassRequests} total requests
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Clock size={20} color={colors.primary} />
            <Text style={styles.statValue}>{formatTime(analytics.timeSaved)}</Text>
          </View>
          <Text style={styles.statLabel}>Time Saved</Text>
          <Text style={styles.statSubtext}>via bypasses</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <DollarSign size={20} color={colors.success} />
            <Text style={styles.statValue}>{formatCurrency(analytics.costSavings)}</Text>
          </View>
          <Text style={styles.statLabel}>Cost Savings</Text>
          <Text style={styles.statSubtext}>via bypasses</Text>
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
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 12,
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
  },
  statLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 12,
    color: '#666',
  },
});
