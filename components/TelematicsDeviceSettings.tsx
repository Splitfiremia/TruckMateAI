import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Smartphone,
  Plus,
  Settings,
  Wifi,
  Bluetooth,
  CheckCircle,
  AlertCircle,
  Trash2,
  RefreshCw,
  Search,
  Info,
  Unlink,
  ArrowLeft,
  X,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTelematicsStore, TelematicsDevice, DeviceType } from '@/store/telematicsStore';

interface TelematicsDeviceSettingsProps {
  onBack?: () => void;
}

export default function TelematicsDeviceSettings({ onBack }: TelematicsDeviceSettingsProps = {}) {
  const {
    devices,
    isScanning,
    autoDetectionEnabled,
    error,
    startDeviceDetection,
    connectDevice,
    disconnectDevice,
    removeDevice,
    setAutoDetection,
    getDeviceRecommendations,
    setError,
  } = useTelematicsStore();

  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const recommendations = getDeviceRecommendations();

  const handleScanDevices = async () => {
    try {
      await startDeviceDetection();
    } catch (error) {
      Alert.alert('Scan Failed', 'Unable to scan for devices. Please try again.');
    }
  };

  const handleConnectDevice = async (deviceId: string) => {
    setConnectingDeviceId(deviceId);
    try {
      const success = await connectDevice(deviceId);
      if (success) {
        Alert.alert('Success', 'Device connected successfully!');
      } else {
        Alert.alert('Connection Failed', error || 'Unable to connect to device');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setConnectingDeviceId(null);
    }
  };

  const handleDisconnectDevice = (deviceId: string) => {
    Alert.alert(
      'Disconnect Device',
      'Are you sure you want to disconnect this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => disconnectDevice(deviceId),
        },
      ]
    );
  };

  const handleRemoveDevice = (deviceId: string) => {
    Alert.alert(
      'Remove Device',
      'Are you sure you want to remove this device? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeDevice(deviceId),
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return colors.success;
      case 'detected':
        return colors.warning;
      case 'error':
        return colors.error;
      default:
        return colors.text.secondary;
    }
  };

  const getConnectionIcon = (method: string) => {
    switch (method) {
      case 'wifi':
        return <Wifi size={16} color={colors.text.secondary} />;
      case 'bluetooth':
        return <Bluetooth size={16} color={colors.text.secondary} />;
      default:
        return <Smartphone size={16} color={colors.text.secondary} />;
    }
  };

  const renderDeviceCard = (device: TelematicsDevice) => (
    <View key={device.id} style={styles.deviceCard}>
      <View style={styles.deviceHeader}>
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <View style={styles.deviceMeta}>
            <Text style={styles.deviceType}>{device.type.toUpperCase()}</Text>
            <View style={styles.connectionInfo}>
              {getConnectionIcon(device.connectionMethod)}
              <Text style={styles.connectionText}>{device.connectionMethod}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(device.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(device.status) }]}>
            {device.status}
          </Text>
        </View>
      </View>

      {device.signalStrength && (
        <View style={styles.deviceDetails}>
          <Text style={styles.detailText}>Signal: {device.signalStrength}%</Text>
          {device.batteryLevel && (
            <Text style={styles.detailText}>Battery: {device.batteryLevel}%</Text>
          )}
          {device.isELDCertified && (
            <View style={styles.certifiedBadge}>
              <CheckCircle size={12} color={colors.success} />
              <Text style={styles.certifiedText}>ELD Certified</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.deviceActions}>
        {device.status === 'detected' && (
          <TouchableOpacity
            style={styles.connectButton}
            onPress={() => handleConnectDevice(device.id)}
            disabled={connectingDeviceId === device.id}
          >
            {connectingDeviceId === device.id ? (
              <ActivityIndicator size="small" color={colors.text.primary} />
            ) : (
              <Text style={styles.connectButtonText}>Connect</Text>
            )}
          </TouchableOpacity>
        )}

        {device.status === 'connected' && (
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={() => handleDisconnectDevice(device.id)}
          >
            <Unlink size={16} color={colors.text.primary} />
            <Text style={styles.disconnectButtonText}>Disconnect</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveDevice(device.id)}
        >
          <Trash2 size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecommendationCard = (device: TelematicsDevice) => (
    <View key={device.id} style={styles.recommendationCard}>
      <View style={styles.recommendationHeader}>
        <Text style={styles.recommendationName}>{device.name}</Text>
        <Text style={styles.recommendationPrice}>{device.metadata?.price}</Text>
      </View>
      <Text style={styles.recommendationType}>{device.type.toUpperCase()}</Text>
      <View style={styles.recommendationFeatures}>
        {device.metadata?.features?.slice(0, 2).map((feature: string, index: number) => (
          <Text key={index} style={styles.recommendationFeature}>• {feature}</Text>
        ))}
      </View>
      <View style={styles.recommendationFooter}>
        <Text style={styles.ratingText}>★ {device.metadata?.rating}</Text>
        <TouchableOpacity style={styles.learnMoreButton}>
          <Text style={styles.learnMoreText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.navigationBar}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <ArrowLeft size={24} color={colors.text.primary} />
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Telematics Devices</Text>
            <Text style={styles.subtitle}>
              Manage your ELD and fleet hardware connections
            </Text>
          </View>
        </View>
      </View>

      {/* Auto-Detection Setting */}
      <View style={styles.settingCard}>
        <View style={styles.settingHeader}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Auto-Detection</Text>
            <Text style={styles.settingDescription}>
              Automatically scan for nearby devices
            </Text>
          </View>
          <Switch
            value={autoDetectionEnabled}
            onValueChange={setAutoDetection}
            trackColor={{ false: colors.background.secondary, true: colors.primary + '40' }}
            thumbColor={autoDetectionEnabled ? colors.primary : colors.text.secondary}
          />
        </View>
      </View>

      {/* Scan Button */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleScanDevices}
        disabled={isScanning}
      >
        {isScanning ? (
          <ActivityIndicator size="small" color={colors.text.primary} />
        ) : (
          <Search size={20} color={colors.text.primary} />
        )}
        <Text style={styles.scanButtonText}>
          {isScanning ? 'Scanning...' : 'Scan for Devices'}
        </Text>
      </TouchableOpacity>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={16} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => setError(null)}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Connected/Detected Devices */}
      {devices.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Devices</Text>
          {devices.map(renderDeviceCard)}
        </View>
      )}

      {/* No Devices Message */}
      {devices.length === 0 && !isScanning && (
        <View style={styles.noDevicesContainer}>
          <Smartphone size={48} color={colors.text.secondary} />
          <Text style={styles.noDevicesTitle}>No devices found</Text>
          <Text style={styles.noDevicesText}>
            Scan for devices or check our recommendations below
          </Text>
        </View>
      )}

      {/* Recommendations Toggle */}
      <TouchableOpacity
        style={styles.recommendationsToggle}
        onPress={() => setShowRecommendations(!showRecommendations)}
      >
        <Text style={styles.recommendationsToggleText}>
          {showRecommendations ? 'Hide' : 'Show'} Device Recommendations
        </Text>
        <Plus
          size={20}
          color={colors.primary}
          style={{
            transform: [{ rotate: showRecommendations ? '45deg' : '0deg' }],
          }}
        />
      </TouchableOpacity>

      {/* Device Recommendations */}
      {showRecommendations && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Devices</Text>
          <Text style={styles.sectionSubtitle}>
            These devices work great with TruckMate AI
          </Text>
          {recommendations.map(renderRecommendationCard)}
        </View>
      )}

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoHeader}>
          <Info size={20} color={colors.primary} />
          <Text style={styles.infoTitle}>About Device Integration</Text>
        </View>
        <Text style={styles.infoText}>
          Connecting your ELD or telematics device enables automatic logbook updates, 
          real-time compliance monitoring, and vehicle diagnostics. All connections 
          are secure and encrypted.
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
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  settingCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '10',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: colors.error,
  },
  dismissText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.error,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  deviceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  deviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deviceType: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  connectionText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  deviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  certifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  certifiedText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.success,
  },
  deviceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  connectButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  disconnectButton: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disconnectButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  removeButton: {
    padding: 8,
    marginLeft: 'auto',
  },
  noDevicesContainer: {
    alignItems: 'center',
    padding: 40,
    marginHorizontal: 20,
  },
  noDevicesTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  noDevicesText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  recommendationsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 12,
    gap: 8,
  },
  recommendationsToggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  recommendationCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.background.secondary,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recommendationName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  recommendationPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  recommendationType: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  recommendationFeatures: {
    marginBottom: 12,
  },
  recommendationFeature: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 2,
  },
  recommendationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '500',
  },
  learnMoreButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary + '10',
    borderRadius: 6,
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  infoSection: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});