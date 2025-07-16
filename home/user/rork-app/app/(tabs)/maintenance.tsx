import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal
} from 'react-native';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Settings,
  Star,
  Wrench,
  Zap,
  TrendingUp,
  Shield,
  Calendar,
  Database,
  X
} from 'lucide-react-native';
import { Stack } from 'expo-router';

import { colors } from '@/constants/colors';
import { usePredictiveMaintenanceStore } from '@/store/predictiveMaintenanceStore';
import { MaintenancePrediction, MaintenanceAlert, RepairShop } from '@/types';
import VehicleHealthDashboard from '@/components/VehicleHealthDashboard';
import MaintenanceAlertCard from '@/components/MaintenanceAlertCard';
import PredictiveMaintenanceCard from '@/components/PredictiveMaintenanceCard';
import TruckFaxIntegration from '@/components/TruckFaxIntegration';

const MaintenancePage = () => {
  const {
    currentDiagnostics,
    predictions,
    alerts,
    vehicleHealth,
    nearbyShops,
    isAnalyzing,
    isLoadingShops,
    lastAnalysis,
    isSimulating,
    truckFaxEnabled,
    truckFaxData,
    isLoadingTruckFax,
    runPredictiveAnalysis,
    dismissAlert,
    findNearbyShops,
    findTruckFaxCertifiedShops,
    startSimulation,
    stopSimulation
  } = usePredictiveMaintenanceStore();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<MaintenancePrediction | null>(null);
  const [showShopsModal, setShowShopsModal] = useState(false);
  const [showTruckFaxModal, setShowTruckFaxModal] = useState(false);

  useEffect(() => {
    // Start simulation on component mount
    if (!isSimulating) {
      startSimulation();
    }
    
    // Cleanup on unmount
    return () => {
      stopSimulation();
    };
  }, []);

  const toggleSimulation = () => {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await runPredictiveAnalysis();
    setRefreshing(false);
  };

  const handlePredictionPress = (prediction: MaintenancePrediction) => {
    setSelectedPrediction(prediction);
  };

  const handleFindShops = async () => {
    setShowShopsModal(true);
    if (nearbyShops.length === 0) {
      await findNearbyShops();
    }
  };

  const handleCallShop = (phone: string) => {
    Alert.alert(
      'Call Shop',
      `Would you like to call ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling:', phone) }
      ]
    );
  };

  const renderPredictionModal = () => {
    if (!selectedPrediction) return null;

    return (
      <Modal
        visible={!!selectedPrediction}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedPrediction(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedPrediction.component}</Text>
            <TouchableOpacity
              onPress={() => setSelectedPrediction(null)}
              style={styles.closeButton}
            >
              <X size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.predictionDetails}>
              <View style={styles.severityBadge}>
                <AlertTriangle 
                  size={16} 
                  color={selectedPrediction.severity === 'high' ? colors.status.error : 
                         selectedPrediction.severity === 'medium' ? colors.status.warning : 
                         colors.status.success} 
                />
                <Text style={[styles.severityText, {
                  color: selectedPrediction.severity === 'high' ? colors.status.error : 
                         selectedPrediction.severity === 'medium' ? colors.status.warning : 
                         colors.status.success
                }]}>
                  {selectedPrediction.severity.toUpperCase()} PRIORITY
                </Text>
              </View>

              <Text style={styles.predictionDescription}>
                {selectedPrediction.description}
              </Text>

              <View style={styles.predictionStats}>
                <View style={styles.statItem}>
                  <Clock size={16} color={colors.text.secondary} />
                  <Text style={styles.statLabel}>Estimated Time</Text>
                  <Text style={styles.statValue}>{selectedPrediction.estimatedMiles} miles</Text>
                </View>

                <View style={styles.statItem}>
                  <TrendingUp size={16} color={colors.text.secondary} />
                  <Text style={styles.statLabel}>Confidence</Text>
                  <Text style={styles.statValue}>{Math.round(selectedPrediction.confidence * 100)}%</Text>
                </View>
              </View>

              <View style={styles.recommendationsSection}>
                <Text style={styles.sectionTitle}>Recommendations</Text>
                {selectedPrediction.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <CheckCircle size={16} color={colors.primary} />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.findShopsButton}
                onPress={() => {
                  setSelectedPrediction(null);
                  handleFindShops();
                }}
              >
                <MapPin size={20} color={colors.white} />
                <Text style={styles.findShopsButtonText}>Find Certified Shops</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const renderShopsModal = () => (
    <Modal
      visible={showShopsModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowShopsModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Nearby Repair Shops</Text>
          <TouchableOpacity
            onPress={() => setShowShopsModal(false)}
            style={styles.closeButton}
          >
            <X size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {isLoadingShops ? (
            <View style={styles.loadingContainer}>
              <Activity size={24} color={colors.primary} />
              <Text style={styles.loadingText}>Finding nearby shops...</Text>
            </View>
          ) : (
            nearbyShops.map((shop) => (
              <View key={shop.id} style={styles.shopCard}>
                <View style={styles.shopHeader}>
                  <Text style={styles.shopName}>{shop.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={16} color={colors.status.warning} />
                    <Text style={styles.rating}>{shop.rating}</Text>
                  </View>
                </View>

                <Text style={styles.shopAddress}>{shop.address}</Text>
                <Text style={styles.shopDistance}>{shop.distance} miles away</Text>

                <View style={styles.shopSpecialties}>
                  {shop.specialties.map((specialty, index) => (
                    <View key={index} style={styles.specialtyTag}>
                      <Text style={styles.specialtyText}>{specialty}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.shopActions}>
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => handleCallShop(shop.phone)}
                  >
                    <Phone size={16} color={colors.white} />
                    <Text style={styles.callButtonText}>Call</Text>
                  </TouchableOpacity>

                  {shop.truckFaxCertified && (
                    <View style={styles.certifiedBadge}>
                      <Shield size={16} color={colors.primary} />
                      <Text style={styles.certifiedText}>TruckFax Certified</Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Predictive Maintenance',
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => setShowTruckFaxModal(true)}
                style={styles.headerButton}
              >
                <Database size={20} color={truckFaxEnabled ? colors.primary : colors.text.secondary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleSimulation}
                style={styles.headerButton}
              >
                <Zap size={20} color={isSimulating ? colors.status.success : colors.text.secondary} />
              </TouchableOpacity>
            </View>
          )
        }} 
      />

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Vehicle Health Dashboard */}
        {vehicleHealth && (
          <View style={styles.section}>
            <VehicleHealthDashboard 
              vehicleHealth={vehicleHealth}
              onSystemPress={(system) => console.log('System pressed:', system)}
            />
          </View>
        )}

        {/* Active Alerts */}
        {alerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Alerts</Text>
            {alerts.map((alert) => (
              <MaintenanceAlertCard
                key={alert.id}
                alert={alert}
                onDismiss={() => dismissAlert(alert.id)}
                onViewShops={(alert) => {
                  setSelectedPrediction(null);
                  handleFindShops();
                }}
              />
            ))}
          </View>
        )}

        {/* Predictive Analysis */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Predictive Analysis</Text>
            {lastAnalysis && (
              <Text style={styles.lastAnalysis}>
                Last updated: {new Date(lastAnalysis).toLocaleTimeString()}
              </Text>
            )}
          </View>

          {isAnalyzing ? (
            <View style={styles.loadingContainer}>
              <Activity size={24} color={colors.primary} />
              <Text style={styles.loadingText}>Analyzing vehicle data...</Text>
            </View>
          ) : predictions.length > 0 ? (
            predictions.map((prediction) => (
              <PredictiveMaintenanceCard
                key={prediction.id}
                prediction={prediction}
                onPress={() => handlePredictionPress(prediction)}
              />
            ))
          ) : (
            <View style={styles.noPredictionsContainer}>
              <CheckCircle size={48} color={colors.status.success} />
              <Text style={styles.noPredictionsTitle}>All Systems Healthy</Text>
              <Text style={styles.noPredictionsText}>
                No maintenance issues predicted in the near future
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleFindShops}
          >
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Find Nearby Shops</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => runPredictiveAnalysis()}
            disabled={isAnalyzing}
          >
            <TrendingUp size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Run Analysis</Text>
          </TouchableOpacity>

          {truckFaxEnabled && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => findTruckFaxCertifiedShops()}
            >
              <Shield size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}>Find TruckFax Certified Shops</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {renderPredictionModal()}
      {renderShopsModal()}
      
      <TruckFaxIntegration
        visible={showTruckFaxModal}
        onClose={() => setShowTruckFaxModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  lastAnalysis: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  noPredictionsContainer: {
    alignItems: 'center',
    padding: 32,
  },
  noPredictionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
  },
  noPredictionsText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
  },
  predictionDetails: {
    padding: 16,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 16,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  predictionDescription: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: 24,
  },
  predictionStats: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  findShopsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  findShopsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  shopCard: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  shopAddress: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  shopDistance: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  shopSpecialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  specialtyTag: {
    backgroundColor: colors.background.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  specialtyText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  shopActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
  },
  certifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  certifiedText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default MaintenancePage;