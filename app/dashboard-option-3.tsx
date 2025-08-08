import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Activity, MapPin, Clock, Fuel, Shield, AlertTriangle, TrendingUp, Users, Calendar, Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import AppBrand from '@/components/AppBrand';

const { width } = Dimensions.get('window');

export default function DashboardOption3() {
  const kpiCards = [
    { title: 'Fleet Efficiency', value: '94.2%', change: '+2.1%', trend: 'up', icon: TrendingUp },
    { title: 'Safety Score', value: '98.7', change: '+0.3', trend: 'up', icon: Shield },
    { title: 'Fuel Economy', value: '7.2 MPG', change: '-0.1', trend: 'down', icon: Fuel },
    { title: 'Driver Rating', value: '4.8/5', change: '+0.1', trend: 'up', icon: Star },
  ];

  const priorityAlerts = [
    { priority: 'high', title: 'Maintenance Due', subtitle: 'TRK-001 • 2,450 miles', time: '2h' },
    { priority: 'medium', title: 'Route Delay', subtitle: 'Driver Mike • I-95 Traffic', time: '15m' },
    { priority: 'low', title: 'Fuel Stop', subtitle: 'TRK-003 • Next 50 miles', time: '1h' },
  ];

  const todayStats = [
    { label: 'Miles Driven', value: '2,847', icon: MapPin, color: colors.primary },
    { label: 'Hours Logged', value: '156.5', icon: Clock, color: colors.accent },
    { label: 'Active Drivers', value: '18', icon: Users, color: colors.success },
    { label: 'Deliveries', value: '24', icon: Calendar, color: colors.warning },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Dashboard Option 3',
        headerStyle: { backgroundColor: colors.background.secondary },
        headerTintColor: colors.text.primary
      }} />
      
      {/* Executive Header */}
      <View style={styles.executiveHeader}>
        <View style={styles.headerContent}>
          <View style={styles.brandSection}>
            <AppBrand size="medium" showText={false} />
            <View style={styles.brandText}>
              <Text style={styles.brandTitle}>TruckMate AI</Text>
              <Text style={styles.brandSubtitle}>Executive Dashboard</Text>
            </View>
          </View>
          <View style={styles.dateSection}>
            <Text style={styles.dateText}>Today</Text>
            <Text style={styles.dateValue}>Dec 8, 2024</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* KPI Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          <View style={styles.kpiGrid}>
            {kpiCards.map((kpi, index) => {
              const IconComp = kpi.icon;
              return (
                <View key={index} style={styles.kpiCard}>
                  <View style={styles.kpiHeader}>
                    <View style={[styles.kpiIcon, { backgroundColor: `${colors.primary}15` }]}>
                      <IconComp size={18} color={colors.primary} />
                    </View>
                    <View style={[styles.trendBadge, { 
                      backgroundColor: kpi.trend === 'up' ? `${colors.success}15` : `${colors.warning}15` 
                    }]}>
                      <Text style={[styles.trendText, { 
                        color: kpi.trend === 'up' ? colors.success : colors.warning 
                      }]}>{kpi.change}</Text>
                    </View>
                  </View>
                  <Text style={styles.kpiValue}>{kpi.value}</Text>
                  <Text style={styles.kpiTitle}>{kpi.title}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Priority Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Priority Alerts</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {priorityAlerts.map((alert, index) => (
            <TouchableOpacity key={index} style={styles.alertCard}>
              <View style={[styles.priorityIndicator, { 
                backgroundColor: alert.priority === 'high' ? colors.danger : 
                                alert.priority === 'medium' ? colors.warning : colors.success 
              }]} />
              <View style={styles.alertContent}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
                <Text style={styles.alertSubtitle}>{alert.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Performance</Text>
          <View style={styles.statsGrid}>
            {todayStats.map((stat, index) => {
              const IconComp = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                    <IconComp size={20} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Fleet Status Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fleet Status</Text>
          <View style={styles.fleetOverview}>
            <View style={styles.fleetStat}>
              <View style={styles.fleetStatHeader}>
                <Text style={styles.fleetStatValue}>24</Text>
                <Text style={styles.fleetStatTotal}>/26</Text>
              </View>
              <Text style={styles.fleetStatLabel}>Active Vehicles</Text>
              <View style={styles.fleetProgressBar}>
                <View style={[styles.fleetProgressFill, { width: '92%' }]} />
              </View>
            </View>
            
            <View style={styles.fleetStat}>
              <View style={styles.fleetStatHeader}>
                <Text style={styles.fleetStatValue}>18</Text>
                <Text style={styles.fleetStatTotal}>/20</Text>
              </View>
              <Text style={styles.fleetStatLabel}>Compliant Drivers</Text>
              <View style={styles.fleetProgressBar}>
                <View style={[styles.fleetProgressFill, { width: '90%' }]} />
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
    backgroundColor: colors.background.primary,
  },
  executiveHeader: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandText: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  brandSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  dateSection: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    width: (width - 56) / 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  kpiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  kpiTitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  alertCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  alertTime: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  alertSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: (width - 56) / 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  fleetOverview: {
    gap: 16,
  },
  fleetStat: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fleetStatHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  fleetStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  fleetStatTotal: {
    fontSize: 18,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  fleetStatLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  fleetProgressBar: {
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fleetProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  footer: {
    height: 40,
  },
});