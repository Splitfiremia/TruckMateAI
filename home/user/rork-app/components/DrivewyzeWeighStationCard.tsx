import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Clock, CheckCircle, XCircle, AlertTriangle, Wrench } from 'lucide-react-native';
import { DrivewyzeWeighStation } from '@/types';
import { colors } from '@/constants/colors';

interface DrivewyzeWeighStationCardProps {
  station: DrivewyzeWeighStation;
  onPress?: () => void;
  onBypassRequest?: () => void;
  showDistance?: boolean;
}

export const DrivewyzeWeighStationCard: React.FC<DrivewyzeWeighStationCardProps> = ({
  station,
  onPress,
  onBypassRequest,
  showDistance = true,
}) => {
  const getStatusIcon = () => {
    switch (station.status) {
      case 'open':
        return <CheckCircle size={20} color={colors.success} />;
      case 'closed':
        return <XCircle size={20} color={colors.danger} />;
      case 'bypass_available':
        return <CheckCircle size={20} color={colors.primary} />;
      case 'maintenance':
        return <Wrench size={20} color={colors.warning} />;
      default:
        return <AlertTriangle size={20} color={colors.warning} />;
    }
  };

  const getStatusColor = () => {
    switch (station.status) {
      case 'open':
        return colors.success;
      case 'closed':
        return colors.danger;
      case 'bypass_available':
        return colors.primary;
      case 'maintenance':
        return colors.warning;
      default:
        return colors.warning;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <MapPin size={16} color={getStatusColor()} />
        <Text style={styles.title}>{station.name}</Text>
        {getStatusIcon()}
      </View>
      {showDistance && station.distance && (
        <Text style={styles.distance}>
          {station.distance.toFixed(1)} miles away
        </Text>
      )}
      <View style={styles.details}>
        <Text style={styles.location}>{station.location.address}</Text>
        {station.status === 'open' && station.operatingHours && (
          <View style={styles.hoursContainer}>
            <Clock size={14} color={colors.text.secondary} />
            <Text style={styles.hoursText}>
              Open until {station.operatingHours[new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase()] || 'Unknown'}
            </Text>
          </View>
        )}
      </View>
      {onBypassRequest && station.status === 'bypass_available' && station.bypassEligible && (
        <TouchableOpacity onPress={onBypassRequest} style={styles.bypassButton}>
          <Text style={styles.bypassText}>Request Bypass</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  distance: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  details: {
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hoursText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  bypassButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  bypassText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
});
