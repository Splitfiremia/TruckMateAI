import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack } from 'expo-router';
import { Cloud, CloudRain, Sun, Wind, Eye, Droplets, MapPin, AlertTriangle, Settings, RefreshCw } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useWeatherStore } from '@/store/weatherStore';
import { WeatherAlertsModal } from '@/components/WeatherAlertsModal';
import { WeatherForecastModal } from '@/components/WeatherForecastModal';

const getWeatherIcon = (conditions: string) => {
  const condition = conditions.toLowerCase();
  if (condition.includes('rain') || condition.includes('shower') || condition.includes('storm')) {
    return CloudRain;
  } else if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('partly')) {
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

const getDayName = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
};

export default function WeatherScreen() {
  const [alertsModalVisible, setAlertsModalVisible] = useState(false);
  const [forecastModalVisible, setForecastModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    currentLocation,
    currentWeather,
    forecast,
    alerts,
    isLoadingWeather,
    isLoadingAlerts,
    locationPermissionGranted,
    lastUpdated,
    requestLocationPermission,
    fetchWeatherData,
    fetchWeatherAlerts,
  } = useWeatherStore();

  useEffect(() => {
    // Only fetch weather data if we already have permission and location
    if (locationPermissionGranted && currentLocation) {
      fetchWeatherData();
      fetchWeatherAlerts();
    }
  }, [locationPermissionGranted, currentLocation]);

  const handleRefresh = async () => {
    if (!currentLocation) return;
    
    setRefreshing(true);
    try {
      await Promise.all([
        fetchWeatherData(),
        fetchWeatherAlerts()
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    handleRefresh();
  }, [currentLocation]);

  if (!locationPermissionGranted) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Weather' }} />
        <View style={styles.permissionContainer}>
          <Cloud color={colors.textSecondary} size={64} />
          <Text style={styles.permissionTitle}>Location Permission Required</Text>
          <Text style={styles.permissionDescription}>
            We need access to your location to provide accurate weather information and alerts.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestLocationPermission}>
            <MapPin color={colors.background} size={20} />
            <Text style={styles.permissionButtonText}>Grant Location Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const WeatherIcon = currentWeather ? getWeatherIcon(currentWeather.conditions) : Cloud;
  const hasAlerts = alerts.length > 0;
  const severeAlerts = alerts.filter(alert => alert.severity === 'severe' || alert.severity === 'extreme');

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Weather',
          headerRight: () => (
            <TouchableOpacity onPress={handleRefresh} disabled={isLoadingWeather}>
              <RefreshCw 
                color={colors.primaryLight} 
                size={20} 
                style={isLoadingWeather ? styles.spinning : undefined}
              />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primaryLight}
            colors={[colors.primaryLight]}
          />
        }
      >
        {/* Location Header */}
        {currentLocation && (
          <View style={styles.locationHeader}>
            <MapPin color={colors.textSecondary} size={20} />
            <Text style={styles.locationText}>
              {currentLocation.city}
              {currentLocation.state && `, ${currentLocation.state}`}
            </Text>
            {lastUpdated && (
              <Text style={styles.lastUpdatedText}>
                Updated {new Date(lastUpdated).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            )}
          </View>
        )}

        {/* Weather Alerts */}
        {hasAlerts && (
          <TouchableOpacity style={styles.alertsCard} onPress={() => setAlertsModalVisible(true)}>
            <View style={styles.alertsHeader}>
              <AlertTriangle color={severeAlerts.length > 0 ? colors.danger : colors.warning} size={24} />
              <View style={styles.alertsInfo}>
                <Text style={styles.alertsTitle}>
                  {severeAlerts.length > 0 ? 'Severe Weather Alerts' : 'Weather Alerts'}
                </Text>
                <Text style={styles.alertsCount}>{alerts.length} active alert{alerts.length !== 1 ? 's' : ''}</Text>
              </View>
            </View>
            <Text style={styles.alertsDescription}>
              {alerts[0].event} - Tap to view details
            </Text>
          </TouchableOpacity>
        )}

        {/* Current Weather */}
        {isLoadingWeather && !currentWeather ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={colors.primaryLight} size="large" />
            <Text style={styles.loadingText}>Loading current weather...</Text>
          </View>
        ) : currentWeather ? (
          <View style={styles.currentWeatherCard}>
            <View style={styles.currentWeatherMain}>
              <WeatherIcon color={colors.primaryLight} size={64} />
              <View style={styles.temperatureContainer}>
                <Text style={styles.temperature}>{currentWeather.temperature}°F</Text>
                <Text style={styles.conditions}>{currentWeather.conditions}</Text>
              </View>
            </View>

            <View style={styles.weatherDetails}>
              <View style={styles.detailItem}>
                <Wind color={colors.textSecondary} size={20} />
                <Text style={styles.detailLabel}>Wind</Text>
                <Text style={styles.detailValue}>
                  {currentWeather.windSpeed} mph {currentWeather.windDirection}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Droplets color={colors.textSecondary} size={20} />
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{currentWeather.humidity}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Eye color={colors.textSecondary} size={20} />
                <Text style={styles.detailLabel}>Visibility</Text>
                <Text style={styles.detailValue}>{currentWeather.visibility} mi</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.errorCard}>
            <Cloud color={colors.textSecondary} size={48} />
            <Text style={styles.errorTitle}>Weather Unavailable</Text>
            <Text style={styles.errorDescription}>
              Unable to load current weather conditions. Please try again.
            </Text>
          </View>
        )}

        {/* 7-Day Forecast */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>7-Day Forecast</Text>
          <TouchableOpacity onPress={() => setForecastModalVisible(true)}>
            <Text style={styles.seeAllText}>View Details</Text>
          </TouchableOpacity>
        </View>

        {isLoadingWeather && forecast.length === 0 ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={colors.primaryLight} size="small" />
            <Text style={styles.loadingText}>Loading forecast...</Text>
          </View>
        ) : forecast.length > 0 ? (
          <View style={styles.forecastContainer}>
            {forecast.slice(0, 5).map((item, index) => {
              const ForecastIcon = getWeatherIcon(item.conditions);
              return (
                <View key={`${item.date}-${index}`} style={styles.forecastItem}>
                  <Text style={styles.forecastDay}>{getDayName(item.date)}</Text>
                  <ForecastIcon color={colors.primaryLight} size={24} />
                  <View style={styles.forecastTemps}>
                    <Text style={styles.forecastHigh}>{item.high}°</Text>
                    <Text style={styles.forecastLow}>{item.low}°</Text>
                  </View>
                  <View style={styles.forecastDetails}>
                    <Text style={styles.forecastPrecip}>{item.precipitationChance}%</Text>
                    <Text style={styles.forecastWind}>{item.windSpeed} mph</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.errorCard}>
            <Cloud color={colors.textSecondary} size={32} />
            <Text style={styles.errorDescription}>
              Forecast data unavailable
            </Text>
          </View>
        )}

        <View style={styles.footer} />
      </ScrollView>

      <WeatherAlertsModal
        visible={alertsModalVisible}
        onClose={() => setAlertsModalVisible(false)}
      />

      <WeatherForecastModal
        visible={forecastModalVisible}
        onClose={() => setForecastModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionDescription: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  permissionButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  locationHeader: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  locationText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  lastUpdatedText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  alertsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    borderWidth: 1,
    borderColor: colors.border,
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertsInfo: {
    marginLeft: 12,
    flex: 1,
  },
  alertsTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  alertsCount: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  alertsDescription: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  currentWeatherCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currentWeatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  temperatureContainer: {
    marginLeft: 20,
    flex: 1,
  },
  temperature: {
    color: colors.text,
    fontSize: 48,
    fontWeight: '300',
  },
  conditions: {
    color: colors.textSecondary,
    fontSize: 18,
    marginTop: 4,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
  },
  seeAllText: {
    color: colors.primaryLight,
    fontSize: 14,
    fontWeight: '500',
  },
  forecastContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  forecastDay: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    width: 80,
  },
  forecastTemps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    width: 60,
  },
  forecastHigh: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  forecastLow: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  forecastDetails: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  forecastPrecip: {
    color: colors.primaryLight,
    fontSize: 12,
    marginBottom: 2,
  },
  forecastWind: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  loadingCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },
  errorCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  errorDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  spinning: {
    transform: [{ rotate: '45deg' }],
  },
  footer: {
    height: 20,
  },
});