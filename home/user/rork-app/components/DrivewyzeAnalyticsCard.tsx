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
      </View>

      <View style={styles.divider} />

      <View style={styles.savingsSection}>
        <Text style={styles.sectionTitle}>Estimated Savings</Text>
        
        <View style={styles.savingsGrid}>
          <View style={styles.savingsItem}>
            <Clock size={18} color={colors.primary} />
            <View>
              <Text style={styles.savingsValue}>{formatTime(analytics.timeSaved)}</Text>
              <Text style={styles.savingsLabel}>Time Saved</Text>
            </View>
          </View>
          
          <View style={styles.savingsItem}>
            <Fuel size={18} color={colors.primary} />
            <View>
              <Text style={styles.savingsValue}>{analytics.fuelSaved.toFixed(1)} gal</Text>
              <Text style={styles.savingsLabel}>Fuel Saved</Text>
            </View>
          </View>
          
          <View style={styles.savingsItem}>
            <DollarSign size={18} color={colors.primary} />
            <View>
              <Text style={styles.savingsValue}>{formatCurrency(analytics.costSaved)}</Text>
              <Text style={styles.savingsLabel}>Cost Saved</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.complianceScore}>
          Compliance Score: <Text style={{ color: colors.success }}>{analytics.complianceScore}%</Text>
        </Text>
        <Text style={styles.lastUpdated}>
          Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    color: '#333333',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  statSubtext: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#eeeeee',
    marginVertical: 16,
  },
  savingsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  savingsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  savingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savingsValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  savingsLabel: {
    fontSize: 12,
    color: '#666666',
  },
  footer: {
    marginTop: 8,
  },
  complianceScore: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#888888',
  },
});