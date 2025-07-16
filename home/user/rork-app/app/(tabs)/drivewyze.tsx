import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { MapPin, Bell, TrendingUp, Settings, Navigation, Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useDrivewyzeStore } from '@/store/drivewyzeStore';
import { DrivewyzeWeighStationCard } from '@/components/DrivewyzeWeighStationCard';
import { DrivewyzeNotificationCard } from '@/components/DrivewyzeNotificationCard';
import { DrivewyzeAnalyticsCard } from '@/components/DrivewyzeAnalyticsCard';
import { DrivewyzeBypassModal } from '@/components/DrivewyzeBypassModal';
import { DrivewyzeWeighStation } from '@/types';

export default function DrivewyzeScreen() {
  const {
    nearbyStations,
    notifications,
    analytics,
    activeBypass,
    loading,
    errors,
    fetchNearbyWeighStations,
    fetchNotifications,
    fetchAnalytics,
    markNotificationAsRead,
    clearNotification,
    clearActiveBypass,
    clearErrors,
  } = useDrivewyzeStore();

  const [selectedStation, setSelectedStation] = useState<DrivewyzeWeighStation | null>(null);
  const [bypassModalVisible, setBypassModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'stations' | 'notifications' | 'analytics'>('stations');

  // Mock current location (Columbus, OH)
  const currentLocation = {
    latitude: 39.9612,
    longitude: -82.9988,
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchNearbyWeighStations(currentLocation),
      fetchNotifications(),
      fetchAnalytics(),
    ]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleStationPress = (station: DrivewyzeWeighStation) => {
    setSelectedStation(station);
    // Show station details or navigate to detail screen
    Alert.alert(
      station.name,
      `Status: ${station.status}\nLocation: ${station.location.address}\nBypass Eligible: ${station.bypassEligible ? 'Yes' : 'No'}`,
      [
        { text: 'OK' },
        ...(station.bypassEligible && station.status === 'bypass_available'
          ? [{
            text: 'Request Bypass',
            onPress: () => {
              setSelectedStation(station);
              setBypassModalVisible(true);
            },
          }]
          : []),
      ]
    );
  };

  const handleBypassRequest = (station: DrivewyzeWeighStation) => {
    setSelectedStation(station);
    setBypassModalVisible(true);
  };

  const handleNotificationAction = (action: string) => {
    switch (action) {
      case 'request_bypass':
        // Find the station and open bypass modal
        const station = nearbyStations.find(s => s.status === 'bypass_available');
        if (station) {
          handleBypassRequest(station);
        }
        break;
      case 'view_details':
        // Navigate to station details
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const renderTabButton = (tab: 'stations' | 'notifications' | 'analytics', icon: React.ReactNode, label: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      {icon}
      <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>
        {label}
      </Text>
      {tab === 'notifications' && notifications.filter(n => n.actionRequired).length > 0 && (
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>
            {notifications.filter(n => n.actionRequired).length}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'stations':
        return (
          <View>
            {activeBypass && (
              <View style={styles.activeBypassCard}>
                <View style={styles.activeBypassHeader}>
                  <Navigation size={20} color={colors.success} />
                  <Text style={styles.activeBypassTitle}>Active Bypass</Text>
                  <TouchableOpacity onPress={clearActiveBypass}>
                    <Text style={styles.clearBypassText}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.activeBypassMessage}>{activeBypass.message}</Text>
                {activeBypass.expiresAt && (
                  <View style={styles.activeBypassExpiry}>
                    <Clock size={14} color={colors.warning} />
                    <Text style={styles.activeBypassExpiryText}>
                      Expires: {new Date(activeBypass.expiresAt).toLocaleTimeString()}
                    </Text>
                  </View>
                )}
              </View>
            )}
            
            <Text style={styles.sectionTitle}>Nearby Weigh Stations</Text>
            {nearbyStations.length === 0 ? (
              <View style={styles.emptyState}>
                <MapPin size={48} color={colors.text.secondary} />
                <Text style={styles.emptyStateText}>No weigh stations found nearby</Text>
                <Text style={styles.emptyStateSubtext}>Try refreshing or check your location</Text>
              </View>
            ) : (
              nearbyStations.map((station) => (
                <DrivewyzeWeighStationCard
                  key={station.id}
                  station={station}
                  onPress={() => handleStationPress(station)}
                  onBypassRequest={() => handleBypassRequest(station)}
                  showDistance
                />
              ))
            )}
          </View>
        );

      case 'notifications':
        return (
          <View>
            <Text style={styles.sectionTitle}>Notifications</Text>
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Bell size={48} color={colors.text.secondary} />
                <Text style={styles.emptyStateText}>No notifications</Text>
                <Text style={styles.emptyStateSubtext}>You are all caught up!</Text>
              </View>
            ) : (
              notifications.map((notification) => (
                <DrivewyzeNotificationCard
                  key={notification.id}
                  notification={notification}
                  onAction={handleNotificationAction}
                  onDismiss={() => clearNotification(notification.id)}
                />
              ))
            )}
          </View>
        );

      case 'analytics':
        return (
          <View>
            {analytics ? (
              <DrivewyzeAnalyticsCard analytics={analytics} />
            ) : (
              <View style={styles.emptyState}>
                <TrendingUp size={48} color={colors.text.secondary} />
                <Text style={styles.emptyStateText}>No analytics data</Text>
                <Text style={styles.emptyStateSubtext}>Data will appear after using Drivewyze</Text>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Drivewyze',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <Settings size={24} color={colors.text.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.tabContainer}>
        {renderTabButton('stations', <MapPin size={20} color={activeTab === 'stations' ? colors.white : colors.text.secondary} />, 'Stations')}
        {renderTabButton('notifications', <Bell size={20} color={activeTab === 'notifications' ? colors.white : colors.text.secondary} />, 'Alerts')}
        {renderTabButton('analytics', <TrendingUp size={20} color={activeTab === 'analytics' ? colors.white : colors.text.secondary} />, 'Analytics')}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <DrivewyzeBypassModal
        visible={bypassModalVisible}
        station={selectedStation}
        onClose={() => {
          setBypassModalVisible(false);
          setSelectedStation(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
    position: 'relative',
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  activeTabButtonText: {
    color: colors.white,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  content: {
    flex: 1,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  activeBypassCard: {
    backgroundColor: colors.success,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  activeBypassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  activeBypassTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    flex: 1,
    marginLeft: 8,
  },
  clearBypassText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
    opacity: 0.8,
  },
  activeBypassMessage: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 8,
  },
  activeBypassExpiry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeBypassExpiryText: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 100,
  },
});