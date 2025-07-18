import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Shield } from 'lucide-react-native';
import { useAdminStore } from '@/store/adminStore';

const { width } = Dimensions.get('window');

export default function CostControl() {
  const { costHistory, metrics, fetchCostHistory } = useAdminStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    fetchCostHistory();
  }, []);

  const currentRatio = metrics.costRatio;
  const isOverThreshold = currentRatio > 0.35;
  const trend = costHistory.length > 1 ? 
    costHistory[costHistory.length - 1].ratio - costHistory[costHistory.length - 2].ratio : 0;

  const maxRatio = Math.max(...costHistory.map(d => d.ratio));
  const chartWidth = width - 64;
  const chartHeight = 120;

  return (
    <ScrollView style={styles.container}>
      {/* Cost Ratio Alert */}
      {isOverThreshold && (
        <View style={styles.alertCard}>
          <AlertTriangle size={24} color="#E5252C" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Cost Breach Alert</Text>
            <Text style={styles.alertText}>
              Current cost ratio ({(currentRatio * 100).toFixed(1)}%) exceeds the 35% threshold.
              Auto-downgrade has been activated for new users.
            </Text>
          </View>
        </View>
      )}

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <View style={[styles.metricCard, isOverThreshold && styles.metricCardDanger]}>
          <View style={styles.metricHeader}>
            <DollarSign size={24} color={isOverThreshold ? "#E5252C" : "#117ACA"} />
            <View style={styles.trendIndicator}>
              {trend > 0 ? (
                <TrendingUp size={16} color="#E5252C" />
              ) : (
                <TrendingDown size={16} color="#10B981" />
              )}
            </View>
          </View>
          <Text style={[styles.metricValue, isOverThreshold && styles.metricValueDanger]}>
            {(currentRatio * 100).toFixed(1)}%
          </Text>
          <Text style={styles.metricLabel}>Current Cost Ratio</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${Math.min(currentRatio * 100 / 35 * 100, 100)}%`,
                    backgroundColor: isOverThreshold ? "#E5252C" : "#117ACA"
                  }
                ]} 
              />
              <View style={styles.thresholdLine} />
            </View>
            <Text style={styles.thresholdText}>35% Threshold</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <Shield size={24} color="#10B981" />
          <Text style={styles.metricValue}>${metrics.dailyApiCost.toFixed(2)}</Text>
          <Text style={styles.metricLabel}>Daily API Cost</Text>
        </View>

        <View style={styles.metricCard}>
          <TrendingUp size={24} color="#FFB81C" />
          <Text style={styles.metricValue}>${metrics.monthlyRevenue.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Monthly Revenue</Text>
        </View>
      </View>

      {/* Cost History Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Cost Ratio Trend (Last 7 Days)</Text>
        <View style={styles.chart}>
          <View style={styles.chartGrid}>
            {/* Threshold line */}
            <View style={[styles.thresholdGridLine, { top: chartHeight * (1 - 0.35 / maxRatio) }]} />
            <Text style={[styles.thresholdGridLabel, { top: chartHeight * (1 - 0.35 / maxRatio) - 10 }]}>
              35%
            </Text>
          </View>
          
          <View style={styles.chartBars}>
            {costHistory.map((data, index) => {
              const barHeight = (data.ratio / maxRatio) * chartHeight;
              const isLast = index === costHistory.length - 1;
              
              return (
                <View key={index} style={styles.chartBarContainer}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: barHeight,
                        backgroundColor: data.ratio > 0.35 ? "#E5252C" : "#117ACA",
                        opacity: isLast ? 1 : 0.7,
                      }
                    ]}
                  />
                  <Text style={styles.chartBarLabel}>
                    {new Date(data.date).getDate()}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#117ACA" }]} />
            <Text style={styles.legendText}>Within Threshold</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#E5252C" }]} />
            <Text style={styles.legendText}>Over Threshold</Text>
          </View>
        </View>
      </View>

      {/* Cost Breakdown */}
      <View style={styles.breakdownContainer}>
        <Text style={styles.sectionTitle}>Cost Breakdown by Service</Text>
        
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.breakdownService}>Location Services</Text>
            <Text style={styles.breakdownCost}>$89.20</Text>
          </View>
          <View style={styles.breakdownBar}>
            <View style={[styles.breakdownFill, { width: '48%', backgroundColor: '#117ACA' }]} />
          </View>
          <Text style={styles.breakdownDetails}>Trial: $32.10 • Paid: $57.10</Text>
        </View>
        
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.breakdownService}>AI Diagnostics</Text>
            <Text style={styles.breakdownCost}>$67.80</Text>
          </View>
          <View style={styles.breakdownBar}>
            <View style={[styles.breakdownFill, { width: '36%', backgroundColor: '#10B981' }]} />
          </View>
          <Text style={styles.breakdownDetails}>Trial: $18.40 • Paid: $49.40</Text>
        </View>
        
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.breakdownService}>Weather Data</Text>
            <Text style={styles.breakdownCost}>$29.50</Text>
          </View>
          <View style={styles.breakdownBar}>
            <View style={[styles.breakdownFill, { width: '16%', backgroundColor: '#FFB81C' }]} />
          </View>
          <Text style={styles.breakdownDetails}>Trial: $12.20 • Paid: $17.30</Text>
        </View>
      </View>

      {/* Cost Control Rules */}
      <View style={styles.rulesContainer}>
        <Text style={styles.sectionTitle}>Active Cost Control Rules</Text>
        
        <View style={styles.ruleCard}>
          <View style={styles.ruleHeader}>
            <Text style={styles.ruleName}>Auto-Downgrade Protection</Text>
            <View style={[styles.ruleStatus, { backgroundColor: isOverThreshold ? '#E5252C' : '#10B981' }]}>
              <Text style={styles.ruleStatusText}>
                {isOverThreshold ? 'ACTIVE' : 'MONITORING'}
              </Text>
            </View>
          </View>
          <Text style={styles.ruleDescription}>
            Automatically downgrade paid users to trial APIs when cost ratio exceeds 35%
          </Text>
        </View>
        
        <View style={styles.ruleCard}>
          <View style={styles.ruleHeader}>
            <Text style={styles.ruleName}>Daily Cost Limit</Text>
            <View style={[styles.ruleStatus, { backgroundColor: '#117ACA' }]}>
              <Text style={styles.ruleStatusText}>ACTIVE</Text>
            </View>
          </View>
          <Text style={styles.ruleDescription}>
            Prevent daily API costs from exceeding $200 by throttling requests
          </Text>
        </View>
        
        <View style={styles.ruleCard}>
          <View style={styles.ruleHeader}>
            <Text style={styles.ruleName}>Revenue-Based Scaling</Text>
            <View style={[styles.ruleStatus, { backgroundColor: '#10B981' }]}>
              <Text style={styles.ruleStatusText}>ACTIVE</Text>
            </View>
          </View>
          <Text style={styles.ruleDescription}>
            Scale API usage limits based on monthly recurring revenue
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#E5252C',
  },
  alertContent: {
    marginLeft: 12,
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E5252C',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: '#666666',
  },
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  metricCardDanger: {
    borderWidth: 2,
    borderColor: '#E5252C',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendIndicator: {
    padding: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#117ACA',
    marginBottom: 4,
  },
  metricValueDanger: {
    color: '#E5252C',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  thresholdLine: {
    position: 'absolute',
    right: '35%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#E5252C',
  },
  thresholdText: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'right',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  chart: {
    height: 120,
    position: 'relative',
  },
  chartGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  thresholdGridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E5252C',
    borderStyle: 'dashed',
  },
  thresholdGridLabel: {
    position: 'absolute',
    right: 0,
    fontSize: 10,
    color: '#E5252C',
    fontWeight: 'bold',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
  },
  chartBar: {
    width: '80%',
    borderRadius: 2,
  },
  chartBarLabel: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666666',
  },
  breakdownContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  breakdownCard: {
    marginBottom: 16,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownService: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  breakdownCost: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#117ACA',
  },
  breakdownBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginBottom: 4,
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 3,
  },
  breakdownDetails: {
    fontSize: 12,
    color: '#666666',
  },
  rulesContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  ruleCard: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  ruleStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ruleStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  ruleDescription: {
    fontSize: 12,
    color: '#666666',
  },
});