import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { Search, Bell, Settings, BarChart3, Navigation, Zap, CheckCircle, AlertCircle, Clock, Truck } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import AppBrand from '@/components/AppBrand';

const { width } = Dimensions.get('window');

export default function DashboardOption2() {
  const navigationItems = [
    { icon: Truck, label: 'Fleet', count: 24, color: colors.primary },
    { icon: Clock, label: 'Logbook', count: 8, color: colors.accent },
    { icon: Navigation, label: 'Routes', count: 12, color: colors.success },
    { icon: BarChart3, label: 'Analytics', count: null, color: colors.warning },
    { icon: CheckCircle, label: 'Compliance', count: 3, color: colors.primary },
    { icon: Settings, label: 'Settings', count: null, color: colors.text.secondary },
  ];

  const alerts = [
    { type: 'warning', message: 'Vehicle TRK-001 needs maintenance in 500 miles', time: '2 hours ago' },
    { type: 'success', message: 'Driver John completed pre-trip inspection', time: '4 hours ago' },
    { type: 'info', message: 'New route optimization available', time: '6 hours ago' },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Dashboard Option 2',
        headerStyle: { backgroundColor: colors.background.secondary },
        headerTintColor: colors.text.primary
      }} />
      
      {/* Clean Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.brandContainer}>
            <AppBrand size="small" showText={false} />
            <View>
              <Text style={styles.brandTitle}>TruckMate AI</Text>
              <Text style={styles.brandSubtitle}>Fleet Management Suite</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={20} color={colors.text.primary} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={16} color={colors.text.secondary} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search vehicles, drivers, routes..."
            placeholderTextColor={colors.text.secondary}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Overview</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricValue}>24/26</Text>
                <Truck size={20} color={colors.primary} />
              </View>
              <Text style={styles.metricLabel}>Active Vehicles</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '92%', backgroundColor: colors.primary }]} />
              </View>
            </View>
            
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricValue}>18/20</Text>
                <CheckCircle size={20} color={colors.success} />
              </View>
              <Text style={styles.metricLabel}>Compliant Drivers</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '90%', backgroundColor: colors.success }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Navigation Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.navigationGrid}>
            {navigationItems.map((item, index) => {
              const IconComp = item.icon;
              return (
                <TouchableOpacity key={index} style={styles.navigationCard}>
                  <View style={styles.navigationCardContent}>
                    <View style={[styles.navigationIcon, { backgroundColor: `${item.color}15` }]}>
                      <IconComp size={22} color={item.color} />
                    </View>
                    {item.count && (
                      <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>{item.count}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.navigationLabel}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {alerts.map((alert, index) => (
            <View key={index} style={styles.activityCard}>
              <View style={styles.activityIcon}>
                {alert.type === 'warning' && <AlertCircle size={16} color={colors.warning} />}
                {alert.type === 'success' && <CheckCircle size={16} color={colors.success} />}
                {alert.type === 'info' && <Zap size={16} color={colors.primary} />}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityMessage}>{alert.message}</Text>
                <Text style={styles.activityTime}>{alert.time}</Text>
              </View>
            </View>
          ))}
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
  header: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  brandSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.danger,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  metricsContainer: {
    gap: 12,
  },
  metricCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  metricLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.background.tertiary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  navigationCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: (width - 56) / 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navigationCardContent: {
    position: 'relative',
    marginBottom: 8,
  },
  navigationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
  },
  navigationLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  footer: {
    height: 40,
  },
});