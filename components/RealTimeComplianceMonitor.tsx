import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  Eye,
  Bell,
  Zap
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { usePredictiveComplianceStore } from '@/store/predictiveComplianceStore';
import { useLogbookStore } from '@/store/logbookStore';

interface RealTimeComplianceMonitorProps {
  onViolationAlert?: (prediction: any) => void;
  onViewDetails?: () => void;
  compact?: boolean;
}

export const RealTimeComplianceMonitor: React.FC<RealTimeComplianceMonitorProps> = ({
  onViolationAlert,
  onViewDetails,
  compact = false
}) => {
  const {
    metrics,
    violationPredictions,
    activeAlerts,
    isMonitoring,
    analyzePredictiveCompliance,
    getRiskLevel,
    getTimeToNextViolation
  } = usePredictiveComplianceStore();

  const { drivingHoursToday, drivingHoursWeek, currentStatus } = useLogbookStore();

  const [pulseAnim] = useState(new Animated.Value(1));
  const [lastAnalysis, setLastAnalysis] = useState(Date.now());

  useEffect(() => {
    if (!isMonitoring) return;

    // Run analysis every 30 seconds
    const analysisInterval = setInterval(() => {
      analyzePredictiveCompliance({
        currentDrivingHours: drivingHoursToday,
        timeSinceLastBreak: 7.5,
        onDutyTime: 12,
        weeklyHours: drivingHoursWeek
      });
      setLastAnalysis(Date.now());
    }, 30000);

    return () => clearInterval(analysisInterval);
  }, [isMonitoring, drivingHoursToday, drivingHoursWeek]);

  useEffect(() => {
    // Pulse animation for critical alerts
    const criticalPredictions = violationPredictions.filter(p => p.severity === 'Critical');
    if (criticalPredictions.length > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Trigger violation alert callback
      if (onViolationAlert) {
        onViolationAlert(criticalPredictions[0]);
      }
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [violationPredictions]);

  const riskLevel = getRiskLevel();
  const timeToNextViolation = getTimeToNextViolation();
  const criticalAlerts = violationPredictions.filter(p => p.severity === 'Critical').length;
  const warningAlerts = violationPredictions.filter(p => p.severity === 'Warning').length;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return colors.error;
      case 'High': return '#FF6B35';
      case 'Medium': return colors.warning;
      default: return colors.success;
    }
  };

  const formatTimeToViolation = (minutes: number) => {
    if (minutes <= 0) return 'NOW';
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={[
          styles.compactContainer,
          criticalAlerts > 0 && styles.criticalCompactContainer
        ]}
        onPress={onViewDetails}
      >
        <Animated.View style={[
          styles.compactContent,
          { transform: [{ scale: pulseAnim }] }
        ]}>
          <View style={styles.compactLeft}>
            <Shield 
              size={16} 
              color={criticalAlerts > 0 ? colors.error : getRiskColor(riskLevel)} 
            />
            <Text style={[
              styles.compactTitle,
              { color: criticalAlerts > 0 ? colors.error : colors.text }
            ]}>
              AI Monitor
            </Text>
          </View>
          <View style={styles.compactRight}>
            {criticalAlerts > 0 ? (
              <Text style={[styles.compactAlert, { color: colors.error }]}>
                {criticalAlerts} Critical
              </Text>
            ) : (
              <Text style={[styles.compactStatus, { color: getRiskColor(riskLevel) }]}>
                {riskLevel}
              </Text>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onViewDetails}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[getRiskColor(riskLevel) + '15', getRiskColor(riskLevel) + '05']}
        style={styles.card}
      >
        <Animated.View style={[
          styles.content,
          criticalAlerts > 0 && { transform: [{ scale: pulseAnim }] }
        ]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Shield size={20} color={getRiskColor(riskLevel)} />
              <Text style={styles.title}>AI Compliance Monitor</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: isMonitoring ? colors.success : colors.error }
              ]}>
                <Eye size={12} color="white" />
              </View>
            </View>
          </View>

          {/* Risk Level */}
          <View style={styles.riskSection}>
            <Text style={styles.riskLabel}>Current Risk Level</Text>
            <Text style={[
              styles.riskLevel,
              { color: getRiskColor(riskLevel) }
            ]}>
              {riskLevel}
            </Text>
            <Text style={styles.complianceScore}>
              {metrics.complianceScore}% Compliant
            </Text>
          </View>

          {/* Critical Alerts */}
          {criticalAlerts > 0 && (
            <View style={styles.criticalSection}>
              <View style={styles.criticalHeader}>
                <AlertTriangle size={16} color={colors.error} />
                <Text style={styles.criticalTitle}>
                  {criticalAlerts} Critical Alert{criticalAlerts > 1 ? 's' : ''}
                </Text>
              </View>
              <Text style={styles.criticalMessage}>
                Violation predicted in {formatTimeToViolation(timeToNextViolation)}
              </Text>
            </View>
          )}

          {/* Metrics */}
          <View style={styles.metricsSection}>
            <View style={styles.metric}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={styles.metricLabel}>Next Risk</Text>
              <Text style={styles.metricValue}>
                {formatTimeToViolation(timeToNextViolation)}
              </Text>
            </View>
            <View style={styles.metric}>
              <AlertTriangle size={14} color={colors.textSecondary} />
              <Text style={styles.metricLabel}>Predictions</Text>
              <Text style={styles.metricValue}>
                {violationPredictions.length}
              </Text>
            </View>
            <View style={styles.metric}>
              <Bell size={14} color={colors.textSecondary} />
              <Text style={styles.metricLabel}>Alerts</Text>
              <Text style={styles.metricValue}>
                {activeAlerts.length}
              </Text>
            </View>
          </View>

          {/* Status Bar */}
          <View style={styles.statusBar}>
            <View style={styles.statusLeft}>
              <Text style={styles.statusText}>
                Last analysis: {Math.round((Date.now() - lastAnalysis) / 1000)}s ago
              </Text>
            </View>
            <View style={styles.statusRight}>
              {isMonitoring && (
                <Zap size={12} color={colors.success} />
              )}
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    alignItems: 'center',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskSection: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  riskLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  riskLevel: {
    fontSize: 20,
    fontWeight: '700',
  },
  complianceScore: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  criticalSection: {
    backgroundColor: colors.error + '10',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  criticalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  criticalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
  criticalMessage: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  metricsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  metric: {
    alignItems: 'center',
    gap: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statusLeft: {
    flex: 1,
  },
  statusText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  statusRight: {
    alignItems: 'center',
  },
  // Compact styles
  compactContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  criticalCompactContainer: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  compactRight: {
    alignItems: 'flex-end',
  },
  compactAlert: {
    fontSize: 12,
    fontWeight: '600',
  },
  compactStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
});