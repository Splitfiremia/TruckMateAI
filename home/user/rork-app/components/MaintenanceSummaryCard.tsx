import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {
  Wrench,
  AlertTriangle,
  Clock,
  TrendingUp,
  ChevronRight,
  Activity
} from 'lucide-react-native';
import { router } from 'expo-router';

import { colors } from '@/constants/colors';
import { usePredictiveMaintenanceStore } from '@/store/predictiveMaintenanceStore';

const MaintenanceSummaryCard: React.FC = () => {
  const {
    vehicleHealth,
    alerts,
    predictions,
    isAnalyzing,
    lastAnalysis
  } = usePredictiveMaintenanceStore();

  const activeAlerts = alerts.filter(alert => !alert.dismissed && !alert.resolvedAt);
  const criticalAlerts = activeAlerts.filter(alert => alert.priority === 'Critical');
  const upcomingMaintenance = predictions.filter(pred => pred.milesUntilFailure < 5000);

  const getHealthColor = (score: number) => {
    if (score >= 85) return colors.secondary;
    if (score >= 70) return colors.warning;
    return colors.danger;
  };

  const getHealthStatus = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    return 'Needs Attention';
  };

  const handlePress = () => {
    router.push('/(tabs)/maintenance');
  };

  if (!vehicleHealth && !isAnalyzing && activeAlerts.length === 0) {
    return (
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Wrench color={colors.primary} size={20} />
            <Text style={styles.title}>AI Maintenance</Text>
          </View>
          <ChevronRight color={colors.textSecondary} size={16} />
        </View>
        <Text style={styles.noDataText}>
          Tap to start AI-powered predictive maintenance analysis
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Wrench color={colors.primary} size={20} />
          <Text style={styles.title}>AI Maintenance</Text>
        </View>
        <ChevronRight color={colors.textSecondary} size={16} />
      </View>

      {isAnalyzing && (
        <View style={styles.analyzingContainer}>
          <Activity size={16} color={colors.primary} />
          <Text style={styles.analyzingText}>Analyzing vehicle data...</Text>
        </View>
      )}

      {vehicleHealth && (
        <View style={styles.healthSection}>
          <View style={styles.healthHeader}>
            <Text style={styles.healthLabel}>Overall Health</Text>
            <Text style={[styles.healthScore, { color: getHealthColor(vehicleHealth.overallScore) }]}>
              {vehicleHealth.overallScore}%
            </Text>
          </View>
          <Text style={[styles.healthStatus, { color: getHealthColor(vehicleHealth.overallScore) }]}>
            {getHealthStatus(vehicleHealth.overallScore)}
          </Text>
        </View>
      )}

      {criticalAlerts.length > 0 && (
        <View style={styles.alertsSection}>
          <View style={styles.alertHeader}>
            <AlertTriangle size={16} color={colors.danger} />
            <Text style={styles.alertText}>
              {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      )}

      {upcomingMaintenance.length > 0 && (
        <View style={styles.maintenanceSection}>
          <View style={styles.maintenanceHeader}>
            <Clock size={16} color={colors.warning} />
            <Text style={styles.maintenanceText}>
              {upcomingMaintenance.length} Upcoming Maintenance
            </Text>
          </View>
        </View>
      )}

      {lastAnalysis && (
        <Text style={styles.lastUpdate}>
          Last updated: {new Date(lastAnalysis).toLocaleTimeString()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  noDataText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  analyzingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  analyzingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  healthSection: {
    marginBottom: 12,
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  healthLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  healthScore: {
    fontSize: 18,
    fontWeight: '700',
  },
  healthStatus: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
  },
  alertsSection: {
    marginBottom: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.danger,
  },
  maintenanceSection: {
    marginBottom: 12,
  },
  maintenanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  maintenanceText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.warning,
  },
  lastUpdate: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
});

export default MaintenanceSummaryCard;