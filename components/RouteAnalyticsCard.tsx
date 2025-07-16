import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  TrendingUp,
  Clock,
  Fuel,
  DollarSign,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Target,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { RouteAnalytics } from '@/types';

interface RouteAnalyticsCardProps {
  analytics: RouteAnalytics[];
  onAnalyticsPress?: (analytics: RouteAnalytics) => void;
}

const RouteAnalyticsCard: React.FC<RouteAnalyticsCardProps> = ({
  analytics,
  onAnalyticsPress,
}) => {
  if (analytics.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <TrendingUp size={48} color={colors.text.secondary} />
        <Text style={styles.emptyText}>No route analytics yet</Text>
        <Text style={styles.emptySubtext}>
          Complete routes to see performance analytics
        </Text>
      </View>
    );
  }

  const calculateAverages = () => {
    const total = analytics.length;
    const avgDistance = analytics.reduce((sum, a) => sum + a.actualDistance, 0) / total;
    const avgDuration = analytics.reduce((sum, a) => sum + a.actualDuration, 0) / total;
    const avgFuel = analytics.reduce((sum, a) => sum + a.fuelConsumed, 0) / total;
    const avgAccuracy = analytics.reduce((sum, a) => sum + a.accuracyScore, 0) / total;

    return { avgDistance, avgDuration, avgFuel, avgAccuracy };
  };

  const { avgDistance, avgDuration, avgFuel, avgAccuracy } = calculateAverages();

  const renderAnalyticsItem = (item: RouteAnalytics) => {
    const accuracyColor = item.accuracyScore >= 80 ? colors.success : 
                         item.accuracyScore >= 60 ? colors.warning : colors.danger;

    return (
      <TouchableOpacity
        key={item.routeId}
        style={styles.analyticsItem}
        onPress={() => onAnalyticsPress?.(item)}
      >
        <View style={styles.analyticsHeader}>
          <Text style={styles.routeId} numberOfLines={1}>
            Route {item.routeId.slice(-8)}
          </Text>
          <View style={[styles.accuracyBadge, { backgroundColor: accuracyColor }]}>
            <Text style={styles.accuracyText}>
              {item.accuracyScore.toFixed(0)}%
            </Text>
          </View>
        </View>

        <View style={styles.analyticsStats}>
          <View style={styles.statItem}>
            <Navigation size={14} color={colors.text.secondary} />
            <Text style={styles.statValue}>{item.actualDistance.toFixed(0)} mi</Text>
          </View>
          
          <View style={styles.statItem}>
            <Clock size={14} color={colors.text.secondary} />
            <Text style={styles.statValue}>
              {Math.floor(item.actualDuration / 60)}h {Math.floor(item.actualDuration % 60)}m
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Fuel size={14} color={colors.text.secondary} />
            <Text style={styles.statValue}>{item.fuelConsumed.toFixed(1)} gal</Text>
          </View>
        </View>

        {item.delaysEncountered.length > 0 && (
          <View style={styles.delaysInfo}>
            <AlertTriangle size={12} color={colors.warning} />
            <Text style={styles.delaysText}>
              {item.delaysEncountered.length} delay{item.delaysEncountered.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {item.complianceIssues.length === 0 && (
          <View style={styles.complianceInfo}>
            <CheckCircle size={12} color={colors.success} />
            <Text style={styles.complianceText}>No compliance issues</Text>
          </View>
        )}

        <Text style={styles.completedDate}>
          Completed {new Date(item.completedAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={20} color={colors.primary} />
        <Text style={styles.title}>Route Analytics</Text>
        <Text style={styles.count}>({analytics.length})</Text>
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryStats}>
        <View style={styles.summaryItem}>
          <View style={styles.summaryIcon}>
            <Navigation size={16} color={colors.primary} />
          </View>
          <Text style={styles.summaryValue}>{avgDistance.toFixed(0)} mi</Text>
          <Text style={styles.summaryLabel}>Avg Distance</Text>
        </View>

        <View style={styles.summaryItem}>
          <View style={styles.summaryIcon}>
            <Clock size={16} color={colors.secondary} />
          </View>
          <Text style={styles.summaryValue}>
            {Math.floor(avgDuration / 60)}h {Math.floor(avgDuration % 60)}m
          </Text>
          <Text style={styles.summaryLabel}>Avg Duration</Text>
        </View>

        <View style={styles.summaryItem}>
          <View style={styles.summaryIcon}>
            <Fuel size={16} color={colors.warning} />
          </View>
          <Text style={styles.summaryValue}>{avgFuel.toFixed(1)} gal</Text>
          <Text style={styles.summaryLabel}>Avg Fuel</Text>
        </View>

        <View style={styles.summaryItem}>
          <View style={styles.summaryIcon}>
            <Target size={16} color={colors.success} />
          </View>
          <Text style={styles.summaryValue}>{avgAccuracy.toFixed(0)}%</Text>
          <Text style={styles.summaryLabel}>Accuracy</Text>
        </View>
      </View>

      {/* Recent Analytics */}
      <Text style={styles.sectionTitle}>Recent Routes</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {analytics.slice(0, 10).map(renderAnalyticsItem)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  count: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  scrollContent: {
    gap: 12,
  },
  analyticsItem: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    width: 240,
    borderWidth: 1,
    borderColor: colors.border,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeId: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  accuracyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  accuracyText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  analyticsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  delaysInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  delaysText: {
    fontSize: 12,
    color: colors.warning,
  },
  complianceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  complianceText: {
    fontSize: 12,
    color: colors.success,
  },
  completedDate: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default RouteAnalyticsCard;