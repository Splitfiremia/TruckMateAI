import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, CheckCircle, XCircle, AlertTriangle, Wrench } from 'lucide-react-native';
import type { DrivewyzeWeighStation } from '@/types';
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
  showDistance = true
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

  const getStatusText = () => {
    switch (station.status) {
      case 'open':
        return 'Open';
      case 'closed':
        return 'Closed';
      case 'bypass_available':
        return 'Bypass Available';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <MapPin size={16} color={getStatusColor()} />
        <Text style={styles.title}>{station.name}</Text>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
          {getStatusIcon()}
        </View>
      </View>

      {showDistance && station.distance && (
        <Text style={styles.distance}>
          {station.distance.toFixed(1)} miles away
        </Text>
      )}

      {onBypassRequest && station.status === 'bypass_available' && (
        <TouchableOpacity 
          onPress={onBypassRequest}
          style={styles.bypassButton}
        >
          <Text style={styles.bypassButtonText}>Request Bypass</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginRight: 4,
    fontSize: 14,
  },
  distance: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  bypassButton: {
    marginTop: 12,
    padding: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
    alignItems: 'center',
  },
  bypassButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});
