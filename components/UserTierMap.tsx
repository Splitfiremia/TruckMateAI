import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { Users, Crown, User, AlertCircle, DollarSign, Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAdminStore, UserTier } from '@/store/adminStore';

export function UserTierMap() {
  const { users, updateUserTier, isUpdating } = useAdminStore();
  const [selectedUser, setSelectedUser] = useState<UserTier | null>(null);

  const handleTierChange = async (userId: string, newTier: 'trial' | 'paid') => {
    Alert.alert(
      'Change User Tier',
      `Are you sure you want to change this user to ${newTier} tier?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            await updateUserTier(userId, newTier);
            setSelectedUser(null);
          }
        }
      ]
    );
  };

  const getUserStatusColor = (user: UserTier) => {
    if (user.tier === 'trial') return colors.text.secondary;
    if (user.apiCostRatio > 0.3) return colors.error;
    if (user.apiCostRatio > 0.2) return colors.warning;
    return colors.success;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Users color={colors.primary} size={24} />
        <Text style={styles.title}>User Tier Management</Text>
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Crown color={colors.warning} size={16} />
          <Text style={styles.summaryValue}>
            {users.filter(u => u.tier === 'paid').length}
          </Text>
          <Text style={styles.summaryLabel}>Paid Users</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <User color={colors.text.secondary} size={16} />
          <Text style={styles.summaryValue}>
            {users.filter(u => u.tier === 'trial').length}
          </Text>
          <Text style={styles.summaryLabel}>Trial Users</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <AlertCircle color={colors.error} size={16} />
          <Text style={styles.summaryValue}>
            {users.filter(u => u.apiCostRatio > 0.3).length}
          </Text>
          <Text style={styles.summaryLabel}>Over Limit</Text>
        </View>
      </View>

      {/* User List */}
      <ScrollView style={styles.userList} showsVerticalScrollIndicator={false}>
        {users.map((user) => (
          <Pressable
            key={user.id}
            style={[
              styles.userCard,
              selectedUser?.id === user.id && styles.selectedUserCard
            ]}
            onPress={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
          >
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <View style={styles.userTitleRow}>
                  {user.tier === 'paid' ? (
                    <Crown color={colors.warning} size={16} />
                  ) : (
                    <User color={colors.text.secondary} size={16} />
                  )}
                  <Text style={styles.userEmail} numberOfLines={1}>
                    {user.email}
                  </Text>
                </View>
                
                <View style={styles.userMetrics}>
                  <Text style={styles.userMetric}>
                    Revenue: ${user.monthlyRevenue.toFixed(0)}
                  </Text>
                  <Text style={styles.userMetric}>
                    Cost: ${user.apiCosts.toFixed(2)}
                  </Text>
                  <Text style={[
                    styles.userMetric,
                    { color: getUserStatusColor(user) }
                  ]}>
                    Ratio: {(user.apiCostRatio * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.userStatus}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: getUserStatusColor(user) }
                ]} />
                <Text style={[
                  styles.tierBadge,
                  user.tier === 'paid' ? styles.paidBadge : styles.trialBadge
                ]}>
                  {user.tier.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Expanded Details */}
            {selectedUser?.id === user.id && (
              <View style={styles.expandedDetails}>
                <View style={styles.detailRow}>
                  <Calendar color={colors.text.secondary} size={14} />
                  <Text style={styles.detailText}>
                    Joined: {formatDate(user.joinedAt)}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <DollarSign color={colors.text.secondary} size={14} />
                  <Text style={styles.detailText}>
                    Last Active: {formatDate(user.lastActive)}
                  </Text>
                </View>

                {user.apiCostRatio > 0.3 && (
                  <View style={styles.warningRow}>
                    <AlertCircle color={colors.error} size={14} />
                    <Text style={[styles.detailText, { color: colors.error }]}>
                      Exceeding 30% cost threshold
                    </Text>
                  </View>
                )}

                {/* Tier Change Buttons */}
                <View style={styles.actionButtons}>
                  {user.tier === 'trial' ? (
                    <Pressable
                      style={[styles.actionButton, styles.upgradeButton]}
                      onPress={() => handleTierChange(user.id, 'paid')}
                      disabled={isUpdating}
                    >
                      <Crown color={colors.white} size={16} />
                      <Text style={styles.actionButtonText}>Upgrade to Paid</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={[styles.actionButton, styles.downgradeButton]}
                      onPress={() => handleTierChange(user.id, 'trial')}
                      disabled={isUpdating}
                    >
                      <User color={colors.white} size={16} />
                      <Text style={styles.actionButtonText}>Downgrade to Trial</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>

      {users.length === 0 && (
        <View style={styles.emptyState}>
          <Users color={colors.text.secondary} size={48} />
          <Text style={styles.emptyText}>No users found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  summaryItem: {
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  userList: {
    maxHeight: 400,
  },
  userCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  selectedUserCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
  },
  userTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    flex: 1,
  },
  userMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  userMetric: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  userStatus: {
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tierBadge: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paidBadge: {
    backgroundColor: colors.warning,
    color: colors.white,
  },
  trialBadge: {
    backgroundColor: colors.text.secondary,
    color: colors.white,
  },
  expandedDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.error + '10',
    padding: 8,
    borderRadius: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  actionButtons: {
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 6,
  },
  upgradeButton: {
    backgroundColor: colors.success,
  },
  downgradeButton: {
    backgroundColor: colors.text.secondary,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 8,
  },
});