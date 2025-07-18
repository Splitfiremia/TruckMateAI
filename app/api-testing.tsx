import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Play, CheckCircle, XCircle, Clock, Zap } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { apiTestingService } from '@/utils/apiTesting';

interface TestResult {
  testName: string;
  success: boolean;
  duration: number;
  details: string;
  error?: string;
}

interface TestSuite {
  name: string;
  results: TestResult[];
  totalTests: number;
  passedTests: number;
  totalDuration: number;
}

export default function APITestingScreen() {
  const [testResults, setTestResults] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{
    status: 'healthy' | 'degraded' | 'critical';
    details: string[];
  } | null>(null);

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      const results = await apiTestingService.runAllTests();
      setTestResults(results);
    } catch (error) {
      Alert.alert('Test Error', `Failed to run tests: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runHealthCheck = async () => {
    try {
      const health = await apiTestingService.quickHealthCheck();
      setHealthStatus(health);
      
      const statusMessage = health.details.join('\n');
      Alert.alert(
        `System Status: ${health.status.toUpperCase()}`,
        statusMessage,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Health Check Failed', `Error: ${error}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return colors.success;
      case 'degraded': return colors.warning;
      case 'critical': return colors.danger;
      default: return colors.text.secondary;
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? 
      <CheckCircle size={16} color={colors.success} /> : 
      <XCircle size={16} color={colors.danger} />;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen 
        options={{ 
          title: 'API Testing',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary
        }} 
      />

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        <Text style={styles.title}>Hybrid API Testing Suite</Text>
        <Text style={styles.subtitle}>
          Test the hybrid API architecture with failover, caching, and cost control
        </Text>

        <View style={styles.buttonRow}>
          <Pressable 
            style={[styles.button, styles.primaryButton, isRunning && styles.buttonDisabled]}
            onPress={runAllTests}
            disabled={isRunning}
          >
            <Play size={20} color={colors.white} />
            <Text style={styles.buttonText}>
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Text>
          </Pressable>

          <Pressable 
            style={[styles.button, styles.secondaryButton]}
            onPress={runHealthCheck}
          >
            <Zap size={20} color={colors.primary} />
            <Text style={[styles.buttonText, { color: colors.primary }]}>
              Health Check
            </Text>
          </Pressable>
        </View>

        {healthStatus && (
          <View style={[styles.healthStatus, { borderColor: getStatusColor(healthStatus.status) }]}>
            <Text style={[styles.healthStatusText, { color: getStatusColor(healthStatus.status) }]}>
              System Status: {healthStatus.status.toUpperCase()}
            </Text>
            {healthStatus.details.map((detail, index) => (
              <Text key={index} style={styles.healthDetail}>• {detail}</Text>
            ))}
          </View>
        )}
      </View>

      {/* Test Results */}
      {testResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Results</Text>
          
          {testResults.map((suite, suiteIndex) => (
            <View key={suiteIndex} style={styles.suiteCard}>
              <View style={styles.suiteHeader}>
                <Text style={styles.suiteName}>{suite.name}</Text>
                <View style={styles.suiteStats}>
                  <Text style={styles.suiteStatsText}>
                    {suite.passedTests}/{suite.totalTests}
                  </Text>
                  <Text style={styles.suiteDuration}>
                    {suite.totalDuration}ms
                  </Text>
                </View>
              </View>

              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${(suite.passedTests / suite.totalTests) * 100}%`,
                      backgroundColor: suite.passedTests === suite.totalTests ? colors.success : colors.warning
                    }
                  ]} 
                />
              </View>

              {suite.results.map((result, resultIndex) => (
                <View key={resultIndex} style={styles.testResult}>
                  <View style={styles.testHeader}>
                    {getStatusIcon(result.success)}
                    <Text style={styles.testName}>{result.testName}</Text>
                    <View style={styles.testDuration}>
                      <Clock size={12} color={colors.text.secondary} />
                      <Text style={styles.testDurationText}>{result.duration}ms</Text>
                    </View>
                  </View>
                  
                  <Text style={[
                    styles.testDetails,
                    { color: result.success ? colors.text.secondary : colors.danger }
                  ]}>
                    {result.success ? result.details : result.error}
                  </Text>
                </View>
              ))}
            </View>
          ))}

          {/* Overall Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Overall Summary</Text>
            
            {(() => {
              const totalTests = testResults.reduce((sum, suite) => sum + suite.totalTests, 0);
              const totalPassed = testResults.reduce((sum, suite) => sum + suite.passedTests, 0);
              const totalDuration = testResults.reduce((sum, suite) => sum + suite.totalDuration, 0);
              const passRate = ((totalPassed / totalTests) * 100).toFixed(1);
              
              return (
                <>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tests Passed:</Text>
                    <Text style={styles.summaryValue}>{totalPassed}/{totalTests} ({passRate}%)</Text>
                  </View>
                  
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Duration:</Text>
                    <Text style={styles.summaryValue}>{totalDuration}ms</Text>
                  </View>
                  
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Status:</Text>
                    <Text style={[
                      styles.summaryValue,
                      { color: totalPassed === totalTests ? colors.success : colors.warning }
                    ]}>
                      {totalPassed === totalTests ? 'All Tests Passed' : 'Some Tests Failed'}
                    </Text>
                  </View>
                </>
              );
            })()}
          </View>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>Testing Instructions</Text>
        <Text style={styles.instructionsText}>
          1. <Text style={styles.bold}>Run All Tests</Text> - Comprehensive test of all hybrid API features{'\n'}
          2. <Text style={styles.bold}>Health Check</Text> - Quick system status verification{'\n'}
          3. <Text style={styles.bold}>Monitor Results</Text> - Check for any failing tests{'\n'}
          4. <Text style={styles.bold}>Review Logs</Text> - Check console for detailed output{'\n'}
          {'\n'}
          Tests cover: Location services, Weather APIs, AI responses, Failover mechanisms, Cost control, and Caching.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  controlPanel: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.white,
    marginLeft: 8,
  },
  healthStatus: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: colors.background.secondary,
  },
  healthStatusText: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  healthDetail: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  resultsContainer: {
    padding: 16,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 16,
  },
  suiteCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  suiteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  suiteName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  suiteStats: {
    alignItems: 'flex-end',
  },
  suiteStatsText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  suiteDuration: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.background.tertiary,
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  testResult: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  testName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  testDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testDurationText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  testDetails: {
    fontSize: 13,
    marginLeft: 24,
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  instructionsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
});