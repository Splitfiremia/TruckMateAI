import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Truck, CheckCircle, AlertTriangle, Clock, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useELDStore } from '@/store/eldStore';
import { router } from 'expo-router';

export default function ELDIntegrationCard() {
  const { connection, complianceDashboard, getCriticalAlerts, getComplianceScore } = useELDStore();

  const handlePress = () => {
    router.push('/(tabs)/eld-integration');
  };

  if (!connection || connection.status !== 'connected') {
    return (
      <Pressable style={styles.card} onPress={handlePress}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Truck size={24} color={colors.primary} />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.title}>ELD Integration</Text>
            <Text style={styles.subtitle}>Connect your ELD system</Text>
          </View>
          <ArrowRight size={20} color={colors.textSecondary} />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.description}>
            Connect your Electronic Logging Device to unlock advanced compliance monitoring and fleet optimization features.
          </Text>
          
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={styles.benefitText}>HOS Compliance Monitoring</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={styles.benefitText}>Predictive Maintenance</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={styles.benefitText}>Fuel Efficiency Insights</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Tap to connect your ELD provider</Text>
        </View>
      </Pressable>
    );
  }

  const criticalAlerts = getCriticalAlerts();
  const complianceScore = getComplianceScore();
  const hasIssues = criticalAlerts.length > 0 || complianceScore < 80;

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: hasIssues ? colors.warning + '20' : colors.success + '20' }]}>
          <Truck size={24} color={hasIssues ? colors.warning : colors.success} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title}>ELD Integration</Text>
          <View style={styles.statusContainer}>
            {hasIssues ? (
              <AlertTriangle size={16} color={colors.warning} />
            ) : (
              <CheckCircle size={16} color={colors.success} />
            )}
            <Text style={[
              styles.statusText,
              { color: hasIssues ? colors.warning : colors.success }
            ]}>
              {hasIssues ? 'Needs Attention' : 'All Good'}
            </Text>
          </View>
        </View>
        <ArrowRight size={20} color={colors.textSecondary} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{complianceScore}%</Text>
            <Text style={styles.metricLabel}>Compliance Score</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{complianceDashboard?.hosCompliance.activeViolations || 0}</Text>
            <Text style={styles.metricLabel}>Active Violations</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{complianceDashboard?.vehicleHealth.averageHealth || 0}%</Text>
            <Text style={styles.metricLabel}>Vehicle Health</Text>
          </View>
        </View>
        
        {criticalAlerts.length > 0 && (
          <View style={styles.alertsContainer}>
            <View style={styles.alertHeader}>
              <AlertTriangle size={16} color={colors.error} />
              <Text style={styles.alertTitle}>Critical Alerts ({criticalAlerts.length})</Text>
            </View>
            <Text style={styles.alertPreview} numberOfLines={2}>
              {criticalAlerts[0]?.message || 'Multiple critical alerts require attention'}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        <View style={styles.providerInfo}>
          <Text style={styles.providerText}>Connected to {connection.provider}</Text>
          <View style={styles.syncStatus}>
            <Clock size={12} color={colors.textSecondary} />
            <Text style={styles.syncText}>
              Last sync: {new Date(connection.lastSync).toLocaleTimeString()}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  content: {
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  benefitsContainer: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  alertsContainer: {
    backgroundColor: colors.error + '10',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.error,
  },
  alertPreview: {
    fontSize: 13,
    color: colors.text.primary,
    lineHeight: 18,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  footerText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
  providerInfo: {
    alignItems: 'center',
  },
  providerText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500' as const,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});