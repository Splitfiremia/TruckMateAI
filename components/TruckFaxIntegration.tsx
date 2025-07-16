import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import {
  Shield,
  Database,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  X,
  Zap,
  Clock,
  DollarSign,
  Star,
  Wrench
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { usePredictiveMaintenanceStore } from '@/store/predictiveMaintenanceStore';
import { TruckFaxVehicleInfo, TruckFaxPredictiveInsights } from '@/types';

interface TruckFaxIntegrationProps {
  visible: boolean;
  onClose: () => void;
}

const TruckFaxIntegration: React.FC<TruckFaxIntegrationProps> = ({
  visible,
  onClose
}) => {
  const {
    truckFaxEnabled,
    truckFaxData,
    truckFaxInsights,
    vehicleVin,
    isLoadingTruckFax,
    lastTruckFaxSync,
    setVehicleVin,
    enableTruckFax,
    disableTruckFax,
    syncTruckFaxData
  } = usePredictiveMaintenanceStore();

  const [vinInput, setVinInput] = useState(vehicleVin || '');
  const [showVehicleInfo, setShowVehicleInfo] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const handleConnect = async () => {
    if (!vinInput.trim()) {
      Alert.alert('Error', 'Please enter a valid VIN number');
      return;
    }

    if (vinInput.length !== 17) {
      Alert.alert('Error', 'VIN must be exactly 17 characters');
      return;
    }

    setVehicleVin(vinInput.trim().toUpperCase());
    await enableTruckFax();
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect TruckFax',
      'Are you sure you want to disconnect TruckFax integration? This will remove enhanced predictions and historical data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            disableTruckFax();
            setVinInput('');
          }
        }
      ]
    );
  };

  const handleSync = async () => {
    if (!vehicleVin) {
      Alert.alert('Error', 'No VIN configured');
      return;
    }
    await syncTruckFaxData();
  };

  const renderConnectionStatus = () => (
    <View style={styles.statusSection}>
      <View style={styles.statusHeader}>
        <Shield size={24} color={truckFaxEnabled ? colors.status.success : colors.text.secondary} />
        <Text style={styles.statusTitle}>
          TruckFax Integration
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: truckFaxEnabled ? colors.status.success : colors.status.error }
        ]}>
          <Text style={styles.statusBadgeText}>
            {truckFaxEnabled ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>

      {truckFaxEnabled && vehicleVin && (
        <View style={styles.vinContainer}>
          <Text style={styles.vinLabel}>Vehicle VIN:</Text>
          <Text style={styles.vinText}>{vehicleVin}</Text>
        </View>
      )}

      {lastTruckFaxSync && (
        <Text style={styles.lastSync}>
          Last sync: {new Date(lastTruckFaxSync).toLocaleString()}
        </Text>
      )}
    </View>
  );

  const renderConnectionForm = () => {
    if (truckFaxEnabled) return null;

    return (
      <View style={styles.connectionForm}>
        <Text style={styles.formTitle}>Connect Your Vehicle</Text>
        <Text style={styles.formDescription}>
          Enter your vehicle's VIN to enable enhanced predictive maintenance with TruckFax data
        </Text>

        <TextInput
          style={styles.vinInput}
          placeholder="Enter 17-digit VIN"
          value={vinInput}
          onChangeText={setVinInput}
          maxLength={17}
          autoCapitalize="characters"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.connectButton, { opacity: vinInput.length === 17 ? 1 : 0.5 }]}
          onPress={handleConnect}
          disabled={vinInput.length !== 17 || isLoadingTruckFax}
        >
          <Database size={20} color={colors.white} />
          <Text style={styles.connectButtonText}>
            {isLoadingTruckFax ? 'Connecting...' : 'Connect TruckFax'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderVehicleInfo = () => {
    if (!truckFaxEnabled || !truckFaxData) return null;

    return (
      <View style={styles.infoSection}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowVehicleInfo(!showVehicleInfo)}
        >
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <Text style={styles.expandIcon}>{showVehicleInfo ? '−' : '+'}</Text>
        </TouchableOpacity>

        {showVehicleInfo && (
          <View style={styles.sectionContent}>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Make & Model</Text>
                <Text style={styles.infoValue}>
                  {truckFaxData.make} {truckFaxData.model}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Year</Text>
                <Text style={styles.infoValue}>{truckFaxData.year}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Engine</Text>
                <Text style={styles.infoValue}>{truckFaxData.engine}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Mileage</Text>
                <Text style={styles.infoValue}>
                  {truckFaxData.mileage?.toLocaleString()} miles
                </Text>
              </View>
            </View>

            {truckFaxData.maintenanceHistory && truckFaxData.maintenanceHistory.length > 0 && (
              <View style={styles.historySection}>
                <Text style={styles.historyTitle}>Recent Maintenance</Text>
                {truckFaxData.maintenanceHistory.slice(0, 3).map((record, index) => (
                  <View key={index} style={styles.historyItem}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyDate}>
                        {new Date(record.date).toLocaleDateString()}
                      </Text>
                      <Text style={styles.historyMileage}>
                        {record.mileage?.toLocaleString()} mi
                      </Text>
                    </View>
                    <Text style={styles.historyDescription}>{record.description}</Text>
                    <Text style={styles.historyCost}>${record.cost}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderPredictiveInsights = () => {
    if (!truckFaxEnabled || !truckFaxInsights) return null;

    return (
      <View style={styles.infoSection}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowInsights(!showInsights)}
        >
          <Text style={styles.sectionTitle}>Enhanced Predictions</Text>
          <Text style={styles.expandIcon}>{showInsights ? '−' : '+'}</Text>
        </TouchableOpacity>

        {showInsights && (
          <View style={styles.sectionContent}>
            <View style={styles.insightsGrid}>
              <View style={styles.insightCard}>
                <TrendingUp size={20} color={colors.primary} />
                <Text style={styles.insightLabel}>Accuracy Boost</Text>
                <Text style={styles.insightValue}>
                  +{truckFaxInsights.accuracyImprovement}%
                </Text>
              </View>

              <View style={styles.insightCard}>
                <Clock size={20} color={colors.status.warning} />
                <Text style={styles.insightLabel}>Early Detection</Text>
                <Text style={styles.insightValue}>
                  {truckFaxInsights.earlyDetectionDays} days
                </Text>
              </View>

              <View style={styles.insightCard}>
                <DollarSign size={20} color={colors.status.success} />
                <Text style={styles.insightLabel}>Cost Savings</Text>
                <Text style={styles.insightValue}>
                  ${truckFaxInsights.estimatedSavings}
                </Text>
              </View>
            </View>

            {truckFaxInsights.riskFactors && truckFaxInsights.riskFactors.length > 0 && (
              <View style={styles.riskSection}>
                <Text style={styles.riskTitle}>Risk Factors</Text>
                {truckFaxInsights.riskFactors.map((risk, index) => (
                  <View key={index} style={styles.riskItem}>
                    <AlertTriangle 
                      size={16} 
                      color={risk.severity === 'high' ? colors.status.error : 
                             risk.severity === 'medium' ? colors.status.warning : 
                             colors.status.success} 
                    />
                    <View style={styles.riskContent}>
                      <Text style={styles.riskComponent}>{risk.component}</Text>
                      <Text style={styles.riskDescription}>{risk.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderActions = () => (
    <View style={styles.actionsSection}>
      {truckFaxEnabled ? (
        <>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSync}
            disabled={isLoadingTruckFax}
          >
            <Zap size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>
              {isLoadingTruckFax ? 'Syncing...' : 'Sync Data'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.disconnectButton]}
            onPress={handleDisconnect}
          >
            <X size={20} color={colors.status.error} />
            <Text style={[styles.actionButtonText, { color: colors.status.error }]}>
              Disconnect
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>TruckFax Benefits</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <CheckCircle size={16} color={colors.status.success} />
              <Text style={styles.benefitText}>Enhanced prediction accuracy</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckCircle size={16} color={colors.status.success} />
              <Text style={styles.benefitText}>Historical maintenance data</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckCircle size={16} color={colors.status.success} />
              <Text style={styles.benefitText}>Certified repair shop network</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckCircle size={16} color={colors.status.success} />
              <Text style={styles.benefitText}>Cost optimization insights</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>TruckFax Integration</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {renderConnectionStatus()}
          {renderConnectionForm()}
          {renderVehicleInfo()}
          {renderPredictiveInsights()}
          {renderActions()}
        </ScrollView>
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
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  statusSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  statusTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
  },
  vinContainer: {
    backgroundColor: colors.background.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  vinLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  vinText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    fontFamily: 'monospace',
  },
  lastSync: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  connectionForm: {
    padding: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  formDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  vinInput: {
    backgroundColor: colors.background.secondary,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: colors.text.primary,
    fontFamily: 'monospace',
    marginBottom: 16,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  infoSection: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  expandIcon: {
    fontSize: 20,
    fontWeight: '300',
    color: colors.text.secondary,
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  infoLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  historySection: {
    marginTop: 16,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  historyItem: {
    backgroundColor: colors.background.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  historyMileage: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  historyDescription: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 4,
  },
  historyCost: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  insightsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  insightCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  insightLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  riskSection: {
    marginTop: 16,
  },
  riskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  riskContent: {
    flex: 1,
  },
  riskComponent: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  riskDescription: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  actionsSection: {
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  disconnectButton: {
    backgroundColor: colors.background.secondary,
  },
  benefitsSection: {
    marginTop: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 14,
    color: colors.text.primary,
  },
});

export default TruckFaxIntegration;