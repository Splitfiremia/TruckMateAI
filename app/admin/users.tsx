import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Search, Filter, UserCheck, UserX, Crown, Users } from 'lucide-react-native';
import { useAdminStore } from '@/store/adminStore';

export default function UserManagement() {
  const { users, loading, fetchUsers, updateUserTier } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<'all' | 'trial' | 'paid'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === 'all' || user.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const handleTierChange = async (userId: string, newTier: 'trial' | 'paid') => {
    await updateUserTier(userId, newTier);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filterContainer}>
          {['all', 'trial', 'paid'].map((tier) => (
            <Pressable
              key={tier}
              style={[
                styles.filterButton,
                filterTier === tier && styles.filterButtonActive
              ]}
              onPress={() => setFilterTier(tier as any)}
            >
              <Text style={[
                styles.filterButtonText,
                filterTier === tier && styles.filterButtonTextActive
              ]}>
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* User Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Users size={24} color="#117ACA" />
          <Text style={styles.statValue}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <UserCheck size={24} color="#10B981" />
          <Text style={styles.statValue}>{users.filter(u => u.tier === 'paid').length}</Text>
          <Text style={styles.statLabel}>Paid Users</Text>
        </View>
        <View style={styles.statCard}>
          <UserX size={24} color="#F59E0B" />
          <Text style={styles.statValue}>{users.filter(u => u.tier === 'trial').length}</Text>
          <Text style={styles.statLabel}>Trial Users</Text>
        </View>
      </View>

      {/* User List */}
      <View style={styles.userList}>
        {filteredUsers.map((user) => (
          <View key={user.uid} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <View style={styles.userNameRow}>
                  <Text style={styles.userName}>{user.name}</Text>
                  {user.tier === 'paid' && <Crown size={16} color="#FFB81C" />}
                </View>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userMeta}>
                  Joined: {user.created_at} • Last active: {user.last_active}
                </Text>
              </View>
              
              <View style={styles.userActions}>
                <View style={[
                  styles.tierBadge,
                  { backgroundColor: user.tier === 'paid' ? '#10B981' : '#F59E0B' }
                ]}>
                  <Text style={styles.tierBadgeText}>
                    {user.tier.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.userMetrics}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{user.api_usage}</Text>
                <Text style={styles.metricLabel}>API Calls</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>${user.monthly_cost.toFixed(2)}</Text>
                <Text style={styles.metricLabel}>Monthly Cost</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>
                  {user.monthly_cost > 0 ? ((user.api_usage * 0.005) / user.monthly_cost * 100).toFixed(1) : '0'}%
                </Text>
                <Text style={styles.metricLabel}>Cost Ratio</Text>
              </View>
            </View>
            
            <View style={styles.userControls}>
              <Pressable
                style={[
                  styles.controlButton,
                  user.tier === 'trial' ? styles.upgradeButton : styles.downgradeButton
                ]}
                onPress={() => handleTierChange(user.uid, user.tier === 'trial' ? 'paid' : 'trial')}
              >
                <Text style={styles.controlButtonText}>
                  {user.tier === 'trial' ? 'Upgrade to Paid' : 'Downgrade to Trial'}
                </Text>
              </Pressable>
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333333',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F7F7F7',
  },
  filterButtonActive: {
    backgroundColor: '#117ACA',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  userList: {
    padding: 16,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 8,
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 12,
    color: '#999999',
  },
  userActions: {
    alignItems: 'flex-end',
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#117ACA',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  userControls: {
    marginTop: 12,
  },
  controlButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  upgradeButton: {
    backgroundColor: '#10B981',
  },
  downgradeButton: {
    backgroundColor: '#F59E0B',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});