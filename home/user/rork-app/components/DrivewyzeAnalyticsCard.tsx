import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Clock, Fuel, DollarSign, CheckCircle, XCircle } from 'lucide-react-native';
import { DrivewyzeAnalytics } from '@/types';
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
            <Clock size={20} color={colors.primary} />
            <Text style={styles.statValue}>{formatTime(analytics.timeSaved)}</Text>
          </View>
          <Text style={styles.statLabel}>Time Saved</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Fuel size={20} color={colors.success} />
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

      <View style={styles.complianceCard}>
        <Text style={styles.complianceScore}>{analytics.complianceScore}%</Text>
        <Text style={styles.complianceLabel}>Compliance Score</Text>
        <Text style={styles.complianceText}>
          Higher scores improve bypass approval rates
        </Text>
      </View>

      <Text style={styles.lastUpdated}>
        Last updated: {new Date(analytics.lastUpdated).toLocaleDateString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    padding: 12,
    width: '48%', // Adjust based on spacing and number of items per row
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  statSubtext: {
    fontSize: 11,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  complianceCard: {
    backgroundColor: colors.primary + '10', // Adding transparency to primary color
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  complianceScore: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  complianceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  complianceText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: 8,
  },
});
