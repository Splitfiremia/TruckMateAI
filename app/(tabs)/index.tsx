import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Mic, Camera, Clock, AlertTriangle, Truck, DollarSign, Clipboard, Upload, Shield, Cloud, Coffee, Bed, LogOut } from 'lucide-react-native';
import AppBrand from '@/components/AppBrand';

import { colors } from '@/constants/colors';
import { ComplianceViolationPrediction, DutyStatus } from '@/types';
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
import { WeatherCard } from '@/components/WeatherCard';
import { WeatherAlertsModal } from '@/components/WeatherAlertsModal';
import DeviceDiscoveryPrompt from '@/components/DeviceDiscoveryPrompt';
import { useDeviceDiscovery } from '@/hooks/useDeviceDiscovery';
import { WeatherForecastModal } from '@/components/WeatherForecastModal';
import { WeatherNotificationSystem } from '@/components/WeatherNotificationSystem';
import MaintenanceSummaryCard from '@/components/MaintenanceSummaryCard';
import AIAssistantFAB from '@/components/AIAssistantFAB';
import ELDIntegrationCard from '@/components/ELDIntegrationCard';
import SmartDeviceOnboardingCard from '@/components/SmartDeviceOnboardingCard';
import { useUserStore } from '@/store/userStore';
import { useBrandingStore } from '@/store/brandingStore';
import { useLogbookStore } from '@/store/logbookStore';

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
  const [currentViolationPrediction, setCurrentViolationPrediction] = useState<ComplianceViolationPrediction | null>(null);
  const [isBeginningTrip, setIsBeginningTrip] = useState(false);
  const [weatherAlertsVisible, setWeatherAlertsVisible] = useState(false);
  const [weatherForecastVisible, setWeatherForecastVisible] = useState(false);
  
  const { lastCommand, lastResponse } = useVoiceCommandStore();
  const { 
    isInspectionRequired, 
    inspectionInProgress, 
    checkInspectionRequirement, 
    checkInspectionForTripStart,
    shouldShowInspectionPrompt,
    dismissInspectionPrompt 
  } = useInspectionStore();
  const { violationPredictions, activeAlerts, metrics } = usePredictiveComplianceStore();
  const { user, isOwnerOperator, isFleetCompany, logout } = useUserStore();
  const { settings } = useBrandingStore();
  const { currentStatus, changeStatus, startBreak, endBreak, isOnBreak, startTrip } = useLogbookStore();
  const { showDiscoveryPrompt, detectedDevice, dismissPrompt } = useDeviceDiscovery();
  
  useEffect(() => {
    // Check if inspection is required when component mounts (but don't show prompt)
    checkInspectionRequirement();
  }, []);
  
  useEffect(() => {
    // Only show inspection prompt when explicitly triggered for trip start
    if (shouldShowInspectionPrompt) {
      setInspectionRequiredModalVisible(true);
    }
  }, [shouldShowInspectionPrompt]);
  
  useEffect(() => {
    // Monitor for critical violation predictions
    const criticalPredictions = violationPredictions.filter(p => p.severity === 'Critical');
    if (criticalPredictions.length > 0 && !violationAlertVisible) {
      setCurrentViolationPrediction(criticalPredictions[0]);
      setViolationAlertVisible(true);
    }
  }, [violationPredictions, violationAlertVisible]);
  
  const handleStatusCardPress = () => {
    setStatusModalVisible(true);
  };
  
  const handleActionWithInspectionCheck = (action: () => void) => {
    action();
  };
  
  const handleCommandProcessed = (response: string) => {
    setCommandModalVisible(true);
  };
  
  const handleInspectionRequired = (isBeginningTripFlag: boolean = false) => {
    setIsBeginningTrip(isBeginningTripFlag);
    setInspectionModalVisible(true);
  };
  
  const handleInspectionComplete = () => {
    checkInspectionRequirement();
  };
  
  const handleViolationAlert = (prediction: ComplianceViolationPrediction) => {
    setCurrentViolationPrediction(prediction);
    setViolationAlertVisible(true);
  };
  
  const handleViolationActionTaken = (actionId: string) => {
    setViolationAlertVisible(false);
    setCurrentViolationPrediction(null);
  };
  
  const handleQuickStatusChange = (status: DutyStatus) => {
    // Determine if this is the beginning of a trip
    const isBeginningTrip = status === 'Driving' && 
      (currentStatus === 'Off Duty' || currentStatus === 'Sleeper Berth');
    
    // End break if currently on break
    if (isOnBreak && status !== 'Off Duty' && status !== 'Sleeper Berth') {
      endBreak();
    }
    
    // Start a new trip if beginning to drive
    if (isBeginningTrip) {
      startTrip();
    }
    
    // Check for inspection requirement when starting a trip
    if (status === 'Driving' && isBeginningTrip) {
      const needsInspection = checkInspectionForTripStart();
      if (needsInspection) {
        Alert.alert(
          'Trip Start - Pre-Trip Inspection Recommended',
          'A pre-trip inspection is recommended before beginning your trip for safety and compliance.',
          [
            { text: 'Start Trip Without Inspection', onPress: () => {
              dismissInspectionPrompt();
              changeStatus(status, true);
            }},
            { 
              text: 'Do Inspection First', 
              style: 'cancel',
              onPress: () => {
                handleInspectionRequired(isBeginningTrip);
              }
            }
          ]
        );
        return;
      }
    }
    
    // For non-trip driving changes, show warning but allow
    if (status === 'Driving' && !isBeginningTrip && isInspectionRequired) {
      Alert.alert(
        'Inspection Recommended',
        'A current pre-trip inspection is recommended for continued driving.',
        [
          { text: 'Continue Without Inspection', onPress: () => {
            changeStatus(status, true);
          }},
          { 
            text: 'Do Inspection', 
            style: 'cancel',
            onPress: () => {
              handleInspectionRequired(false);
            }
          }
        ]
      );
      return;
    }
    
    changeStatus(status, true);
  };
  
  const handleQuickBreakToggle = () => {
    if (isOnBreak) {
      endBreak();
    } else {
      startBreak();
    }
  };
  
  const getStatusColor = (status: DutyStatus) => {
    switch (status) {
      case 'Driving':
        return colors.primaryLight;
      case 'On Duty Not Driving':
        return colors.warning;
      case 'Off Duty':
        return colors.secondary;
      case 'Sleeper Berth':
        return colors.text.secondary;
      default:
        return colors.text.secondary;
    }
  };
  
  const handleStartInspection = () => {
    setIsBeginningTrip(true); // Assume inspection required modal is for trip start
    dismissInspectionPrompt();
    setInspectionRequiredModalVisible(false);
    setInspectionModalVisible(true);
  };
  
  // Use custom branding if available
  const welcomeMessage = settings.welcomeMessage || 'Welcome to TruckMate AI';
  const appName = settings.appName || 'TruckMate AI';
  const companyName = settings.companyName || user?.companyName;
  
  const handleLogOut = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: () => {
            logout();
          }
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <AppBrand size="small" showText={false} logoSize={40} />
            </View>
          ),
          headerTitleAlign: 'left',
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoGreetingContainer}>
              <AppBrand size="small" showText={false} logoSize={48} />
              <View style={styles.greetingTextContainer}>
                <Text style={[styles.greeting, { color: settings.primaryColor || colors.text.primary }]}>
                  Hello, {user?.name || driverInfo.name}
                </Text>
                <Text style={styles.subGreeting}>
                  {companyName || driverInfo.company}
                </Text>
                <Text style={styles.welcomeMessage}>{welcomeMessage}</Text>
              </View>
            </View>
            {settings.logoUrl && settings.showCompanyLogo && (
              <Image source={{ uri: settings.logoUrl }} style={styles.companyLogo} />
            )}
          </View>
          
          <View style={styles.headerRightContainer}>
            <AIAssistantFAB top={0} right={0} />
            <TouchableOpacity 
              style={styles.logOutButton}
              onPress={handleLogOut}
            >
              <LogOut size={20} color={colors.text.secondary} />
              <Text style={styles.logOutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <StatusCard onStatusChange={handleStatusCardPress} />
        
        <SmartDeviceOnboardingCard />
        
        {/* Quick Duty Status Change Section */}
        <View style={styles.quickStatusSection}>
          <View style={styles.quickStatusSectionHeader}>
            <Text style={styles.sectionTitle}>Quick Status Change</Text>
            <TouchableOpacity onPress={handleStatusCardPress}>
              <Text style={styles.seeAllText}>More Options</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.quickStatusGrid}>
            <TouchableOpacity 
              style={[
                styles.quickStatusButton,
                currentStatus === 'Driving' && styles.quickStatusButtonActive,
                { borderColor: getStatusColor('Driving') }
              ]}
              onPress={() => handleQuickStatusChange('Driving')}
            >
              <View style={[styles.quickStatusIcon, { backgroundColor: getStatusColor('Driving') }]}>
                <Truck size={20} color={colors.white} />
              </View>
              <Text style={[
                styles.quickStatusText,
                currentStatus === 'Driving' && styles.quickStatusTextActive
              ]}>Driving</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.quickStatusButton,
                currentStatus === 'On Duty Not Driving' && styles.quickStatusButtonActive,
                { borderColor: getStatusColor('On Duty Not Driving') }
              ]}
              onPress={() => handleQuickStatusChange('On Duty Not Driving')}
            >
              <View style={[styles.quickStatusIcon, { backgroundColor: getStatusColor('On Duty Not Driving') }]}>
                <Clock size={20} color={colors.white} />
              </View>
              <Text style={[
                styles.quickStatusText,
                currentStatus === 'On Duty Not Driving' && styles.quickStatusTextActive
              ]}>On Duty</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.quickStatusButton,
                currentStatus === 'Off Duty' && styles.quickStatusButtonActive,
                { borderColor: getStatusColor('Off Duty') }
              ]}
              onPress={() => handleQuickStatusChange('Off Duty')}
            >
              <View style={[styles.quickStatusIcon, { backgroundColor: getStatusColor('Off Duty') }]}>
                <Coffee size={20} color={colors.white} />
              </View>
              <Text style={[
                styles.quickStatusText,
                currentStatus === 'Off Duty' && styles.quickStatusTextActive
              ]}>Off Duty</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.quickStatusButton,
                currentStatus === 'Sleeper Berth' && styles.quickStatusButtonActive,
                { borderColor: getStatusColor('Sleeper Berth') }
              ]}
              onPress={() => handleQuickStatusChange('Sleeper Berth')}
            >
              <View style={[styles.quickStatusIcon, { backgroundColor: getStatusColor('Sleeper Berth') }]}>
                <Bed size={20} color={colors.white} />
              </View>
              <Text style={[
                styles.quickStatusText,
                currentStatus === 'Sleeper Berth' && styles.quickStatusTextActive
              ]}>Sleeper</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.breakToggleButton,
              isOnBreak && styles.breakToggleButtonActive
            ]}
            onPress={handleQuickBreakToggle}
          >
            <Text style={[
              styles.breakToggleText,
              isOnBreak && styles.breakToggleTextActive
            ]}>
              {isOnBreak ? '⏹ End Break' : '⏸ Start 30-Min Break'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <WeatherCard onPress={() => setWeatherForecastVisible(true)} />
        
        <MaintenanceSummaryCard />
        
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
          <View style={styles.quickActionRow}>
            <QuickActionButton 
              icon={<Clock size={20} color={colors.text.primary} />}
              label="Change Status"
              onPress={() => handleActionWithInspectionCheck(() => setStatusModalVisible(true))}
              color={colors.primaryLight}
            />
            
            <QuickActionButton 
              icon={<Clipboard size={20} color={colors.text.primary} />}
              label="Pre-Trip Inspection"
              onPress={() => setInspectionModalVisible(true)}
              color={colors.secondary}
            />
            
            <QuickActionButton 
              icon={<Camera size={20} color={colors.text.primary} />}
              label="Scan Receipt"
              onPress={() => handleActionWithInspectionCheck(() => setScannerVisible(true))}
              color={colors.secondary}
            />
          </View>
          
          <View style={styles.quickActionRow}>
            <QuickActionButton 
              icon={<Upload size={20} color={colors.text.primary} />}
              label="Bulk Upload"
              onPress={() => handleActionWithInspectionCheck(() => setBulkUploadVisible(true))}
              color={colors.primaryLight}
            />
            
            <QuickActionButton 
              icon={<Shield size={20} color={colors.text.primary} />}
              label="DOT Assistant"
              onPress={() => handleActionWithInspectionCheck(() => setDotAssistantVisible(true))}
              color={colors.secondary}
            />
            
            <QuickActionButton 
              icon={<AlertTriangle size={20} color={colors.text.primary} />}
              label="AI Compliance"
              onPress={() => handleActionWithInspectionCheck(() => setPredictiveComplianceVisible(true))}
              color={violationPredictions.length > 0 ? colors.warning : colors.primaryLight}
            />
          </View>
          
          <View style={styles.quickActionRow}>
            <QuickActionButton 
              icon={<Cloud size={20} color={colors.text.primary} />}
              label="Weather Forecast"
              onPress={() => setWeatherForecastVisible(true)}
              color={colors.primaryLight}
            />
            
            <View style={styles.quickActionPlaceholder} />
            <View style={styles.quickActionPlaceholder} />
          </View>
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
        isBeginningTrip={isBeginningTrip}
      />
      
      <InspectionRequiredModal
        visible={inspectionRequiredModalVisible}
        onStartInspection={handleStartInspection}
        onDismiss={() => {
          dismissInspectionPrompt();
          setInspectionRequiredModalVisible(false);
        }}
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
      
      {/* Weather Modals */}
      <WeatherAlertsModal
        visible={weatherAlertsVisible}
        onClose={() => setWeatherAlertsVisible(false)}
      />
      
      <WeatherForecastModal
        visible={weatherForecastVisible}
        onClose={() => setWeatherForecastVisible(false)}
      />
      
      {/* Weather Notification System */}
      <WeatherNotificationSystem
        onNotificationPress={(alert) => {
          setWeatherAlertsVisible(true);
        }}
      />
      
      {/* Device Discovery Prompt */}
      <DeviceDiscoveryPrompt
        visible={showDiscoveryPrompt}
        onClose={dismissPrompt}
        detectedDevice={detectedDevice ?? undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  welcomeMessage: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  logoGreetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  greetingTextContainer: {
    flex: 1,
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginTop: 8,
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
    color: colors.text.primary,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primaryLight,
  },
  quickActions: {
    marginBottom: 8,
  },
  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },
  quickActionPlaceholder: {
    flex: 1,
    minWidth: 80,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
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
    color: colors.text.primary,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
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
    backgroundColor: colors.background.secondary,
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
    color: colors.text.primary,
  },
  predictiveSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
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
    color: colors.text.secondary,
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
    backgroundColor: colors.background.primary,
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
    color: colors.text.primary,
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
    color: colors.text.secondary,
  },
  quickStatusSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickStatusSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickStatusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  quickStatusButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background.primary,
    position: 'relative',
  },
  quickStatusButtonActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 2,
  },
  quickStatusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
    textAlign: 'center',
  },
  quickStatusTextActive: {
    color: colors.primaryLight,
  },
  quickStatusWarning: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  breakToggleButton: {
    backgroundColor: colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  breakToggleButtonActive: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  breakToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  breakToggleTextActive: {
    color: colors.white,
  },
  headerRightContainer: {
    alignItems: 'flex-end',
    gap: 12,
  },
  logOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  logOutText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});