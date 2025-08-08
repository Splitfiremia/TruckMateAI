import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Mic, Camera, Clock, AlertTriangle, Truck, DollarSign, Clipboard, Upload, Shield, Cloud, Activity, Settings, Route, ScanLine, CheckCircle2, Sun, Wrench, Link as LinkIcon, Sparkles, BookOpen, Package as PackageIcon } from 'lucide-react-native';
import AppBrand from '@/components/AppBrand';

import { colors } from '@/constants/colors';
import { ComplianceViolationPrediction, DutyStatus } from '@/types';
import { driverInfo, upcomingLoads, weeklyStats } from '@/constants/mockData';
import StatusCard from '@/components/StatusCard';
import ComplianceAlert from '@/components/ComplianceAlert';
import UpcomingLoadCard from '@/components/UpcomingLoadCard';
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
  
  const primaryNavTiles = [
    { key: 'logbook', label: 'Logbook', route: '/logbook', icon: BookOpen },
    { key: 'loads', label: 'Loads', route: '/loads', icon: PackageIcon },
    { key: 'receipts', label: 'Receipts', route: '/receipts', icon: ScanLine },
    { key: 'routes', label: 'Routes', route: '/route-optimization', icon: Route },
    { key: 'weather', label: 'Weather', route: '/weather', icon: Sun },
    { key: 'compliance', label: 'Compliance', route: '/compliance', icon: CheckCircle2 },
  ] as const;
  
  const secondaryNavTiles = [
    { key: 'eld', label: 'ELD', route: '/eld-integration', icon: Activity },
    { key: 'maintenance', label: 'Maintenance', route: '/maintenance', icon: Wrench },
    { key: 'ai', label: 'AI Assist', route: '/ai-assistant', icon: Sparkles },
    { key: 'integrations', label: 'Integrations', route: '/integrations', icon: LinkIcon },
    { key: 'pricing', label: 'Pricing', route: '/pricing', icon: DollarSign },
    { key: 'settings', label: 'Settings', route: '/settings', icon: Settings },
  ] as const;
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />
      
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/settings')} testID="menuButton" accessibilityRole="button" accessibilityLabel="Open settings">
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </TouchableOpacity>
          <View style={styles.headerBrand}>
            <AppBrand size="small" showText={true} logoSize={28} />
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={handleLogOut}
          >
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>
                {(user?.name || driverInfo.name).charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileDropdown}>
              <Text style={styles.profileDropdownText}>▼</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Welcome, {(user?.name || driverInfo.name).split(' ')[0]}!
          </Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
        </View>
        
        {/* Primary Nav Tiles - 3x2 Grid */}
        <View style={styles.primaryNavGrid}>
          {primaryNavTiles.map((tile) => {
            const IconComp = tile.icon as any;
            return (
              <TouchableOpacity
                key={tile.key}
                testID={`navTile-${tile.key}`}
                style={styles.primaryNavTile}
                onPress={() => router.push(tile.route as any)}
              >
                <View style={styles.primaryNavTileIconWrap}>
                  <IconComp color={colors.primary} size={28} />
                </View>
                <Text style={styles.primaryNavTileLabel}>{tile.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Secondary Nav Tiles - 3x2 Grid */}
        <View style={styles.secondaryNavGrid}>
          {secondaryNavTiles.map((tile) => {
            const IconComp = tile.icon as any;
            return (
              <TouchableOpacity
                key={tile.key}
                testID={`navTile-${tile.key}`}
                style={styles.secondaryNavTile}
                onPress={() => router.push(tile.route as any)}
              >
                <View style={styles.secondaryNavTileIconWrap}>
                  <IconComp color={colors.primary} size={24} />
                </View>
                <Text style={styles.secondaryNavTileLabel}>{tile.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        

        
        {/* Current Status Card */}
        <StatusCard onStatusChange={handleStatusCardPress} />
        
        <SmartDeviceOnboardingCard />
        
        {/* Upcoming Appointment Card */}
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <View style={styles.appointmentDateContainer}>
              <View style={styles.appointmentCalendar}>
                <Text style={styles.appointmentMonth}>Aug</Text>
                <Text style={styles.appointmentDay}>16</Text>
                <Text style={styles.appointmentDayName}>Sat</Text>
              </View>
            </View>
            <View style={styles.appointmentDetails}>
              <Text style={styles.appointmentTitle}>Next Load Pickup</Text>
              <View style={styles.appointmentTime}>
                <Clock size={16} color={colors.text.secondary} />
                <Text style={styles.appointmentTimeText}>Starts at 2:45 PM EDT</Text>
              </View>
              <View style={styles.appointmentLocation}>
                <Text style={styles.appointmentLocationText}>📍 Distribution Center - Atlanta, GA</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsText}>View details</Text>
          </TouchableOpacity>
        </View>
        
        {/* Recent Activity Card */}
        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <View style={styles.activityIcon}>
              <Activity size={16} color={colors.primary} />
            </View>
            <Text style={styles.activityTitle}>Recent Activity</Text>
          </View>
          <Text style={styles.activityDescription}>
            You completed your pre-trip inspection and logged 8.5 hours of driving time yesterday. Great work maintaining compliance!
          </Text>
          <TouchableOpacity style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsText}>View details</Text>
          </TouchableOpacity>
        </View>
        
        {/* Compliance and Weather Cards */}
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
      
      {/* AI Assistant FAB positioned in top right */}
      <AIAssistantFAB top={140} right={16} />
      
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
    flexDirection: 'row',
    alignItems: 'center',
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
    gap: 8,
    position: 'relative',
    minWidth: 120,
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
  // New styles for redesigned dashboard
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  menuButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: colors.white,
    borderRadius: 1,
  },
  headerBrand: {
    marginLeft: 16,
  },
  headerRight: {
    alignItems: 'center',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  profileDropdown: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDropdownText: {
    fontSize: 12,
    color: colors.white,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  editButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 18,
  },
  primaryNavGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
  },
  primaryNavTile: {
    width: '31%',
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryNavTileIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(37, 99, 235, 0.2)',
    marginBottom: 12,
  },
  primaryNavTileLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  secondaryNavGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  secondaryNavTile: {
    width: '31%',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  secondaryNavTileIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.15)',
    marginBottom: 10,
  },
  secondaryNavTileLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  mainActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  mainActionCard: {
    width: '48%',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mainActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mainActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  appointmentCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  appointmentHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  appointmentDateContainer: {
    alignItems: 'center',
  },
  appointmentCalendar: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  appointmentMonth: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  appointmentDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  appointmentDayName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  appointmentTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  appointmentTimeText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  appointmentLocation: {
    marginTop: 4,
  },
  appointmentLocationText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  viewDetailsButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  activityCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  activityIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  activityDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
});