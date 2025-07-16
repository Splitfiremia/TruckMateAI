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
        <View style={styles.titleRow}>
          <Wrench color={severityColor} size={18} />
          <Text style={styles.componentName}>{prediction.componentName}</Text>
          <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
            <Text style={styles.severityText}>{prediction.severity}</Text>
          </View>
        </View>
        <Text style={styles.componentType}>{prediction.componentType}</Text>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {prediction.description}
      </Text>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <View style={styles.metricHeader}>
            <TrendingDown color={conditionColor} size={14} />
            <Text style={styles.metricLabel}>Condition</Text>
          </View>
          <Text style={[styles.metricValue, { color: conditionColor }]}>
            {prediction.currentCondition}%
          </Text>
        </View>

        <View style={styles.metric}>
          <View style={styles.metricHeader}>
            <Clock color={urgencyColor} size={14} />
            <Text style={styles.metricLabel}>Time Left</Text>
          </View>
          <Text style={[styles.metricValue, { color: urgencyColor }]}>
            {formatDate(prediction.predictedFailureDate)}
          </Text>
        </View>

        <View style={styles.metric}>
          <View style={styles.metricHeader}>
            <MapPin color={colors.text.secondary} size={14} />
            <Text style={styles.metricLabel}>Miles</Text>
          </View>
          <Text style={styles.metricValue}>
            {prediction.milesUntilFailure.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.costSection}>
          <DollarSign color={colors.primary} size={16} />
          <Text style={styles.costText}>
            Est. ${prediction.estimatedCost.toLocaleString()}
          </Text>
        </View>
        <View style={styles.confidenceSection}>
          <Text style={styles.confidenceText}>
            {prediction.confidenceLevel}% confidence
          </Text>
        </View>
      </View>

      {prediction.symptoms.length > 0 && (
        <View style={styles.symptomsSection}>
          <Text style={styles.symptomsLabel}>Current Symptoms:</Text>
          <Text style={styles.symptomsText} numberOfLines={2}>
            {prediction.symptoms.join(', ')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  componentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.background.primary,
  },
  componentType: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 26,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  costSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  costText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  confidenceSection: {
    alignItems: 'flex-end',
  },
  confidenceText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  symptomsSection: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    padding: 8,
  },
  symptomsLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  symptomsText: {
    fontSize: 12,
    color: colors.text.primary,
    lineHeight: 16,
  },
});

export default PredictiveMaintenanceCard;