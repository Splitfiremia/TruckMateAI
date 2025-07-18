import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput } from 'react-native';
import { Users, Search, Filter, Crown, Truck, AlertCircle, CheckCircle } from 'lucide-react-native';

interface User {
  id: string;
  name: string;
  email: string;
  tier: 'trial' | 'paid';
  role: 'owner-operator' | 'fleet-company';
  subscriptionStatus: 'active' | 'cancelled' | 'past_due';
  monthlyRevenue: number;
  apiCostRatio: number;
  joinDate: string;
  lastActive: string;
}

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<'all' | 'trial' | 'paid'>('all');

  const users: User[] = [
    {
      id: '1',
      name: 'TransCorp Fleet',
      email: 'admin@transcorp.com',
      tier: 'paid',
      role: 'fleet-company',
      subscriptionStatus: 'active',
      monthlyRevenue: 450,
      apiCostRatio: 0.24,
      joinDate: '2024-01-15',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Mike Johnson',
      email: 'mike.j@email.com',
      tier: 'trial',
      role: 'owner-operator',
      subscriptionStatus: 'active',
      monthlyRevenue: 0,
      apiCostRatio: 0.0,
      joinDate: '2024-07-10',
      lastActive: '1 day ago'
    },
    {
      id: '3',
      name: 'Highway Logistics',
      email: 'ops@highway-log.com',
      tier: 'paid',
      role: 'fleet-company',
      subscriptionStatus: 'past_due',
      monthlyRevenue: 280,
      apiCostRatio: 0.42,
      joinDate: '2024-03-22',
      lastActive: '5 hours ago'
    },
    {
      id: '4',
      name: 'Sarah Martinez',
      email: 'sarah.m@trucking.com',
      tier: 'paid',
      role: 'owner-operator',
      subscriptionStatus: 'active',
      monthlyRevenue: 89,
      apiCostRatio: 0.18,
      joinDate: '2024-05-08',
      lastActive: '30 minutes ago'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === 'all' || user.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const getTierColor = (tier: string) => {
    return tier === 'paid' ? '#3b82f6' : '#6b7280';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'past_due': return '#ef4444';
      case 'cancelled': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getRiskLevel = (ratio: number) => {
    if (ratio >= 0.35) return { level: 'High', color: '#ef4444' };
    if (ratio >= 0.25) return { level: 'Medium', color: '#f59e0b' };
    return { level: 'Low', color: '#10b981' };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const userStats = {
    total: users.length,
    trial: users.filter(u => u.tier === 'trial').length,
    paid: users.filter(u => u.tier === 'paid').length,
    active: users.filter(u => u.subscriptionStatus === 'active').length,
    revenue: users.reduce((sum, u) => sum + u.monthlyRevenue, 0)
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Users size={32} color="#3b82f6" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>User Management</Text>
            <Text style={styles.headerSubtitle}>Manage tiers and subscriptions</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userStats.total}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userStats.paid}</Text>
          <Text style={styles.statLabel}>Paid Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userStats.trial}</Text>
          <Text style={styles.statLabel}>Trial Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatCurrency(userStats.revenue)}</Text>
          <Text style={styles.statLabel}>Monthly Revenue</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filterContainer}>
          <Filter size={20} color="#6b7280" />
          <View style={styles.filterButtons}>
            {(['all', 'trial', 'paid'] as const).map((tier) => (
              <Pressable
                key={tier}
                style={[
                  styles.filterButton,
                  filterTier === tier && styles.activeFilterButton
                ]}
                onPress={() => setFilterTier(tier)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterTier === tier && styles.activeFilterButtonText
                ]}>
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.usersList}>
        {filteredUsers.map((user) => {
          const risk = getRiskLevel(user.apiCostRatio);
          return (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.userName}>{user.name}</Text>
                    {user.role === 'fleet-company' ? (
                      <Truck size={16} color="#6b7280" />
                    ) : (
                      <Crown size={16} color="#6b7280" />
                    )}
                  </View>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                
                <View style={styles.userBadges}>
                  <View style={[styles.tierBadge, { backgroundColor: getTierColor(user.tier) }]}>
                    <Text style={styles.tierText}>{user.tier.toUpperCase()}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.subscriptionStatus) }]}>
                    {user.subscriptionStatus === 'active' ? (
                      <CheckCircle size={12} color="#fff" />
                    ) : (
                      <AlertCircle size={12} color="#fff" />
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.userMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Monthly Revenue</Text>
                  <Text style={styles.metricValue}>{formatCurrency(user.monthlyRevenue)}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Cost Ratio</Text>
                  <Text style={[styles.metricValue, { color: risk.color }]}>
                    {(user.apiCostRatio * 100).toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Risk Level</Text>
                  <Text style={[styles.metricValue, { color: risk.color }]}>
                    {risk.level}
                  </Text>
                </View>
              </View>

              <View style={styles.userFooter}>
                <Text style={styles.userDate}>Joined: {user.joinDate}</Text>
                <Text style={styles.userActivity}>Last active: {user.lastActive}</Text>
              </View>
            </View>
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
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  controls: {
    padding: 16,
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  activeFilterButton: {
    backgroundColor: '#3b82f6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6b7280',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  usersList: {
    padding: 16,
    gap: 16,
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1f2937',
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  userBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#fff',
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1f2937',
  },
  userFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  userDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  userActivity: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default UserManagement;