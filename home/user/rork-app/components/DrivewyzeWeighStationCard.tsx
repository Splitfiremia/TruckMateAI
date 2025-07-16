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

  const getBypassStatusColor = () => {
    switch (station.bypassStatus) {
      case 'approved':
        return colors.success;
      case 'denied':
        return colors.danger;
      case 'pending':
        return colors.warning;
      default:
        return colors.text.secondary;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.locationInfo}>
          <MapPin size={16} color={colors.text.secondary} />
          <Text style={styles.stationName} numberOfLines={1}>
            {station.name}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          {getStatusIcon()}
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.address} numberOfLines={1}>
          {station.location.address}
        </Text>
        
        <View style={styles.infoRow}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
          {showDistance && station.distance && (
            <Text style={styles.distance}>
              {station.distance.toFixed(1)} mi
            </Text>
          )}
        </View>

        {station.bypassEligible && (
          <View style={styles.bypassInfo}>
            <Text style={styles.bypassEligible}>
              Bypass Eligible
            </Text>
            {station.bypassStatus && (
              <Text style={[styles.bypassStatus, { color: getBypassStatusColor() }]}>
                {station.bypassStatus.charAt(0).toUpperCase() + station.bypassStatus.slice(1)}
              </Text>
            )}
          </View>
        )}

        {station.operatingHours && (
          <View style={styles.hoursContainer}>
            <Clock size={12} color={colors.text.secondary} />
            <Text style={styles.hours}>
              {station.operatingHours[new Date().toLocaleLowerCase().slice(0, 3) as keyof typeof station.operatingHours] || 'Hours vary'}
            </Text>
          </View>
        )}
      </View>

      {onBypassRequest && station.status === 'bypass_available' && station.bypassEligible && (
        <TouchableOpacity
          style={styles.bypassButton}
          onPress={onBypassRequest}
          activeOpacity={0.8}
        >
          <Text style={styles.bypassButtonText}>Request Bypass</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    gap: 6,
  },
  address: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  distance: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  bypassInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  bypassEligible: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  bypassStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  hours: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  bypassButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  bypassButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});