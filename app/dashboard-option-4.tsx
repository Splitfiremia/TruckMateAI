import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Zap, Target, Award, Gauge, MapPin, Clock, Users, Truck, TrendingUp, Battery, Fuel, Shield } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import AppBrand from '@/components/AppBrand';

const { width } = Dimensions.get('window');

export default function DashboardOption4() {
  const performanceMetrics = [
    { title: 'Efficiency Score', value: 94, maxValue: 100, icon: Target, color: colors.primary },
    { title: 'Safety Rating', value: 98, maxValue: 100, icon: Shield, color: colors.success },
    { title: 'Fuel Economy', value: 7.2, maxValue: 10, icon: Fuel, color: colors.warning, unit: 'MPG' },
    { title: 'Uptime', value: 96, maxValue: 100, icon: Battery, color: colors.accent },
  ];

  const liveUpdates = [
    { id: 1, driver: 'Mike Johnson', status: 'En Route', location: 'I-95 North', eta: '2:30 PM', progress: 0.65 },
    { id: 2, driver: 'Sarah Davis', status: 'Loading', location: 'Warehouse B', eta: '3:15 PM', progress: 0.25 },
    { id: 3, driver: 'Tom Wilson', status: 'Delivered', location: 'Downtown', eta: 'Completed', progress: 1.0 },
  ];

  const achievements = [
    { title: 'Safety Champion', subtitle: '30 days accident-free', icon: Award, color: colors.success },
    { title: 'Fuel Saver', subtitle: '15% below target', icon: Fuel, color: colors.primary },
    { title: 'On-Time Hero', subtitle: '98% delivery rate', icon: Clock, color: colors.accent },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Dashboard Option 4',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white
      }} />
      
      {/* Dynamic Header */}
      <View style={styles.dynamicHeader}>
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.brandRow}>
              <AppBrand size="small" showText={false} />
              <View style={styles.brandInfo}>
                <Text style={styles.brandTitle}>TruckMate AI</Text>
                <Text style={styles.brandSubtitle}>Real-Time Operations</Text>
              </View>
            </View>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          
          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Truck size={16} color={colors.white} />
              <Text style={styles.quickStatValue}>24</Text>
              <Text style={styles.quickStatLabel}>Active</Text>
            </View>
            <View style={styles.quickStat}>
              <Users size={16} color={colors.white} />
              <Text style={styles.quickStatValue}>18</Text>
              <Text style={styles.quickStatLabel}>Drivers</Text>
            </View>
            <View style={styles.quickStat}>
              <MapPin size={16} color={colors.white} />
              <Text style={styles.quickStatValue}>12</Text>
              <Text style={styles.quickStatLabel}>Routes</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Performance Gauges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Dashboard</Text>
          <View style={styles.gaugesGrid}>
            {performanceMetrics.map((metric, index) => {
              const IconComp = metric.icon;
              const percentage = (metric.value / metric.maxValue) * 100;
              return (
                <View key={index} style={styles.gaugeCard}>
                  <View style={styles.gaugeHeader}>
                    <View style={[styles.gaugeIcon, { backgroundColor: `${metric.color}15` }]}>
                      <IconComp size={20} color={metric.color} />
                    </View>
                    <Text style={styles.gaugeTitle}>{metric.title}</Text>
                  </View>
                  
                  <View style={styles.gaugeContainer}>
                    <View style={styles.gaugeTrack}>
                      <View style={[styles.gaugeFill, { 
                        width: `${percentage}%`, 
                        backgroundColor: metric.color 
                      }]} />
                    </View>
                    <Text style={styles.gaugeValue}>
                      {metric.value}{metric.unit || '%'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Live Fleet Updates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Fleet Updates</Text>
            <View style={styles.refreshIndicator}>
              <Zap size={14} color={colors.primary} />
              <Text style={styles.refreshText}>Auto-refresh</Text>
            </View>
          </View>
          
          {liveUpdates.map((update) => (
            <View key={update.id} style={styles.updateCard}>
              <View style={styles.updateHeader}>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{update.driver}</Text>
                  <Text style={styles.driverLocation}>{update.location}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{update.status}</Text>
                </View>
              </View>
              
              <View style={styles.progressSection}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { 
                    width: `${update.progress * 100}%`,
                    backgroundColor: update.progress === 1 ? colors.success : colors.primary
                  }]} />
                </View>
                <Text style={styles.etaText}>ETA: {update.eta}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Achievement Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement, index) => {
              const IconComp = achievement.icon;
              return (
                <TouchableOpacity key={index} style={styles.achievementCard}>
                  <View style={[styles.achievementIcon, { backgroundColor: `${achievement.color}15` }]}>
                    <IconComp size={24} color={achievement.color} />
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementSubtitle}>{achievement.subtitle}</Text>
                  </View>
                  <View style={[styles.achievementBadge, { backgroundColor: achievement.color }]}>
                    <Text style={styles.achievementBadgeText}>NEW</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Real-time Analytics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Analytics</Text>
          <View style={styles.analyticsGrid}>
            <View style={styles.analyticsCard}>
              <View style={styles.analyticsHeader}>
                <TrendingUp size={20} color={colors.success} />
                <Text style={styles.analyticsChange}>+12%</Text>
              </View>
              <Text style={styles.analyticsValue}>2,847</Text>
              <Text style={styles.analyticsLabel}>Miles Driven</Text>
            </View>
            
            <View style={styles.analyticsCard}>
              <View style={styles.analyticsHeader}>
                <Gauge size={20} color={colors.primary} />
                <Text style={styles.analyticsChange}>+5%</Text>
              </View>
              <Text style={styles.analyticsValue}>94.2%</Text>
              <Text style={styles.analyticsLabel}>Efficiency</Text>
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
  dynamicHeader: {
    backgroundColor: colors.primary,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandInfo: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  brandSubtitle: {
    fontSize: 12,
    color: `${colors.white}80`,
    marginTop: 2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${colors.white}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickStat: {
    alignItems: 'center',
    gap: 4,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  quickStatLabel: {
    fontSize: 10,
    color: `${colors.white}80`,
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
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refreshText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  gaugesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gaugeCard: {
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
  gaugeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  gaugeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
    flex: 1,
  },
  gaugeContainer: {
    alignItems: 'center',
    gap: 8,
  },
  gaugeTrack: {
    width: '100%',
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 3,
  },
  gaugeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  updateCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  driverLocation: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.white,
  },
  progressSection: {
    gap: 8,
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
  etaText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'right',
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  achievementSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  achievementBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  achievementBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
  },
  analyticsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  analyticsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  analyticsChange: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  analyticsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  footer: {
    height: 40,
  },
});