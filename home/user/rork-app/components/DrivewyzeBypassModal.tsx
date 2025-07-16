import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { X, Truck, MapPin, Clock, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { DrivewyzeWeighStation, DrivewyzeBypassRequest } from '@/types';
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
  const [vehicleInfo, setVehicleInfo] = useState({
    weight: '',
    height: '',
    length: '',
    width: '',
    axles: '',
    hazmat: false,
  });
  const [driverId, setDriverId] = useState('DRIVER001');
  const [vehicleId, setVehicleId] = useState('TRUCK001');

  const handleSubmit = async () => {
    if (!station) return;

    // Validate required fields
    if (!vehicleInfo.weight || !vehicleInfo.height || !vehicleInfo.length) {
      Alert.alert('Missing Information', 'Please fill in all required vehicle dimensions.');
      return;
    }

    const request: DrivewyzeBypassRequest = {
      weighStationId: station.id,
      vehicleId,
      driverId,
      currentLocation: {
        latitude: 39.1612, // Mock current location
        longitude: -84.4569,
      },
      vehicleInfo: {
        weight: parseFloat(vehicleInfo.weight),
        height: parseFloat(vehicleInfo.height),
        length: parseFloat(vehicleInfo.length),
        width: parseFloat(vehicleInfo.width) || 8.5,
        axles: parseInt(vehicleInfo.axles) || 5,
        hazmat: vehicleInfo.hazmat,
      },
      complianceStatus: {
        hoursOfService: 'compliant',
        logbookCurrent: true,
        inspectionCurrent: true,
        registrationCurrent: true,
        insuranceCurrent: true,
      },
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await requestBypass(request);
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
    }
  };

  const resetForm = () => {
    setVehicleInfo({
      weight: '',
      height: '',
      length: '',
      width: '',
      axles: '',
      hazmat: false,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!station) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Request Bypass</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Station Information */}
          <View style={styles.stationCard}>
            <View style={styles.stationHeader}>
              <MapPin size={20} color={colors.primary} />
              <Text style={styles.stationName}>{station.name}</Text>
            </View>
            <Text style={styles.stationAddress}>{station.location.address}</Text>
            <View style={styles.stationStatus}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={styles.statusText}>Bypass Available</Text>
            </View>
          </View>

          {/* Vehicle Information Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>
            
            <View style={styles.formRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Weight (lbs) *</Text>
                <TextInput
                  style={styles.input}
                  value={vehicleInfo.weight}
                  onChangeText={(text) => setVehicleInfo(prev => ({ ...prev, weight: text }))}
                  placeholder="80000"
                  keyboardType="numeric"
                  placeholderTextColor={colors.text.secondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Height (ft) *</Text>
                <TextInput
                  style={styles.input}
                  value={vehicleInfo.height}
                  onChangeText={(text) => setVehicleInfo(prev => ({ ...prev, height: text }))}
                  placeholder="13.5"
                  keyboardType="numeric"
                  placeholderTextColor={colors.text.secondary}
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Length (ft) *</Text>
                <TextInput
                  style={styles.input}
                  value={vehicleInfo.length}
                  onChangeText={(text) => setVehicleInfo(prev => ({ ...prev, length: text }))}
                  placeholder="65"
                  keyboardType="numeric"
                  placeholderTextColor={colors.text.secondary}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Width (ft)</Text>
                <TextInput
                  style={styles.input}
                  value={vehicleInfo.width}
                  onChangeText={(text) => setVehicleInfo(prev => ({ ...prev, width: text }))}
                  placeholder="8.5"
                  keyboardType="numeric"
                  placeholderTextColor={colors.text.secondary}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Number of Axles</Text>
              <TextInput
                style={styles.input}
                value={vehicleInfo.axles}
                onChangeText={(text) => setVehicleInfo(prev => ({ ...prev, axles: text }))}
                placeholder="5"
                keyboardType="numeric"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setVehicleInfo(prev => ({ ...prev, hazmat: !prev.hazmat }))}
            >
              <View style={[styles.checkbox, vehicleInfo.hazmat && styles.checkboxChecked]}>
                {vehicleInfo.hazmat && <CheckCircle size={16} color={colors.white} />}
              </View>
              <Text style={styles.checkboxLabel}>Carrying Hazardous Materials</Text>
            </TouchableOpacity>
          </View>

          {/* Driver & Vehicle IDs */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Identification</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Driver ID</Text>
              <TextInput
                style={styles.input}
                value={driverId}
                onChangeText={setDriverId}
                placeholder="Enter driver ID"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Vehicle ID</Text>
              <TextInput
                style={styles.input}
                value={vehicleId}
                onChangeText={setVehicleId}
                placeholder="Enter vehicle ID"
                placeholderTextColor={colors.text.secondary}
              />
            </View>
          </View>

          {/* Compliance Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compliance Status</Text>
            <View style={styles.complianceList}>
              <View style={styles.complianceItem}>
                <CheckCircle size={16} color={colors.success} />
                <Text style={styles.complianceText}>Hours of Service: Compliant</Text>
              </View>
              <View style={styles.complianceItem}>
                <CheckCircle size={16} color={colors.success} />
                <Text style={styles.complianceText}>Logbook: Current</Text>
              </View>
              <View style={styles.complianceItem}>
                <CheckCircle size={16} color={colors.success} />
                <Text style={styles.complianceText}>Inspection: Current</Text>
              </View>
              <View style={styles.complianceItem}>
                <CheckCircle size={16} color={colors.success} />
                <Text style={styles.complianceText}>Registration: Current</Text>
              </View>
            </View>
          </View>

          {/* Warning */}
          <View style={styles.warningCard}>
            <AlertTriangle size={20} color={colors.warning} />
            <Text style={styles.warningText}>
              Bypass approval is not guaranteed. You may still be required to enter the weigh station for inspection.
            </Text>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, loading.bypass && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading.bypass}
          >
            {loading.bypass ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <>
                <Truck size={20} color={colors.white} />
                <Text style={styles.submitButtonText}>Request Bypass</Text>
              </>
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
  stationCard: {
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  stationAddress: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  stationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.success,
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.text.primary,
  },
  complianceList: {
    gap: 12,
  },
  complianceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  complianceText: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 8,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: colors.warning + '20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 14,
    color: colors.warning,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});