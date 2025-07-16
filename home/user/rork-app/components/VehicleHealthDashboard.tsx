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
            const SystemHealthIcon = getHealthIcon(score);
            const systemColor = getHealthColor(score);
            
            return (
              <TouchableOpacity
                key={system}
                style={styles.systemItem}
                onPress={() => onSystemPress?.(system)}
              >
                <View style={styles.systemInfo}>
                  <SystemHealthIcon color={systemColor} size={20} />
                  <Text style={styles.systemName}>
                    {getSystemDisplayName(system)}
                  </Text>
                </View>
                <View style={styles.systemScore}>
                  <Text style={[styles.scoreValue, { color: systemColor }]}>
                    {score}
                  </Text>
                  <View style={styles.scoreBar}>
                    <View 
                      style={[
                        styles.scoreBarFill, 
                        { 
                          width: `${score}%`, 
                          backgroundColor: systemColor 
                        }
                      ]} 
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Last Updated */}
      <View style={styles.lastUpdated}>
        <Clock color={colors.textSecondary} size={14} />
        <Text style={styles.lastUpdatedText}>
          Last updated: {new Date(vehicleHealth.lastUpdated).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overallHealth: {
    marginBottom: 24,
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scoreDetails: {
    flex: 1,
  },
  scoreDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreDetailText: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 8,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  systemsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  systemsList: {
    gap: 12,
  },
  systemItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
  },
  systemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  systemName: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
  },
  systemScore: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  scoreBar: {
    width: 50,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  lastUpdated: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
});

export default VehicleHealthDashboard;