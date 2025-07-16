import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { colors } from '../constants/colors';
import { useIntegrationStore } from '../store/integrationStore';
import { GeotabDevice, GeotabAlert, WeighStationBypassResponse } from '../types/index';

export const GeotabIntegration = () => {
  // Use type assertion to bypass TypeScript errors until store is properly typed
  const integrationStore = useIntegrationStore() as any;
  const geotabDevices = integrationStore.geotabDevices as GeotabDevice[];
  const geotabAlerts = integrationStore.geotabAlerts as GeotabAlert[];
  const geotabBypassResponses = integrationStore.geotabBypassResponses as WeighStationBypassResponse[];
  const fetchGeotabDevices = integrationStore.fetchGeotabDevices as () => Promise<void>;
  const fetchGeotabAlerts = integrationStore.fetchGeotabAlerts as () => Promise<void>;
  const requestWeighStationBypass = integrationStore.requestWeighStationBypass as (deviceId: string, weighStationId: string) => Promise<void>;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadGeotabData();
  }, []);

  const loadGeotabData = async () => {
    setIsLoading(true);
    try {
      await fetchGeotabDevices();
      await fetchGeotabAlerts();
    } catch (error) {
      Alert.alert('Error', 'Failed to load Geotab data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBypassRequest = async (deviceId: string, weighStationId: string) => {
    try {
      await requestWeighStationBypass(deviceId, weighStationId);
      Alert.alert('Success', 'Weigh station bypass requested');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to request bypass');
    }
  };

  const renderDeviceItem = ({ item }: { item: GeotabDevice }) => (
    <View style={styles.deviceItem}>
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceStatus}>Status: {item.status}</Text>
      <Text style={styles.deviceLocation}>
        Location: {item.lastLocation.latitude.toFixed(4)}, {item.lastLocation.longitude.toFixed(4)}
      </Text>
      <TouchableOpacity 
        style={styles.bypassButton} 
        onPress={() => handleBypassRequest(item.id, 'ws001')}
      >
        <Text style={styles.bypassButtonText}>Request Bypass</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAlertItem = ({ item }: { item: GeotabAlert }) => (
    <View style={[styles.alertItem, styles[`severity${item.severity}` as 'severityLow' | 'severityMedium' | 'severityHigh' | 'severityCritical']]}
    >
      <Text style={styles.alertMessage}>{item.message}</Text>
      <Text style={styles.alertType}>Type: {item.type}</Text>
      <Text style={styles.alertTime}>Time: {new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Geotab Integration</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Devices ({geotabDevices.length})</Text>
        {geotabDevices.length > 0 ? (
          <FlatList
            data={geotabDevices}
            renderItem={renderDeviceItem}
            keyExtractor={(item) => item.id}
            style={styles.deviceList}
          />
        ) : (
          <Text style={styles.noDataText}>No devices found</Text>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alerts ({geotabAlerts.length})</Text>
        {geotabAlerts.length > 0 ? (
          <FlatList
            data={geotabAlerts}
            renderItem={renderAlertItem}
            keyExtractor={(item) => item.id}
            style={styles.alertList}
          />
        ) : (
          <Text style={styles.noDataText}>No alerts at this time</Text>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bypass Responses ({geotabBypassResponses.length})</Text>
        {geotabBypassResponses.length > 0 ? (
          <FlatList
            data={geotabBypassResponses}
            renderItem={({ item }) => (
              <View style={styles.bypassResponseItem}>
                <Text style={styles.bypassResponseText}>
                  {item.weighStationName}: {item.bypassGranted ? 'Granted' : 'Denied'}
                </Text>
                <Text style={styles.bypassResponseTime}>
                  Until: {new Date(item.validUntil).toLocaleTimeString()}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.requestId}
            style={styles.bypassResponseList}
          />
        ) : (
          <Text style={styles.noDataText}>No bypass responses</Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={loadGeotabData} 
        disabled={isLoading}
      >
        <Text style={styles.refreshButtonText}>
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  deviceList: {
    maxHeight: 200,
  },
  deviceItem: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  deviceLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  bypassButton: {
    backgroundColor: colors.primary.primary,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  bypassButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  alertList: {
    maxHeight: 250,
  },
  alertItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  severityLow: {
    backgroundColor: '#E6F7E6',
  },
  severityMedium: {
    backgroundColor: '#FFF3E0',
  },
  severityHigh: {
    backgroundColor: '#FFE0E0',
  },
  severityCritical: {
    backgroundColor: '#FFCCCC',
  },
  alertMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  alertType: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bypassResponseList: {
    maxHeight: 150,
  },
  bypassResponseItem: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  bypassResponseText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  bypassResponseTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  refreshButton: {
    backgroundColor: colors.primary.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 20,
  },
});
