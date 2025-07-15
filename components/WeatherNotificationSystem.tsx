import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { AlertTriangle, Cloud, X, MapPin } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useWeatherStore, WeatherAlert } from '@/store/weatherStore';
import { useSettingsStore } from '@/store/settingsStore';

interface WeatherNotificationSystemProps {
  onNotificationPress?: (alert: WeatherAlert) => void;
}

export const WeatherNotificationSystem: React.FC<WeatherNotificationSystemProps> = ({
  onNotificationPress
}) => {
  const [visibleAlert, setVisibleAlert] = useState<WeatherAlert | null>(null);
  const [slideAnim] = useState(new Animated.Value(-100));
  const [shownAlerts, setShownAlerts] = useState<Set<string>>(new Set());

  const { alerts, dismissAlert } = useWeatherStore();
  const { weatherAlertsEnabled, severeWeatherOnly } = useSettingsStore();

  useEffect(() => {
    if (!weatherAlertsEnabled || alerts.length === 0) {
      hideNotification();
      return;
    }

    // Filter alerts based on settings
    let filteredAlerts = alerts;
    if (severeWeatherOnly) {
      filteredAlerts = alerts.filter(alert => 
        alert.severity === 'severe' || alert.severity === 'extreme'
      );
    }

    // Find the first alert that hasn't been shown yet
    const newAlert = filteredAlerts.find(alert => !shownAlerts.has(alert.id));
    
    if (newAlert && !visibleAlert) {
      setVisibleAlert(newAlert);
      setShownAlerts(prev => new Set([...prev, newAlert.id]));
      showNotification();
    }
  }, [alerts, weatherAlertsEnabled, severeWeatherOnly, visibleAlert, shownAlerts]);

  const showNotification = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();

    // Auto-hide after 8 seconds for non-severe alerts
    if (visibleAlert && visibleAlert.severity !== 'severe' && visibleAlert.severity !== 'extreme') {
      setTimeout(() => {
        hideNotification();
      }, 8000);
    }
  };

  const hideNotification = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisibleAlert(null);
    });
  };

  const handlePress = () => {
    if (visibleAlert && onNotificationPress) {
      onNotificationPress(visibleAlert);
    }
    hideNotification();
  };

  const handleDismiss = () => {
    if (visibleAlert) {
      dismissAlert(visibleAlert.id);
    }
    hideNotification();
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'extreme':
      case 'severe':
        return AlertTriangle;
      default:
        return Cloud;
    }
  };

  if (!visibleAlert || !weatherAlertsEnabled) {
    return null;
  }

  const SeverityIcon = getSeverityIcon(visibleAlert.severity);
  const severityColor = getSeverityColor(visibleAlert.severity);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          borderLeftColor: severityColor,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <SeverityIcon color={severityColor} size={24} />
        </View>
        
        <View style={styles.textContainer}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: severityColor }]}>
              Weather Alert
            </Text>
            <View style={styles.severityBadge}>
              <Text style={[styles.severityText, { color: severityColor }]}>
                {visibleAlert.severity.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <Text style={styles.event} numberOfLines={1}>
            {visibleAlert.event}
          </Text>
          
          <Text style={styles.description} numberOfLines={2}>
            {visibleAlert.headline}
          </Text>
          
          <View style={styles.footer}>
            <View style={styles.locationContainer}>
              <MapPin color={colors.textSecondary} size={12} />
              <Text style={styles.location} numberOfLines={1}>
                {visibleAlert.areas.slice(0, 2).join(', ')}
              </Text>
            </View>
            <Text style={styles.tapHint}>Tap for details</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={handleDismiss}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X color={colors.textSecondary} size={18} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 16,
    right: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  severityBadge: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  event: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  tapHint: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '500',
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
});