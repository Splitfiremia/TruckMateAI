import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Clock, CheckCircle, XCircle, AlertTriangle, Wrench } from 'lucide-react-native';
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
      case 'open': return <CheckCircle size={20} color={colors.success} />;
      case 'closed': return <XCircle size={20} color={colors.danger} />;
      case 'bypass_available': return <CheckCircle size={20} color={colors.primary} />;
      case 'maintenance': return <Wrench size={20} color={colors.warning} />;
      default: return <AlertTriangle size={20} color={colors.warning} />;
    }
  };

  const getStatusColor = () => {
    switch (station.status) {
      case 'open': return colors.success;
      case 'closed': return colors.danger;
      case 'bypass_available': return colors.primary;
      case 'maintenance': return colors.warning;
      default: return colors.warning;
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
      {onBypassRequest && station.status === 'bypass_available' && (
        <TouchableOpacity onPress={onBypassRequest} style={styles.bypassButton}>
          <Text style={styles.bypassText}>Request Bypass</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  distance: {
    marginTop: 4,
    color: '#666',
  },
  bypassButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
    alignItems: 'center',
  },
  bypassText: {
    color: '#fff',
    fontWeight: '500',
  },
});
