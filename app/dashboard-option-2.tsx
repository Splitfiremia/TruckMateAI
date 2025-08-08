import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { Mic, Camera, Clock, AlertTriangle, Truck, DollarSign, Clipboard, Upload, Shield, Cloud, Activity, Settings, Route, ScanLine, CheckCircle2, Sun, Wrench, Link as LinkIcon, Sparkles, BookOpen, Package as PackageIcon, Bell, Search, Menu, MoreHorizontal, TrendingUp } from 'lucide-react-native';
import AppBrand from '@/components/AppBrand';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useLogbookStore } from '@/store/logbookStore';
import { driverInfo, upcomingLoads, weeklyStats } from '@/constants/mockData';

const { width } = Dimensions.get('window');

export default function DashboardOption2() {
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
  
  const primaryActions = [
    { key: 'drive', label: 'Start Driving', icon: Truck, color: colors.primary, size: 'large' },
    { key: 'inspect', label: 'Pre-Trip Inspection', icon: Clipboard, color: colors.success, size: 'large' },
  ];
  
  const secondaryActions = [
    { key: 'scan', label: 'Scan Receipt', icon: Camera, color: colors.accent },
    { key: 'weather', label: 'Weather', icon: Sun, color: colors.warning },
    { key: 'dot', label: 'DOT Assistant', icon: Shield, color: colors.secondary },
    { key: 'upload', label: 'Bulk Upload', icon: Upload, color: colors.primaryLight },
  ];
  
  const navigationItems = [
    { key: 'logbook', label: 'Logbook', route: '/logbook', icon: BookOpen },
    { key: 'loads', label: 'Loads', route: '/loads', icon: PackageIcon },
    { key: 'receipts', label: 'Receipts', route: '/receipts', icon: ScanLine },
    { key: 'routes', label: 'Routes', route: '/route-optimization', icon: Route },
    { key: 'compliance', label: 'Compliance', route: '/compliance', icon: CheckCircle2 },
    { key: 'maintenance', label: 'Maintenance', route: '/maintenance', icon: Wrench },
    { key: 'ai', label: 'AI Assistant', route: '/ai-assistant', icon: Sparkles },
    { key: 'settings', label: 'Settings', route: '/settings', icon: Settings },
  ];
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Minimal Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/settings')}>
          <Menu size={20} color={colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <AppBrand size="small" showText={false} logoSize={24} />
          <Text style={styles.headerTitle}>TruckMate AI</Text>
        </View>
        
        <TouchableOpacity style={styles.profileButton} onPress={handleLogOut}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>
              {(user?.name || driverInfo.name).charAt(0).toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{(user?.name || driverInfo.name).split(' ')[0]}!</Text>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <Text style={styles.statusText}>{currentStatus}</Text>
          </View>
        </View>
        
        {/* Primary Actions */}
        <View style={styles.section}>
          <View style={styles.primaryActionsGrid}>
            {primaryActions.map((action) => {
              const IconComp = action.icon;
              return (
                <TouchableOpacity key={action.key} style={styles.primaryActionCard}>
                  <View style={[styles.primaryActionIcon, { backgroundColor: action.color }]}>
                    <IconComp size={32} color={colors.white} />
                  </View>
                  <Text style={styles.primaryActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        {/* Secondary Actions */}
        <View style={styles.section}>
          <View style={styles.secondaryActionsGrid}>
            {secondaryActions.map((action) => {
              const IconComp = action.icon;
              return (
                <TouchableOpacity key={action.key} style={styles.secondaryActionCard}>
                  <View style={[styles.secondaryActionIcon, { backgroundColor: `${action.color}15` }]}>
                    <IconComp size={20} color={action.color} />
                  </View>
                  <Text style={styles.secondaryActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        {/* Today's Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Overview</Text>
            <TouchableOpacity>
              <TrendingUp size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.overviewCard}>
            <View style={styles.overviewMetrics}>
              <View style={styles.overviewMetric}>
                <Text style={styles.overviewValue}>6.5</Text>
                <Text style={styles.overviewLabel}>Hours Driven</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '65%' }]} />
                </View>
              </View>
              
              <View style={styles.overviewMetric}>
                <Text style={styles.overviewValue}>425</Text>
                <Text style={styles.overviewLabel}>Miles Today</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '78%' }]} />
                </View>
              </View>
              
              <View style={styles.overviewMetric}>
                <Text style={styles.overviewValue}>4.5</Text>
                <Text style={styles.overviewLabel}>Hours Left</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '45%', backgroundColor: colors.warning }]} />
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Navigation Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navigate</Text>
          <View style={styles.navigationGrid}>
            {navigationItems.map((item) => {
              const IconComp = item.icon;
              return (
                <TouchableOpacity 
                  key={item.key} 
                  style={styles.navigationCard}
                  onPress={() => router.push(item.route as any)}
                >
                  <IconComp size={24} color={colors.primary} />
                  <Text style={styles.navigationLabel}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        {/* Next Load */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Next Load</Text>
            <TouchableOpacity>
              <MoreHorizontal size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.loadCard}>
            <View style={styles.loadInfo}>
              <View style={styles.loadDateTime}>
                <Text style={styles.loadDate}>Aug 16</Text>
                <Text style={styles.loadTime}>2:45 PM</Text>
              </View>
              <View style={styles.loadDetails}>
                <Text style={styles.loadTitle}>Pickup - Atlanta, GA</Text>
                <Text style={styles.loadLocation}>📍 Distribution Center</Text>
                <Text style={styles.loadDistance}>~45 miles away</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.loadAction}>
              <Text style={styles.loadActionText}>Navigate</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Weekly Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.performanceCard}>
            <View style={styles.performanceGrid}>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceValue}>{weeklyStats.drivingHours}h</Text>
                <Text style={styles.performanceLabel}>Driving</Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceValue}>{weeklyStats.milesLogged}</Text>
                <Text style={styles.performanceLabel}>Miles</Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={[styles.performanceValue, { color: colors.success }]}>
                  ${weeklyStats.revenue.toFixed(0)}
                </Text>
                <Text style={styles.performanceLabel}>Revenue</Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={[styles.performanceValue, { color: weeklyStats.violations > 0 ? colors.danger : colors.success }]}>
                  {weeklyStats.violations}
                </Text>
                <Text style={styles.performanceLabel}>Violations</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
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
    color: colors.text.primary,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    paddingVertical: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  primaryActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryActionCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  secondaryActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  secondaryActionCard: {
    width: (width - 64) / 2,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  overviewCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewMetrics: {
    gap: 20,
  },
  overviewMetric: {
    gap: 8,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  overviewLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  navigationCard: {
    width: (width - 64) / 4,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  navigationLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
  },
  loadCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  loadInfo: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  loadDateTime: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    minWidth: 70,
  },
  loadDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  loadTime: {
    fontSize: 12,
    color: colors.white,
    marginTop: 2,
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
  loadLocation: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  loadDistance: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  loadAction: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  loadActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  performanceCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceItem: {
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  performanceLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  footer: {
    height: 40,
  },
});