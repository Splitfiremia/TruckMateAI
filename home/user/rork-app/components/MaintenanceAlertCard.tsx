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
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>
            <Text style={styles.priorityText}>{alert.priority}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={() => onDismiss(alert.id)}
        >
          <X color={colors.textSecondary} size={20} />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{alert.description}</Text>

      <View style={styles.details}>
        {alert.component && (
          <View style={styles.detailItem}>
            <Wrench color={colors.textSecondary} size={16} />
            <Text style={styles.detailText}>Component: {alert.component}</Text>
          </View>
        )}
        
        {alert.milesUntilFailure && (
          <View style={styles.detailItem}>
            <Clock color={colors.textSecondary} size={16} />
            <Text style={styles.detailText}>
              {alert.milesUntilFailure > 0 
                ? `${alert.milesUntilFailure.toLocaleString()} miles remaining`
                : 'Immediate attention required'
              }
            </Text>
          </View>
        )}

        {alert.estimatedCost > 0 && (
          <View style={styles.detailItem}>
            <Text style={styles.costText}>
              Est. Cost: ${alert.estimatedCost.toLocaleString()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {alert.nearbyShops.length > 0 && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewShops}
          >
            <MapPin color={colors.primary} size={16} />
            <Text style={styles.actionButtonText}>
              View {alert.nearbyShops.length} Nearby Shops
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.timestamp}>
          {new Date(alert.createdAt).toLocaleDateString()}
        </Text>
        {alert.confidence && (
          <Text style={styles.confidence}>
            {Math.round(alert.confidence * 100)}% confidence
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
    marginRight: 12,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.surface,
  },
  dismissButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  details: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  costText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  actions: {
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight + '20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  confidence: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '500',
  },
});

export default MaintenanceAlertCard;