import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
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

  const renderStatsCard = () => {
    if (!currentRoute) return null;

    return (
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Navigation size={16} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>
              {currentRoute.totalDistance.toFixed(0)} mi
            </Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Clock size={16} color={colors.secondary} />
            </View>
            <Text style={styles.statValue}>
              {Math.floor(currentRoute.totalDuration / 60)}h {Math.floor(currentRoute.totalDuration % 60)}m
            </Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Fuel size={16} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>
              ${currentRoute.estimatedFuelCost.toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Fuel Cost</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <TrendingUp size={16} color={colors.success} />
            </View>
            <Text style={styles.statValue}>
              {currentRoute.optimizationScore.toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Score</Text>
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
          title: 'Route Optimization',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setPreferencesVisible(true)}
              >
                <Settings size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setWaypointManagerVisible(true)}
              >
                <MapPin size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

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

      <View style={styles.bottomPanel}>
        {renderStatsCard()}
        {renderAlertsCard()}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.optimizeButton,
              { opacity: isOptimizing || waypoints.length < 2 ? 0.6 : 1 }
            ]}
            onPress={handleOptimizeRoute}
            disabled={isOptimizing || waypoints.length < 2}
          >
            <Zap size={20} color={colors.white} />
            <Text style={styles.optimizeButtonText}>
              {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  mapContainer: {
    flex: 1,
  },
  bottomPanel: {
    backgroundColor: colors.background.primary,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  alertsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
    gap: 12,
  },
  alertType: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 60,
    textAlign: 'center',
  },
  alertDescription: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
  },
  alertDelay: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.warning,
  },
  alertImpact: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  actionButtons: {
    gap: 12,
  },
  optimizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optimizeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});