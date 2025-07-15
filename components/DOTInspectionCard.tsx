import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shield, AlertTriangle, TrendingUp, Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useDOTInspectionStore } from '@/store/dotInspectionStore';

interface DOTInspectionCardProps {
  onPress: () => void;
}

export default function DOTInspectionCard({ onPress }: DOTInspectionCardProps) {
  const { currentPrediction, blitzAlerts } = useDOTInspectionStore();
  
  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'High': return colors.danger;
      case 'Medium': return colors.warning;
      case 'Low': return colors.secondary;
      default: return colors.textSecondary;
    }
  };
  
  const hasActiveAlerts = blitzAlerts.length > 0;
  const riskLevel = currentPrediction?.riskLevel || 'Low';
  const probability = currentPrediction?.probability || 15;
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Shield size={20} color={colors.primaryLight} />
          <Text style={styles.title}>DOT Inspection Assistant</Text>
        </View>
        {hasActiveAlerts && (
          <View style={styles.alertBadge}>
            <AlertTriangle size={12} color={colors.text} />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.predictionContainer}>
          <View style={styles.riskContainer}>
            <Text style={styles.riskLabel}>Risk Level:</Text>
            <View style={[styles.riskBadge, { backgroundColor: getRiskColor(riskLevel) }]}>
              <Text style={styles.riskText}>{riskLevel}</Text>
            </View>
          </View>
          
          <View style={styles.probabilityContainer}>
            <TrendingUp size={16} color={colors.primaryLight} />
            <Text style={styles.probabilityText}>{probability}% chance</Text>
          </View>
        </View>
        
        {currentPrediction?.nextLikelyLocation && (
          <View style={styles.locationContainer}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={styles.locationText} numberOfLines={1}>
              Next likely: {currentPrediction.nextLikelyLocation}
            </Text>
          </View>
        )}
        
        {hasActiveAlerts && (
          <View style={styles.alertContainer}>
            <AlertTriangle size={14} color={colors.warning} />
            <Text style={styles.alertText}>
              {blitzAlerts.length} active inspection blitz alert{blitzAlerts.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Tap for AI guidance & tips</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  alertBadge: {
    backgroundColor: colors.warning,
    borderRadius: 10,
    padding: 4,
  },
  content: {
    marginBottom: 12,
  },
  predictionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  riskLabel: {
    fontSize: 14,
    color: colors.text,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  probabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  probabilityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryLight,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  alertText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});