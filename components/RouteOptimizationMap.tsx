import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';

// Conditionally import react-native-maps only on native platforms
let MapView: any = null;
let Marker: any = null;
let Polyline: any = null;
let PROVIDER_GOOGLE: any = null;
let MapViewDirections: any = null;

if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  Polyline = maps.Polyline;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
  
  try {
    MapViewDirections = require('react-native-maps-directions').default;
  } catch (e) {
    console.warn('react-native-maps-directions not available');
  }
}
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

// Mock Google Maps API key - in production, this should be from environment variables
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

interface RouteOptimizationMapProps {
  onWaypointPress?: (waypoint: RouteWaypoint) => void;
  onMapPress?: (coordinate: { latitude: number; longitude: number }) => void;
}

const RouteOptimizationMap: React.FC<RouteOptimizationMapProps> = ({
  onWaypointPress,
  onMapPress,
}) => {
  const mapRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  
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

  // Default region (centered on US)
  const [region, setRegion] = useState({
    latitude: 39.8283,
    longitude: -98.5795,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });

  useEffect(() => {
    if (waypoints.length > 0 && mapReady) {
      fitToWaypoints();
    }
  }, [waypoints, mapReady]);

  const fitToWaypoints = () => {
    if (waypoints.length === 0 || !mapRef.current) return;

    const coordinates = waypoints.map(wp => ({
      latitude: wp.latitude,
      longitude: wp.longitude,
    }));

    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
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

  const renderWaypoints = () => {
    return waypoints.map((waypoint, index) => (
      <Marker
        key={waypoint.id}
        coordinate={{
          latitude: waypoint.latitude,
          longitude: waypoint.longitude,
        }}
        title={waypoint.address}
        description={`${waypoint.type} - ${waypoint.notes || ''}`}
        pinColor={getWaypointColor(waypoint.type)}
        onPress={() => onWaypointPress?.(waypoint)}
      >
        <View style={[
          styles.customMarker,
          { backgroundColor: getWaypointColor(waypoint.type) }
        ]}>
          <Text style={styles.markerText}>{index + 1}</Text>
        </View>
      </Marker>
    ));
  };

  const renderFuelStops = () => {
    if (!showFuelStops) return null;

    return nearbyFuelStops.map((stop) => (
      <Marker
        key={stop.id}
        coordinate={{
          latitude: stop.latitude,
          longitude: stop.longitude,
        }}
        title={stop.name}
        description={`$${stop.currentPrice}/gal - ${stop.distance.toFixed(1)} mi`}
      >
        <View style={[styles.fuelMarker]}>
          <Fuel size={16} color={colors.white} />
        </View>
      </Marker>
    ));
  };

  const renderWeatherAlerts = () => {
    if (!showWeatherAlerts) return null;

    return weatherAlerts.map((alert) => (
      <Marker
        key={alert.id}
        coordinate={{
          latitude: alert.location.latitude,
          longitude: alert.location.longitude,
        }}
        title={`Weather Alert: ${alert.type}`}
        description={alert.description}
      >
        <View style={[styles.weatherMarker]}>
          <Cloud size={16} color={colors.white} />
        </View>
      </Marker>
    ));
  };

  const renderRoute = () => {
    if (!currentRoute || waypoints.length < 2 || Platform.OS === 'web') return null;

    const coordinates = waypoints.map(wp => ({
      latitude: wp.latitude,
      longitude: wp.longitude,
    }));

    // Simple polyline for basic route display
    if (!MapViewDirections) {
      return (
        <Polyline
          coordinates={coordinates}
          strokeColor={colors.primary}
          strokeWidth={4}
        />
      );
    }

    // Use MapViewDirections for native platforms when available
    return (
      <MapViewDirections
        origin={coordinates[0]}
        destination={coordinates[coordinates.length - 1]}
        waypoints={coordinates.slice(1, -1)}
        apikey={GOOGLE_MAPS_API_KEY}
        strokeWidth={4}
        strokeColor={colors.primary}
        optimizeWaypoints={true}
        onStart={(params) => {
          console.log('Route calculation started');
        }}
        onReady={(result) => {
          console.log('Route ready:', result);
        }}
        onError={(errorMessage) => {
          console.error('Route error:', errorMessage);
        }}
      />
    );
  };

  // Web fallback component
  const WebMapFallback = () => (
    <View style={[styles.map, styles.webFallback]}>
      <View style={styles.webFallbackContent}>
        <MapPin size={48} color={colors.primary} />
        <Text style={styles.webFallbackTitle}>Map View</Text>
        <Text style={styles.webFallbackText}>
          Interactive maps are not available on web.
          {waypoints.length > 0 && (
            `\n\nWaypoints (${waypoints.length}):`
          )}
        </Text>
        {waypoints.length > 0 && (
          <View style={styles.waypointsList}>
            {waypoints.map((waypoint, index) => (
              <View key={waypoint.id} style={styles.waypointItem}>
                <Text style={styles.waypointNumber}>{index + 1}</Text>
                <View style={styles.waypointInfo}>
                  <Text style={styles.waypointAddress}>{waypoint.address}</Text>
                  <Text style={styles.waypointType}>{waypoint.type}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        {currentRoute && (
          <View style={styles.webRouteInfo}>
            <Text style={styles.webRouteTitle}>Route Summary</Text>
            <Text style={styles.webRouteDetail}>
              Distance: {currentRoute.totalDistance.toFixed(1)} mi
            </Text>
            <Text style={styles.webRouteDetail}>
              Duration: {Math.floor(currentRoute.totalDuration / 60)}h {Math.floor(currentRoute.totalDuration % 60)}m
            </Text>
            <Text style={styles.webRouteDetail}>
              Fuel Cost: ${currentRoute.estimatedFuelCost.toFixed(2)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <WebMapFallback />
      ) : (
        MapView && (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={region}
            showsTraffic={showTraffic}
            showsBuildings={false}
            showsIndoors={false}
            onMapReady={() => setMapReady(true)}
            onPress={(event) => {
              onMapPress?.(event.nativeEvent.coordinate);
            }}
          >
            {renderWaypoints()}
            {renderFuelStops()}
            {renderWeatherAlerts()}
            {renderRoute()}
          </MapView>
        )
      )}

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
            <Zap size={20} color={colors.white} />
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
            <Navigation size={20} color={colors.white} />
            <Text style={styles.navigationButtonText}>
              {isNavigating ? 'Stop' : 'Navigate'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Route Info - Only show on native platforms */}
      {Platform.OS !== 'web' && currentRoute && (
        <View style={styles.routeInfo}>
          <View style={styles.routeInfoRow}>
            <Text style={styles.routeInfoLabel}>Distance:</Text>
            <Text style={styles.routeInfoValue}>
              {currentRoute.totalDistance.toFixed(1)} mi
            </Text>
          </View>
          <View style={styles.routeInfoRow}>
            <Text style={styles.routeInfoLabel}>Duration:</Text>
            <Text style={styles.routeInfoValue}>
              {Math.floor(currentRoute.totalDuration / 60)}h {Math.floor(currentRoute.totalDuration % 60)}m
            </Text>
          </View>
          <View style={styles.routeInfoRow}>
            <Text style={styles.routeInfoLabel}>Fuel Cost:</Text>
            <Text style={styles.routeInfoValue}>
              ${currentRoute.estimatedFuelCost.toFixed(2)}
            </Text>
          </View>
          <View style={styles.routeInfoRow}>
            <Text style={styles.routeInfoLabel}>Score:</Text>
            <Text style={styles.routeInfoValue}>
              {currentRoute.optimizationScore.toFixed(0)}/100
            </Text>
          </View>
        </View>
      )}
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
  customMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  markerText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  fuelMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlPanel: {
    position: 'absolute',
    top: 50,
    right: 16,
    gap: 8,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optimizeButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  navigationButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  routeInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  routeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  routeInfoLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  routeInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  webFallback: {
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webFallbackContent: {
    alignItems: 'center',
    padding: 32,
    maxWidth: 400,
  },
  webFallbackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  webFallbackText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  waypointsList: {
    width: '100%',
    marginTop: 24,
    gap: 12,
  },
  waypointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  waypointNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 24,
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
  },
  waypointType: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  webRouteInfo: {
    width: '100%',
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  webRouteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  webRouteDetail: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
});

export default RouteOptimizationMap;