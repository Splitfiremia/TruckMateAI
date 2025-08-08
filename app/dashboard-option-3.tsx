import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { Mic, Camera, Clock, AlertTriangle, Truck, DollarSign, Clipboard, Upload, Shield, Cloud, Activity, Settings, Route, ScanLine, CheckCircle2, Sun, Wrench, Link as LinkIcon, Sparkles, BookOpen, Package as PackageIcon, Bell, Search, Menu, MoreHorizontal, TrendingUp, ChevronRight, MapPin, Zap } from 'lucide-react-native';
import AppBrand from '@/components/AppBrand';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useLogbookStore } from '@/store/logbookStore';
import { driverInfo, upcomingLoads, weeklyStats } from '@/constants/mockData';

const { width } = Dimensions.get('window');

export default function DashboardOption3() {
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
    { key: 'drive', label: 'Start Driving', icon: Truck, color: colors.primary, description: 'Begin your route' },
    { key: 'inspect', label: 'Pre-Trip', icon: Clipboard, color: colors.success, description: 'Safety inspection' },
    { key: 'scan', label: 'Scan Receipt', icon: Camera, color: colors.accent, description: 'Capture expenses' },
    { key: 'weather', label: 'Weather', icon: Sun, color: colors.warning, description: 'Route conditions' },
  ];
  
  const mainFeatures = [
    { key: 'logbook', label: 'Logbook', route: '/logbook', icon: BookOpen, color: colors.primary, badge: '2' },
    { key: 'loads', label: 'Loads', route: '/loads', icon: PackageIcon, color: colors.secondary, badge: null },
    { key: 'receipts', label: 'Receipts', route: '/receipts', icon: ScanLine, color: colors.accent, badge: '5' },
    { key: 'routes', label: 'Routes', route: '/route-optimization', icon: Route, color: colors.success, badge: null },
    { key: 'compliance', label: 'Compliance', route: '/compliance', icon: CheckCircle2, color: colors.warning, badge: '1' },
    { key: 'maintenance', label: 'Maintenance', route: '/maintenance', icon: Wrench, color: colors.danger, badge: null },
    { key: 'ai', label: 'AI Assistant', route: '/ai-assistant', icon: Sparkles, color: colors.primaryLight, badge: null },
    { key: 'settings', label: 'Settings', route: '/settings', icon: Settings, color: colors.text.secondary, badge: null },
  ];
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/settings')}>
            <Menu size={20} color={colors.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.searchContainer}>
            <Search size={16} color={colors.text.secondary} />
            <Text style={styles.searchPlaceholder}>Search features...</Text>
          </View>
          
          <TouchableOpacity style={styles.profileButton} onPress={handleLogOut}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>
                {(user?.name || driverInfo.name).charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.brandSection}>
          <AppBrand size="small" showText={false} logoSize={32} />
          <View style={styles.brandText}>
            <Text style={styles.brandTitle}>TruckMate AI</Text>
            <Text style={styles.brandSubtitle}>Professional Edition</Text>
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeGreeting}>Good morning,</Text>
            <Text style={styles.welcomeName}>{(user?.name || driverInfo.name).split(' ')[0]}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusIndicator, { backgroundColor: colors.success }]} />
              <Text style={styles.statusText}>{currentStatus}</Text>
              <Text style={styles.statusTime}>• 6h 30m active</Text>
            </View>
          </View>
          <View style={styles.welcomeStats}>
            <View style={styles.statBubble}>
              <Text style={styles.statValue}>425</Text>
              <Text style={styles.statLabel}>Miles</Text>
            </View>
            <View style={styles.statBubble}>
              <Text style={styles.statValue}>4.5h</Text>
              <Text style={styles.statLabel}>Left</Text>
            </View>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity>
              <Zap size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => {
              const IconComp = action.icon;
              return (
                <TouchableOpacity key={action.key} style={styles.quickActionCard}>
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                    <IconComp size={24} color={colors.white} />
                  </View>
                  <View style={styles.quickActionContent}>
                    <Text style={styles.quickActionLabel}>{action.label}</Text>
                    <Text style={styles.quickActionDescription}>{action.description}</Text>
                  </View>
                  <ChevronRight size={16} color={colors.text.tertiary} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        {/* Features Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Features</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.featuresGrid}>
            {mainFeatures.map((feature) => {
              const IconComp = feature.icon;
              return (
                <TouchableOpacity 
                  key={feature.key} 
                  style={styles.featureCard}
                  onPress={() => router.push(feature.route as any)}
                >
                  <View style={styles.featureHeader}>
                    <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
                      <IconComp size={20} color={feature.color} />
                    </View>
                    {feature.badge && (
                      <View style={styles.featureBadge}>
                        <Text style={styles.featureBadgeText}>{feature.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.featureLabel}>{feature.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        {/* Next Load Card */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Next Load</Text>
            <TouchableOpacity>
              <MapPin size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.loadCard}>
            <View style={styles.loadHeader}>
              <View style={styles.loadDateBadge}>
                <Text style={styles.loadDateText}>Aug 16</Text>
                <Text style={styles.loadTimeText}>2:45 PM</Text>
              </View>
              <View style={styles.loadPriority}>
                <Text style={styles.loadPriorityText}>High Priority</Text>
              </View>
            </View>
            
            <View style={styles.loadContent}>
              <Text style={styles.loadTitle}>Pickup - Atlanta Distribution Center</Text>
              <Text style={styles.loadAddress}>📍 1234 Industrial Blvd, Atlanta, GA 30309</Text>
              <Text style={styles.loadDistance}>~45 miles • 1h 15m drive time</Text>
            </View>
            
            <View style={styles.loadActions}>
              <TouchableOpacity style={styles.loadActionSecondary}>
                <Text style={styles.loadActionSecondaryText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.loadActionPrimary}>
                <Text style={styles.loadActionPrimaryText}>Start Navigation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Performance Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This Week's Performance</Text>
            <TouchableOpacity>
              <TrendingUp size={18} color={colors.success} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.performanceCard}>
            <View style={styles.performanceRow}>
              <View style={styles.performanceMetric}>
                <Text style={styles.performanceValue}>{weeklyStats.drivingHours}h</Text>
                <Text style={styles.performanceLabel}>Driving Hours</Text>
                <View style={styles.performanceBar}>
                  <View style={[styles.performanceBarFill, { width: '70%', backgroundColor: colors.primary }]} />
                </View>
              </View>
              
              <View style={styles.performanceMetric}>
                <Text style={styles.performanceValue}>{weeklyStats.milesLogged}</Text>
                <Text style={styles.performanceLabel}>Miles Logged</Text>
                <View style={styles.performanceBar}>
                  <View style={[styles.performanceBarFill, { width: '85%', backgroundColor: colors.success }]} />
                </View>
              </View>
            </View>
            
            <View style={styles.performanceRow}>
              <View style={styles.performanceMetric}>
                <Text style={[styles.performanceValue, { color: colors.success }]}>
                  ${weeklyStats.revenue.toFixed(0)}
                </Text>
                <Text style={styles.performanceLabel}>Revenue</Text>
                <View style={styles.performanceBar}>
                  <View style={[styles.performanceBarFill, { width: '92%', backgroundColor: colors.success }]} />
                </View>
              </View>
              
              <View style={styles.performanceMetric}>
                <Text style={[styles.performanceValue, { color: weeklyStats.violations > 0 ? colors.danger : colors.success }]}>
                  {weeklyStats.violations}
                </Text>
                <Text style={styles.performanceLabel}>Violations</Text>
                <View style={styles.performanceBar}>
                  <View style={[styles.performanceBarFill, { width: weeklyStats.violations > 0 ? '15%' : '100%', backgroundColor: weeklyStats.violations > 0 ? colors.danger : colors.success }]} />
                </View>
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
    backgroundColor: colors.background.secondary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  profileButton: {
    position: 'relative',
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
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: colors.background.secondary,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  brandSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeGreeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  welcomeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  statusTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  welcomeStats: {
    gap: 8,
  },
  statBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
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
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  quickActionsContainer: {
    gap: 12,
  },
  quickActionCard: {
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
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  quickActionDescription: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: (width - 64) / 4,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureHeader: {
    position: 'relative',
    marginBottom: 8,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
  },
  featureLabel: {
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
  loadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadDateBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  loadDateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  loadTimeText: {
    fontSize: 10,
    color: colors.white,
    marginTop: 2,
  },
  loadPriority: {
    backgroundColor: colors.warning,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  loadPriorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
  loadContent: {
    marginBottom: 16,
  },
  loadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 6,
  },
  loadAddress: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  loadDistance: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  loadActions: {
    flexDirection: 'row',
    gap: 12,
  },
  loadActionSecondary: {
    flex: 1,
    backgroundColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  loadActionSecondaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  loadActionPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  loadActionPrimaryText: {
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
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  performanceMetric: {
    flex: 1,
    marginHorizontal: 6,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  performanceBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  performanceBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  footer: {
    height: 40,
  },
});