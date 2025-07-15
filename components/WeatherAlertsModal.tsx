import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { X, AlertTriangle, Clock, MapPin, Info } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useWeatherStore, WeatherAlert } from '@/store/weatherStore';

interface WeatherAlertsModalProps {
  visible: boolean;
  onClose: () => void;
}

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
      return Info;
  }
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const WeatherAlertCard: React.FC<{ alert: WeatherAlert; onDismiss: (id: string) => void }> = ({ alert, onDismiss }) => {
  const SeverityIcon = getSeverityIcon(alert.severity);
  const severityColor = getSeverityColor(alert.severity);

  const handleDismiss = () => {
    Alert.alert(
      'Dismiss Alert',
      'Are you sure you want to dismiss this weather alert?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Dismiss', style: 'destructive', onPress: () => onDismiss(alert.id) },
      ]
    );
  };

  return (
    <View style={[styles.alertCard, { borderLeftColor: severityColor }]}>
      <View style={styles.alertHeader}>
        <View style={styles.alertTitleContainer}>
          <SeverityIcon color={severityColor} size={20} />
          <Text style={[styles.alertTitle, { color: severityColor }]}>
            {alert.event}
          </Text>
        </View>
        <TouchableOpacity onPress={handleDismiss} style={styles.dismissButton}>
          <X color={colors.textSecondary} size={18} />
        </TouchableOpacity>
      </View>

      <Text style={styles.alertHeadline}>{alert.headline}</Text>

      <View style={styles.alertMeta}>
        <View style={styles.metaItem}>
          <Clock color={colors.textSecondary} size={14} />
          <Text style={styles.metaText}>
            Until {formatDateTime(alert.expires)}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <MapPin color={colors.textSecondary} size={14} />
          <Text style={styles.metaText} numberOfLines={1}>
            {alert.areas.slice(0, 2).join(', ')}
            {alert.areas.length > 2 && ` +${alert.areas.length - 2} more`}
          </Text>
        </View>
      </View>

      <Text style={styles.alertDescription} numberOfLines={4}>
        {alert.description}
      </Text>

      {alert.instruction && (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>Instructions:</Text>
          <Text style={styles.instructionText}>{alert.instruction}</Text>
        </View>
      )}

      <View style={styles.alertFooter}>
        <View style={styles.severityBadge}>
          <Text style={[styles.severityText, { color: severityColor }]}>
            {alert.severity.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.urgencyText}>
          {alert.urgency} • {alert.certainty}
        </Text>
      </View>
    </View>
  );
};

export const WeatherAlertsModal: React.FC<WeatherAlertsModalProps> = ({ visible, onClose }) => {
  const { alerts, dismissAlert, currentLocation } = useWeatherStore();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Weather Alerts</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color={colors.text} size={24} />
          </TouchableOpacity>
        </View>

        {currentLocation && (
          <View style={styles.locationHeader}>
            <MapPin color={colors.textSecondary} size={16} />
            <Text style={styles.locationText}>
              {currentLocation.city}
              {currentLocation.state && `, ${currentLocation.state}`}
            </Text>
          </View>
        )}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {alerts.length === 0 ? (
            <View style={styles.emptyState}>
              <Info color={colors.textSecondary} size={48} />
              <Text style={styles.emptyTitle}>No Active Alerts</Text>
              <Text style={styles.emptyDescription}>
                There are currently no weather alerts for your location.
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.alertCount}>
                {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
              </Text>
              {alerts.map((alert) => (
                <WeatherAlertCard
                  key={alert.id}
                  alert={alert}
                  onDismiss={dismissAlert}
                />
              ))}
            </>
          )}
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.backgroundLight,
  },
  locationText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  alertCount: {
    color: colors.textSecondary,
    fontSize: 14,
    marginVertical: 16,
  },
  alertCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  dismissButton: {
    padding: 4,
  },
  alertHeadline: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  alertMeta: {
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
  },
  alertDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  instructionContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  instructionTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  instructionText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: colors.backgroundLight,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  urgencyText: {
    color: colors.textSecondary,
    fontSize: 11,
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
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
    lineHeight: 20,
  },
});