import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  Navigation,
  MapPin,
  Fuel,
  AlertTriangle,
  Cloud,
  Settings,
  Route,
  Zap,
  Clock,
  TrendingUp,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useRouteOptimizationStore } from '@/store/routeOptimizationStore';
import { RouteWaypoint, OptimizedRoute } from '@/types';

const { width, height } = Dimensions.get('window');

interface RouteOptimizationMapProps {
  onWaypointPress?: (waypoint: RouteWaypoint) => void;
  onMapPress?: (coordinate: { latitude: number; longitude: number }) => void;
}

const RouteOptimizationMap: React.FC<RouteOptimizationMapProps> = ({
  onWaypointPress,
  onMapPress,
}) => {
  const {
    currentRoute,
    waypoints,
    isOptimizing,
    isNavigating,
    showTraffic,
    showFuelStops,
    showWeatherAlerts,
    trafficIncidents,
    nearbyFuelStops,
    weatherAlerts,
    optimizeRoute,
    startNavigation,
    stopNavigation,
    toggleTrafficView,
    toggleFuelStopsView,
    toggleWeatherView,
  } = useRouteOptimizationStore();

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

  const handleStartNavigation = () => {
    if (!currentRoute) {
      Alert.alert('Error', 'Please optimize a route first.');
      return;
    }
    startNavigation();
  };

  const getWaypointColor = (type: string) => {
    switch (type) {
      case 'pickup': return colors.primary;
      case 'delivery': return colors.success;
      case 'fuel': return colors.warning;
      case 'rest': return colors.secondary;
      case 'weigh_station': return colors.danger;
      default: return colors.primary;
    }
  };

  const getWaypointIcon = (type: string) => {
    switch (type) {
      case 'pickup': return '📦';
      case 'delivery': return '🏢';
      case 'fuel': return '⛽';
      case 'rest': return '🛏️';
      case 'weigh_station': return '⚖️';
      default: return '📍';
    }
  };

  // Web-compatible map fallback component
  const MapFallback = () => (
    <View style={[styles.map, styles.mapFallback]}>
      <View style={styles.mapFallbackContent}>
        <View style={styles.mapIconContainer}>
          <MapPin size={32} color={colors.primary} />
        </View>
        <Text style={styles.mapFallbackTitle}>Route Preview</Text>
        {waypoints.length === 0 ? (
          <View style={styles.emptyMapState}>
            <Text style={styles.emptyMapText}>
              Add waypoints to see your route visualization
            </Text>
          </View>
        ) : (
          <Text style={styles.mapFallbackText}>
            {waypoints.length} stop{waypoints.length > 1 ? 's' : ''} added to your route
          </Text>
        )}
        
        {waypoints.length > 0 && (
          <View style={styles.waypointsContainer}>
            <Text style={styles.waypointsTitle}>Route Stops</Text>
            <ScrollView style={styles.waypointsList} showsVerticalScrollIndicator={false}>
              {waypoints.map((waypoint, index) => (
                <TouchableOpacity
                  key={waypoint.id}
                  style={styles.waypointItem}
                  onPress={() => onWaypointPress?.(waypoint)}
                >
                  <View style={[
                    styles.waypointNumber,
                    { backgroundColor: getWaypointColor(waypoint.type) }
                  ]}>
                    <Text style={styles.waypointNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.waypointInfo}>
                    <Text style={styles.waypointAddress} numberOfLines={1}>
                      {waypoint.address}
                    </Text>
                    <View style={styles.waypointMeta}>
                      <Text style={styles.waypointType}>
                        {getWaypointIcon(waypoint.type)} {waypoint.type.replace('_', ' ')}
                      </Text>
                      {waypoint.notes && (
                        <Text style={styles.waypointNotes} numberOfLines={1}>
                          • {waypoint.notes}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        {currentRoute && (
          <View style={styles.routeInfo}>
            <Text style={styles.routeTitle}>Optimized Route</Text>
            <View style={styles.routeStats}>
              <View style={styles.routeStat}>
                <View style={styles.routeStatIcon}>
                  <Navigation size={14} color={colors.primary} />
                </View>
                <Text style={styles.routeStatValue}>
                  {currentRoute.totalDistance.toFixed(1)} mi
                </Text>
                <Text style={styles.routeStatLabel}>Distance</Text>
              </View>
              <View style={styles.routeStat}>
                <View style={styles.routeStatIcon}>
                  <Clock size={14} color={colors.secondary} />
                </View>
                <Text style={styles.routeStatValue}>
                  {Math.floor(currentRoute.totalDuration / 60)}h {Math.floor(currentRoute.totalDuration % 60)}m
                </Text>
                <Text style={styles.routeStatLabel}>Duration</Text>
              </View>
              <View style={styles.routeStat}>
                <View style={styles.routeStatIcon}>
                  <Fuel size={14} color={colors.warning} />
                </View>
                <Text style={styles.routeStatValue}>
                  ${currentRoute.estimatedFuelCost.toFixed(0)}
                </Text>
                <Text style={styles.routeStatLabel}>Fuel Cost</Text>
              </View>
              <View style={styles.routeStat}>
                <View style={styles.routeStatIcon}>
                  <TrendingUp size={14} color={colors.success} />
                </View>
                <Text style={styles.routeStatValue}>
                  {currentRoute.optimizationScore.toFixed(0)}%
                </Text>
                <Text style={styles.routeStatLabel}>Efficiency</Text>
              </View>
            </View>
          </View>
        )}

        {/* Alerts Section */}
        {(trafficIncidents.length > 0 || weatherAlerts.length > 0) && (
          <View style={styles.alertsSection}>
            <Text style={styles.alertsTitle}>Route Alerts</Text>
            {trafficIncidents.slice(0, 2).map((incident) => (
              <View key={incident.id} style={styles.alertItem}>
                <AlertTriangle size={16} color={colors.warning} />
                <View style={styles.alertContent}>
                  <Text style={styles.alertType}>Traffic</Text>
                  <Text style={styles.alertDescription} numberOfLines={2}>
                    {incident.description}
                  </Text>
                  <Text style={styles.alertDelay}>+{incident.estimatedDelay}min delay</Text>
                </View>
              </View>
            ))}
            {weatherAlerts.slice(0, 2).map((alert) => (
              <View key={alert.id} style={styles.alertItem}>
                <Cloud size={16} color={colors.secondary} />
                <View style={styles.alertContent}>
                  <Text style={styles.alertType}>Weather</Text>
                  <Text style={styles.alertDescription} numberOfLines={2}>
                    {alert.description}
                  </Text>
                  <Text style={styles.alertImpact}>{alert.impact} impact</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Fuel Stops Section */}
        {showFuelStops && nearbyFuelStops.length > 0 && (
          <View style={styles.fuelStopsSection}>
            <Text style={styles.fuelStopsTitle}>Nearby Fuel Stops</Text>
            {nearbyFuelStops.slice(0, 3).map((stop) => (
              <View key={stop.id} style={styles.fuelStopItem}>
                <Fuel size={16} color={colors.warning} />
                <View style={styles.fuelStopContent}>
                  <Text style={styles.fuelStopName}>{stop.name}</Text>
                  <Text style={styles.fuelStopPrice}>
                    ${stop.currentPrice.toFixed(2)}/gal • {stop.distance.toFixed(1)} mi
                  </Text>
                  <Text style={styles.fuelStopRating}>
                    ⭐ {stop.rating}/5 ({stop.reviewCount} reviews)
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <MapFallback />

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <View style={styles.mapControlsRow}>
          <TouchableOpacity
            style={[
              styles.mapControlButton,
              { backgroundColor: showTraffic ? colors.primary : colors.card }
            ]}
            onPress={toggleTrafficView}
          >
            <Route size={16} color={showTraffic ? colors.white : colors.text.primary} />
            <Text style={[
              styles.mapControlText,
              { color: showTraffic ? colors.white : colors.text.primary }
            ]}>Traffic</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.mapControlButton,
              { backgroundColor: showFuelStops ? colors.warning : colors.card }
            ]}
            onPress={toggleFuelStopsView}
          >
            <Fuel size={16} color={showFuelStops ? colors.white : colors.text.primary} />
            <Text style={[
              styles.mapControlText,
              { color: showFuelStops ? colors.white : colors.text.primary }
            ]}>Fuel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.mapControlButton,
              { backgroundColor: showWeatherAlerts ? colors.secondary : colors.card }
            ]}
            onPress={toggleWeatherView}
          >
            <Cloud size={16} color={showWeatherAlerts ? colors.white : colors.text.primary} />
            <Text style={[
              styles.mapControlText,
              { color: showWeatherAlerts ? colors.white : colors.text.primary }
            ]}>Weather</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapFallback: {
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  mapFallbackContent: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    width: '100%',
    maxWidth: 500,
  },
  mapIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mapFallbackTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptyMapState: {
    paddingVertical: 20,
  },
  emptyMapText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  mapFallbackText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  waypointsContainer: {
    width: '100%',
    marginBottom: 16,
  },
  waypointsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  waypointsList: {
    width: '100%',
    maxHeight: 180,
  },
  waypointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  waypointNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waypointNumberText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  waypointInfo: {
    flex: 1,
  },
  waypointAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  waypointMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  waypointType: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  waypointNotes: {
    fontSize: 11,
    color: colors.text.secondary,
    fontStyle: 'italic',
    flex: 1,
  },
  routeInfo: {
    width: '100%',
    backgroundColor: colors.primary + '10',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  routeStat: {
    alignItems: 'center',
    flex: 1,
  },
  routeStatIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  routeStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  routeStatLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  alertsSection: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  alertContent: {
    flex: 1,
  },
  alertType: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 13,
    color: colors.text.primary,
    marginBottom: 2,
  },
  alertDelay: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.warning,
  },
  alertImpact: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  fuelStopsSection: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fuelStopsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  fuelStopItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  fuelStopContent: {
    flex: 1,
  },
  fuelStopName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  fuelStopPrice: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  fuelStopRating: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  mapControlsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  mapControlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 70,
    justifyContent: 'center',
  },
  mapControlText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default RouteOptimizationMap;