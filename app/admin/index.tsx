import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { BarChart3, Users, Shield, DollarSign, Activity, AlertTriangle } from 'lucide-react-native';
import { useAdminStore } from '@/store/adminStore';

export default function AdminDashboard() {
  const router = useRouter();
  const { metrics, alerts } = useAdminStore();

  const dashboardCards = [
    {
      title: 'User Management',
      subtitle: `${metrics.totalUsers} total users`,
      icon: Users,
      route: '/admin/users',
      color: '#117ACA'
    },
    {
      title: 'API Gateway',
      subtitle: `${metrics.apiRequests} requests today`,
      icon: Shield,
      route: '/admin/api-gateway',
      color: '#2D2D2D'
    },
    {
      title: 'Cost Control',
      subtitle: `${(metrics.costRatio * 100).toFixed(1)}% of revenue`,
      icon: DollarSign,
      route: '/admin/cost-control',
      color: metrics.costRatio > 0.35 ? '#E5252C' : '#117ACA'
    },
    {
      title: 'Payment System',
      subtitle: `$${metrics.monthlyRevenue.toLocaleString()} this month`,
      icon: BarChart3,
      route: '/admin/payments',
      color: '#FFB81C'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TruckMate AI Admin Portal</Text>
        <Text style={styles.subtitle}>Profit-Optimized Management Dashboard</Text>
      </View>

      {/* Profit Guard Alert */}
      {metrics.costRatio > 0.35 && (
        <View style={styles.alertCard}>
          <AlertTriangle size={24} color="#E5252C" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Cost Breach Alert</Text>
            <Text style={styles.alertText}>
              API costs exceed 35% of revenue. Auto-downgrade activated.
            </Text>
          </View>
        </View>
      )}

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{(metrics.costRatio * 100).toFixed(1)}%</Text>
          <Text style={styles.metricLabel}>Cost Ratio</Text>
          <View style={[styles.progressBar, { width: `${Math.min(metrics.costRatio * 100, 100)}%` }]} />
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{metrics.activeUsers}</Text>
          <Text style={styles.metricLabel}>Active Users</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>${metrics.dailyApiCost.toFixed(2)}</Text>
          <Text style={styles.metricLabel}>Daily API Cost</Text>
        </View>
      </View>

      {/* Dashboard Cards */}
      <View style={styles.cardsContainer}>
        {dashboardCards.map((card, index) => (
          <Pressable
            key={index}
            style={[styles.card, { borderLeftColor: card.color }]}
            onPress={() => router.push(card.route as any)}
          >
            <View style={styles.cardHeader}>
              <card.icon size={24} color={card.color} />
              <Text style={styles.cardTitle}>{card.title}</Text>
            </View>
            <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
          </Pressable>
        ))}
      </View>

      {/* Recent Alerts */}
      <View style={styles.alertsSection}>
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        {alerts.map((alert, index) => (
          <View key={index} style={styles.alertItem}>
            <View style={[styles.alertDot, { backgroundColor: alert.severity === 'high' ? '#E5252C' : '#FFB81C' }]} />
            <View style={styles.alertDetails}>
              <Text style={styles.alertItemTitle}>{alert.title}</Text>
              <Text style={styles.alertItemTime}>{alert.timestamp}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#E5252C',
  },
  alertContent: {
    marginLeft: 12,
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E5252C',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: '#666666',
  },
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#117ACA',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#117ACA',
    borderRadius: 2,
    marginTop: 8,
    alignSelf: 'stretch',
  },
  cardsContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 12,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  alertsSection: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  alertDetails: {
    flex: 1,
  },
  alertItemTitle: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 2,
  },
  alertItemTime: {
    fontSize: 12,
    color: '#666666',
  },
});