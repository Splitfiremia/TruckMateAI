import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { Mic, Camera, Clock, AlertTriangle, Truck, DollarSign, Clipboard, Upload, Shield, Cloud, Activity, Settings, Route, ScanLine, CheckCircle2, Sun, Wrench, Link as LinkIcon, Sparkles, BookOpen, Package as PackageIcon, Bell, Search, Menu } from 'lucide-react-native';
import AppBrand from '@/components/AppBrand';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useLogbookStore } from '@/store/logbookStore';
import { driverInfo, upcomingLoads, weeklyStats } from '@/constants/mockData';

const { width } = Dimensions.get('window');

export default function DashboardOption1() {
  const { user, logout } = useUserStore();
  const { currentStatus } = useLogbookStore();
  
  const handleLogOut = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: () => {
            logout();
          }
        }
      ]
    );
  };
  
  const quickActions = [
    { key: 'drive', label: 'Start Driving', icon: Truck, color: colors.primary },
    { key: 'inspect', label: 'Inspection', icon: Clipboard, color: colors.success },
    { key: 'scan', label: 'Scan Receipt', icon: Camera, color: colors.accent },
    { key: 'weather', label: 'Weather', icon: Sun, color: colors.warning },
  ];
  
  const mainFeatures = [
    { key: 'logbook', label: 'Logbook', route: '/logbook', icon: BookOpen, color: colors.primary },
    { key: 'loads', label: 'Loads', route: '/loads', icon: PackageIcon, color: colors.secondary },
    { key: 'receipts', label: 'Receipts', route: '/receipts', icon: ScanLine, color: colors.accent },
    { key: 'routes', label: 'Routes', route: '/route-optimization', icon: Route, color: colors.success },
    { key: 'compliance', label: 'Compliance', route: '/compliance', icon: CheckCircle2, color: colors.warning },
    { key: 'maintenance', label: 'Maintenance', route: '/maintenance', icon: Wrench, color: colors.danger },
  ];
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Modern Header with Gradient */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/settings')}>
            <Menu size={24} color={colors.white} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <AppBrand size="small" showText={false} logoSize={28} />
            <Text style={styles.headerTitle}>TruckMate AI</Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={20} color={colors.white} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={handleLogOut}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileInitial}>
                  {(user?.name || driverInfo.name).charAt(0).toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Good morning,</Text>
          <Text style={styles.userName}>{(user?.name || driverInfo.name).split(' ')[0]}</Text>
          <Text style={styles.statusText}>Status: {currentStatus}</Text>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => {
              const IconComp = action.icon;
              return (
                <TouchableOpacity key={action.key} style={styles.quickActionCard}>
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                    <IconComp size={24} color={colors.white} />
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        {/* Status Overview */}
        <View style={styles.section}>
          <View style={styles.statusOverview}>
            <View style={styles.statusCard}>
              <Text style={styles.statusCardTitle}>Today's Progress</Text>
              <View style={styles.statusMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>6.5h</Text>
                  <Text style={styles.metricLabel}>Driving</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>425</Text>
                  <Text style={styles.metricLabel}>Miles</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>4.5h</Text>
                  <Text style={styles.metricLabel}>Remaining</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Main Features Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            {mainFeatures.map((feature) => {
              const IconComp = feature.icon;
              return (
                <TouchableOpacity 
                  key={feature.key} 
                  style={styles.featureCard}
                  onPress={() => router.push(feature.route as any)}
                >
                  <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
                    <IconComp size={28} color={feature.color} />
                  </View>
                  <Text style={styles.featureLabel}>{feature.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        {/* Upcoming Load */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Load</Text>
          <View style={styles.loadCard}>
            <View style={styles.loadHeader}>
              <View style={styles.loadDate}>
                <Text style={styles.loadMonth}>Aug</Text>
                <Text style={styles.loadDay}>16</Text>
              </View>
              <View style={styles.loadDetails}>
                <Text style={styles.loadTitle}>Pickup - Atlanta, GA</Text>
                <Text style={styles.loadTime}>2:45 PM EDT</Text>
                <Text style={styles.loadDistance}>📍 Distribution Center</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.loadButton}>
              <Text style={styles.loadButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Weekly Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.statsCard}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{weeklyStats.drivingHours}h</Text>
                <Text style={styles.statLabel}>Driving Hours</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{weeklyStats.milesLogged}</Text>
                <Text style={styles.statLabel}>Miles</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  ${weeklyStats.revenue.toFixed(0)}
                </Text>
                <Text style={styles.statLabel}>Revenue</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: weeklyStats.violations > 0 ? colors.danger : colors.success }]}>
                  {weeklyStats.violations}
                </Text>
                <Text style={styles.statLabel}>Violations</Text>
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
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  welcomeSection: {
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  statusOverview: {
    marginBottom: 8,
  },
  statusCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  statusMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureCard: {
    width: (width - 64) / 3,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  loadCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  loadDate: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  loadMonth: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  loadDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  loadDetails: {
    flex: 1,
  },
  loadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  loadTime: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  loadDistance: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  loadButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  loadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  statsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  footer: {
    height: 40,
  },
});