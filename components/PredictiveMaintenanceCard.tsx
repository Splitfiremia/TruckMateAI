import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {
  Calendar,
  MapPin,
  TrendingDown,
  Wrench,
  AlertTriangle,
  Clock,
  DollarSign
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { MaintenancePrediction } from '@/types';

interface PredictiveMaintenanceCardProps {
  prediction: MaintenancePrediction;
  onPress: (prediction: MaintenancePrediction) => void;
}

const PredictiveMaintenanceCard: React.FC<PredictiveMaintenanceCardProps> = ({
  prediction,
  onPress
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return colors.danger;
      case 'High': return colors.warning;
      case 'Medium': return colors.primaryLight;
      case 'Low': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  const getUrgencyColor = (milesUntilFailure: number) => {
    if (milesUntilFailure < 1000) return colors.danger;
    if (milesUntilFailure < 3000) return colors.warning;
    return colors.secondary;
  };

  const getConditionColor = (condition: number) => {
    if (condition > 70) return colors.secondary;
    if (condition > 40) return colors.warning;
    return colors.danger;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
    return `${Math.ceil(diffDays / 30)} months`;
  };

  const severityColor = getSeverityColor(prediction.severity);
  const urgencyColor = getUrgencyColor(prediction.milesUntilFailure);
  const conditionColor = getConditionColor(prediction.currentCondition);

  return (
    <TouchableOpacity 
      style={[styles.container, { borderLeftColor: severityColor }]}
      onPress={() => onPress(prediction)}
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.systemName}>{prediction.component}</Text>
          <View style={[styles.severityBadge, { backgroundColor: severityColor + '20' }]}>
            <Text style={[styles.severityText, { color: severityColor }]}>
              {prediction.severity}
            </Text>
          </View>
        </View>
        <View style={styles.conditionSection}>
          <Text style={styles.conditionLabel}>Condition</Text>
          <Text style={[styles.conditionValue, { color: conditionColor }]}>
            {prediction.currentCondition}%
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{prediction.description}</Text>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <TrendingDown color={urgencyColor} size={16} />
          <Text style={styles.detailText}>
            {prediction.milesUntilFailure.toLocaleString()} miles remaining
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Calendar color={colors.textSecondary} size={16} />
          <Text style={styles.detailText}>
            Expected: {formatDate(prediction.predictedFailureDate)}
          </Text>
        </View>

        {prediction.estimatedCost > 0 && (
          <View style={styles.detailRow}>
            <DollarSign color={colors.textSecondary} size={16} />
            <Text style={styles.detailText}>
              Est. ${prediction.estimatedCost.toLocaleString()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actionSection}>
        <View style={styles.actionInfo}>
          <Wrench color={colors.primary} size={16} />
          <Text style={styles.actionText}>{prediction.recommendations[0] || 'Schedule maintenance'}</Text>
        </View>
        <View style={[styles.confidenceBadge, { backgroundColor: colors.primaryLight + '20' }]}>
          <Text style={[styles.confidenceText, { color: colors.primary }]}>
            {prediction.confidenceLevel}% confidence
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: colors.black,
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
  titleSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  systemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  conditionSection: {
    alignItems: 'flex-end',
  },
  conditionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  conditionValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundSecondary,
  },
  actionInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    flex: 1,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default PredictiveMaintenanceCard;