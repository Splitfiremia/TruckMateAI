import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Switch
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  FileText,
  Bell,
  Settings,
  Eye,
  EyeOff,
  Zap,
  CheckCircle,
  XCircle
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ComplianceViolationPrediction } from '@/types';
import { PredictiveComplianceDashboard } from '@/components/PredictiveComplianceDashboard';
import { DOTRuleUpdates } from '@/components/DOTRuleUpdates';
import { ViolationPreventionAlert } from '@/components/ViolationPreventionAlert';
import { ComplianceNotificationSystem } from '@/components/ComplianceNotificationSystem';
import { usePredictiveComplianceStore } from '@/store/predictiveComplianceStore';
import { useLogbookStore } from '@/store/logbookStore';

export default function ComplianceScreen() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rules' | 'settings'>('dashboard');
  const [refreshing, setRefreshing] = useState(false);
  const [violationAlertVisible, setViolationAlertVisible] = useState(false);
  const [currentViolationPrediction, setCurrentViolationPrediction] = useState<ComplianceViolationPrediction | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoPreventionEnabled, setAutoPreventionEnabled] = useState(true);

  const {
    metrics,
    violationPredictions,
    activeAlerts,
    isMonitoring,
    startPredictiveMonitoring,
    stopPredictiveMonitoring,
    syncDOTRules,
    analyzePredictiveCompliance,
    dismissAlert,
    getRiskLevel,
    resetWeeklyOverrides
  } = usePredictiveComplianceStore();

  const { drivingHoursToday, drivingHoursWeek } = useLogbookStore();

  useEffect(() => {
    // Monitor for critical violations
    const criticalPredictions = violationPredictions.filter(p => p.severity === 'Critical');
    if (criticalPredictions.length > 0 && !violationAlertVisible && notificationsEnabled) {
      setCurrentViolationPrediction(criticalPredictions[0]);
      setViolationAlertVisible(true);
    }
  }, [violationPredictions, violationAlertVisible, notificationsEnabled]);

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
      Alert.alert('Error', 'Failed to refresh compliance data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleViolationAlert = (prediction: ComplianceViolationPrediction) => {
    if (notificationsEnabled) {
      setCurrentViolationPrediction(prediction);
      setViolationAlertVisible(true);
    }
  };

  const handleViolationActionTaken = (actionId: string) => {
    setViolationAlertVisible(false);
    setCurrentViolationPrediction(null);
  };

  const toggleMonitoring = () => {
    if (isMonitoring) {
      stopPredictiveMonitoring();
    } else {
      startPredictiveMonitoring();
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

  const riskLevel = getRiskLevel();

  const renderDashboard = () => (
    <PredictiveComplianceDashboard onViolationAlert={handleViolationAlert} />
  );

  const renderRuleUpdates = () => (
    <DOTRuleUpdates />
  );

  const renderSettings = () => (
    <ScrollView style={styles.settingsContainer}>
      {/* Monitoring Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>🔍 Monitoring Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Predictive Monitoring</Text>
            <Text style={styles.settingDescription}>
              Real-time violation prediction and prevention
            </Text>
          </View>
          <Switch
            value={isMonitoring}
            onValueChange={toggleMonitoring}
            trackColor={{ false: colors.border, true: colors.primary + '50' }}
            thumbColor={isMonitoring ? colors.primary : colors.textSecondary}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive alerts for potential violations
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.border, true: colors.primary + '50' }}
            thumbColor={notificationsEnabled ? colors.primary : colors.textSecondary}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Auto Prevention</Text>
            <Text style={styles.settingDescription}>
              Automatically execute prevention actions when possible
            </Text>
          </View>
          <Switch
            value={autoPreventionEnabled}
            onValueChange={setAutoPreventionEnabled}
            trackColor={{ false: colors.border, true: colors.primary + '50' }}
            thumbColor={autoPreventionEnabled ? colors.primary : colors.textSecondary}
          />
        </View>
      </View>

      {/* Alert Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>🚨 Alert Settings</Text>
        
        <TouchableOpacity style={styles.settingButton}>
          <Bell size={20} color={colors.primary} />
          <View style={styles.settingButtonInfo}>
            <Text style={styles.settingButtonTitle}>Alert Thresholds</Text>
            <Text style={styles.settingButtonDescription}>
              Customize when to receive violation warnings
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingButton}>
          <Clock size={20} color={colors.primary} />
          <View style={styles.settingButtonInfo}>
            <Text style={styles.settingButtonTitle}>Timing Preferences</Text>
            <Text style={styles.settingButtonDescription}>
              Set preferred break and rest periods
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Testing */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>🧪 Testing</Text>
        
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => {
            const testPrediction: ComplianceViolationPrediction = {
              id: `test-break-${Date.now()}`,
              type: 'Break',
              severity: 'Critical',
              timeToViolation: 15, // 15 minutes
              currentValue: 7.8,
              thresholdValue: 8,
              message: 'Test violation: 30-minute break required in 15 minutes',
              recommendations: ['Find nearest rest area', 'Take 30-minute break'],
              preventionActions: [{
                id: 'test-action-break',
                type: 'Break',
                title: 'Take Break',
                description: 'Start required break',
                urgency: 'Immediate',
                estimatedTime: 30,
                automated: false
              }],
              estimatedFine: 395,
              canOverride: true
            };
            handleViolationAlert(testPrediction);
          }}
        >
          <AlertTriangle size={20} color={colors.warning} />
          <View style={styles.settingButtonInfo}>
            <Text style={styles.settingButtonTitle}>Test Break Violation</Text>
            <Text style={styles.settingButtonDescription}>
              Test 30-minute break violation alert with override option
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => {
            const testPrediction: ComplianceViolationPrediction = {
              id: `test-driving-${Date.now()}`,
              type: 'HOS',
              severity: 'Critical',
              timeToViolation: 5, // 5 minutes
              currentValue: 10.9,
              thresholdValue: 11,
              message: 'CRITICAL: 11-hour driving limit will be exceeded in 5 minutes',
              recommendations: ['Stop driving immediately', 'Find safe parking', 'Take 10-hour rest'],
              preventionActions: [{
                id: 'test-action-stop',
                type: 'Route',
                title: 'Find Parking',
                description: 'Locate nearest safe parking area',
                urgency: 'Immediate',
                estimatedTime: 10,
                automated: true
              }],
              estimatedFine: 1150,
              canOverride: false // Cannot override driving limits
            };
            handleViolationAlert(testPrediction);
          }}
        >
          <XCircle size={20} color={colors.error} />
          <View style={styles.settingButtonInfo}>
            <Text style={styles.settingButtonTitle}>Test Driving Limit</Text>
            <Text style={styles.settingButtonDescription}>
              Test 11-hour driving limit violation (no override allowed)
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => {
            const testPrediction: ComplianceViolationPrediction = {
              id: `test-window-${Date.now()}`,
              type: 'HOS',
              severity: 'Warning',
              timeToViolation: 45, // 45 minutes
              currentValue: 13.25,
              thresholdValue: 14,
              message: 'Warning: 14-hour window expires in 45 minutes',
              recommendations: ['Complete current trip', 'Plan 10-hour reset'],
              preventionActions: [{
                id: 'test-action-plan',
                type: 'Route',
                title: 'Plan Reset Location',
                description: 'Find location for 10-hour off-duty period',
                urgency: 'Soon',
                estimatedTime: 20,
                automated: true
              }],
              estimatedFine: 1150,
              canOverride: false
            };
            handleViolationAlert(testPrediction);
          }}
        >
          <Clock size={20} color={colors.warning} />
          <View style={styles.settingButtonInfo}>
            <Text style={styles.settingButtonTitle}>Test 14-Hour Window</Text>
            <Text style={styles.settingButtonDescription}>
              Test 14-hour window warning (no override allowed)
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => {
            // Test notification system by adding alerts directly
            const testAlert = {
              id: `test-notification-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: 'Violation Prevention' as const,
              priority: 'Critical' as const,
              title: 'Test Notification System',
              message: 'This is a test notification to verify the notification system is working properly.',
              actionRequired: true,
              autoResolved: false,
              expiresAt: new Date(Date.now() + 300000).toISOString() // 5 minutes
            };
            
            const { addAlert } = usePredictiveComplianceStore.getState();
            addAlert(testAlert);
            
            Alert.alert('Test Notification', 'A test notification has been added to the system. Check the top of the screen.');
          }}
        >
          <Bell size={20} color={colors.primary} />
          <View style={styles.settingButtonInfo}>
            <Text style={styles.settingButtonTitle}>Test Notification System</Text>
            <Text style={styles.settingButtonDescription}>
              Test the notification banner system
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => {
            Alert.alert(
              'Reset Weekly Overrides',
              'This will reset your weekly override count to 0. This is for testing purposes only.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Reset', 
                  style: 'destructive',
                  onPress: () => {
                    resetWeeklyOverrides();
                    Alert.alert('Success', 'Weekly override count has been reset.');
                  }
                }
              ]
            );
          }}
        >
          <XCircle size={20} color={colors.error} />
          <View style={styles.settingButtonInfo}>
            <Text style={styles.settingButtonTitle}>Reset Weekly Overrides</Text>
            <Text style={styles.settingButtonDescription}>
              Reset override count for testing (Current: {metrics.overridesThisWeek}/3)
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Data & Sync */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>📊 Data & Sync</Text>
        
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={handleRefresh}
        >
          <FileText size={20} color={colors.primary} />
          <View style={styles.settingButtonInfo}>
            <Text style={styles.settingButtonTitle}>Sync DOT Rules</Text>
            <Text style={styles.settingButtonDescription}>
              Last synced: {new Date(metrics.lastRuleSync).toLocaleString()}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingButton}>
          <TrendingUp size={20} color={colors.primary} />
          <View style={styles.settingButtonInfo}>
            <Text style={styles.settingButtonTitle}>Analytics & Reports</Text>
            <Text style={styles.settingButtonDescription}>
              View compliance trends and insights
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Current Status */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>📈 Current Status</Text>
        
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>{metrics.complianceScore}%</Text>
            <Text style={styles.statusLabel}>Compliance Score</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={[styles.statusValue, { color: getRiskColor(riskLevel) }]}>
              {metrics.violationRisk}%
            </Text>
            <Text style={styles.statusLabel}>Violation Risk</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>{violationPredictions.length}</Text>
            <Text style={styles.statusLabel}>Active Predictions</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>{activeAlerts.length}</Text>
            <Text style={styles.statusLabel}>Active Alerts</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'AI Compliance',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />

      {/* Header with Risk Overview */}
      <LinearGradient
        colors={[getRiskColor(riskLevel) + '20', getRiskColor(riskLevel) + '05']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Shield size={24} color={getRiskColor(riskLevel)} />
            <View>
              <Text style={styles.headerTitle}>Predictive Compliance</Text>
              <Text style={styles.headerSubtitle}>
                {riskLevel} Risk • {metrics.complianceScore}% Compliant
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={[
              styles.monitoringStatus,
              { backgroundColor: isMonitoring ? colors.success : colors.error }
            ]}>
              {isMonitoring ? (
                <Eye size={16} color="white" />
              ) : (
                <EyeOff size={16} color="white" />
              )}
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <AlertTriangle size={16} color={colors.textSecondary} />
            <Text style={styles.quickStatValue}>{violationPredictions.length}</Text>
            <Text style={styles.quickStatLabel}>Predictions</Text>
          </View>
          <View style={styles.quickStat}>
            <Bell size={16} color={colors.textSecondary} />
            <Text style={styles.quickStatValue}>{activeAlerts.length}</Text>
            <Text style={styles.quickStatLabel}>Alerts</Text>
          </View>
          <View style={styles.quickStat}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.quickStatValue}>
              {Math.round(metrics.hoursUntilViolation)}h
            </Text>
            <Text style={styles.quickStatLabel}>Next Risk</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
          onPress={() => setActiveTab('dashboard')}
        >
          <TrendingUp size={20} color={activeTab === 'dashboard' ? colors.primary : colors.textSecondary} />
          <Text style={[
            styles.tabText,
            activeTab === 'dashboard' && styles.activeTabText
          ]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'rules' && styles.activeTab]}
          onPress={() => setActiveTab('rules')}
        >
          <FileText size={20} color={activeTab === 'rules' ? colors.primary : colors.textSecondary} />
          <Text style={[
            styles.tabText,
            activeTab === 'rules' && styles.activeTabText
          ]}>
            DOT Rules
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Settings size={20} color={activeTab === 'settings' ? colors.primary : colors.textSecondary} />
          <Text style={[
            styles.tabText,
            activeTab === 'settings' && styles.activeTabText
          ]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'rules' && renderRuleUpdates()}
        {activeTab === 'settings' && renderSettings()}
      </View>

      {/* Notification System */}
      <ComplianceNotificationSystem 
        onNotificationPress={(alert) => {
          console.log('Notification pressed:', alert);
          // You can handle notification press here
        }}
      />

      {/* Violation Prevention Alert */}
      {currentViolationPrediction && (
        <ViolationPreventionAlert
          prediction={currentViolationPrediction}
          visible={violationAlertVisible}
          onDismiss={() => setViolationAlertVisible(false)}
          onActionTaken={handleViolationActionTaken}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'center',
  },
  monitoringStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickStat: {
    alignItems: 'center',
    gap: 4,
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  quickStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  settingsContainer: {
    flex: 1,
    padding: 16,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  settingButtonInfo: {
    flex: 1,
  },
  settingButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  settingButtonDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});