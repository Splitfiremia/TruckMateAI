import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shield, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ComplianceOverview as ComplianceOverviewType } from '@/store/fleetStore';

interface ComplianceOverviewProps {
  data: ComplianceOverviewType;
}

export default function ComplianceOverview({ data }: ComplianceOverviewProps) {
  const compliancePercentage = Math.round((data.compliantDrivers / data.totalDrivers) * 100);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Shield size={24} color={colors.primaryLight} />
        <Text style={styles.title}>Fleet Compliance Overview</Text>
      </View>
      
      <View style={styles.overallScore}>
        <Text style={styles.scoreValue}>{compliancePercentage}%</Text>
        <Text style={styles.scoreLabel}>Overall Compliance</Text>
      </View>
      
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <CheckCircle size={20} color={colors.secondary} />
          <Text style={styles.metricValue}>{data.compliantDrivers}</Text>
          <Text style={styles.metricLabel}>Compliant</Text>
        </View>
        
        <View style={styles.metricCard}>
          <AlertTriangle size={20} color={colors.warning} />
          <Text style={styles.metricValue}>{data.warningDrivers}</Text>
          <Text style={styles.metricLabel}>Warnings</Text>
        </View>
        
        <View style={styles.metricCard}>
          <AlertTriangle size={20} color={colors.danger} />
          <Text style={styles.metricValue}>{data.violationDrivers}</Text>
          <Text style={styles.metricLabel}>Violations</Text>
        </View>
      </View>
      
      <View style={styles.alertsSection}>
        <View style={styles.alertItem}>
          <FileText size={18} color={colors.warning} />
          <View style={styles.alertContent}>
            <Text style={styles.alertValue}>{data.expiringDocuments}</Text>
            <Text style={styles.alertLabel}>Documents expiring soon</Text>
          </View>
        </View>
        
        <View style={styles.alertItem}>
          <Clock size={18} color={colors.danger} />
          <View style={styles.alertContent}>
            <Text style={styles.alertValue}>{data.overdueInspections}</Text>
            <Text style={styles.alertLabel}>Overdue inspections</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  overallScore: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.secondary,
  },
  scoreLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  alertsSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    gap: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertContent: {
    marginLeft: 12,
  },
  alertValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  alertLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});