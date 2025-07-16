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
      default: return colors.text.secondary;
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
          <X color={colors.text.secondary} size={16} />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{alert.description}</Text>

      <View style={styles.details}>
        {alert.component && (
          <View style={styles.detailItem}>
            <Wrench color={colors.text.secondary} size={14} />
            <Text style={styles.detailText}>Component: {alert.component}</Text>
          </View>
        )}
        
        {alert.milesUntilFailure && (
          <View style={styles.detailItem}>
            <Clock color={colors.text.secondary} size={14} />
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

      {alert.nearbyShops.length > 0 && (
        <TouchableOpacity style={styles.shopsButton} onPress={handleViewShops}>
          <MapPin color={colors.primary} size={16} />
          <Text style={styles.shopsButtonText}>
            View {alert.nearbyShops.length} Nearby Shop{alert.nearbyShops.length > 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.timestamp}>
        {new Date(alert.createdAt).toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
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
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.background.primary,
  },
  dismissButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  costText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  shopsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    marginBottom: 8,
  },
  shopsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'right',
  },
});

export default MaintenanceAlertCard;