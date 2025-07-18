import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { 
  Settings, 
  Zap, 
  Shield, 
  DollarSign, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { hybridApiService } from '@/services/hybridApiService';
import CostControlDashboard from '@/components/CostControlDashboard';

interface APISettings {
  enableFallbacks: boolean;
  aggressiveCaching: boolean;
  costOptimization: boolean;
  autoThrottling: boolean;
  debugMode: boolean;
}

export default function APISettingsScreen() {
  const [settings, setSettings] = useState<APISettings>({
    enableFallbacks: true,
    aggressiveCaching: true,
    costOptimization: true,
    autoThrottling: true,
    debugMode: false
  });
  const [usageStats, setUsageStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testingFailover, setTestingFailover] = useState(false);

  useEffect(() => {
    loadSettings();
    loadUsageStats();
  }, []);

  const loadSettings = async () => {
    // In a real app, load from AsyncStorage
    setLoading(false);
  };

  const loadUsageStats = async () => {
    try {
      const stats = await hybridApiService.getUsageStatus();
      setUsageStats(stats);
    } catch (error) {
      console.error('Failed to load usage stats:', error);
    }
  };

  const updateSetting = (key: keyof APISettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // In a real app, save to AsyncStorage
  };

  const testFailover = async () => {
    setTestingFailover(true);
    try {
      await hybridApiService.simulateFailover('Geotab', 60000); // 1 minute
      Alert.alert(
        'Failover Test Started',
        'Primary APIs will use fallbacks for the next minute. Monitor the status banner to see the effect.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Test Failed', 'Could not simulate failover');
    } finally {
      setTestingFailover(false);
    }
  };

  const clearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached API responses. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            hybridApiService.clearCache();
            Alert.alert('Cache Cleared', 'All cached data has been removed.');
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return colors.success;
      case 'warning': return colors.warning;
      case 'critical': return colors.danger;
      default: return colors.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={16} color={colors.success} />;
      case 'warning': return <AlertTriangle size={16} color={colors.warning} />;
      case 'critical': return <XCircle size={16} color={colors.danger} />;
      default: return null;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen 
        options={{ 
          title: 'API Management',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary
        }} 
      />

      {/* Current Status Overview */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Shield size={24} color={colors.primary} />
          <Text style={styles.statusTitle}>System Status</Text>
        </View>
        
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Mode</Text>
            <Text style={[styles.statusValue, { color: hybridApiService.isDegradedMode() ? colors.warning : colors.success }]}>
              {hybridApiService.isDegradedMode() ? 'Degraded' : 'Normal'}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>APIs Active</Text>
            <Text style={styles.statusValue}>
              {usageStats?.apis?.filter((api: any) => api.status === 'healthy').length || 0} / {usageStats?.apis?.length || 0}
            </Text>
          </View>
        </View>

        {usageStats?.apis && (
          <View style={styles.apiList}>
            {usageStats.apis.map((api: any, index: number) => (
              <View key={index} style={styles.apiItem}>
                <View style={styles.apiInfo}>
                  {getStatusIcon(api.status)}
                  <Text style={styles.apiName}>{api.name}</Text>
                </View>
                <Text style={[styles.apiStatus, { color: getStatusColor(api.status) }]}>
                  {api.status.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Settings */}
      <View style={styles.settingsCard}>
        <View style={styles.sectionHeader}>
          <Settings size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Configuration</Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Enable Fallback APIs</Text>
            <Text style={styles.settingDescription}>
              Automatically switch to backup services when primary APIs fail
            </Text>
          </View>
          <Switch
            value={settings.enableFallbacks}
            onValueChange={(value) => updateSetting('enableFallbacks', value)}
            trackColor={{ false: colors.background.tertiary, true: colors.primaryLight }}
            thumbColor={settings.enableFallbacks ? colors.primary : colors.text.secondary}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Aggressive Caching</Text>
            <Text style={styles.settingDescription}>
              Cache responses longer to reduce API calls and costs
            </Text>
          </View>
          <Switch
            value={settings.aggressiveCaching}
            onValueChange={(value) => updateSetting('aggressiveCaching', value)}
            trackColor={{ false: colors.background.tertiary, true: colors.primaryLight }}
            thumbColor={settings.aggressiveCaching ? colors.primary : colors.text.secondary}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Cost Optimization</Text>
            <Text style={styles.settingDescription}>
              Prioritize free/cheaper APIs for non-critical features
            </Text>
          </View>
          <Switch
            value={settings.costOptimization}
            onValueChange={(value) => updateSetting('costOptimization', value)}
            trackColor={{ false: colors.background.tertiary, true: colors.primaryLight }}
            thumbColor={settings.costOptimization ? colors.primary : colors.text.secondary}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Auto Throttling</Text>
            <Text style={styles.settingDescription}>
              Automatically limit API usage when approaching quotas
            </Text>
          </View>
          <Switch
            value={settings.autoThrottling}
            onValueChange={(value) => updateSetting('autoThrottling', value)}
            trackColor={{ false: colors.background.tertiary, true: colors.primaryLight }}
            thumbColor={settings.autoThrottling ? colors.primary : colors.text.secondary}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Debug Mode</Text>
            <Text style={styles.settingDescription}>
              Show detailed API logs and performance metrics
            </Text>
          </View>
          <Switch
            value={settings.debugMode}
            onValueChange={(value) => updateSetting('debugMode', value)}
            trackColor={{ false: colors.background.tertiary, true: colors.primaryLight }}
            thumbColor={settings.debugMode ? colors.primary : colors.text.secondary}
          />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsCard}>
        <View style={styles.sectionHeader}>
          <Zap size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Actions</Text>
        </View>

        <Pressable 
          style={[styles.actionButton, testingFailover && styles.actionButtonDisabled]}
          onPress={testFailover}
          disabled={testingFailover}
        >
          <RefreshCw size={20} color={testingFailover ? colors.text.secondary : colors.primary} />
          <View style={styles.actionInfo}>
            <Text style={[styles.actionLabel, testingFailover && styles.actionLabelDisabled]}>
              Test Failover
            </Text>
            <Text style={styles.actionDescription}>
              Simulate primary API failure to test backup systems
            </Text>
          </View>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={clearCache}>
          <RefreshCw size={20} color={colors.warning} />
          <View style={styles.actionInfo}>
            <Text style={[styles.actionLabel, { color: colors.warning }]}>
              Clear Cache
            </Text>
            <Text style={styles.actionDescription}>
              Remove all cached API responses
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Cost Control Dashboard */}
      <CostControlDashboard />

      {/* Important Notes */}
      <View style={styles.notesCard}>
        <View style={styles.sectionHeader}>
          <AlertTriangle size={20} color={colors.accent} />
          <Text style={styles.sectionTitle}>Important Notes</Text>
        </View>

        <Text style={styles.noteText}>
          • ELD compliance features always use primary APIs regardless of settings{'\n'}
          • Fallback APIs may have reduced accuracy for location services{'\n'}
          • Cost optimization may delay some non-critical updates{'\n'}
          • Debug mode increases battery usage and storage requirements
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
  statusCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginLeft: 8,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  apiList: {
    gap: 8,
  },
  apiItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
  },
  apiInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  apiName: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 8,
  },
  apiStatus: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  settingsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  actionsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text.primary,
    marginBottom: 2,
  },
  actionLabelDisabled: {
    color: colors.text.secondary,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  notesCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  noteText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});