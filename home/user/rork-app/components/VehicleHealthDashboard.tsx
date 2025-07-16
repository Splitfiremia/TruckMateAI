import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { VehicleHealth } from '@/types';

interface VehicleHealthDashboardProps {
  vehicleHealth: VehicleHealth;
  onSystemPress?: (system: string) => void;
}

const VehicleHealthDashboard: React.FC<VehicleHealthDashboardProps> = ({
  vehicleHealth,
  onSystemPress
}) => {
  const getHealthColor = (score: number) => {
    if (score >= 85) return colors.secondary;
    if (score >= 70) return colors.warning;
    return colors.danger;
  };

  const getHealthIcon = (score: number) => {
    if (score >= 85) return CheckCircle;
    if (score >= 70) return AlertTriangle;
    return AlertTriangle;
  };

  const getTrendIcon = (score: number) => {
    if (score >= 85) return TrendingUp;
    if (score >= 70) return Minus;
    return TrendingDown;
  };

  const getSystemDisplayName = (system: string) => {
    const names: { [key: string]: string } = {
      engine: 'Engine',
      transmission: 'Transmission',
      brakes: 'Brakes',
      tires: 'Tires',
      electrical: 'Electrical',
      cooling: 'Cooling',
      fuel: 'Fuel System'
    };
    return names[system] || system;
  };

  const HealthIcon = getHealthIcon(vehicleHealth.overallScore);
  const TrendIcon = getTrendIcon(vehicleHealth.overallScore);
  const healthColor = getHealthColor(vehicleHealth.overallScore);

  return (
    <View style={styles.container}>
      {/* Overall Health Score */}
      <View style={styles.overallHealth}>
        <View style={styles.scoreSection}>
          <View style={[styles.scoreCircle, { borderColor: healthColor }]}>
            <Text style={[styles.scoreText, { color: healthColor }]}>
              {vehicleHealth.overallScore}
            </Text>
            <Text style={styles.scoreLabel}>Health</Text>
          </View>
          <View style={styles.scoreDetails}>
            <View style={styles.scoreDetailItem}>
              <HealthIcon color={healthColor} size={16} />
              <Text style={styles.scoreDetailText}>
                {vehicleHealth.overallScore >= 85 ? 'Excellent' :
                 vehicleHealth.overallScore >= 70 ? 'Good' : 'Needs Attention'}
              </Text>
            </View>
            <View style={styles.scoreDetailItem}>
              <TrendIcon color={healthColor} size={16} />
              <Text style={styles.scoreDetailText}>
                {vehicleHealth.predictedReliability}% Reliability
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <AlertTriangle color={colors.danger} size={16} />
            <Text style={styles.statNumber}>{vehicleHealth.criticalIssues}</Text>
            <Text style={styles.statLabel}>Critical</Text>
          </View>
          <View style={styles.statItem}>
            <Clock color={colors.warning} size={16} />
            <Text style={styles.statNumber}>{vehicleHealth.upcomingMaintenance}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statItem}>
            <Activity color={colors.primaryLight} size={16} />
            <Text style={styles.statNumber}>
              {Object.values(vehicleHealth.systemHealth).filter(score => score < 70).length}
            </Text>
            <Text style={styles.statLabel}>At Risk</Text>
          </View>
        </View>
      </View>

      {/* System Health Breakdown */}
      <View style={styles.systemsSection}>
        <Text style={styles.sectionTitle}>System Health</Text>
        <View style={styles.systemsList}>
          {Object.entries(vehicleHealth.systemHealth).map(([system, score]) => {
            const SystemIcon = getHealthIcon(score);
            const systemColor = getHealthColor(score);
            
            return (
              <TouchableOpacity
                key={system}
                style={styles.systemItem}
                onPress={() => onSystemPress?.(system)}
              >
                <View style={styles.systemInfo}>
                  <SystemIcon color={systemColor} size={16} />
                  <Text style={styles.systemName}>
                    {getSystemDisplayName(system)}
                  </Text>
                </View>
                <View style={styles.systemScore}>
                  <Text style={[styles.scoreValue, { color: systemColor }]}>
                    {score}%
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Last Updated */}
      <Text style={styles.lastUpdated}>
        Last updated: {new Date(vehicleHealth.lastUpdated).toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  overallHealth: {
    marginBottom: 20,
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  scoreDetails: {
    flex: 1,
    gap: 8,
  },
  scoreDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreDetailText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  systemsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  systemsList: {
    gap: 8,
  },
  systemItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.background.primary,
    borderRadius: 8,
  },
  systemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  systemName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  systemScore: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default VehicleHealthDashboard;