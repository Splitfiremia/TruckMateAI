import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { Shield, AlertTriangle, CheckCircle, Clock, Fuel, Thermometer, ArrowLeft, Activity } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function DashboardOption3() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerTitle: 'Dashboard Option 3 - Safety First',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Safety Score Card */}
        <View style={styles.safetyScoreCard}>
          <View style={styles.scoreHeader}>
            <Shield size={32} color="#10b981" />
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreTitle}>Fleet Safety Score</Text>
              <Text style={styles.scoreSubtitle}>Last 30 days</Text>
            </View>
          </View>
          
          <View style={styles.scoreDisplay}>
            <Text style={styles.scoreNumber}>94</Text>
            <Text style={styles.scoreOutOf}>/100</Text>
          </View>
          
          <View style={styles.scoreBar}>
            <View style={[styles.scoreProgress, { width: '94%' }]} />
          </View>
          
          <Text style={styles.scoreDescription}>Excellent safety performance</Text>
        </View>
        
        {/* Alert Summary */}
        <View style={styles.alertSummary}>
          <Text style={styles.sectionTitle}>Active Alerts</Text>
          
          <View style={styles.alertGrid}>
            <View style={[styles.alertCard, styles.criticalAlert]}>
              <AlertTriangle size={20} color="#ef4444" />
              <Text style={styles.alertNumber}>2</Text>
              <Text style={styles.alertLabel}>Critical</Text>
            </View>
            
            <View style={[styles.alertCard, styles.warningAlert]}>
              <Clock size={20} color="#f59e0b" />
              <Text style={styles.alertNumber}>5</Text>
              <Text style={styles.alertLabel}>Warning</Text>
            </View>
            
            <View style={[styles.alertCard, styles.infoAlert]}>
              <Activity size={20} color="#3b82f6" />
              <Text style={styles.alertNumber}>12</Text>
              <Text style={styles.alertLabel}>Info</Text>
            </View>
            
            <View style={[styles.alertCard, styles.resolvedAlert]}>
              <CheckCircle size={20} color="#10b981" />
              <Text style={styles.alertNumber}>48</Text>
              <Text style={styles.alertLabel}>Resolved</Text>
            </View>
          </View>
        </View>
        
        {/* Vehicle Health Monitor */}
        <View style={styles.vehicleHealthSection}>
          <Text style={styles.sectionTitle}>Vehicle Health Monitor</Text>
          
          <View style={styles.vehicleCard}>
            <View style={styles.vehicleHeader}>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>Truck #1247</Text>
                <Text style={styles.vehicleDriver}>Driver: John Doe</Text>
              </View>
              <View style={styles.healthBadge}>
                <Text style={styles.healthText}>GOOD</Text>
              </View>
            </View>
            
            <View style={styles.healthMetrics}>
              <View style={styles.healthMetric}>
                <View style={styles.metricIcon}>
                  <Fuel size={16} color="#10b981" />
                </View>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>Fuel Level</Text>
                  <Text style={styles.metricValue}>78%</Text>
                </View>
                <View style={[styles.statusIndicator, { backgroundColor: '#10b981' }]} />
              </View>
              
              <View style={styles.healthMetric}>
                <View style={styles.metricIcon}>
                  <Thermometer size={16} color="#f59e0b" />
                </View>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>Engine Temp</Text>
                  <Text style={styles.metricValue}>195°F</Text>
                </View>
                <View style={[styles.statusIndicator, { backgroundColor: '#f59e0b' }]} />
              </View>
              
              <View style={styles.healthMetric}>
                <View style={styles.metricIcon}>
                  <Activity size={16} color="#10b981" />
                </View>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>Oil Pressure</Text>
                  <Text style={styles.metricValue}>45 PSI</Text>
                </View>
                <View style={[styles.statusIndicator, { backgroundColor: '#10b981' }]} />
              </View>
            </View>
          </View>
          
          <View style={styles.vehicleCard}>
            <View style={styles.vehicleHeader}>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>Truck #1248</Text>
                <Text style={styles.vehicleDriver}>Driver: Mike Smith</Text>
              </View>
              <View style={[styles.healthBadge, { backgroundColor: '#fef3c7' }]}>
                <Text style={[styles.healthText, { color: '#d97706' }]}>CAUTION</Text>
              </View>
            </View>
            
            <View style={styles.healthMetrics}>
              <View style={styles.healthMetric}>
                <View style={styles.metricIcon}>
                  <Fuel size={16} color="#ef4444" />
                </View>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>Fuel Level</Text>
                  <Text style={styles.metricValue}>15%</Text>
                </View>
                <View style={[styles.statusIndicator, { backgroundColor: '#ef4444' }]} />
              </View>
              
              <View style={styles.healthMetric}>
                <View style={styles.metricIcon}>
                  <Thermometer size={16} color="#10b981" />
                </View>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>Engine Temp</Text>
                  <Text style={styles.metricValue}>180°F</Text>
                </View>
                <View style={[styles.statusIndicator, { backgroundColor: '#10b981' }]} />
              </View>
              
              <View style={styles.healthMetric}>
                <View style={styles.metricIcon}>
                  <Activity size={16} color="#10b981" />
                </View>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>Oil Pressure</Text>
                  <Text style={styles.metricValue}>42 PSI</Text>
                </View>
                <View style={[styles.statusIndicator, { backgroundColor: '#10b981' }]} />
              </View>
            </View>
          </View>
        </View>
        
        {/* Safety Incidents Timeline */}
        <View style={styles.incidentsSection}>
          <Text style={styles.sectionTitle}>Recent Safety Events</Text>
          
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#10b981' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Pre-trip Inspection Completed</Text>
                <Text style={styles.timelineTime}>2 hours ago</Text>
                <Text style={styles.timelineDescription}>Truck #1247 - All systems normal</Text>
              </View>
            </View>
            
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#f59e0b' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Speed Limit Warning</Text>
                <Text style={styles.timelineTime}>4 hours ago</Text>
                <Text style={styles.timelineDescription}>Driver exceeded 70 mph on I-95</Text>
              </View>
            </View>
            
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#ef4444' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Low Fuel Alert</Text>
                <Text style={styles.timelineTime}>6 hours ago</Text>
                <Text style={styles.timelineDescription}>Truck #1248 - Fuel level below 20%</Text>
              </View>
            </View>
            
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#10b981' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Maintenance Completed</Text>
                <Text style={styles.timelineTime}>1 day ago</Text>
                <Text style={styles.timelineDescription}>Truck #1249 - Oil change and inspection</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  safetyScoreCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginTop: 16,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreInfo: {
    marginLeft: 12,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  scoreSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#10b981',
  },
  scoreOutOf: {
    fontSize: 24,
    color: '#6b7280',
    marginLeft: 4,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginBottom: 12,
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  alertSummary: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  alertGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 64) / 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  criticalAlert: {
    borderTopWidth: 3,
    borderTopColor: '#ef4444',
  },
  warningAlert: {
    borderTopWidth: 3,
    borderTopColor: '#f59e0b',
  },
  infoAlert: {
    borderTopWidth: 3,
    borderTopColor: '#3b82f6',
  },
  resolvedAlert: {
    borderTopWidth: 3,
    borderTopColor: '#10b981',
  },
  alertNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  alertLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  vehicleHealthSection: {
    marginBottom: 24,
  },
  vehicleCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  vehicleDriver: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  healthBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  healthText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  healthMetrics: {
    gap: 12,
  },
  healthMetric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 2,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  incidentsSection: {
    marginBottom: 24,
  },
  timeline: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 16,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  footer: {
    height: 20,
  },
});