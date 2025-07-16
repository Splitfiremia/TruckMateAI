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
          <Text style={styles.statSubtext}>
            Avg {formatTime(Math.floor(analytics.timeSaved / analytics.approvedBypasses))} per bypass
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Fuel size={20} color={colors.warning} />
            <Text style={styles.statValue}>{analytics.fuelSaved.toFixed(1)}</Text>
          </View>
          <Text style={styles.statLabel}>Gallons Saved</Text>
          <Text style={styles.statSubtext}>
            Fuel efficiency improved
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <DollarSign size={20} color={colors.success} />
            <Text style={styles.statValue}>{formatCurrency(analytics.costSaved)}</Text>
          </View>
          <Text style={styles.statLabel}>Cost Savings</Text>
          <Text style={styles.statSubtext}>
            Fuel + time savings
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <TrendingUp size={20} color={colors.primary} />
            <Text style={styles.statValue}>{analytics.complianceScore}%</Text>
          </View>
          <Text style={styles.statLabel}>Compliance Score</Text>
          <Text style={styles.statSubtext}>
            DOT compliance rating
          </Text>
        </View>
      </View>

      {analytics.monthlyStats && analytics.monthlyStats.length > 0 && (
        <View style={styles.monthlySection}>
          <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
          {analytics.monthlyStats.map((month, index) => (
            <View key={index} style={styles.monthlyRow}>
              <Text style={styles.monthLabel}>{month.month}</Text>
              <View style={styles.monthlyStats}>
                <Text style={styles.monthStat}>{month.bypasses} bypasses</Text>
                <Text style={styles.monthStat}>{formatTime(month.timeSaved)}</Text>
                <Text style={styles.monthStat}>{formatCurrency(month.costSaved)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.lastUpdated}>
          Last updated: {new Date(analytics.lastUpdated).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    flex: 1,
    minWidth: '45%',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  monthlySection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  monthlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    flex: 1,
  },
  monthlyStats: {
    flexDirection: 'row',
    gap: 12,
  },
  monthStat: {
    fontSize: 12,
    color: colors.text.secondary,
    minWidth: 60,
    textAlign: 'right',
  },
  footer: {
    alignItems: 'center',
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
});