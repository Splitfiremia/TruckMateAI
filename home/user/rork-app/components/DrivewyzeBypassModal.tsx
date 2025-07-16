import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { X, MapPin, Clock, Truck } from 'lucide-react-native';
import { DrivewyzeWeighStation } from '@/types';
import { colors } from '@/constants/colors';
import { useDrivewyzeStore } from '@/store/drivewyzeStore';

interface DrivewyzeBypassModalProps {
  visible: boolean;
  station: DrivewyzeWeighStation | null;
  onClose: () => void;
}

export const DrivewyzeBypassModal: React.FC<DrivewyzeBypassModalProps> = ({
  visible,
  station,
  onClose,
}) => {
  const { requestBypass, loading } = useDrivewyzeStore();
  const [requesting, setRequesting] = useState(false);

  if (!station) return null;

  const handleBypassRequest = async () => {
    if (!station) return;

    setRequesting(true);
    try {
      const response = await requestBypass({
        weighStationId: station.id,
        vehicleInfo: {
          type: 'truck',
          weight: 75000, // Mock weight
          length: 60,
          height: 13,
          hazmat: false,
        },
        driverInfo: {
          licenseNumber: 'DEMO123',
          dotNumber: 'DOT456789',
        },
        timestamp: new Date().toISOString(),
      });

      if (response) {
        Alert.alert(
          response.status === 'approved' ? 'Bypass Approved!' : 'Bypass Denied',
          response.message,
          [
            {
              text: 'OK',
              onPress: onClose,
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to request bypass. Please try again.');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Request Bypass</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.stationInfo}>
            <View style={styles.stationHeader}>
              <MapPin size={20} color={colors.primary} />
              <Text style={styles.stationName}>{station.name}</Text>
            </View>
            <Text style={styles.stationAddress}>{station.location.address}</Text>
            
            {station.distance && (
              <View style={styles.distanceRow}>
                <Text style={styles.distance}>{station.distance.toFixed(1)} miles away</Text>
              </View>
            )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Bypass Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Clock size={16} color={colors.text.secondary} />
                <Text style={styles.infoText}>
                  Estimated processing time: 2-3 minutes
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Truck size={16} color={colors.text.secondary} />
                <Text style={styles.infoText}>
                  Valid for commercial vehicles only
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.warningSection}>
            <Text style={styles.warningTitle}>Important Notes:</Text>
            <Text style={styles.warningText}>
              • Bypass approval is not guaranteed
            </Text>
            <Text style={styles.warningText}>
              • If denied, you must enter the weigh station
            </Text>
            <Text style={styles.warningText}>
              • Bypass expires after 30 minutes if approved
            </Text>
            <Text style={styles.warningText}>
              • Stay in right lane when bypassing
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={requesting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.requestButton, requesting && styles.requestButtonDisabled]}
            onPress={handleBypassRequest}
            disabled={requesting || loading.bypass}
          >
            {requesting || loading.bypass ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.requestButtonText}>Request Bypass</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  stationInfo: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  stationAddress: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  warningSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 4,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  requestButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestButtonDisabled: {
    opacity: 0.6,
  },
  requestButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});