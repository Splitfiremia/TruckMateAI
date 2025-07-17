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
        <MapPin size={48} color={colors.primary} />
        <Text style={styles.mapFallbackTitle}>Route Optimization</Text>
        <Text style={styles.mapFallbackText}>
          Interactive maps are available on mobile devices.
          {waypoints.length > 0 && (
            `\n\nWaypoints (${waypoints.length}):`
          )}
        </Text>
        <Text style={styles.mapFallbackSubtext}>
          Use the mobile app for full map functionality.
        </Text>
        
        {waypoints.length > 0 && (
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
                  <Text style={styles.waypointType}>
                    {getWaypointIcon(waypoint.type)} {waypoint.type}
                  </Text>
                  {waypoint.notes && (
                    <Text style={styles.waypointNotes} numberOfLines={1}>
                      {waypoint.notes}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        
        {currentRoute && (
          <View style={styles.routeInfo}>
            <Text style={styles.routeTitle}>Route Summary</Text>
            <View style={styles.routeStats}>
              <View style={styles.routeStat}>
                <Navigation size={16} color={colors.primary} />
                <Text style={styles.routeStatValue}>
                  {currentRoute.totalDistance.toFixed(1)} mi
                </Text>
                <Text style={styles.routeStatLabel}>Distance</Text>
              </View>
              <View style={styles.routeStat}>
                <Text style={styles.routeStatValue}>
                  {Math.floor(currentRoute.totalDuration / 60)}h {Math.floor(currentRoute.totalDuration % 60)}m
                </Text>
                <Text style={styles.routeStatLabel}>Duration</Text>
              </View>
              <View style={styles.routeStat}>
                <Fuel size={16} color={colors.warning} />
                <Text style={styles.routeStatValue}>
                  ${currentRoute.estimatedFuelCost.toFixed(2)}
                </Text>
                <Text style={styles.routeStatLabel}>Fuel Cost</Text>
              </View>
              <View style={styles.routeStat}>
                <Text style={styles.routeStatValue}>
                  {currentRoute.optimizationScore.toFixed(0)}/100
                </Text>
                <Text style={styles.routeStatLabel}>Score</Text>
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

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              { backgroundColor: showTraffic ? colors.primary : colors.background.secondary }
            ]}
            onPress={toggleTrafficView}
          >
            <Route size={20} color={showTraffic ? colors.white : colors.text.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              { backgroundColor: showFuelStops ? colors.warning : colors.background.secondary }
            ]}
            onPress={toggleFuelStopsView}
          >
            <Fuel size={20} color={showFuelStops ? colors.white : colors.text.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              { backgroundColor: showWeatherAlerts ? colors.secondary : colors.background.secondary }
            ]}
            onPress={toggleWeatherView}
          >
            <Cloud size={20} color={showWeatherAlerts ? colors.white : colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.controlRow}>
          <TouchableOpacity
            style={[
              styles.optimizeButton,
              { opacity: isOptimizing ? 0.6 : 1 }
            ]}
            onPress={handleOptimizeRoute}
            disabled={isOptimizing}
          >
            <Zap size={16} color={colors.white} />
            <Text style={styles.optimizeButtonText}>
              {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navigationButton,
              { 
                backgroundColor: isNavigating ? colors.danger : colors.success,
                opacity: !currentRoute ? 0.6 : 1
              }
            ]}
            onPress={isNavigating ? stopNavigation : handleStartNavigation}
            disabled={!currentRoute}
          >
            <Navigation size={16} color={colors.white} />
            <Text style={styles.navigationButtonText}>
              {isNavigating ? 'Stop' : 'Navigate'}
            </Text>
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
    paddingTop: 80,
    width: '100%',
    maxWidth: 500,
  },
  mapFallbackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  mapFallbackText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  mapFallbackSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  waypointsList: {
    width: '100%',
    maxHeight: 200,
    marginBottom: 20,
  },
  waypointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  waypointNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    marginBottom: 2,
  },
  waypointType: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  waypointNotes: {
    fontSize: 11,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  routeInfo: {
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
  routeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  routeStat: {
    alignItems: 'center',
    flex: 1,
  },
  routeStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 4,
  },
  routeStatLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 2,
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
  controlPanel: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
    zIndex: 10,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optimizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optimizeButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  navigationButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default RouteOptimizationMap;