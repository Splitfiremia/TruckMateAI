import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  MapPin,
  Settings,
  Navigation,
  Zap,
  Clock,
  Fuel,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
  Route,
  Play,
  RotateCcw,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useRouteOptimizationStore } from '@/store/routeOptimizationStore';
import RouteOptimizationMap from '@/components/RouteOptimizationMap';
import WaypointManager from '@/components/WaypointManager';
import RoutePreferences from '@/components/RoutePreferences';
import FuelStopsCard from '@/components/FuelStopsCard';
import RouteAnalyticsCard from '@/components/RouteAnalyticsCard';

export default function RouteOptimizationScreen() {
  const [waypointManagerVisible, setWaypointManagerVisible] = useState(false);
  const [preferencesVisible, setPreferencesVisible] = useState(false);

  const {
    currentRoute,
    waypoints,
    isOptimizing,
    isNavigating,
    trafficIncidents,
    weatherAlerts,
    nearbyFuelStops,
    routeAnalytics,
    addWaypoint,
    optimizeRoute,
    updateTrafficData,
    updateWeatherAlerts,
    updateFuelStops,
  } = useRouteOptimizationStore();

  // Mock data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update traffic incidents
      const mockTrafficIncidents = [
        {
          id: 'traffic_1',
          type: 'accident' as const,
          severity: 'moderate' as const,
          description: 'Multi-vehicle accident on I-95 North',
          location: {
            latitude: 40.7589,
            longitude: -73.9851,
            address: 'I-95 North, Mile 15',
          },
          estimatedDelay: 25,
          startTime: new Date().toISOString(),
          alternativeRoute: 'Take Route 1 North',
        },
        {
          id: 'traffic_2',
          type: 'construction' as const,
          severity: 'minor' as const,
          description: 'Lane closure for road work',
          location: {
            latitude: 40.6892,
            longitude: -74.0445,
            address: 'I-78 West, Mile 8',
          },
          estimatedDelay: 10,
          startTime: new Date().toISOString(),
          estimatedEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        },
      ];

      updateTrafficData(mockTrafficIncidents);

      // Update weather alerts
      const mockWeatherAlerts = [
        {
          id: 'weather_1',
          type: 'snow' as const,
          severity: 'moderate' as const,
          description: 'Light snow expected, reduced visibility',
          location: {
            latitude: 41.8781,
            longitude: -87.6298,
            address: 'Chicago, IL area',
          },
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          impact: 'medium' as const,
        },
      ];

      updateWeatherAlerts(mockWeatherAlerts);

      // Update fuel stops
      const mockFuelStops = [
        {
          id: 'fuel_1',
          name: 'Pilot Travel Center',
          brand: 'Pilot',
          address: '123 Highway 95, Exit 42',
          latitude: 40.7589,
          longitude: -73.9851,
          currentPrice: 3.45,
          amenities: ['Restaurant', 'Showers', 'Parking', 'ATM'],
          truckParking: true,
          showers: true,
          restaurant: true,
          distance: 2.3,
          detourTime: 5,
          rating: 4.2,
          reviewCount: 1247,
        },
        {
          id: 'fuel_2',
          name: 'TA Travel Center',
          brand: 'TravelCenters',
          address: '456 Interstate 80, Mile 15',
          latitude: 40.6892,
          longitude: -74.0445,
          currentPrice: 3.52,
          amenities: ['Food Court', 'Laundry', 'Parking'],
          truckParking: true,
          showers: false,
          restaurant: true,
          distance: 5.7,
          detourTime: 12,
          rating: 3.9,
          reviewCount: 892,
        },
        {
          id: 'fuel_3',
          name: 'Love\'s Travel Stop',
          brand: 'Love\'s',
          address: '789 Route 1, Exit 8',
          latitude: 40.8176,
          longitude: -74.0431,
          currentPrice: 3.38,
          amenities: ['Subway', 'Showers', 'Parking', 'Dog Park'],
          truckParking: true,
          showers: true,
          restaurant: true,
          distance: 8.2,
          detourTime: 18,
          rating: 4.5,
          reviewCount: 2156,
        },
      ];

      updateFuelStops(mockFuelStops);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleMapPress = (coordinate: { latitude: number; longitude: number }) => {
    Alert.alert(
      'Add Waypoint',
      'Add a waypoint at this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: () => {
            const waypoint = {
              id: `waypoint_${Date.now()}`,
              address: `${coordinate.latitude.toFixed(4)}, ${coordinate.longitude.toFixed(4)}`,
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
              type: 'pickup' as const,
              notes: 'Added from map',
            };
            addWaypoint(waypoint);
          },
        },
      ]
    );
  };

  const handleOptimizeRoute = async () => {
    if (waypoints.length < 2) {
      Alert.alert('Error', 'Please add at least 2 waypoints to optimize the route.');
      return;
    }

    const route = await optimizeRoute();
    if (route) {
      Alert.alert('Success', 'Route optimized successfully!');
    } else {
      Alert.alert('Error', 'Failed to optimize route. Please try again.');
    }
  };

  const handleFuelStopPress = (stop: any) => {
    Alert.alert(
      stop.name,
      `${stop.brand}\n${stop.address}\n\nPrice: ${stop.currentPrice.toFixed(2)}/gal\nDistance: ${stop.distance.toFixed(1)} miles\nRating: ${stop.rating}/5`,
      [{ text: 'OK' }]
    );
  };

  const handleNavigateToFuelStop = (stop: any) => {
    Alert.alert(
      'Navigate to Fuel Stop',
      `Start navigation to ${stop.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Navigate', onPress: () => {
          // In a real app, this would open the navigation app
          console.log('Navigate to:', stop.name);
        }},
      ]
    );
  };

  const handleAnalyticsPress = (analytics: any) => {
    Alert.alert(
      'Route Analytics',
      `Route ID: ${analytics.routeId}\nDistance: ${analytics.actualDistance.toFixed(1)} mi\nDuration: ${Math.floor(analytics.actualDuration / 60)}h ${Math.floor(analytics.actualDuration % 60)}m\nFuel: ${analytics.fuelConsumed.toFixed(1)} gal\nAccuracy: ${analytics.accuracyScore.toFixed(0)}%`,
      [{ text: 'OK' }]
    );
  };

  const renderQuickActions = () => {
    return (
      <View style={styles.quickActionsCard}>
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setWaypointManagerVisible(true)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '20' }]}>
              <Plus size={20} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Add Stop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handleOptimizeRoute}
            disabled={isOptimizing || waypoints.length < 2}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.success + '20' }]}>
              <Route size={20} color={colors.success} />
            </View>
            <Text style={styles.quickActionText}>Optimize</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => {
              if (!currentRoute) {
                Alert.alert('Error', 'Please optimize a route first.');
                return;
              }
              // Start navigation logic
            }}
            disabled={!currentRoute}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.warning + '20' }]}>
              <Play size={20} color={colors.warning} />
            </View>
            <Text style={styles.quickActionText}>Navigate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setPreferencesVisible(true)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary + '20' }]}>
              <Settings size={20} color={colors.secondary} />
            </View>
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderStatsCard = () => {
    if (!currentRoute) {
      return (
        <View style={styles.emptyStateCard}>
          <MapPin size={48} color={colors.text.secondary} />
          <Text style={styles.emptyStateTitle}>No Route Planned</Text>
          <Text style={styles.emptyStateText}>
            Add waypoints and optimize your route to see statistics
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => setWaypointManagerVisible(true)}
          >
            <Plus size={16} color={colors.white} />
            <Text style={styles.emptyStateButtonText}>Add First Stop</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>Route Summary</Text>
          <TouchableOpacity style={styles.refreshButton}>
            <RotateCcw size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary + '15' }]}>
              <Navigation size={18} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>
              {currentRoute.totalDistance.toFixed(0)} mi
            </Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.secondary + '15' }]}>
              <Clock size={18} color={colors.secondary} />
            </View>
            <Text style={styles.statValue}>
              {Math.floor(currentRoute.totalDuration / 60)}h {Math.floor(currentRoute.totalDuration % 60)}m
            </Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.warning + '15' }]}>
              <Fuel size={18} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>
              ${currentRoute.estimatedFuelCost.toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Fuel Cost</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.success + '15' }]}>
              <TrendingUp size={18} color={colors.success} />
            </View>
            <Text style={styles.statValue}>
              {currentRoute.optimizationScore.toFixed(0)}%
            </Text>
            <Text style={styles.statLabel}>Efficiency</Text>
          </View>
        </View>

        {currentRoute.tollCosts > 0 && (
          <View style={styles.tollInfo}>
            <DollarSign size={16} color={colors.text.secondary} />
            <Text style={styles.tollText}>
              Estimated tolls: ${currentRoute.tollCosts.toFixed(2)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderAlertsCard = () => {
    const totalAlerts = trafficIncidents.length + weatherAlerts.length;
    if (totalAlerts === 0) return null;

    return (
      <View style={styles.alertsCard}>
        <View style={styles.alertsHeader}>
          <AlertTriangle size={20} color={colors.warning} />
          <Text style={styles.alertsTitle}>
            {totalAlerts} Alert{totalAlerts > 1 ? 's' : ''} on Route
          </Text>
        </View>

        {trafficIncidents.slice(0, 2).map((incident) => (
          <View key={incident.id} style={styles.alertItem}>
            <Text style={styles.alertType}>Traffic</Text>
            <Text style={styles.alertDescription} numberOfLines={1}>
              {incident.description}
            </Text>
            <Text style={styles.alertDelay}>+{incident.estimatedDelay}min</Text>
          </View>
        ))}

        {weatherAlerts.slice(0, 2).map((alert) => (
          <View key={alert.id} style={styles.alertItem}>
            <Text style={styles.alertType}>Weather</Text>
            <Text style={styles.alertDescription} numberOfLines={1}>
              {alert.description}
            </Text>
            <Text style={styles.alertImpact}>{alert.impact} impact</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Routes',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text.primary,
          },
        }}
      />

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderQuickActions()}
        {renderStatsCard()}
        {renderAlertsCard()}
        
        <View style={styles.mapSection}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>Route Map</Text>
            <TouchableOpacity 
              style={styles.testingModeButton}
              onPress={() => Alert.alert('Testing Mode', 'This enables testing features for route optimization.')}
            >
              <Text style={styles.testingModeText}>Enable Testing Mode</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mapContainer}>
            <RouteOptimizationMap
              onMapPress={handleMapPress}
              onWaypointPress={(waypoint) => {
                Alert.alert(
                  waypoint.address,
                  `Type: ${waypoint.type}\n${waypoint.notes || 'No notes'}`,
                  [{ text: 'OK' }]
                );
              }}
            />
          </View>
          
          <Text style={styles.mapSubtext}>
            Interactive maps are available on mobile devices.{"\n"}
            Use the mobile app for full map functionality.
          </Text>
        </View>

        {currentRoute && (
          <View style={styles.primaryActionContainer}>
            <TouchableOpacity
              style={[
                styles.primaryActionButton,
                { opacity: isOptimizing ? 0.7 : 1 }
              ]}
              onPress={handleOptimizeRoute}
              disabled={isOptimizing}
            >
              <Zap size={24} color={colors.white} />
              <Text style={styles.primaryActionText}>
                {isOptimizing ? 'Optimizing Route...' : 'Optimize Route'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <WaypointManager
        visible={waypointManagerVisible}
        onClose={() => setWaypointManagerVisible(false)}
      />

      <RoutePreferences
        visible={preferencesVisible}
        onClose={() => setPreferencesVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  quickActionsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  emptyStateCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 32,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  emptyStateButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  mapSection: {
    marginBottom: 16,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  testingModeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  testingModeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  mapContainer: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  primaryActionContainer: {
    marginTop: 8,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    gap: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryActionText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  refreshButton: {
    padding: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  tollInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 6,
  },
  tollText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  alertsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  alertsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  alertType: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 60,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  alertDescription: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
    lineHeight: 18,
  },
  alertDelay: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.warning,
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  alertImpact: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
    backgroundColor: colors.text.secondary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
});