import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Download, FileText, Activity, AlertTriangle, TrendingUp, Database } from 'lucide-react-native';
import { useAdminStore } from '@/store/adminStore';
import { apiReportingService, DetailedApiReport, ApiReport } from '@/services/apiReportingService';

export default function ApiReports() {
  const { apiEndpoints } = useAdminStore();
  const [currentReport, setCurrentReport] = useState<DetailedApiReport | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'deprecated' | 'error' | 'high-cost'>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateReport();
  }, [apiEndpoints]);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const report = apiReportingService.generateDetailedReport(apiEndpoints);
      setCurrentReport(report);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate API report');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = async () => {
    if (!currentReport) return;
    
    try {
      await apiReportingService.downloadReport(currentReport);
      Alert.alert('Success', 'API report downloaded successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to download report');
    }
  };

  const getFilteredApis = (): ApiReport[] => {
    if (!currentReport) return [];

    switch (selectedFilter) {
      case 'active':
        return apiReportingService.getApisByStatus(currentReport.apis, 'active');
      case 'deprecated':
        return apiReportingService.getApisByStatus(currentReport.apis, 'deprecated');
      case 'error':
        return apiReportingService.getApisByStatus(currentReport.apis, 'error');
      case 'high-cost':
        return apiReportingService.getHighCostApis(currentReport.apis, 50);
      default:
        return currentReport.apis;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'deprecated':
        return '#F59E0B';
      case 'error':
        return '#E5252C';
      case 'inactive':
        return '#6B7280';
      default:
        return '#666666';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return '#10B981';
    if (score >= 70) return '#F59E0B';
    return '#E5252C';
  };

  if (!currentReport) {
    return (
      <View style={styles.loadingContainer}>
        <Activity size={48} color="#117ACA" />
        <Text style={styles.loadingText}>Generating API Report...</Text>
      </View>
    );
  }

  const filteredApis = getFilteredApis();

  return (
    <ScrollView style={styles.container}>
      {/* Report Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>API Performance Report</Text>
          <Text style={styles.subtitle}>
            Generated: {new Date(currentReport.generated_at).toLocaleString()}
          </Text>
          <Text style={styles.version}>Version {currentReport.report_version}</Text>
        </View>
        
        <Pressable style={styles.downloadButton} onPress={downloadReport}>
          <Download size={20} color="#FFFFFF" />
          <Text style={styles.downloadButtonText}>Export JSON</Text>
        </Pressable>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Database size={24} color="#117ACA" />
          <Text style={styles.summaryValue}>{currentReport.total_apis}</Text>
          <Text style={styles.summaryLabel}>Total APIs</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Activity size={24} color="#10B981" />
          <Text style={styles.summaryValue}>{currentReport.active_apis}</Text>
          <Text style={styles.summaryLabel}>Active</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <AlertTriangle size={24} color="#F59E0B" />
          <Text style={styles.summaryValue}>{currentReport.deprecated_apis}</Text>
          <Text style={styles.summaryLabel}>Deprecated</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <TrendingUp size={24} color={getHealthScoreColor(currentReport.summary.health_score)} />
          <Text style={[styles.summaryValue, { color: getHealthScoreColor(currentReport.summary.health_score) }]}>
            {currentReport.summary.health_score}%
          </Text>
          <Text style={styles.summaryLabel}>Health Score</Text>
        </View>
      </View>

      {/* Cost Summary */}
      <View style={styles.costSummaryContainer}>
        <Text style={styles.sectionTitle}>30-Day Cost Summary</Text>
        
        <View style={styles.costBreakdown}>
          <View style={styles.costItem}>
            <Text style={styles.costLabel}>Trial Tier</Text>
            <Text style={styles.costValue}>${currentReport.summary.cost_by_tier.trial}</Text>
            <Text style={styles.costRequests}>
              {currentReport.summary.requests_by_tier.trial.toLocaleString()} requests
            </Text>
          </View>
          
          <View style={styles.costItem}>
            <Text style={styles.costLabel}>Paid Tier</Text>
            <Text style={styles.costValue}>${currentReport.summary.cost_by_tier.paid}</Text>
            <Text style={styles.costRequests}>
              {currentReport.summary.requests_by_tier.paid.toLocaleString()} requests
            </Text>
          </View>
          
          <View style={[styles.costItem, styles.totalCost]}>
            <Text style={styles.costLabel}>Total Cost</Text>
            <Text style={[styles.costValue, styles.totalCostValue]}>
              ${currentReport.total_cost_30d.toFixed(2)}
            </Text>
            <Text style={styles.costRequests}>
              {currentReport.total_requests_30d.toLocaleString()} total requests
            </Text>
          </View>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filter APIs:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {[
            { key: 'all', label: 'All APIs' },
            { key: 'active', label: 'Active' },
            { key: 'deprecated', label: 'Deprecated' },
            { key: 'error', label: 'Error' },
            { key: 'high-cost', label: 'High Cost' },
          ].map((filter) => (
            <Pressable
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter.key as any)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === filter.key && styles.filterButtonTextActive
              ]}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* API Details */}
      <View style={styles.apisContainer}>
        <Text style={styles.sectionTitle}>
          API Details ({filteredApis.length} {filteredApis.length === 1 ? 'API' : 'APIs'})
        </Text>
        
        {filteredApis.map((api, index) => (
          <View key={index} style={styles.apiCard}>
            <View style={styles.apiHeader}>
              <View style={styles.apiInfo}>
                <Text style={styles.apiName}>{api.api_name}</Text>
                <Text style={styles.apiUrl}>{api.endpoint_url}</Text>
              </View>
              
              <View style={styles.apiStatus}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(api.status) }]}>
                  <Text style={styles.statusText}>{api.status.toUpperCase()}</Text>
                </View>
                <View style={[styles.tierBadge, { backgroundColor: api.tier === 'paid' ? '#10B981' : '#F59E0B' }]}>
                  <Text style={styles.tierText}>{api.tier.toUpperCase()}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.apiMetrics}>
              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Last Success</Text>
                  <Text style={styles.metricValue}>
                    {new Date(api.last_successful_call).toLocaleString()}
                  </Text>
                </View>
                
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Error Rate</Text>
                  <Text style={[styles.metricValue, { color: api.error_rate > 0.05 ? '#E5252C' : '#10B981' }]}>
                    {(api.error_rate * 100).toFixed(2)}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>30-Day Cost</Text>
                  <Text style={styles.metricValue}>${api.cost_last_30d}</Text>
                </View>
                
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>30-Day Requests</Text>
                  <Text style={styles.metricValue}>{api.requests_last_30d.toLocaleString()}</Text>
                </View>
              </View>
              
              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Avg Response</Text>
                  <Text style={styles.metricValue}>{api.avg_response_time}ms</Text>
                </View>
                
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Uptime</Text>
                  <Text style={[styles.metricValue, { color: api.uptime_percentage >= 99 ? '#10B981' : '#F59E0B' }]}>
                    {api.uptime_percentage}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* JSON Preview */}
      <View style={styles.jsonContainer}>
        <Text style={styles.sectionTitle}>JSON Export Preview</Text>
        <View style={styles.jsonPreview}>
          <Text style={styles.jsonText}>
            {JSON.stringify(currentReport, null, 2).substring(0, 500)}...
          </Text>
        </View>
        <Text style={styles.jsonNote}>
          Full report contains {JSON.stringify(currentReport).length} characters
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  version: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#117ACA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  costSummaryContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  costBreakdown: {
    flexDirection: 'row',
  },
  costItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  totalCost: {
    borderLeftWidth: 1,
    borderLeftColor: '#E5E5E5',
  },
  costLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  costValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#117ACA',
  },
  totalCostValue: {
    fontSize: 20,
    color: '#333333',
  },
  costRequests: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  filterScroll: {
    paddingHorizontal: 16,
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
  apisContainer: {
    padding: 16,
  },
  apiCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  apiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  apiInfo: {
    flex: 1,
  },
  apiName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  apiUrl: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
  },
  apiStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tierText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  apiMetrics: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  metricRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  jsonContainer: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
  },
  jsonPreview: {
    backgroundColor: '#F7F7F7',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  jsonText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#333333',
  },
  jsonNote: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
});