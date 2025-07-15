import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  TrendingUp, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Eye,
  Bell
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { usePredictiveComplianceStore } from '@/store/predictiveComplianceStore';
import { useLogbookStore } from '@/store/logbookStore';

interface PredictiveComplianceDashboardProps {
  onViolationAlert?: (prediction: any) => void;
}

export const PredictiveComplianceDashboard: React.FC<PredictiveComplianceDashboardProps> = ({
  onViolationAlert
}) => {
  const {
    metrics,
    violationPredictions,
    activeAlerts,
    isMonitoring,
    isAnalyzing,
    startPredictiveMonitoring,
    stopPredictiveMonitoring,
    syncDOTRules,
    analyzePredictiveCompliance,
    dismissAlert,
    executePreventionAction,
    getRiskLevel,
    getTimeToNextViolation
  } = usePredictiveComplianceStore();

  const { drivingHoursToday, drivingHoursWeek, currentStatus } = useLogbookStore();

  const [refreshing, setRefreshing] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Start monitoring when component mounts
    if (!isMonitoring) {
      startPredictiveMonitoring();
    }

    // Pulse animation for critical alerts
    const criticalAlerts = activeAlerts.filter(a => a.priority === 'Critical');
    if (criticalAlerts.length > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
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
    }

    return () => {
      stopPredictiveMonitoring();
    };
  }, [activeAlerts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await syncDOTRules();
      await analyzePredictiveCompliance({
        currentDrivingHours: drivingHoursToday,
        timeSinceLastBreak: 7.5,
        onDutyTime: 12,
        weeklyHours: drivingHoursWeek
      });
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleExecuteAction = async (actionId: string) => {
    try {
      await executePreventionAction(actionId);
      Alert.alert('Action Executed', 'Prevention action completed successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to execute prevention action');
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return colors.error;
      case 'High': return '#FF6B35';
      case 'Medium': return colors.warning;
      default: return colors.success;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical': return XCircle;
      case 'Warning': return AlertTriangle;
      default: return AlertCircle;
    }
  };

  const formatTimeToViolation = (minutes: number) => {
    if (minutes <= 0) return 'Now';
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const riskLevel = getRiskLevel();
  const timeToNextViolation = getTimeToNextViolation();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Shield size={24} color={colors.primary} />
          <Text style={styles.headerTitle}>AI Predictive Compliance</Text>
          <View style={[styles.statusIndicator, { backgroundColor: isMonitoring ? colors.success : colors.error }]} />
        </View>
        <Text style={styles.headerSubtitle}>
          Real-time DOT violation prevention
        </Text>
      </View>

      {/* Risk Overview */}
      <LinearGradient
        colors={[getRiskColor(riskLevel) + '20', getRiskColor(riskLevel) + '05']}
        style={styles.riskCard}
      >
        <View style={styles.riskHeader}>
          <View style={styles.riskLevel}>
            <TrendingUp size={20} color={getRiskColor(riskLevel)} />
            <Text style={[styles.riskLevelText, { color: getRiskColor(riskLevel) }]}>
              {riskLevel} Risk
            </Text>
          </View>
          <Text style={styles.complianceScore}>
            {metrics.complianceScore}% Compliant
          </Text>
        </View>
        
        <View style={styles.riskMetrics}>
          <View style={styles.metric}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.metricLabel}>Next Violation</Text>
            <Text style={styles.metricValue}>
              {formatTimeToViolation(timeToNextViolation)}
            </Text>
          </View>
          <View style={styles.metric}>
            <AlertTriangle size={16} color={colors.textSecondary} />
            <Text style={styles.metricLabel}>Active Predictions</Text>
            <Text style={styles.metricValue}>
              {violationPredictions.length}
            </Text>
          </View>
          <View style={styles.metric}>
            <Bell size={16} color={colors.textSecondary} />
            <Text style={styles.metricLabel}>Active Alerts</Text>
            <Text style={styles.metricValue}>
              {activeAlerts.length}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Critical Alerts */}
      {activeAlerts.filter(a => a.priority === 'Critical').length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚨 Critical Alerts</Text>
          {activeAlerts
            .filter(a => a.priority === 'Critical')
            .slice(0, 3)
            .map((alert) => (
              <Animated.View
                key={alert.id}
                style={[
                  styles.alertCard,
                  styles.criticalAlert,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <View style={styles.alertHeader}>
                  <XCircle size={20} color={colors.error} />
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <TouchableOpacity
                    onPress={() => dismissAlert(alert.id)}
                    style={styles.dismissButton}
                  >
                    <Text style={styles.dismissText}>×</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                {alert.actionRequired && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Take Action</Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            ))}
        </View>
      )}

      {/* Violation Predictions */}
      {violationPredictions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Violation Predictions</Text>
          {violationPredictions.slice(0, 5).map((prediction) => {
            const SeverityIcon = getSeverityIcon(prediction.severity);
            return (
              <View key={prediction.id} style={styles.predictionCard}>
                <View style={styles.predictionHeader}>
                  <SeverityIcon 
                    size={18} 
                    color={prediction.severity === 'Critical' ? colors.error : colors.warning} 
                  />
                  <View style={styles.predictionInfo}>
                    <Text style={styles.predictionType}>{prediction.type}</Text>
                    <Text style={styles.predictionTime}>
                      {formatTimeToViolation(prediction.timeToViolation)}
                    </Text>
                  </View>
                  <View style={styles.predictionProgress}>
                    <Text style={styles.progressText}>
                      {prediction.currentValue.toFixed(1)}/{prediction.thresholdValue}
                    </Text>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill,
                          { 
                            width: `${Math.min(100, (prediction.currentValue / prediction.thresholdValue) * 100)}%`,
                            backgroundColor: prediction.severity === 'Critical' ? colors.error : colors.warning
                          }
                        ]} 
                      />
                    </View>
                  </View>
                </View>
                
                <Text style={styles.predictionMessage}>{prediction.message}</Text>
                
                {prediction.preventionActions.length > 0 && (
                  <View style={styles.actionsContainer}>
                    <Text style={styles.actionsTitle}>Prevention Actions:</Text>
                    {prediction.preventionActions.slice(0, 2).map((action) => (
                      <TouchableOpacity
                        key={action.id}
                        style={[
                          styles.preventionAction,
                          action.urgency === 'Immediate' && styles.urgentAction
                        ]}
                        onPress={() => handleExecuteAction(action.id)}
                      >
                        <View style={styles.actionContent}>
                          <Text style={styles.actionTitle}>{action.title}</Text>
                          <Text style={styles.actionDescription}>{action.description}</Text>
                        </View>
                        <View style={styles.actionMeta}>
                          <Text style={styles.actionTime}>{action.estimatedTime}min</Text>
                          {action.automated && (
                            <Zap size={14} color={colors.primary} />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* Monitoring Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔍 Monitoring Status</Text>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Eye size={18} color={colors.primary} />
            <Text style={styles.statusLabel}>Predictive Monitoring</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: isMonitoring ? colors.success : colors.error }
            ]}>
              <Text style={styles.statusBadgeText}>
                {isMonitoring ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          
          <View style={styles.statusRow}>
            <RefreshCw size={18} color={colors.primary} />
            <Text style={styles.statusLabel}>Last Rule Sync</Text>
            <Text style={styles.statusValue}>
              {new Date(metrics.lastRuleSync).toLocaleTimeString()}
            </Text>
          </View>
          
          <View style={styles.statusRow}>
            <TrendingUp size={18} color={colors.primary} />
            <Text style={styles.statusLabel}>Analysis Status</Text>
            <Text style={styles.statusValue}>
              {isAnalyzing ? 'Analyzing...' : 'Ready'}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => analyzePredictiveCompliance({
              currentDrivingHours: drivingHoursToday,
              timeSinceLastBreak: 7.5,
              onDutyTime: 12,
              weeklyHours: drivingHoursWeek
            })}
          >
            <TrendingUp size={20} color={colors.primary} />
            <Text style={styles.quickActionText}>Run Analysis</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickAction}
            onPress={syncDOTRules}
          >
            <RefreshCw size={20} color={colors.primary} />
            <Text style={styles.quickActionText}>Sync Rules</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => {
              if (isMonitoring) {
                stopPredictiveMonitoring();
              } else {
                startPredictiveMonitoring();
              }
            }}
          >
            <Shield size={20} color={colors.primary} />
            <Text style={styles.quickActionText}>
              {isMonitoring ? 'Stop' : 'Start'} Monitor
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  riskCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  riskLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  riskLevelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  complianceScore: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  riskMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  alertCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  criticalAlert: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  dismissButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  predictionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  predictionInfo: {
    flex: 1,
  },
  predictionType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  predictionTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  predictionProgress: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  predictionMessage: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
  },
  actionsContainer: {
    marginTop: 8,
  },
  actionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  preventionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  urgentAction: {
    borderColor: colors.warning,
    backgroundColor: colors.warning + '10',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionMeta: {
    alignItems: 'center',
    gap: 4,
  },
  actionTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  statusValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});