import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Clock, Fuel, DollarSign, Award } from 'lucide-react-native';
import { DrivewyzeAnalytics } from '@/types';
import { colors } from '@/constants/colors';

interface DrivewyzeAnalyticsCardProps {
  analytics: DrivewyzeAnalytics;
}

export const DrivewyzeAnalyticsCard: React.FC<DrivewyzeAnalyticsCardProps> = ({
  analytics,
}) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getComplianceScoreColor = (score: number) => {
    if (score >= 90) return colors.success;
    if (score >= 70) return colors.warning;
    return colors.danger;
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
            <Award size={20} color={colors.primary} />
            <Text style={styles.statLabel}>Bypass Requests</Text>
          </View>
          <Text style={styles.statValue}>{analytics.totalBypassRequests}</Text>
          <Text style={styles.statSubtext}>
            {analytics.approvedBypasses} approved, {analytics.deniedBypasses} denied
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Clock size={20} color={colors.success} />
            <Text style={styles.statLabel}>Time Saved</Text>
          </View>
          <Text style={styles.statValue}>{formatTime(analytics.timeSaved)}</Text>
          <Text style={styles.statSubtext}>Total time savings</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Fuel size={20} color={colors.warning} />
            <Text style={styles.statLabel}>Fuel Saved</Text>
          </View>
          <Text style={styles.statValue}>{analytics.fuelSaved.toFixed(1)} gal</Text>
          <Text style={styles.statSubtext}>Gallons saved</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <DollarSign size={20} color={colors.success} />
            <Text style={styles.statLabel}>Cost Saved</Text>
          </View>
          <Text style={styles.statValue}>${analytics.costSaved.toFixed(2)}</Text>
          <Text style={styles.statSubtext}>Total savings</Text>
        </View>
      </View>

      <View style={styles.complianceSection}>
        <Text style={styles.sectionTitle}>Compliance Score</Text>
        <View style={styles.complianceCard}>
          <View style={styles.complianceScore}>
            <Text style={[styles.scoreValue, { color: getComplianceScoreColor(analytics.complianceScore) }]}>
              {analytics.complianceScore}%
            </Text>
            <Text style={styles.scoreLabel}>Overall Score</Text>
          </View>
          <View style={styles.complianceBar}>
            <View
              style={[
                styles.complianceProgress,
                {
                  width: `${analytics.complianceScore}%`,
                  backgroundColor: getComplianceScoreColor(analytics.complianceScore),
                },
              ]}
            />
          </View>
        </View>
      </View>

      {analytics.monthlyStats && analytics.monthlyStats.length > 0 && (
        <View style={styles.monthlySection}>
          <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
          {analytics.monthlyStats.slice(-3).map((month, index) => (
            <View key={index} style={styles.monthlyCard}>
              <Text style={styles.monthLabel}>{month.month}</Text>
              <View style={styles.monthlyStats}>
                <View style={styles.monthlyStat}>
                  <Text style={styles.monthlyValue}>{month.bypasses}</Text>
                  <Text style={styles.monthlyLabel}>Bypasses</Text>
                </View>
                <View style={styles.monthlyStat}>
                  <Text style={styles.monthlyValue}>{formatTime(month.timeSaved)}</Text>
                  <Text style={styles.monthlyLabel}>Time Saved</Text>
                </View>
                <View style={styles.monthlyStat}>
                  <Text style={styles.monthlyValue}>${month.costSaved.toFixed(0)}</Text>
                  <Text style={styles.monthlyLabel}>Cost Saved</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.lastUpdated}>
        Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
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
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  complianceSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  complianceCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 16,
  },
  complianceScore: {
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  complianceBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  complianceProgress: {
    height: '100%',
    borderRadius: 4,
  },
  monthlySection: {
    marginBottom: 16,
  },
  monthlyCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  monthlyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthlyStat: {
    alignItems: 'center',
  },
  monthlyValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  monthlyLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 2,
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});