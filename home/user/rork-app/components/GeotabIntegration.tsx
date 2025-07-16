import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { colors } from '@/constants/colors';
import { useIntegrationStore } from '@/store/integrationStore';
import { GeotabDevice, GeotabAlert, WeighStationBypassResponse } from '@/types';

export const GeotabIntegration = () => {
  const {
    geotabDevices,
    geotabAlerts,
    geotabBypassResponses,
    isLoading,
    error,
    fetchGeotabDevices,
    fetchGeotabAlerts,
    requestWeighStationBypass,
  } = useIntegrationStore();

  const [selectedDevice, setSelectedDevice] = useState<GeotabDevice | null>(null);

  useEffect(() => {
    fetchGeotabDevices();
    fetchGeotabAlerts();
  }, [fetchGeotabDevices, fetchGeotabAlerts]);

  const handleBypassRequest = async (deviceId: string) => {
    try {
      await requestWeighStationBypass(deviceId);
      Alert.alert('Success', 'Weigh station bypass request sent successfully.');
    } catch (err) {
      Alert.alert('Error', 'Failed to request weigh station bypass.');
    }
  };

  const renderDeviceItem = (device: GeotabDevice) => {
    const isSelected = selectedDevice?.id === device.id;
    const bypassResponse = geotabBypassResponses.find(resp => resp.deviceId === device.id);
    return (
      <TouchableOpacity
        key={device.id}
        style={[styles.deviceItem, isSelected && styles.selectedDeviceItem]}
        onPress={() => setSelectedDevice(isSelected ? null : device)}
      >
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={styles.deviceInfo}>VIN: {device.vin}</Text>
        <Text style={styles.deviceInfo}>Plate: {device.licensePlate}</Text>
        <Text style={styles.deviceLocation}>Last: {device.lastLocation.address}</Text>
        {bypassResponse && (
          <Text style={[styles.bypassStatus, bypassResponse.status === 'approved' && styles.approvedStatus]}>
            Bypass: {bypassResponse.status} {bypassResponse.status === 'approved' ? `until ${new Date(bypassResponse.validUntil || '').toLocaleTimeString()}` : ''}
          </Text>
        )}
        <TouchableOpacity
          style={styles.bypassButton}
          onPress={() => handleBypassRequest(device.id)}
          disabled={isLoading}
        >
          <Text style={styles.bypassButtonText}>Request Bypass</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderAlertItem = (alert: GeotabAlert) => {
    return (
      <View key={alert.id} style={[styles.alertItem, styles[`severity${alert.severity}`]]}>
        <Text style={styles.alertType}>{alert.type}</Text>
        <Text style={styles.alertMessage}>{alert.message}</Text>
        <Text style={styles.alertLocation}>{alert.location.address}</Text>
        <Text style={styles.alertTime}>{new Date(alert.timestamp).toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Geotab Drivewyze Integration</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading Geotab data...</Text>
        </View>
      ) : (
        <>
          <View style={styles.sectionContainer}>
            <Text style={styles.subSectionTitle}>Devices ({geotabDevices.length})</Text>
            {geotabDevices.length > 0 ? (
              geotabDevices.map(renderDeviceItem)
            ) : (
              <Text style={styles.noDataText}>No devices found. Please ensure your Geotab account is connected.</Text>
            )}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.subSectionTitle}>Alerts ({geotabAlerts.length})</Text>
            {geotabAlerts.length > 0 ? (
              geotabAlerts.map(renderAlertItem)
            ) : (
              <Text style={styles.noDataText}>No alerts at this time.</Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    marginTop: 16,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
  },
  deviceItem: {
    backgroundColor: colors.background.primary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedDeviceItem: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  deviceInfo: {
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
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bypassButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bypassStatus: {
    fontSize: 14,
    marginTop: 8,
    color: colors.textSecondary,
  },
  approvedStatus: {
    color: colors.success,
    fontWeight: 'bold',
  },
  alertItem: {
    backgroundColor: colors.background.primary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  severitylow: {
    borderLeftColor: colors.success,
  },
  severitymedium: {
    borderLeftColor: colors.warning,
  },
  severityhigh: {
    borderLeftColor: colors.danger,
  },
  alertType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  alertLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  errorContainer: {
    backgroundColor: colors.danger + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 8,
  },
  noDataText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
