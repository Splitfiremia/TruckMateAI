import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Truck, Clock, MapPin, AlertTriangle, TrendingUp, Battery, Fuel, Shield, Users, Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import AppBrand from '@/components/AppBrand';

const { width } = Dimensions.get('window');

export default function DashboardOption1() {
  const quickActions = [
    { icon: Truck, label: 'Vehicle Status', color: colors.primary },
    { icon: Clock, label: 'Hours Log', color: colors.accent },
    { icon: MapPin, label: 'Route Plan', color: colors.success },
    { icon: AlertTriangle, label: 'Alerts', color: colors.warning },
  ];

  const statusCards = [
    { title: 'Driving Hours', value: '8.5h', subtitle: 'Today', progress: 0.7, color: colors.primary },
    { title: 'Fuel Level', value: '78%', subtitle: 'Tank 1', progress: 0.78, color: colors.success },
    { title: 'Next Service', value: '2,450', subtitle: 'Miles', progress: 0.3, color: colors.warning },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Dashboard Option 1',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white
      }} />
      
      {/* Hero Header */}
      <View style={styles.heroHeader}>
        <View style={styles.heroContent}>
          <AppBrand size="small" showText={false} />
          <Text style={styles.heroTitle}>TruckMate AI</Text>
          <Text style={styles.heroSubtitle}>Professional Fleet Management</Text>
        </View>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>24</Text>
            <Text style={styles.heroStatLabel}>Active Vehicles</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>98%</Text>
            <Text style={styles.heroStatLabel}>Compliance</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => {
              const IconComp = action.icon;
              return (
                <TouchableOpacity key={index} style={styles.quickActionCard}>
                  <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                    <IconComp size={24} color={action.color} />
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Status Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Overview</Text>
          {statusCards.map((card, index) => (
            <View key={index} style={styles.statusCard}>
              <View style={styles.statusCardHeader}>
                <Text style={styles.statusCardTitle}>{card.title}</Text>
                <Text style={styles.statusCardValue}>{card.value}</Text>
              </View>
              <Text style={styles.statusCardSubtitle}>{card.subtitle}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${card.progress * 100}%`, backgroundColor: card.color }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <TrendingUp size={20} color={colors.success} />
              <Text style={styles.metricValue}>2,847</Text>
              <Text style={styles.metricLabel}>Miles Driven</Text>
            </View>
            <View style={styles.metricCard}>
              <Fuel size={20} color={colors.warning} />
              <Text style={styles.metricValue}>$1,234</Text>
              <Text style={styles.metricLabel}>Fuel Cost</Text>
            </View>
            <View style={styles.metricCard}>
              <Shield size={20} color={colors.primary} />
              <Text style={styles.metricValue}>100%</Text>
              <Text style={styles.metricLabel}>Safety Score</Text>
            </View>
            <View style={styles.metricCard}>
              <Users size={20} color={colors.accent} />
              <Text style={styles.metricValue}>18</Text>
              <Text style={styles.metricLabel}>Active Drivers</Text>
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
  heroHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: `${colors.white}90`,
    marginTop: 4,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  heroStat: {
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  heroStatLabel: {
    fontSize: 12,
    color: `${colors.white}80`,
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
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
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
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statusCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statusCardSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
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
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  footer: {
    height: 40,
  },
});