import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { X, Cloud, CloudRain, Sun, Wind, Droplets, RefreshCw, MapPin } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useWeatherStore, WeatherForecast } from '@/store/weatherStore';

interface WeatherForecastModalProps {
  visible: boolean;
  onClose: () => void;
}

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
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
};

const ForecastCard: React.FC<{ forecast: WeatherForecast; isToday?: boolean }> = ({ forecast, isToday }) => {
  const WeatherIcon = getWeatherIcon(forecast.conditions);
  
  return (
    <View style={[styles.forecastCard, isToday && styles.todayCard]}>
      <View style={styles.forecastHeader}>
        <Text style={[styles.dayName, isToday && styles.todayText]}>
          {getDayName(forecast.date)}
        </Text>
        <Text style={styles.date}>
          {new Date(forecast.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </Text>
      </View>
      
      <View style={styles.forecastMain}>
        <WeatherIcon color={colors.primaryLight} size={32} />
        <View style={styles.temperatureRange}>
          <Text style={styles.highTemp}>{forecast.high}°</Text>
          <Text style={styles.lowTemp}>{forecast.low}°</Text>
        </View>
      </View>
      
      <Text style={styles.forecastConditions} numberOfLines={2}>
        {forecast.conditions}
      </Text>
      
      <View style={styles.forecastDetails}>
        <View style={styles.detailRow}>
          <Droplets color={colors.textSecondary} size={14} />
          <Text style={styles.detailText}>{forecast.precipitationChance}%</Text>
        </View>
        <View style={styles.detailRow}>
          <Wind color={colors.textSecondary} size={14} />
          <Text style={styles.detailText}>{forecast.windSpeed} mph</Text>
        </View>
      </View>
    </View>
  );
};

export const WeatherForecastModal: React.FC<WeatherForecastModalProps> = ({ visible, onClose }) => {
  const {
    currentLocation,
    currentWeather,
    forecast,
    isLoadingWeather,
    lastUpdated,
    fetchWeatherData,
  } = useWeatherStore();

  useEffect(() => {
    if (visible && currentLocation && forecast.length === 0) {
      fetchWeatherData();
    }
  }, [visible, currentLocation]);

  const handleRefresh = () => {
    if (currentLocation) {
      fetchWeatherData();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Weather Forecast</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color={colors.text} size={24} />
          </TouchableOpacity>
        </View>

        {currentLocation && (
          <View style={styles.locationHeader}>
            <View style={styles.locationInfo}>
              <MapPin color={colors.textSecondary} size={16} />
              <Text style={styles.locationText}>
                {currentLocation.city}
                {currentLocation.state && `, ${currentLocation.state}`}
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
        )}

        {lastUpdated && (
          <Text style={styles.lastUpdated}>
            Last updated: {new Date(lastUpdated).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
        )}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {currentWeather && (
            <View style={styles.currentWeatherSection}>
              <Text style={styles.sectionTitle}>Current Conditions</Text>
              <View style={styles.currentWeatherCard}>
                <View style={styles.currentWeatherMain}>
                  {React.createElement(getWeatherIcon(currentWeather.conditions), {
                    color: colors.primaryLight,
                    size: 48,
                  })}
                  <View style={styles.currentTemperature}>
                    <Text style={styles.currentTemp}>{currentWeather.temperature}°F</Text>
                    <Text style={styles.currentConditions}>{currentWeather.conditions}</Text>
                  </View>
                </View>
                
                <View style={styles.currentDetails}>
                  <View style={styles.currentDetailItem}>
                    <Wind color={colors.textSecondary} size={16} />
                    <Text style={styles.currentDetailText}>
                      {currentWeather.windSpeed} mph {currentWeather.windDirection}
                    </Text>
                  </View>
                  <View style={styles.currentDetailItem}>
                    <Droplets color={colors.textSecondary} size={16} />
                    <Text style={styles.currentDetailText}>
                      {currentWeather.humidity}% humidity
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View style={styles.forecastSection}>
            <Text style={styles.sectionTitle}>7-Day Forecast</Text>
            
            {isLoadingWeather && forecast.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.primaryLight} size="large" />
                <Text style={styles.loadingText}>Loading forecast...</Text>
              </View>
            ) : forecast.length === 0 ? (
              <View style={styles.emptyState}>
                <Cloud color={colors.textSecondary} size={48} />
                <Text style={styles.emptyTitle}>No Forecast Available</Text>
                <Text style={styles.emptyDescription}>
                  Unable to load weather forecast data.
                </Text>
              </View>
            ) : (
              <View style={styles.forecastGrid}>
                {forecast.map((item, index) => (
                  <ForecastCard
                    key={item.date}
                    forecast={item}
                    isToday={index === 0}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.backgroundLight,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 6,
  },
  spinning: {
    transform: [{ rotate: '45deg' }],
  },
  lastUpdated: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  currentWeatherSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  currentWeatherCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currentWeatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentTemperature: {
    marginLeft: 16,
    flex: 1,
  },
  currentTemp: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '600',
  },
  currentConditions: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 4,
  },
  currentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  currentDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentDetailText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 6,
  },
  forecastSection: {
    marginBottom: 20,
  },
  forecastGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  forecastCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  todayCard: {
    borderColor: colors.primaryLight,
    borderWidth: 1.5,
  },
  forecastHeader: {
    marginBottom: 12,
  },
  dayName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  todayText: {
    color: colors.primaryLight,
  },
  date: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  forecastMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  temperatureRange: {
    alignItems: 'flex-end',
  },
  highTemp: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
  },
  lowTemp: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  forecastConditions: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    minHeight: 32,
  },
  forecastDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: colors.textSecondary,
    fontSize: 11,
    marginLeft: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});