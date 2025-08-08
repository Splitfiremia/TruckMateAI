import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import {
  MapPin,
  Navigation,
  Phone,
  Pause,
  Play,
  CheckCircle,
  Clock,
  Route as RouteIcon,
  AlertTriangle,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useDriverStore } from '@/store/driverStore';

const { width, height } = Dimensions.get('window');

export default function ActiveTripScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const {
    currentTrip,
    pauseTrip,
    resumeTrip,
    completeTrip,
    updateTripLocation,
  } = useDriverStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTripAction = () => {
    if (!currentTrip) return;
    
    if (currentTrip.status === 'in-progress') {
      pauseTrip();
    } else {
      resumeTrip();
    }
  };

  const handleCompleteTrip = () => {
    Alert.alert(
      'Complete Trip',
      'Are you sure you want to complete this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          style: 'default',
          onPress: () => {
            completeTrip();
            Alert.alert('Success', 'Trip completed successfully!');
          },
        },
      ]
    );
  };

  const handleEmergency = () => {
    Alert.alert(
      'Emergency SOS',
      'This will contact emergency services and your dispatcher. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Emergency',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Emergency', 'Emergency services contacted');
          },
        },
      ]
    );
  };

  const handleContactDispatcher = () => {
    Alert.alert('Contact Dispatcher', 'Calling dispatcher...');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateTripDuration = () => {
    if (!currentTrip?.startTime) return '0:00';
    
    const start = new Date(currentTrip.startTime);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  if (!currentTrip) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noTripContainer}>
          <RouteIcon color={colors.text.tertiary} size={64} />
          <Text style={styles.noTripText}>No active trip</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Map View Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Navigation color={colors.primary} size={48} />
          <Text style={styles.mapPlaceholderText}>Live Map View</Text>
          <Text style={styles.mapSubtext}>GPS tracking active</Text>
        </View>
        
        {/* Status Overlay */}
        <View style={styles.statusOverlay}>
          <View style={[
            styles.statusBadge,
            currentTrip.status === 'in-progress' ? styles.statusActive : styles.statusPaused
          ]}>
            <Text style={styles.statusText}>
              {currentTrip.status === 'in-progress' ? 'In Progress' : 'Paused'}
            </Text>
          </View>
          <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
        </View>

        {/* Emergency Button */}
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergency}
        >
          <AlertTriangle color={colors.white} size={24} />
          <Text style={styles.emergencyText}>SOS</Text>
        </TouchableOpacity>
      </View>

      {/* Trip Details Panel */}
      <View style={styles.detailsPanel}>
        {/* Trip Info */}
        <View style={styles.tripInfo}>
          <View style={styles.locationContainer}>
            <View style={styles.locationRow}>
              <MapPin color={colors.success} size={20} />
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>From</Text>
                <Text style={styles.locationText} numberOfLines={2}>
                  {currentTrip.startLocation.address}
                </Text>
              </View>
            </View>
            
            <View style={styles.routeLine} />
            
            <View style={styles.locationRow}>
              <MapPin color={colors.danger} size={20} />
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>To</Text>
                <Text style={styles.locationText} numberOfLines={2}>
                  {currentTrip.destination.address}
                </Text>
              </View>
            </View>
          </View>

          {/* Trip Stats */}
          <View style={styles.tripStats}>
            <View style={styles.statItem}>
              <Clock color={colors.primary} size={16} />
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>{calculateTripDuration()}</Text>
            </View>
            <View style={styles.statItem}>
              <RouteIcon color={colors.primary} size={16} />
              <Text style={styles.statLabel}>Distance</Text>
              <Text style={styles.statValue}>
                {currentTrip.distance ? `${currentTrip.distance} mi` : '--'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Navigation color={colors.primary} size={16} />
              <Text style={styles.statLabel}>ETA</Text>
              <Text style={styles.statValue}>
                {currentTrip.estimatedDuration ? 
                  `${Math.floor(currentTrip.estimatedDuration / 60)}h ${currentTrip.estimatedDuration % 60}m` : 
                  '--'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.pauseResumeButton]}
            onPress={handleTripAction}
          >
            {currentTrip.status === 'in-progress' ? (
              <Pause color={colors.white} size={20} />
            ) : (
              <Play color={colors.white} size={20} />
            )}
            <Text style={styles.controlButtonText}>
              {currentTrip.status === 'in-progress' ? 'Pause Trip' : 'Resume Trip'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.completeButton]}
            onPress={handleCompleteTrip}
          >
            <CheckCircle color={colors.white} size={20} />
            <Text style={styles.controlButtonText}>Complete Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.contactButton]}
            onPress={handleContactDispatcher}
          >
            <Phone color={colors.white} size={20} />
            <Text style={styles.controlButtonText}>Contact Dispatcher</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  mapContainer: {
    height: height * 0.6,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
  },
  mapSubtext: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  statusOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statusActive: {
    backgroundColor: colors.success,
  },
  statusPaused: {
    backgroundColor: colors.warning,
  },
  statusText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  currentTime: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  emergencyButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.danger,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencyText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  detailsPanel: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    marginTop: -24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  tripInfo: {
    flex: 1,
  },
  locationContainer: {
    marginBottom: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  locationDetails: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginTop: 4,
    lineHeight: 22,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.border,
    marginLeft: 10,
    marginBottom: 8,
  },
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background.primary,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  controls: {
    paddingBottom: 20,
    gap: 12,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  pauseResumeButton: {
    backgroundColor: colors.primary,
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  contactButton: {
    backgroundColor: colors.accent,
  },
  controlButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  noTripContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTripText: {
    fontSize: 18,
    color: colors.text.secondary,
    marginTop: 16,
  },
});