import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  AlertTriangle,
  Clock,
  MapPin,
  Wrench,
  X
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { MaintenanceAlert } from '@/types';

interface MaintenanceAlertCardProps {
  alert: MaintenanceAlert;
  onDismiss: (alertId: string) => void;
  onViewShops: (alert: MaintenanceAlert) => void;
}

const MaintenanceAlertCard: React.FC<MaintenanceAlertCardProps> = ({
  alert,
  onDismiss,
  onViewShops
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return colors.danger;
      case 'High': return colors.warning;
      case 'Medium': return colors.primaryLight;
      case 'Low': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Prediction': return AlertTriangle;
      case 'Immediate': return AlertTriangle;
      case 'Scheduled': return Clock;
      case 'Overdue': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const TypeIcon = getTypeIcon(alert.type);
  const priorityColor = getPriorityColor(alert.priority);

  const handleViewShops = () => {
    if (alert.nearbyShops.length > 0 || alert.estimatedCost > 0) {
      onViewShops(alert);
    } else {
      Alert.alert(
        'No Shops Available',
        'No nearby repair shops found for this service. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={[styles.container, { borderLeftColor: priorityColor }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <TypeIcon color={priorityColor} size={18} />
          <Text style={styles.title}>{alert.title}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {alert.priority}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={() => onDismiss(alert.id)}
        >
          <X color={colors.textSecondary} size={16} />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{alert.description}</Text>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Clock color={colors.textSecondary} size={14} />
          <Text style={styles.detailText}>
            {alert.type === 'Prediction' 
              ? `In ${alert.milesUntilFailure?.toLocaleString()} miles`
              : alert.dueDate
            }
          </Text>
        </View>
        
        {alert.estimatedCost > 0 && (
          <View style={styles.detailItem}>
            <Wrench color={colors.textSecondary} size={14} />
            <Text style={styles.detailText}>
              Est. ${alert.estimatedCost.toLocaleString()}
            </Text>
          </View>
        )}

        {alert.nearbyShops.length > 0 && (
          <View style={styles.detailItem}>
            <MapPin color={colors.textSecondary} size={14} />
            <Text style={styles.detailText}>
              {alert.nearbyShops.length} shops nearby
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleViewShops}
        >
          <MapPin color={colors.primary} size={16} />
          <Text style={styles.secondaryButtonText}>View Shops</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => {
            // Handle schedule maintenance
            Alert.alert(
              'Schedule Maintenance',
              'This feature will be available soon.',
              [{ text: 'OK' }]
            );
          }}
        >
          <Clock color={colors.white} size={16} />
          <Text style={styles.primaryButtonText}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dismissButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.primaryLight + '20',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default MaintenanceAlertCard;