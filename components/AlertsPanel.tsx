import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { AlertTriangle, CheckCircle, Clock, X, Filter } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAdminStore, CostAlert } from '@/store/adminStore';

export function AlertsPanel() {
  const { alerts, unreadAlerts, resolveAlert } = useAdminStore();
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'high'>('unresolved');

  const getFilteredAlerts = () => {
    switch (filter) {
      case 'unresolved':
        return alerts.filter(alert => !alert.resolved);
      case 'high':
        return alerts.filter(alert => alert.severity === 'high' && !alert.resolved);
      default:
        return alerts;
    }
  };

  const getSeverityColor = (severity: CostAlert['severity']) => {
    switch (severity) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.text.secondary;
      default:
        return colors.text.secondary;
    }
  };

  const getSeverityIcon = (severity: CostAlert['severity']) => {
    switch (severity) {
      case 'high':
        return AlertTriangle;
      case 'medium':
        return AlertTriangle;
      case 'low':
        return Clock;
      default:
        return Clock;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AlertTriangle color={colors.primary} size={24} />
        <Text style={styles.title}>System Alerts</Text>
        
        {unreadAlerts > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadAlerts}</Text>
          </View>
        )}
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        <Pressable
          style={[
            styles.filterButton,
            filter === 'unresolved' && styles.activeFilter
          ]}
          onPress={() => setFilter('unresolved')}
        >
          <Text style={[
            styles.filterText,
            filter === 'unresolved' && styles.activeFilterText
          ]}>
            Unresolved ({alerts.filter(a => !a.resolved).length})
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.filterButton,
            filter === 'high' && styles.activeFilter
          ]}
          onPress={() => setFilter('high')}
        >
          <Text style={[
            styles.filterText,
            filter === 'high' && styles.activeFilterText
          ]}>
            High Priority ({alerts.filter(a => a.severity === 'high' && !a.resolved).length})
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.filterButton,
            filter === 'all' && styles.activeFilter
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterText,
            filter === 'all' && styles.activeFilterText
          ]}>
            All ({alerts.length})
          </Text>
        </Pressable>
      </View>

      {/* Alerts List */}
      <ScrollView style={styles.alertsList} showsVerticalScrollIndicator={false}>
        {filteredAlerts.map((alert) => {
          const SeverityIcon = getSeverityIcon(alert.severity);
          const severityColor = getSeverityColor(alert.severity);
          
          return (
            <View
              key={alert.id}
              style={[
                styles.alertCard,
                alert.resolved && styles.resolvedAlert
              ]}
            >
              <View style={styles.alertHeader}>
                <View style={styles.alertInfo}>
                  <SeverityIcon color={severityColor} size={16} />
                  <Text style={[
                    styles.alertType,
                    { color: severityColor }
                  ]}>
                    {alert.type.replace('_', ' ').toUpperCase()}
                  </Text>
                  <Text style={styles.alertTime}>
                    {formatTimestamp(alert.timestamp)}
                  </Text>
                </View>
                
                {!alert.resolved && (
                  <Pressable
                    style={styles.resolveButton}
                    onPress={() => resolveAlert(alert.id)}
                  >
                    <CheckCircle color={colors.success} size={16} />
                  </Pressable>
                )}
                
                {alert.resolved && (
                  <View style={styles.resolvedIcon}>
                    <CheckCircle color={colors.success} size={16} />
                  </View>
                )}
              </View>
              
              <Text style={[
                styles.alertMessage,
                alert.resolved && styles.resolvedText
              ]}>
                {alert.message}
              </Text>
              
              {alert.userId !== 'system' && (
                <Text style={styles.alertUser}>
                  User ID: {alert.userId}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      {filteredAlerts.length === 0 && (
        <View style={styles.emptyState}>
          <CheckCircle color={colors.success} size={48} />
          <Text style={styles.emptyTitle}>All Clear!</Text>
          <Text style={styles.emptyText}>
            {filter === 'unresolved' 
              ? 'No unresolved alerts at this time'
              : filter === 'high'
              ? 'No high priority alerts'
              : 'No alerts found'
            }
          </Text>
        </View>
      )}

      {/* Alert Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Alert Summary</Text>
        
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {alerts.filter(a => a.severity === 'high' && !a.resolved).length}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.error }]}>High</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {alerts.filter(a => a.severity === 'medium' && !a.resolved).length}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.warning }]}>Medium</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {alerts.filter(a => a.severity === 'low' && !a.resolved).length}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Low</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {alerts.filter(a => a.resolved).length}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.success }]}>Resolved</Text>
          </View>
        </View>
      </View>
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
    flex: 1,
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilter: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  activeFilterText: {
    color: colors.white,
  },
  alertsList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  alertCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  resolvedAlert: {
    opacity: 0.6,
    backgroundColor: colors.background.secondary,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  alertType: {
    fontSize: 12,
    fontWeight: '600',
  },
  alertTime: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  resolveButton: {
    padding: 4,
  },
  resolvedIcon: {
    padding: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 18,
    marginBottom: 4,
  },
  resolvedText: {
    color: colors.text.secondary,
  },
  alertUser: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.success,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
  summary: {
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});