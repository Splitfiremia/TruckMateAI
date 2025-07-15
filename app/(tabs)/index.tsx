import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Mic, Camera, Clock, AlertTriangle, Truck, DollarSign, Clipboard, Upload, Shield } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { driverInfo, upcomingLoads, weeklyStats } from '@/constants/mockData';
import StatusCard from '@/components/StatusCard';
import ComplianceAlert from '@/components/ComplianceAlert';
import UpcomingLoadCard from '@/components/UpcomingLoadCard';
import QuickActionButton from '@/components/QuickActionButton';
import VoiceCommandButton from '@/components/VoiceCommandButton';
import StatusChangeModal from '@/components/StatusChangeModal';
import CommandResponseModal from '@/components/CommandResponseModal';
import ReceiptScanner from '@/components/ReceiptScanner';
import BulkReceiptUpload from '@/components/BulkReceiptUpload';
import PreTripInspectionModal from '@/components/PreTripInspectionModal';
import InspectionRequiredModal from '@/components/InspectionRequiredModal';
import DOTInspectionAssistant from '@/components/DOTInspectionAssistant';
import DOTInspectionCard from '@/components/DOTInspectionCard';
import { PredictiveComplianceDashboard } from '@/components/PredictiveComplianceDashboard';
import { ViolationPreventionAlert } from '@/components/ViolationPreventionAlert';
import { RealTimeComplianceMonitor } from '@/components/RealTimeComplianceMonitor';
import { ComplianceNotificationSystem } from '@/components/ComplianceNotificationSystem';
import { useVoiceCommandStore } from '@/store/voiceCommandStore';
import { useInspectionStore } from '@/store/inspectionStore';
import { usePredictiveComplianceStore } from '@/store/predictiveComplianceStore';

