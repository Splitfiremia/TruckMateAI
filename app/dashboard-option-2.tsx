import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { Navigation, DollarSign, Users, MapPin, ArrowLeft, Calendar, BarChart3 } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function DashboardOption2() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerTitle: 'Dashboard Option 2 - Analytics Hub',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.headerStats}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <DollarSign size={20} color="#10b981" />
            </View>
            <Text style={styles.statValue}>$12,847</Text>
            <Text style={styles.statLabel}>Revenue Today</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Navigation size={20} color="#3b82f6" />
            </View>
            <Text style={styles.statValue}>2,341</Text>
            <Text style={styles.statLabel}>Miles Driven</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Users size={20} color="#8b5cf6" />
            </View>
            <Text style={styles.statValue}>18/24</Text>
            <Text style={styles.statLabel}>Active Drivers</Text>
          </View>
        </View>
        
        {/* Performance Chart Card */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Weekly Performance</Text>
            <TouchableOpacity style={styles.chartButton}>
              <BarChart3 size={16} color={colors.primary} />
              <Text style={styles.chartButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartPlaceholder}>
            <View style={styles.chartBars}>
              <View style={[styles.chartBar, { height: 40 }]} />
              <View style={[styles.chartBar, { height: 60 }]} />
              <View style={[styles.chartBar, { height: 80 }]} />
              <View style={[styles.chartBar, { height: 45 }]} />
              <View style={[styles.chartBar, { height: 90 }]} />
              <View style={[styles.chartBar, { height: 70 }]} />
              <View style={[styles.chartBar, { height: 85 }]} />
            </View>
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>Mon</Text>
              <Text style={styles.chartLabel}>Tue</Text>
              <Text style={styles.chartLabel}>Wed</Text>
              <Text style={styles.chartLabel}>Thu</Text>
              <Text style={styles.chartLabel}>Fri</Text>
              <Text style={styles.chartLabel}>Sat</Text>
              <Text style={styles.chartLabel}>Sun</Text>
            </View>
          </View>
        </View>
        
        {/* Live Tracking Section */}
        <View style={styles.trackingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Tracking</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.trackingCard}>
            <View style={styles.trackingHeader}>
              <View style={styles.driverInfo}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverInitials}>AB</Text>
                </View>
                <View>
                  <Text style={styles.driverName}>Alex Brown</Text>
                  <Text style={styles.truckNumber}>Truck #1247</Text>
                </View>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>EN ROUTE</Text>
              </View>
            </View>
            
            <View style={styles.routeInfo}>
              <View style={styles.routePoint}>
                <MapPin size={14} color="#10b981" />
                <Text style={styles.routeText}>Chicago, IL</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routePoint}>
                <MapPin size={14} color="#ef4444" />
                <Text style={styles.routeText}>Dallas, TX</Text>
              </View>
            </View>
            
            <View style={styles.trackingMetrics}>
              <View style={styles.trackingMetric}>
                <Text style={styles.metricLabel}>ETA</Text>
                <Text style={styles.metricValue}>4h 32m</Text>
              </View>
              <View style={styles.trackingMetric}>
                <Text style={styles.metricLabel}>Distance</Text>
                <Text style={styles.metricValue}>287 mi</Text>
              </View>
              <View style={styles.trackingMetric}>
                <Text style={styles.metricLabel}>Speed</Text>
                <Text style={styles.metricValue}>65 mph</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Schedule Overview */}
        <View style={styles.scheduleSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today&apos;s Schedule</Text>
            <TouchableOpacity>
              <Calendar size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.scheduleList}>
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleTime}>
                <Text style={styles.timeText}>08:00</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleTitle}>Pickup - Warehouse A</Text>
                <Text style={styles.scheduleLocation}>1234 Industrial Blvd</Text>
              </View>
              <View style={styles.scheduleStatus}>
                <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
              </View>
            </View>
            
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleTime}>
                <Text style={styles.timeText}>14:30</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleTitle}>Delivery - Customer Site</Text>
                <Text style={styles.scheduleLocation}>5678 Commerce St</Text>
              </View>
              <View style={styles.scheduleStatus}>
                <View style={[styles.statusDot, { backgroundColor: '#f59e0b' }]} />
              </View>
            </View>
            
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleTime}>
                <Text style={styles.timeText}>18:00</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleTitle}>Return to Depot</Text>
                <Text style={styles.scheduleLocation}>Main Terminal</Text>
              </View>
              <View style={styles.scheduleStatus}>
                <View style={[styles.statusDot, { backgroundColor: '#6b7280' }]} />
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
    backgroundColor: '#f1f5f9',
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 48) / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  chartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chartButtonText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  chartPlaceholder: {
    height: 120,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 90,
    marginBottom: 8,
  },
  chartBar: {
    width: 24,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 12,
    color: '#6b7280',
    width: 24,
    textAlign: 'center',
  },
  trackingSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  trackingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverInitials: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  truckNumber: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16a34a',
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 4,
  },
  routeLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
    marginHorizontal: 12,
  },
  trackingMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackingMetric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  scheduleSection: {
    marginBottom: 24,
  },
  scheduleList: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  scheduleTime: {
    width: 60,
    marginRight: 16,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  scheduleLocation: {
    fontSize: 12,
    color: '#6b7280',
  },
  scheduleStatus: {
    marginLeft: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    height: 20,
  },
});