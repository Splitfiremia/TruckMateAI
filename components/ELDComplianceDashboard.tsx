import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Truck, 
  Users, 
  Fuel, 
  BarChart,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useELDStore } from '@/store/eldStore';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onPress?: () => void;
}

function MetricCard({ title, value, subtitle, icon, color, trend, trendValue, onPress }: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={14} color={colors.success} />;
    if (trend === 'down') return <TrendingDown size={14} color={colors.error} />;
    return null;
  };

  return (
    <Pressable 
      style={[styles.metricCard, { borderLeftColor: color }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: color + '20' }]}>
          {icon}
        </View>
        <View style={styles.metricContent}>
          <Text style={styles.metricTitle}>{title}</Text>
          <Text style={styles.metricValue}>{value}</Text>
          {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
          {trend && trendValue && (
            <View style={styles.trendContainer}>
              {getTrendIcon()}
              <Text style={[
                styles.trendText,
                { color: trend === 'up' ? colors.success : trend === 'down' ? colors.error : colors.textSecondary }
              ]}>
                {trendValue}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

interface AlertItemProps {
  title: string;
  message: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  onPress?: () => void;
}

function AlertItem({ title, message, priority, timestamp, onPress }: AlertItemProps) {
  const getPriorityColor = () => {
    switch (priority) {
      case 'critical': return colors.error;
      case 'high': return colors.warning;
      case 'medium': return colors.primary;
      case 'low': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getPriorityIcon = () => {
    switch (priority) {
      case 'critical': return <AlertTriangle size={16} color={colors.error} />;
      case 'high': return <AlertTriangle size={16} color={colors.warning} />;
      case 'medium': return <Clock size={16} color={colors.primary} />;
      case 'low': return <CheckCircle size={16} color={colors.textSecondary} />;
      default: return <Clock size={16} color={colors.textSecondary} />;
    }
  };

  return (
    <Pressable 
      style={[styles.alertItem, { borderLeftColor: getPriorityColor() }]}
      onPress={onPress}
    >
      <View style={styles.alertHeader}>
        {getPriorityIcon()}
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertTime}>{new Date(timestamp).toLocaleTimeString()}</Text>
      </View>
      <Text style={styles.alertMessage}>{message}</Text>
    </Pressable>
  );
}

export default function ELDComplianceDashboard() {
  const { 
    complianceDashboard, 
    alerts, 
    vehicles, 
    drivers, 
    connection,
    syncData, 
    isSyncing,
    getCriticalAlerts,
    getComplianceScore
  } = useELDStore();

  useEffect(() => {
    if (connection?.status === 'connected') {
      syncData();
    }
  }, [connection]);

  const handleRefresh = () => {
    syncData();
  };

  if (!connection || connection.status !== 'connected') {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Shield size={48} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>ELD Not Connected</Text>
          <Text style={styles.emptySubtitle}>
            Connect your ELD system to view compliance data and real-time monitoring
          </Text>
        </View>
      </View>
    );
  }

  const criticalAlerts = getCriticalAlerts();
  const complianceScore = getComplianceScore();

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isSyncing} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>ELD Compliance Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Connected to {connection.provider} • Last sync: {new Date(connection.lastSync).toLocaleTimeString()}
          </Text>
        </View>
        <Pressable style={styles.refreshButton} onPress={handleRefresh}>
          <RefreshCw size={20} color={colors.primary} />
        </Pressable>
      </View>

      {/* Overall Compliance Score */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>{complianceScore}</Text>
          <Text style={styles.scoreLabel}>Compliance Score</Text>
        </View>
        <View style={styles.scoreDetails}>
          <Text style={styles.scoreTitle}>Overall Status</Text>
          <Text style={[
            styles.scoreStatus,
            { color: complianceScore >= 90 ? colors.success : complianceScore >= 70 ? colors.warning : colors.error }
          ]}>
            {complianceScore >= 90 ? 'Excellent' : complianceScore >= 70 ? 'Good' : 'Needs Attention'}
          </Text>
          <Text style={styles.scoreDescription}>
            Based on HOS compliance, vehicle health, and safety metrics
          </Text>
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Active Violations"
            value={complianceDashboard?.hosCompliance.activeViolations || 0}
            subtitle="HOS violations"
            icon={<AlertTriangle size={20} color={colors.error} />}
            color={colors.error}
            trend={complianceDashboard?.hosCompliance.activeViolations === 0 ? 'up' : 'down'}
            trendValue={complianceDashboard?.hosCompliance.activeViolations === 0 ? 'No violations' : 'Action needed'}
          />
          
          <MetricCard
            title="Drivers at Risk"
            value={complianceDashboard?.hosCompliance.driversAtRisk || 0}
            subtitle="Near violation"
            icon={<Users size={20} color={colors.warning} />}
            color={colors.warning}
          />
          
          <MetricCard
            title="Vehicle Health"
            value={`${complianceDashboard?.vehicleHealth.averageHealth || 0}%`}
            subtitle="Average score"
            icon={<Truck size={20} color={colors.primary} />}
            color={colors.primary}
            trend="up"
            trendValue="+2% this week"
          />
          
          <MetricCard
            title="Fuel Efficiency"
            value={`${complianceDashboard?.safetyMetrics.fuelEfficiency || 0} MPG`}
            subtitle="Fleet average"
            icon={<Fuel size={20} color={colors.success} />}
            color={colors.success}
            trend="up"
            trendValue="+0.3 MPG"
          />
        </View>
      </View>

      {/* HOS Compliance Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hours of Service Compliance</Text>
        <View style={styles.hosGrid}>
          <View style={styles.hosItem}>
            <Text style={styles.hosValue}>{complianceDashboard?.hosCompliance.warningsCount || 0}</Text>
            <Text style={styles.hosLabel}>Warnings</Text>
          </View>
          <View style={styles.hosItem}>
            <Text style={styles.hosValue}>{complianceDashboard?.hosCompliance.averageUtilization || 0}%</Text>
            <Text style={styles.hosLabel}>Avg Utilization</Text>
          </View>
          <View style={styles.hosItem}>
            <Text style={styles.hosValue}>{drivers.length}</Text>
            <Text style={styles.hosLabel}>Active Drivers</Text>
          </View>
          <View style={styles.hosItem}>
            <Text style={styles.hosValue}>{vehicles.length}</Text>
            <Text style={styles.hosLabel}>Fleet Size</Text>
          </View>
        </View>
      </View>

      {/* Safety Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety & Performance</Text>
        <View style={styles.safetyGrid}>
          <View style={styles.safetyItem}>
            <BarChart size={20} color={colors.primary} />
            <Text style={styles.safetyValue}>{complianceDashboard?.safetyMetrics.harshBrakingEvents || 0}</Text>
            <Text style={styles.safetyLabel}>Harsh Braking Events</Text>
          </View>
          <View style={styles.safetyItem}>
            <BarChart size={20} color={colors.warning} />
            <Text style={styles.safetyValue}>{complianceDashboard?.safetyMetrics.speedingEvents || 0}</Text>
            <Text style={styles.safetyLabel}>Speeding Events</Text>
          </View>
          <View style={styles.safetyItem}>
            <Clock size={20} color={colors.error} />
            <Text style={styles.safetyValue}>{complianceDashboard?.safetyMetrics.idlingTime || 0}h</Text>
            <Text style={styles.safetyLabel}>Idle Time</Text>
          </View>
        </View>
      </View>

      {/* Recent Alerts */}
      {criticalAlerts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Critical Alerts</Text>
          <View style={styles.alertsList}>
            {criticalAlerts.slice(0, 3).map((alert) => (
              <AlertItem
                key={alert.id}
                title={alert.title}
                message={alert.message}
                priority={alert.priority}
                timestamp={alert.timestamp}
              />
            ))}
          </View>
        </View>
      )}

      {/* Inspection Readiness */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DOT Inspection Readiness</Text>
        <View style={styles.inspectionCard}>
          <View style={styles.inspectionHeader}>
            <Shield size={24} color={colors.primary} />
            <View style={styles.inspectionContent}>
              <Text style={styles.inspectionScore}>
                {complianceDashboard?.inspectionReadiness.score || 0}%
              </Text>
              <Text style={styles.inspectionLabel}>Readiness Score</Text>
            </View>
            <View style={[
              styles.inspectionBadge,
              { backgroundColor: (complianceDashboard?.inspectionReadiness.score || 0) >= 95 ? colors.success : colors.warning }
            ]}>
              <Text style={styles.inspectionBadgeText}>
                {(complianceDashboard?.inspectionReadiness.score || 0) >= 95 ? 'Ready' : 'Review'}
              </Text>
            </View>
          </View>
          <Text style={styles.inspectionDetails}>
            Last inspection: {complianceDashboard?.inspectionReadiness.lastInspection ? 
              new Date(complianceDashboard.inspectionReadiness.lastInspection).toLocaleDateString() : 'N/A'}
          </Text>
          <Text style={styles.inspectionDetails}>
            Documents ready: {complianceDashboard?.inspectionReadiness.documentsReady ? 'Yes' : 'No'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  refreshButton: {
    padding: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.primary,
    textAlign: 'center',
  },
  scoreDetails: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  scoreStatus: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  metricsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 16,
  },
  metricsGrid: {
    gap: 12,
  },
  metricCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  metricContent: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: 2,
  },
  metricSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  hosGrid: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  hosItem: {
    flex: 1,
    alignItems: 'center',
  },
  hosValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  hosLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  safetyGrid: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    gap: 16,
  },
  safetyItem: {
    flex: 1,
    alignItems: 'center',
  },
  safetyValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  safetyLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  alertsList: {
    gap: 8,
  },
  alertItem: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  alertTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  alertTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  alertMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  inspectionCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  inspectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inspectionContent: {
    flex: 1,
    marginLeft: 12,
  },
  inspectionScore: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text.primary,
  },
  inspectionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  inspectionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inspectionBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.white,
  },
  inspectionDetails: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});