export default function DashboardScreen() {
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [commandModalVisible, setCommandModalVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [bulkUploadVisible, setBulkUploadVisible] = useState(false);
  const [inspectionModalVisible, setInspectionModalVisible] = useState(false);
  const [inspectionRequiredModalVisible, setInspectionRequiredModalVisible] = useState(false);
  const [dotAssistantVisible, setDotAssistantVisible] = useState(false);
  const [predictiveComplianceVisible, setPredictiveComplianceVisible] = useState(false);
  const [violationAlertVisible, setViolationAlertVisible] = useState(false);
  const [currentViolationPrediction, setCurrentViolationPrediction] = useState(null);
  
  const { lastCommand, lastResponse } = useVoiceCommandStore();
  const { isInspectionRequired, checkInspectionRequirement } = useInspectionStore();
  const { violationPredictions, activeAlerts, metrics } = usePredictiveComplianceStore();
  
  useEffect(() => {
    // Check if inspection is required when component mounts
    checkInspectionRequirement();
  }, []);
  
  useEffect(() => {
    // Show inspection required modal if needed
    if (isInspectionRequired) {
      setInspectionRequiredModalVisible(true);
    }
  }, [isInspectionRequired]);
  
  useEffect(() => {
    // Monitor for critical violation predictions
    const criticalPredictions = violationPredictions.filter(p => p.severity === 'Critical');
    if (criticalPredictions.length > 0 && !violationAlertVisible) {
      setCurrentViolationPrediction(criticalPredictions[0]);
      setViolationAlertVisible(true);
    }
  }, [violationPredictions, violationAlertVisible]);
  
  const handleStatusCardPress = () => {
    if (isInspectionRequired) {
      setInspectionRequiredModalVisible(true);
    } else {
      setStatusModalVisible(true);
    }
  };
  
  const handleCommandProcessed = (response: string) => {
    setCommandModalVisible(true);
  };
  
  const handleInspectionRequired = () => {
    setInspectionModalVisible(true);
  };
  
  const handleInspectionComplete = () => {
    checkInspectionRequirement();
  };
  
  const handleViolationAlert = (prediction) => {
    setCurrentViolationPrediction(prediction);
    setViolationAlertVisible(true);
  };
  
  const handleViolationActionTaken = (actionId) => {
    setViolationAlertVisible(false);
    setCurrentViolationPrediction(null);
  };
  
  const handleStartInspection = () => {
    setInspectionRequiredModalVisible(false);
    setInspectionModalVisible(true);
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'TruckMate',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {driverInfo.name}</Text>
            <Text style={styles.subGreeting}>{driverInfo.company}</Text>
          </View>
        </View>
        
        <StatusCard onStatusChange={handleStatusCardPress} />
        
        <ComplianceAlert />
        
        {/* Real-Time Compliance Monitor */}
        <RealTimeComplianceMonitor 
          onViolationAlert={handleViolationAlert}
          onViewDetails={() => setPredictiveComplianceVisible(true)}
        />
        
        <DOTInspectionCard onPress={() => setDotAssistantVisible(true)} />
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        
        <View style={styles.quickActions}>
          <QuickActionButton 
            icon={<Clock size={20} color={colors.text} />}
            label="Change Status"
            onPress={() => {
              if (isInspectionRequired) {
                setInspectionRequiredModalVisible(true);
              } else {
                setStatusModalVisible(true);
              }
            }}
            color={colors.primaryLight}
          />
          
          <QuickActionButton 
            icon={<Clipboard size={20} color={colors.text} />}
            label="Pre-Trip"
            onPress={() => setInspectionModalVisible(true)}
            color={isInspectionRequired ? colors.warning : colors.secondary}
          />
          
          <QuickActionButton 
            icon={<Camera size={20} color={colors.text} />}
            label="Scan Receipt"
            onPress={() => setScannerVisible(true)}
            color={colors.secondary}
          />
          
          <QuickActionButton 
            icon={<Upload size={20} color={colors.text} />}
            label="Bulk Upload"
            onPress={() => setBulkUploadVisible(true)}
            color={colors.primaryLight}
          />
          
          <QuickActionButton 
            icon={<Shield size={20} color={colors.text} />}
            label="DOT Assistant"
            onPress={() => setDotAssistantVisible(true)}
            color={colors.secondary}
          />
          
          <QuickActionButton 
            icon={<AlertTriangle size={20} color={colors.text} />}
            label="AI Compliance"
            onPress={() => setPredictiveComplianceVisible(true)}
            color={violationPredictions.length > 0 ? colors.warning : colors.primaryLight}
          />
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Loads</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {upcomingLoads.map((load) => (
          <UpcomingLoadCard key={load.id} load={load} />
        ))}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weekly Stats</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{weeklyStats.drivingHours}h</Text>
            <Text style={styles.statLabel}>Driving Hours</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{weeklyStats.milesLogged}</Text>
            <Text style={styles.statLabel}>Miles Logged</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statValueContainer}>
              <DollarSign size={14} color={colors.secondary} />
              <Text style={[styles.statValue, { color: colors.secondary }]}>
                {weeklyStats.revenue.toFixed(0)}
              </Text>
            </View>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{weeklyStats.violations}</Text>
            <Text style={styles.statLabel}>Violations</Text>
          </View>
        </View>
        
        <View style={styles.footer} />
      </ScrollView>
      
      <View style={styles.voiceButtonContainer}>
        <VoiceCommandButton onCommandProcessed={handleCommandProcessed} />
      </View>
      
      <StatusChangeModal 
        visible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        onInspectionRequired={handleInspectionRequired}
      />
      
      <CommandResponseModal
        visible={commandModalVisible}
        onClose={() => setCommandModalVisible(false)}
        command={lastCommand}
        response={lastResponse}
      />
      
      <ReceiptScanner
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
      />
      
      <BulkReceiptUpload
        visible={bulkUploadVisible}
        onClose={() => setBulkUploadVisible(false)}
        onUploadComplete={(receipts) => {
          console.log('Bulk upload completed:', receipts.length, 'receipts');
        }}
      />
      
      <PreTripInspectionModal
        visible={inspectionModalVisible}
        onClose={() => setInspectionModalVisible(false)}
        onComplete={handleInspectionComplete}
      />
      
      <InspectionRequiredModal
        visible={inspectionRequiredModalVisible}
        onStartInspection={handleStartInspection}
      />
      
      <DOTInspectionAssistant
        visible={dotAssistantVisible}
        onClose={() => setDotAssistantVisible(false)}
      />
      
      {/* Predictive Compliance Dashboard Modal */}
      {predictiveComplianceVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>AI Predictive Compliance</Text>
            <TouchableOpacity 
              onPress={() => setPredictiveComplianceVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>
          </View>
          <PredictiveComplianceDashboard onViolationAlert={handleViolationAlert} />
        </View>
      )}
      
      {/* Violation Prevention Alert */}
      {currentViolationPrediction && (
        <ViolationPreventionAlert
          prediction={currentViolationPrediction}
          visible={violationAlertVisible}
          onDismiss={() => setViolationAlertVisible(false)}
          onActionTaken={handleViolationActionTaken}
        />
      )}
      
      {/* Compliance Notification System */}
      <ComplianceNotificationSystem 
        onNotificationPress={(alert) => {
          if (alert.type === 'Violation Prevention') {
            setPredictiveComplianceVisible(true);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primaryLight,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  footer: {
    height: 100, // Space for the floating button
  },
  voiceButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  predictiveComplianceCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  predictiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  predictiveInfo: {
    flex: 1,
  },
  predictiveTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  predictiveSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  riskIndicator: {
    alignItems: 'center',
  },
  riskScore: {
    fontSize: 20,
    fontWeight: '700',
  },
  riskLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  nextViolation: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: 1000,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 20,
    color: colors.textSecondary,
  },
});