import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Cloud, CloudRain, Sun, Wind, Eye, Droplets, RefreshCw, MapPin } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useWeatherStore } from '@/store/weatherStore';

interface WeatherCardProps {
  onPress?: () => void;
}

const getWeatherIcon = (conditions: string) => {
  const condition = conditions.toLowerCase();
  if (condition.includes('rain') || condition.includes('shower')) {
    return CloudRain;
  } else if (condition.includes('cloud') || condition.includes('overcast')) {
    return Cloud;
  } else {
    return Sun;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'extreme':
      return colors.danger;
    case 'severe':
      return colors.warning;
    case 'moderate':
      return colors.primaryLight;
    default:
      return colors.textSecondary;
  }
};

export const WeatherCard: React.FC<WeatherCardProps> = ({ onPress }) => {
  const {
    currentLocation,
    currentWeather,
    alerts,
    isLoadingWeather,
    locationPermissionGranted,
    requestLocationPermission,
    fetchWeatherData,
    fetchWeatherAlerts
  } = useWeatherStore();

  useEffect(() => {
    // Only fetch weather data if we already have permission and location
    if (locationPermissionGranted && currentLocation) {
      fetchWeatherData();
      fetchWeatherAlerts();
    }
  }, [locationPermissionGranted, currentLocation]);

  const handleRefresh = () => {
    if (currentLocation) {
      fetchWeatherData();
      fetchWeatherAlerts();
    }
  };

  if (!locationPermissionGranted) {
    return (
      <TouchableOpacity style={styles.card} onPress={async () => {
        const granted = await requestLocationPermission();
        if (granted) {
          fetchWeatherData();
          fetchWeatherAlerts();
        }
      }}>
        <View style={styles.permissionContainer}>
          <MapPin color={colors.textSecondary} size={24} />
          <Text style={styles.permissionText}>Enable location for weather updates</Text>
          <Text style={styles.permissionSubtext}>Tap to grant permission</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (isLoadingWeather && !currentWeather) {
    return (
      <View style={styles.card}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primaryLight} size="small" />
          <Text style={styles.loadingText}>Loading weather...</Text>
        </View>
      </View>
    );
  }

  const WeatherIcon = currentWeather ? getWeatherIcon(currentWeather.conditions) : Cloud;
  const hasAlerts = alerts.length > 0;
  const severeAlerts = alerts.filter(alert => alert.severity === 'severe' || alert.severity === 'extreme');

  return (
    <TouchableOpacity style={[styles.card, hasAlerts && styles.cardWithAlert]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <MapPin color={colors.textSecondary} size={16} />
          <Text style={styles.location}>
            {currentLocation?.city || 'Unknown Location'}
            {currentLocation?.state && `, ${currentLocation.state}`}
          </Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} disabled={isLoadingWeather}>
          <RefreshCw 
            color={colors.textSecondary} 
            size={18} 
            style={isLoadingWeather ? styles.spinning : undefined}
          />
        </TouchableOpacity>
      </View>

      {currentWeather && (
        <View style={styles.weatherContent}>
          <View style={styles.mainWeather}>
            <WeatherIcon color={colors.primaryLight} size={32} />
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperature}>{currentWeather.temperature}°F</Text>
              <Text style={styles.conditions}>{currentWeather.conditions}</Text>
            </View>
          </View>

          <View style={styles.weatherDetails}>
            <View style={styles.detailItem}>
              <Wind color={colors.textSecondary} size={14} />
              <Text style={styles.detailText}>{currentWeather.windSpeed} mph</Text>
            </View>
            <View style={styles.detailItem}>
              <Droplets color={colors.textSecondary} size={14} />
              <Text style={styles.detailText}>{currentWeather.humidity}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Eye color={colors.textSecondary} size={14} />
              <Text style={styles.detailText}>{currentWeather.visibility} mi</Text>
            </View>
          </View>
        </View>
      )}

      {hasAlerts && (
        <View style={styles.alertsContainer}>
          <Text style={styles.alertsTitle}>
            {severeAlerts.length > 0 ? 'Severe Weather Alerts' : 'Weather Alerts'} ({alerts.length})
          </Text>
          {alerts.slice(0, 2).map((alert) => (
            <View key={alert.id} style={styles.alertItem}>
              <View style={[styles.alertIndicator, { backgroundColor: getSeverityColor(alert.severity) }]} />
              <Text style={styles.alertText} numberOfLines={1}>{alert.event}</Text>
            </View>
          ))}
          {alerts.length > 2 && (
            <Text style={styles.moreAlerts}>+{alerts.length - 2} more alerts</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardWithAlert: {
    borderColor: colors.warning,
    borderWidth: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 6,
    flex: 1,
  },
  spinning: {
    transform: [{ rotate: '45deg' }],
  },
  weatherContent: {
    marginBottom: 12,
  },
  mainWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  temperatureContainer: {
    marginLeft: 12,
    flex: 1,
  },
  temperature: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '600',
  },
  conditions: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 4,
  },
  alertsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  alertsTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  alertText: {
    color: colors.textSecondary,
    fontSize: 12,
    flex: 1,
  },
  moreAlerts: {
    color: colors.textSecondary,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
  permissionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  permissionText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  permissionSubtext: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 8,
  },
});