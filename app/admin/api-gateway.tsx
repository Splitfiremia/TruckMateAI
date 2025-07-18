import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { Shield, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react-native';
import { useAdminStore } from '@/store/adminStore';

export default function ApiGateway() {
  const { apiEndpoints, toggleApiEndpoint } = useAdminStore();
  const [selectedTier, setSelectedTier] = useState<'all' | 'trial' | 'paid'>('all');

  const filteredEndpoints = apiEndpoints.filter(endpoint => 
    selectedTier === 'all' || endpoint.tier === selectedTier
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={20} color="#10B981" />;
      case 'inactive':
        return <AlertCircle size={20} color="#F59E0B" />;
      case 'error':
        return <AlertCircle size={20} color="#E5252C" />;
      default:
        return <Clock size={20} color="#666666" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'inactive':
        return '#F59E0B';
      case 'error':
        return '#E5252C';
      default:
        return '#666666';
    }
  };

  const totalRequests = apiEndpoints.reduce((sum, endpoint) => sum + endpoint.requests_today, 0);
  const totalCost = apiEndpoints.reduce((sum, endpoint) => sum + (endpoint.requests_today * endpoint.cost_per_request), 0);
  const activeEndpoints = apiEndpoints.filter(e => e.status === 'active').length;

  return (
    <ScrollView style={styles.container}>
      {/* Gateway Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Shield size={24} color="#117ACA" />
          <Text style={styles.statValue}>{activeEndpoints}/{apiEndpoints.length}</Text>
          <Text style={styles.statLabel}>Active Endpoints</Text>
        </View>
        <View style={styles.statCard}>
          <Activity size={24} color="#10B981" />
          <Text style={styles.statValue}>{totalRequests.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Requests Today</Text>
        </View>
        <View style={styles.statCard}>
          <AlertCircle size={24} color="#FFB81C" />
          <Text style={styles.statValue}>${totalCost.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Daily Cost</Text>
        </View>
      </View>

      {/* Tier Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filter by Tier:</Text>
        <View style={styles.filterButtons}>
          {['all', 'trial', 'paid'].map((tier) => (
            <Pressable
              key={tier}
              style={[
                styles.filterButton,
                selectedTier === tier && styles.filterButtonActive
              ]}
              onPress={() => setSelectedTier(tier as any)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedTier === tier && styles.filterButtonTextActive
              ]}>
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* API Endpoints */}
      <View style={styles.endpointsContainer}>
        <Text style={styles.sectionTitle}>API Endpoints</Text>
        
        {filteredEndpoints.map((endpoint, index) => (
          <View key={index} style={styles.endpointCard}>
            <View style={styles.endpointHeader}>
              <View style={styles.endpointInfo}>
                <View style={styles.endpointTitleRow}>
                  <Text style={styles.endpointName}>{endpoint.name}</Text>
                  <View style={[
                    styles.tierBadge,
                    { backgroundColor: endpoint.tier === 'paid' ? '#10B981' : '#F59E0B' }
                  ]}>
                    <Text style={styles.tierBadgeText}>
                      {endpoint.tier.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.endpointUrl}>{endpoint.url}</Text>
              </View>
              
              <View style={styles.endpointControls}>
                <View style={styles.statusRow}>
                  {getStatusIcon(endpoint.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(endpoint.status) }]}>
                    {endpoint.status.toUpperCase()}
                  </Text>
                </View>
                <Switch
                  value={endpoint.status === 'active'}
                  onValueChange={() => toggleApiEndpoint(endpoint.name)}
                  trackColor={{ false: '#E5E5E5', true: '#117ACA' }}
                  thumbColor={endpoint.status === 'active' ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            </View>
            
            <View style={styles.endpointMetrics}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{endpoint.requests_today.toLocaleString()}</Text>
                <Text style={styles.metricLabel}>Requests Today</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>${endpoint.cost_per_request.toFixed(4)}</Text>
                <Text style={styles.metricLabel}>Cost per Request</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>
                  ${(endpoint.requests_today * endpoint.cost_per_request).toFixed(2)}
                </Text>
                <Text style={styles.metricLabel}>Daily Cost</Text>
              </View>
            </View>
            
            {/* Usage Chart Placeholder */}
            <View style={styles.usageChart}>
              <Text style={styles.chartTitle}>24h Usage Pattern</Text>
              <View style={styles.chartBars}>
                {Array.from({ length: 24 }, (_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.chartBar,
                      { height: Math.random() * 40 + 10 }
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Gateway Rules */}
      <View style={styles.rulesContainer}>
        <Text style={styles.sectionTitle}>Gateway Rules</Text>
        
        <View style={styles.ruleCard}>
          <View style={styles.ruleHeader}>
            <Text style={styles.ruleName}>Trial User Routing</Text>
            <View style={styles.ruleStatus}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.ruleStatusText}>Active</Text>
            </View>
          </View>
          <Text style={styles.ruleDescription}>
            Route trial users to cost-effective APIs (ipapi, Google AI, OpenWeather)
          </Text>
          <Text style={styles.ruleCondition}>
            Condition: user.tier == 'trial'
          </Text>
        </View>
        
        <View style={styles.ruleCard}>
          <View style={styles.ruleHeader}>
            <Text style={styles.ruleName}>Paid User Routing</Text>
            <View style={styles.ruleStatus}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.ruleStatusText}>Active</Text>
            </View>
          </View>
          <Text style={styles.ruleDescription}>
            Route paid users to premium APIs when cost ratio {'<'} 35%
          </Text>
          <Text style={styles.ruleCondition}>
            Condition: user.tier == 'paid' && api_ratio {'<'} 0.35
          </Text>
        </View>
        
        <View style={styles.ruleCard}>
          <View style={styles.ruleHeader}>
            <Text style={styles.ruleName}>Cost Breach Fallback</Text>
            <View style={styles.ruleStatus}>
              <AlertCircle size={16} color="#F59E0B" />
              <Text style={styles.ruleStatusText}>Monitoring</Text>
            </View>
          </View>
          <Text style={styles.ruleDescription}>
            Auto-downgrade users to trial APIs when cost ratio exceeds 35%
          </Text>
          <Text style={styles.ruleCondition}>
            Condition: api_ratio {'>='} 0.35
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F7F7F7',
  },
  filterButtonActive: {
    backgroundColor: '#117ACA',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  endpointsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  endpointCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  endpointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  endpointInfo: {
    flex: 1,
  },
  endpointTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  endpointName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 12,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tierBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  endpointUrl: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
  },
  endpointControls: {
    alignItems: 'flex-end',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  endpointMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#117ACA',
  },
  metricLabel: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  usageChart: {
    marginTop: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 50,
  },
  chartBar: {
    flex: 1,
    backgroundColor: '#117ACA',
    marginHorizontal: 1,
    borderRadius: 1,
    opacity: 0.7,
  },
  rulesContainer: {
    padding: 16,
  },
  ruleCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  ruleStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ruleStatusText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  ruleDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  ruleCondition: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'monospace',
    backgroundColor: '#F7F7F7',
    padding: 8,
    borderRadius: 4,
  },
});