import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin,
  Navigation,
  AlertTriangle,
  MessageCircle,
  Fuel,
  Clock,
  Route,
  User,
  LogOut,
  Play,
  Pause,
  Phone,
  Camera,
  Settings,
  ArrowLeft,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useDriverStore } from '@/store/driverStore';

export default function DriverDashboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const {
    driver,
    currentTrip,
    assignedVehicle,
    todayStats,
    unreadCount,
    logout,
    startTrip,
    pauseTrip,
    resumeTrip,
  } = useDriverStore();

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/driver-login');
          },
        },
      ]
    );
  };

  const handleStartTrip = () => {
    const mockTrip = {
      id: Date.now().toString(),
      driverId: driver?.id || '',
      startLocation: {
        address: '123 Main St, City, State',
        coordinates: { lat: 40.7128, lng: -74.0060 },
      },
      destination: {
        address: '456 Oak Ave, Another City, State',
        coordinates: { lat: 40.7589, lng: -73.9851 },
      },
      status: 'pending' as const,
    };
    startTrip(mockTrip);
  };

  const handleTripAction = () => {
    if (!currentTrip) return;
    
    if (currentTrip.status === 'in-progress') {
      pauseTrip();
    } else {
      resumeTrip();
    }
  };

  const handleEmergency = () => {
    Alert.alert(
      'Emergency SOS',
      'This will contact emergency services and your dispatcher. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Emergency', style: 'destructive', onPress: () => {
          Alert.alert('Emergency', 'Emergency services contacted');
        }},
      ]
    );
  };

  if (!driver) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please log in to continue</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.replace('/driver-login')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/driver-login')} style={styles.backButton}>
          <ArrowLeft color={colors.text.primary} size={24} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.avatarContainer}>
            <User color={colors.primary} size={24} />
          </View>
          <View>
            <Text style={styles.greeting}>Hello, {driver.name.split(' ')[0]}!</Text>
            <Text style={styles.subGreeting}>Ready for today&apos;s journey</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut color={colors.text.tertiary} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Active Trip Card */}
        {currentTrip ? (
          <View style={styles.activeTripCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Navigation color={colors.primary} size={20} />
                <Text style={styles.cardTitle}>Active Trip</Text>
              </View>
              <View style={[styles.statusBadge, 
                currentTrip.status === 'in-progress' ? styles.statusActive : styles.statusPaused
              ]}>
                <Text style={styles.statusText}>
                  {currentTrip.status === 'in-progress' ? 'In Progress' : 'Paused'}
                </Text>
              </View>
            </View>
            
            <View style={styles.tripDetails}>
              <View style={styles.locationRow}>
                <MapPin color={colors.success} size={16} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {currentTrip.startLocation.address}
                </Text>
              </View>
              <View style={styles.locationRow}>
                <MapPin color={colors.danger} size={16} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {currentTrip.destination.address}
                </Text>
              </View>
            </View>

            <View style={styles.tripActions}>
              <TouchableOpacity
                style={[styles.tripActionButton, styles.primaryAction]}
                onPress={handleTripAction}
              >
                {currentTrip.status === 'in-progress' ? (
                  <Pause color={colors.white} size={18} />
                ) : (
                  <Play color={colors.white} size={18} />
                )}
                <Text style={styles.tripActionText}>
                  {currentTrip.status === 'in-progress' ? 'Pause' : 'Resume'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tripActionButton, styles.emergencyAction]}
                onPress={handleEmergency}
              >
                <Phone color={colors.white} size={18} />
                <Text style={styles.tripActionText}>SOS</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.noTripCard}>
            <Route color={colors.text.tertiary} size={48} />
            <Text style={styles.noTripTitle}>No Active Trip</Text>
            <Text style={styles.noTripSubtitle}>Ready to start your next journey?</Text>
            <TouchableOpacity style={styles.startTripButton} onPress={handleStartTrip}>
              <Play color={colors.white} size={18} />
              <Text style={styles.startTripText}>Start Trip</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionButton}>
              <AlertTriangle color={colors.warning} size={24} />
              <Text style={styles.quickActionText}>Report Issue</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <MessageCircle color={colors.primary} size={24} />
              <Text style={styles.quickActionText}>Messages</Text>
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Camera color={colors.accent} size={24} />
              <Text style={styles.quickActionText}>Proof of Delivery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Settings color={colors.text.secondary} size={24} />
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Vehicle Status */}
        {assignedVehicle && (
          <View style={styles.vehicleCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Fuel color={colors.primary} size={20} />
                <Text style={styles.cardTitle}>Vehicle Status</Text>
              </View>
            </View>
            
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleTitle}>
                {assignedVehicle.year} {assignedVehicle.make} {assignedVehicle.model}
              </Text>
              <Text style={styles.vehicleSubtitle}>
                {assignedVehicle.licensePlate}
              </Text>
            </View>

            <View style={styles.vehicleStats}>
              <View style={styles.vehicleStat}>
                <Text style={styles.vehicleStatValue}>{assignedVehicle.fuelLevel}%</Text>
                <Text style={styles.vehicleStatLabel}>Fuel Level</Text>
              </View>
              <View style={styles.vehicleStat}>
                <Text style={styles.vehicleStatValue}>
                  {(assignedVehicle.mileage / 1000).toFixed(0)}K
                </Text>
                <Text style={styles.vehicleStatLabel}>Miles</Text>
              </View>
              <View style={styles.vehicleStat}>
                <Text style={styles.vehicleStatValue}>
                  {assignedVehicle.maintenanceAlerts.length}
                </Text>
                <Text style={styles.vehicleStatLabel}>Alerts</Text>
              </View>
            </View>

            {assignedVehicle.maintenanceAlerts.length > 0 && (
              <View style={styles.alertsContainer}>
                {assignedVehicle.maintenanceAlerts.slice(0, 2).map((alert) => (
                  <View key={alert.id} style={styles.alertItem}>
                    <AlertTriangle 
                      color={alert.type === 'critical' ? colors.danger : colors.warning} 
                      size={16} 
                    />
                    <Text style={styles.alertText}>{alert.message}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Today's Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Clock color={colors.primary} size={20} />
              <Text style={styles.cardTitle}>Today&apos;s Summary</Text>
            </View>
          </View>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{todayStats.tripsCompleted}</Text>
              <Text style={styles.summaryLabel}>Trips Completed</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{todayStats.hoursWorked.toFixed(1)}h</Text>
              <Text style={styles.summaryLabel}>Hours Driven</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{todayStats.idleTime}m</Text>
              <Text style={styles.summaryLabel}>Idle Time</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{todayStats.distanceTraveled}mi</Text>
              <Text style={styles.summaryLabel}>Distance</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  activeTripCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  noTripCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 32,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  noTripTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
  },
  noTripSubtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 4,
    marginBottom: 24,
  },
  startTripButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  startTripText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: colors.success,
  },
  statusPaused: {
    backgroundColor: colors.warning,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  tripDetails: {
    marginBottom: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
  },
  tripActions: {
    flexDirection: 'row',
    gap: 12,
  },
  tripActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  primaryAction: {
    backgroundColor: colors.primary,
  },
  emergencyAction: {
    backgroundColor: colors.danger,
  },
  tripActionText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  vehicleCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  vehicleInfo: {
    marginBottom: 16,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  vehicleSubtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  vehicleStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  vehicleStat: {
    alignItems: 'center',
  },
  vehicleStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  vehicleStatLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  alertsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
  },
  summaryCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    marginBottom: 32,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 4,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.text.secondary,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});