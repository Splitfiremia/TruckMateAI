import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Shield, Users, Settings, BarChart3, DollarSign, AlertTriangle } from 'lucide-react-native';

const AdminDashboard = () => {
  const adminCards = [
    {
      title: 'Profit Guard',
      description: 'Monitor API costs vs revenue in real-time',
      icon: Shield,
      route: '/admin/profit-guard',
      color: '#10b981',
      status: 'Active'
    },
    {
      title: 'User Management',
      description: 'Manage user tiers and subscriptions',
      icon: Users,
      route: '/admin/user-management',
      color: '#3b82f6',
      status: 'Active'
    },
    {
      title: 'API Gateway',
      description: 'Control API routing and cost limits',
      icon: Settings,
      route: '/admin/api-gateway',
      color: '#8b5cf6',
      status: 'Active'
    },
    {
      title: 'Analytics',
      description: 'Revenue and usage analytics',
      icon: BarChart3,
      route: '/admin/analytics',
      color: '#f59e0b',
      status: 'Coming Soon'
    }
  ];

  const stats = [
    { label: 'Total Users', value: '1,247', change: '+12%', color: '#10b981' },
    { label: 'Monthly Revenue', value: '$18,705', change: '+8%', color: '#3b82f6' },
    { label: 'API Cost Ratio', value: '28%', change: '-3%', color: '#10b981' },
    { label: 'Active Subscriptions', value: '892', change: '+15%', color: '#8b5cf6' }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TruckMate AI Admin</Text>
        <Text style={styles.subtitle}>Profit-Optimized Fleet Management Platform</Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={[styles.statChange, { color: stat.color }]}>{stat.change}</Text>
          </View>
        ))}
      </View>

      <View style={styles.alertContainer}>
        <View style={styles.alertCard}>
          <AlertTriangle size={20} color="#f59e0b" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Cost Monitor Active</Text>
            <Text style={styles.alertText}>API costs are within 35% revenue target</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardsContainer}>
        {adminCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Pressable
              key={index}
              style={[styles.card, card.status === 'Coming Soon' && styles.disabledCard]}
              onPress={() => card.status === 'Active' && router.push(card.route)}
              disabled={card.status === 'Coming Soon'}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: card.color + '20' }]}>
                  <IconComponent size={24} color={card.color} />
                </View>
                <View style={[styles.statusBadge, { 
                  backgroundColor: card.status === 'Active' ? '#10b981' : '#6b7280' 
                }]}>
                  <Text style={styles.statusText}>{card.status}</Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#1f2937',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  alertContainer: {
    padding: 16,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  alertContent: {
    marginLeft: 12,
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#92400e',
    marginBottom: 2,
  },
  alertText: {
    fontSize: 14,
    color: '#b45309',
  },
  cardsContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledCard: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#fff',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1f2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
});

export default AdminDashboard;