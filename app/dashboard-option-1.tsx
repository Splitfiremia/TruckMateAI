import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { Truck, MapPin, AlertTriangle, TrendingUp, Battery, Fuel, Shield, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function DashboardOption1() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerTitle: 'Dashboard Option 1 - Fleet Command',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Status Card */}
        <LinearGradient
          colors={['#1e40af', '#3b82f6', '#60a5fa']}
          style={styles.heroCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <Text style={styles.heroTitle}>Fleet Command Center</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>ACTIVE</Text>
              </View>
            </View>
            
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNumber}>24</Text>
                <Text style={styles.heroStatLabel}>Active Drivers</Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNumber}>18</Text>
                <Text style={styles.heroStatLabel}>On Route</Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNumber}>6</Text>
                <Text style={styles.heroStatLabel}>Available</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        
        {/* Quick Actions Grid */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: '#10b981' }]}>
              <Truck size={24} color="white" />
              <Text style={styles.quickActionText}>Dispatch</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: '#f59e0b' }]}>
              <MapPin size={24} color="white" />
              <Text style={styles.quickActionText}>Track</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: '#ef4444' }]}>
              <AlertTriangle size={24} color="white" />
              <Text style={styles.quickActionText}>Alerts</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: '#8b5cf6' }]}>
              <TrendingUp size={24} color="white" />
              <Text style={styles.quickActionText}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Live Fleet Status */}
        <View style={styles.fleetStatusContainer}>
          <Text style={styles.sectionTitle}>Live Fleet Status</Text>
          
          <View style={styles.driverCard}>
            <View style={styles.driverInfo}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverInitials}>JD</Text>
              </View>
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>John Doe</Text>
                <Text style={styles.driverRoute}>Route: I-95 North</Text>
                <Text style={styles.driverETA}>ETA: 2h 15m</Text>
              </View>
            </View>
            <View style={styles.driverMetrics}>
              <View style={styles.metric}>
                <Fuel size={16} color={colors.success} />
                <Text style={styles.metricValue}>78%</Text>
              </View>
              <View style={styles.metric}>
                <Battery size={16} color={colors.warning} />
                <Text style={styles.metricValue}>45%</Text>
              </View>
              <View style={styles.metric}>
                <Shield size={16} color={colors.success} />
                <Text style={styles.metricValue}>OK</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.driverCard}>
            <View style={styles.driverInfo}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverInitials}>MS</Text>
              </View>
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>Mike Smith</Text>
                <Text style={styles.driverRoute}>Route: I-10 West</Text>
                <Text style={styles.driverETA}>ETA: 4h 30m</Text>
              </View>
            </View>
            <View style={styles.driverMetrics}>
              <View style={styles.metric}>
                <Fuel size={16} color={colors.warning} />
                <Text style={styles.metricValue}>32%</Text>
              </View>
              <View style={styles.metric}>
                <Battery size={16} color={colors.success} />
                <Text style={styles.metricValue}>89%</Text>
              </View>
              <View style={styles.metric}>
                <Shield size={16} color={colors.danger} />
                <Text style={styles.metricValue}>ALERT</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Performance Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Today&apos;s Performance</Text>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricNumber}>1,247</Text>
              <Text style={styles.metricLabel}>Miles Driven</Text>
              <Text style={styles.metricChange}>+12% vs yesterday</Text>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricNumber}>94%</Text>
              <Text style={styles.metricLabel}>On-Time Delivery</Text>
              <Text style={styles.metricChange}>+2% vs yesterday</Text>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricNumber}>$2,847</Text>
              <Text style={styles.metricLabel}>Fuel Costs</Text>
              <Text style={styles.metricChange}>-8% vs yesterday</Text>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricNumber}>0</Text>
              <Text style={styles.metricLabel}>Safety Incidents</Text>
              <Text style={styles.metricChange}>Perfect record!</Text>
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
    backgroundColor: '#f8fafc',
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  heroCard: {
    borderRadius: 20,
    padding: 24,
    marginTop: 16,
    marginBottom: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 12,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  heroStat: {
    alignItems: 'center',
  },
  heroStatNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  heroStatLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (width - 48) / 2,
    aspectRatio: 1.5,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  fleetStatusContainer: {
    marginBottom: 24,
  },
  driverCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverInitials: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  driverRoute: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  driverETA: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  driverMetrics: {
    alignItems: 'flex-end',
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: '#1f2937',
  },
  metricsContainer: {
    marginBottom: 24,
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
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  metricLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  metricChange: {
    fontSize: 12,
    color: colors.success,
    marginTop: 4,
    fontWeight: '500',
  },
  footer: {
    height: 20,
  },
});