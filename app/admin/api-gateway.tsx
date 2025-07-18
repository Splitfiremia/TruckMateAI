import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Switch } from 'react-native';
import { Settings, Activity, AlertTriangle, CheckCircle, Zap, Globe } from 'lucide-react-native';

interface APIEndpoint {
  id: string;
  name: string;
  service: string;
  tier: 'trial' | 'paid';
  status: 'active' | 'inactive' | 'limited';
  costPerRequest: number;
  requestsToday: number;
  errorRate: number;
  responseTime: number;
  endpoint: string;
}

const APIGatewayControl = () => {
  const [autoScaling, setAutoScaling] = useState(true);
  const [costProtection, setCostProtection] = useState(true);

  const endpoints: APIEndpoint[] = [
    {
      id: '1',
      name: 'Geotab Telematics',
      service: 'Location Tracking',
      tier: 'paid',
      status: 'active',
      costPerRequest: 0.05,
      requestsToday: 12847,
      errorRate: 0.2,
      responseTime: 145,
      endpoint: 'https://my.geotab.com/apiv1'
    },
    {
      id: '2',
      name: 'IP API Location',
      service: 'Location Tracking',
      tier: 'trial',
      status: 'active',
      costPerRequest: 0.001,
      requestsToday: 8934,
      errorRate: 1.2,
      responseTime: 89,
      endpoint: 'https://api.ipapi.com'
    },
    {
      id: '3',
      name: 'Hugging Face AI',
      service: 'Diagnostics',
      tier: 'paid',
      status: 'active',
      costPerRequest: 0.02,
      requestsToday: 5672,
      errorRate: 0.8,
      responseTime: 234,
      endpoint: 'https://api-inference.huggingface.co'
    },
    {
      id: '4',
      name: 'Google AI',
      service: 'Diagnostics',
      tier: 'trial',
      status: 'limited',
      costPerRequest: 0.003,
      requestsToday: 3421,
      errorRate: 0.5,
      responseTime: 178,
      endpoint: 'https://generativelanguage.googleapis.com'
    },
    {
      id: '5',
      name: 'Mapbox Routing',
      service: 'Route Optimization',
      tier: 'paid',
      status: 'active',
      costPerRequest: 0.01,
      requestsToday: 7823,
      errorRate: 0.3,
      responseTime: 112,
      endpoint: 'https://api.mapbox.com'
    },
    {
      id: '6',
      name: 'OSRM Routing',
      service: 'Route Optimization',
      tier: 'trial',
      status: 'active',
      costPerRequest: 0.0,
      requestsToday: 4567,
      errorRate: 2.1,
      responseTime: 298,
      endpoint: 'https://router.project-osrm.org'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'limited': return '#f59e0b';
      case 'inactive': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTierColor = (tier: string) => {
    return tier === 'paid' ? '#3b82f6' : '#6b7280';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 3
    }).format(amount);
  };

  const gatewayStats = {
    totalRequests: endpoints.reduce((sum, ep) => sum + ep.requestsToday, 0),
    totalCost: endpoints.reduce((sum, ep) => sum + (ep.requestsToday * ep.costPerRequest), 0),
    avgResponseTime: endpoints.reduce((sum, ep) => sum + ep.responseTime, 0) / endpoints.length,
    avgErrorRate: endpoints.reduce((sum, ep) => sum + ep.errorRate, 0) / endpoints.length
  };

  const routingRules = [
    {
      name: 'Trial User Routing',
      condition: 'user.tier == "trial"',
      action: 'Route to free/low-cost APIs',
      status: 'active'
    },
    {
      name: 'Cost Breach Protection',
      condition: 'api_ratio >= 0.35',
      action: 'Auto-downgrade to trial APIs',
      status: 'active'
    },
    {
      name: 'High Volume Scaling',
      condition: 'requests > 10000/hour',
      action: 'Load balance across endpoints',
      status: 'active'
    },
    {
      name: 'Error Rate Failover',
      condition: 'error_rate > 5%',
      action: 'Switch to backup endpoint',
      status: 'active'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Settings size={32} color="#8b5cf6" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>API Gateway Control</Text>
            <Text style={styles.headerSubtitle}>Manage routing and cost limits</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Activity size={20} color="#3b82f6" />
          <Text style={styles.statValue}>{gatewayStats.totalRequests.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Requests Today</Text>
        </View>
        <View style={styles.statCard}>
          <Zap size={20} color="#10b981" />
          <Text style={styles.statValue}>{formatCurrency(gatewayStats.totalCost)}</Text>
          <Text style={styles.statLabel}>Daily Cost</Text>
        </View>
        <View style={styles.statCard}>
          <Globe size={20} color="#f59e0b" />
          <Text style={styles.statValue}>{Math.round(gatewayStats.avgResponseTime)}ms</Text>
          <Text style={styles.statLabel}>Avg Response</Text>
        </View>
        <View style={styles.statCard}>
          <AlertTriangle size={20} color="#ef4444" />
          <Text style={styles.statValue}>{gatewayStats.avgErrorRate.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Error Rate</Text>
        </View>
      </View>

      <View style={styles.controlsSection}>
        <Text style={styles.sectionTitle}>Gateway Controls</Text>
        <View style={styles.controlCard}>
          <View style={styles.controlRow}>
            <View style={styles.controlInfo}>
              <Text style={styles.controlTitle}>Auto-Scaling</Text>
              <Text style={styles.controlDescription}>Automatically scale based on demand</Text>
            </View>
            <Switch
              value={autoScaling}
              onValueChange={setAutoScaling}
              trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
              thumbColor={autoScaling ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={styles.controlCard}>
          <View style={styles.controlRow}>
            <View style={styles.controlInfo}>
              <Text style={styles.controlTitle}>Cost Protection</Text>
              <Text style={styles.controlDescription}>Auto-downgrade when cost ratio exceeds 35%</Text>
            </View>
            <Switch
              value={costProtection}
              onValueChange={setCostProtection}
              trackColor={{ false: '#e5e7eb', true: '#10b981' }}
              thumbColor={costProtection ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Endpoints</Text>
        {endpoints.map((endpoint) => (
          <View key={endpoint.id} style={styles.endpointCard}>
            <View style={styles.endpointHeader}>
              <View style={styles.endpointInfo}>
                <Text style={styles.endpointName}>{endpoint.name}</Text>
                <Text style={styles.endpointService}>{endpoint.service}</Text>
              </View>
              <View style={styles.endpointBadges}>
                <View style={[styles.tierBadge, { backgroundColor: getTierColor(endpoint.tier) }]}>
                  <Text style={styles.tierText}>{endpoint.tier.toUpperCase()}</Text>
                </View>
                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(endpoint.status) }]}>
                  {endpoint.status === 'active' ? (
                    <CheckCircle size={12} color="#fff" />
                  ) : (
                    <AlertTriangle size={12} color="#fff" />
                  )}
                </View>
              </View>
            </View>

            <View style={styles.endpointMetrics}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Cost/Request</Text>
                <Text style={styles.metricValue}>{formatCurrency(endpoint.costPerRequest)}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Requests</Text>
                <Text style={styles.metricValue}>{endpoint.requestsToday.toLocaleString()}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Error Rate</Text>
                <Text style={[styles.metricValue, { 
                  color: endpoint.errorRate > 2 ? '#ef4444' : '#10b981' 
                }]}>
                  {endpoint.errorRate}%
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Response</Text>
                <Text style={styles.metricValue}>{endpoint.responseTime}ms</Text>
              </View>
            </View>

            <Text style={styles.endpointUrl}>{endpoint.endpoint}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Routing Rules</Text>
        {routingRules.map((rule, index) => (
          <View key={index} style={styles.ruleCard}>
            <View style={styles.ruleHeader}>
              <Text style={styles.ruleName}>{rule.name}</Text>
              <View style={[styles.ruleStatus, { 
                backgroundColor: rule.status === 'active' ? '#10b981' : '#6b7280' 
              }]}>
                <Text style={styles.ruleStatusText}>{rule.status.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.ruleCondition}>When: {rule.condition}</Text>
            <Text style={styles.ruleAction}>Then: {rule.action}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  controlsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1f2937',
    marginBottom: 16,
  },
  controlCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlInfo: {
    flex: 1,
  },
  controlTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: 4,
  },
  controlDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    padding: 16,
  },
  endpointCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  endpointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  endpointInfo: {
    flex: 1,
  },
  endpointName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: 4,
  },
  endpointService: {
    fontSize: 14,
    color: '#6b7280',
  },
  endpointBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#fff',
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endpointMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1f2937',
  },
  endpointUrl: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'monospace',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 6,
  },
  ruleCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1f2937',
  },
  ruleStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ruleStatusText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#fff',
  },
  ruleCondition: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  ruleAction: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500' as const,
  },
});

export default APIGatewayControl;