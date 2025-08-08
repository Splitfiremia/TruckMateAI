import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { BarChart3, PieChart, TrendingUp, AlertCircle, CheckCircle, Clock, MapPin, Fuel, Users, Truck, Calendar, Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import AppBrand from '@/components/AppBrand';

const { width } = Dimensions.get('window');

export default function DashboardOption5() {
  const chartData = [
    { label: 'Mon', value: 85, color: colors.primary },
    { label: 'Tue', value: 92, color: colors.primary },
    { label: 'Wed', value: 78, color: colors.primary },
    { label: 'Thu', value: 96, color: colors.primary },
    { label: 'Fri', value: 88, color: colors.primary },
    { label: 'Sat', value: 94, color: colors.primary },
    { label: 'Sun', value: 90, color: colors.primary },
  ];

  const fleetDistribution = [
    { label: 'Active', value: 24, color: colors.success, percentage: 85 },
    { label: 'Maintenance', value: 3, color: colors.warning, percentage: 11 },
    { label: 'Offline', value: 1, color: colors.danger, percentage: 4 },
  ];

  const topPerformers = [
    { name: 'Mike Johnson', score: 98, metric: 'Safety Score', badge: 'gold' },
    { name: 'Sarah Davis', score: 96, metric: 'Efficiency', badge: 'silver' },
    { name: 'Tom Wilson', score: 94, metric: 'On-Time Rate', badge: 'bronze' },
  ];

  const weeklyInsights = [
    { title: 'Fuel Efficiency Up', value: '+12%', description: 'Compared to last week', icon: TrendingUp, color: colors.success },
    { title: 'Route Optimization', value: '15min', description: 'Average time saved', icon: MapPin, color: colors.primary },
    { title: 'Driver Satisfaction', value: '4.8/5', description: 'Monthly survey results', icon: Star, color: colors.accent },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Dashboard Option 5',
        headerStyle: { backgroundColor: colors.background.secondary },
        headerTintColor: colors.text.primary
      }} />
      
      {/* Analytics Header */}
      <View style={styles.analyticsHeader}>
        <View style={styles.headerTop}>
          <View style={styles.brandContainer}>
            <AppBrand size="medium" showText={false} />
            <View style={styles.brandInfo}>
              <Text style={styles.brandTitle}>TruckMate AI</Text>
              <Text style={styles.brandSubtitle}>Analytics Dashboard</Text>
            </View>
          </View>
          <View style={styles.periodSelector}>
            <Text style={styles.periodText}>This Week</Text>
            <View style={styles.periodIndicator} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Performance Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Performance</Text>
            <TouchableOpacity style={styles.chartTypeButton}>
              <BarChart3 size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartCard}>
            <View style={styles.chartContainer}>
              <View style={styles.chartYAxis}>
                <Text style={styles.axisLabel}>100%</Text>
                <Text style={styles.axisLabel}>75%</Text>
                <Text style={styles.axisLabel}>50%</Text>
                <Text style={styles.axisLabel}>25%</Text>
                <Text style={styles.axisLabel}>0%</Text>
              </View>
              <View style={styles.chartArea}>
                {chartData.map((item, index) => (
                  <View key={index} style={styles.chartColumn}>
                    <View style={styles.chartBarContainer}>
                      <View style={[styles.chartBar, { 
                        height: `${item.value}%`, 
                        backgroundColor: item.color 
                      }]} />
                    </View>
                    <Text style={styles.chartLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.legendText}>Fleet Efficiency %</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Fleet Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fleet Status Distribution</Text>
          <View style={styles.distributionCard}>
            <View style={styles.pieChartContainer}>
              <View style={styles.pieChart}>
                <PieChart size={80} color={colors.primary} />
                <View style={styles.pieChartCenter}>
                  <Text style={styles.pieChartValue}>28</Text>
                  <Text style={styles.pieChartLabel}>Total</Text>
                </View>
              </View>
              <View style={styles.distributionLegend}>
                {fleetDistribution.map((item, index) => (
                  <View key={index} style={styles.distributionItem}>
                    <View style={[styles.distributionDot, { backgroundColor: item.color }]} />
                    <View style={styles.distributionInfo}>
                      <Text style={styles.distributionLabel}>{item.label}</Text>
                      <Text style={styles.distributionValue}>{item.value} vehicles</Text>
                    </View>
                    <Text style={styles.distributionPercentage}>{item.percentage}%</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Top Performers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performers</Text>
          {topPerformers.map((performer, index) => (
            <View key={index} style={styles.performerCard}>
              <View style={styles.performerRank}>
                <View style={[styles.rankBadge, { 
                  backgroundColor: performer.badge === 'gold' ? '#FFD700' : 
                                  performer.badge === 'silver' ? '#C0C0C0' : '#CD7F32' 
                }]}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
              </View>
              <View style={styles.performerInfo}>
                <Text style={styles.performerName}>{performer.name}</Text>
                <Text style={styles.performerMetric}>{performer.metric}</Text>
              </View>
              <View style={styles.performerScore}>
                <Text style={styles.scoreValue}>{performer.score}</Text>
                <Text style={styles.scoreLabel}>Score</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Weekly Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Insights</Text>
          <View style={styles.insightsGrid}>
            {weeklyInsights.map((insight, index) => {
              const IconComp = insight.icon;
              return (
                <View key={index} style={styles.insightCard}>
                  <View style={[styles.insightIcon, { backgroundColor: `${insight.color}15` }]}>
                    <IconComp size={20} color={insight.color} />
                  </View>
                  <Text style={styles.insightValue}>{insight.value}</Text>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDescription}>{insight.description}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Key Metrics Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics Summary</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Truck size={18} color={colors.primary} />
                <Text style={styles.metricChange}>+5%</Text>
              </View>
              <Text style={styles.metricValue}>2,847</Text>
              <Text style={styles.metricLabel}>Total Miles</Text>
            </View>
            
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Fuel size={18} color={colors.warning} />
                <Text style={styles.metricChange}>-8%</Text>
              </View>
              <Text style={styles.metricValue}>$1,234</Text>
              <Text style={styles.metricLabel}>Fuel Cost</Text>
            </View>
            
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Users size={18} color={colors.success} />
                <Text style={styles.metricChange}>+2</Text>
              </View>
              <Text style={styles.metricValue}>18</Text>
              <Text style={styles.metricLabel}>Active Drivers</Text>
            </View>
            
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Calendar size={18} color={colors.accent} />
                <Text style={styles.metricChange}>+12%</Text>
              </View>
              <Text style={styles.metricValue}>96%</Text>
              <Text style={styles.metricLabel}>On-Time Rate</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  analyticsHeader: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandInfo: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  brandSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  periodSelector: {
    alignItems: 'center',
    gap: 4,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  periodIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  chartTypeButton: {
    padding: 8,
    backgroundColor: `${colors.primary}15`,
    borderRadius: 8,
  },
  chartCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200,
    marginBottom: 16,
  },
  chartYAxis: {
    width: 40,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  axisLabel: {
    fontSize: 10,
    color: colors.text.secondary,
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarContainer: {
    height: 160,
    width: 20,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 10,
    color: colors.text.secondary,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  distributionCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  pieChart: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChartCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  pieChartValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  pieChartLabel: {
    fontSize: 10,
    color: colors.text.secondary,
  },
  distributionLegend: {
    flex: 1,
    gap: 12,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distributionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  distributionInfo: {
    flex: 1,
  },
  distributionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  distributionValue: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  distributionPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  performerCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  performerRank: {
    alignItems: 'center',
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  performerMetric: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  performerScore: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.text.secondary,
  },
  insightsGrid: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  insightDescription: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    width: (width - 56) / 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  footer: {
    height: 40,
  },
});