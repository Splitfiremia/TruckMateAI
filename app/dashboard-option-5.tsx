import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { Smartphone, Wifi, Battery, Signal, MapPin, Clock, ArrowLeft, Zap, Globe } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function DashboardOption5() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerTitle: 'Dashboard Option 5 - Smart Connect',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Connection Status Header */}
        <View style={styles.connectionHeader}>
          <View style={styles.connectionCard}>
            <View style={styles.connectionIcon}>
              <Wifi size={24} color="#10b981" />
            </View>
            <View style={styles.connectionInfo}>
              <Text style={styles.connectionTitle}>Fleet Network</Text>
              <Text style={styles.connectionStatus}>All systems connected</Text>
            </View>
            <View style={styles.connectionBadge}>
              <Text style={styles.badgeText}>ONLINE</Text>
            </View>
          </View>
        </View>
        
        {/* Real-time Metrics */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Real-Time Metrics</Text>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <View style={[styles.metricIcon, { backgroundColor: '#dbeafe' }]}>
                  <Signal size={18} color="#3b82f6" />
                </View>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>24</Text>
              <Text style={styles.metricLabel}>Connected Vehicles</Text>
            </View>
            
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <View style={[styles.metricIcon, { backgroundColor: '#dcfce7' }]}>
                  <Battery size={18} color="#10b981" />
                </View>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>87%</Text>
              <Text style={styles.metricLabel}>Avg Battery Level</Text>
            </View>
            
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <View style={[styles.metricIcon, { backgroundColor: '#fef3c7' }]}>
                  <Zap size={18} color="#f59e0b" />
                </View>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>2.1s</Text>
              <Text style={styles.metricLabel}>Response Time</Text>
            </View>
            
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <View style={[styles.metricIcon, { backgroundColor: '#fce7f3' }]}>
                  <Globe size={18} color="#ec4899" />
                </View>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>99.8%</Text>
              <Text style={styles.metricLabel}>Network Uptime</Text>
            </View>
          </View>
        </View>
        
        {/* Device Status */}
        <View style={styles.deviceSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Device Status</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Manage All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.deviceList}>
            <View style={styles.deviceCard}>
              <View style={styles.deviceInfo}>
                <View style={styles.deviceIcon}>
                  <Smartphone size={20} color="#3b82f6" />
                </View>
                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceName}>Truck #1247 - Tablet</Text>
                  <Text style={styles.deviceDriver}>Driver: John Doe</Text>
                  <Text style={styles.deviceLocation}>Location: I-95 North, Mile 247</Text>
                </View>
              </View>
              <View style={styles.deviceMetrics}>
                <View style={styles.deviceMetric}>
                  <Battery size={14} color="#10b981" />
                  <Text style={styles.deviceMetricText}>89%</Text>
                </View>
                <View style={styles.deviceMetric}>
                  <Signal size={14} color="#10b981" />
                  <Text style={styles.deviceMetricText}>Strong</Text>
                </View>
                <View style={styles.deviceMetric}>
                  <Wifi size={14} color="#10b981" />
                  <Text style={styles.deviceMetricText}>5G</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.deviceCard}>
              <View style={styles.deviceInfo}>
                <View style={styles.deviceIcon}>
                  <Smartphone size={20} color="#3b82f6" />
                </View>
                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceName}>Truck #1248 - Tablet</Text>
                  <Text style={styles.deviceDriver}>Driver: Mike Smith</Text>
                  <Text style={styles.deviceLocation}>Location: I-10 West, Mile 156</Text>
                </View>
              </View>
              <View style={styles.deviceMetrics}>
                <View style={styles.deviceMetric}>
                  <Battery size={14} color="#f59e0b" />
                  <Text style={styles.deviceMetricText}>34%</Text>
                </View>
                <View style={styles.deviceMetric}>
                  <Signal size={14} color="#f59e0b" />
                  <Text style={styles.deviceMetricText}>Weak</Text>
                </View>
                <View style={styles.deviceMetric}>
                  <Wifi size={14} color="#10b981" />
                  <Text style={styles.deviceMetricText}>4G</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.deviceCard}>
              <View style={styles.deviceInfo}>
                <View style={styles.deviceIcon}>
                  <Smartphone size={20} color="#3b82f6" />
                </View>
                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceName}>Truck #1249 - Tablet</Text>
                  <Text style={styles.deviceDriver}>Driver: Sarah Johnson</Text>
                  <Text style={styles.deviceLocation}>Location: US-101 South, Mile 89</Text>
                </View>
              </View>
              <View style={styles.deviceMetrics}>
                <View style={styles.deviceMetric}>
                  <Battery size={14} color="#10b981" />
                  <Text style={styles.deviceMetricText}>92%</Text>
                </View>
                <View style={styles.deviceMetric}>
                  <Signal size={14} color="#10b981" />
                  <Text style={styles.deviceMetricText}>Strong</Text>
                </View>
                <View style={styles.deviceMetric}>
                  <Wifi size={14} color="#10b981" />
                  <Text style={styles.deviceMetricText}>5G</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Live Activity Feed */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Live Activity Feed</Text>
          
          <View style={styles.activityFeed}>
            <View style={styles.activityItem}>
              <View style={styles.activityTime}>
                <Clock size={14} color="#6b7280" />
                <Text style={styles.timeText}>2m ago</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Device Connected</Text>
                <Text style={styles.activityDescription}>Truck #1250 tablet came online</Text>
              </View>
              <View style={[styles.activityStatus, { backgroundColor: '#dcfce7' }]}>
                <Text style={[styles.statusText, { color: '#16a34a' }]}>CONNECTED</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityTime}>
                <Clock size={14} color="#6b7280" />
                <Text style={styles.timeText}>5m ago</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Location Update</Text>
                <Text style={styles.activityDescription}>Truck #1247 reached checkpoint</Text>
              </View>
              <View style={[styles.activityStatus, { backgroundColor: '#dbeafe' }]}>
                <Text style={[styles.statusText, { color: '#2563eb' }]}>UPDATE</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityTime}>
                <Clock size={14} color="#6b7280" />
                <Text style={styles.timeText}>8m ago</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Low Battery Alert</Text>
                <Text style={styles.activityDescription}>Truck #1248 battery below 35%</Text>
              </View>
              <View style={[styles.activityStatus, { backgroundColor: '#fef3c7' }]}>
                <Text style={[styles.statusText, { color: '#d97706' }]}>WARNING</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityTime}>
                <Clock size={14} color="#6b7280" />
                <Text style={styles.timeText}>12m ago</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Route Optimization</Text>
                <Text style={styles.activityDescription}>New route calculated for Truck #1249</Text>
              </View>
              <View style={[styles.activityStatus, { backgroundColor: '#fce7f3' }]}>
                <Text style={[styles.statusText, { color: '#be185d' }]}>OPTIMIZED</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#3b82f6' }]}>
                <Signal size={20} color="white" />
              </View>
              <Text style={styles.actionText}>Network Diagnostics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#10b981' }]}>
                <Battery size={20} color="white" />
              </View>
              <Text style={styles.actionText}>Battery Monitor</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#f59e0b' }]}>
                <MapPin size={20} color="white" />
              </View>
              <Text style={styles.actionText}>Location Tracker</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#8b5cf6' }]}>
                <Smartphone size={20} color="white" />
              </View>
              <Text style={styles.actionText}>Device Manager</Text>
            </TouchableOpacity>
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
    backgroundColor: '#f8fafc',
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  connectionHeader: {
    marginTop: 16,
    marginBottom: 24,
  },
  connectionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  connectionStatus: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  connectionBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  metricsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: (width - 48) / 2,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ef4444',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  deviceSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  deviceList: {
    gap: 12,
  },
  deviceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  deviceDriver: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  deviceLocation: {
    fontSize: 12,
    color: '#9ca3af',
  },
  deviceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deviceMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deviceMetricText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 4,
  },
  activitySection: {
    marginBottom: 24,
  },
  activityFeed: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityTime: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    marginRight: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  activityStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: (width - 48) / 2,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'center',
  },
  footer: {
    height: 20,
  },
});