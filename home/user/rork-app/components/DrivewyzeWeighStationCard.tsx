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

  const formatOperatingHours = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = station.operatingHours[today as keyof typeof station.operatingHours];
    return todayHours || 'Hours not available';
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
          <Text style={styles.statusText}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.address} numberOfLines={1}>
          {station.location.address}
        </Text>
        
        {showDistance && station.distance && (
          <View style={styles.distanceContainer}>
            <Text style={styles.distance}>
              {station.distance.toFixed(1)} miles away
            </Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <View style={styles.hoursContainer}>
            <Clock size={14} color={colors.text.secondary} />
            <Text style={styles.hours}>
              {formatOperatingHours()}
            </Text>
          </View>
        </View>

        {station.bypassEligible && (
          <View style={styles.bypassInfo}>
            <Text style={[styles.bypassText, { color: getBypassStatusColor() }]}>
              {station.bypassStatus ? `Bypass ${station.bypassStatus}` : 'Bypass eligible'}
            </Text>
            {station.status === 'bypass_available' && onBypassRequest && (
              <TouchableOpacity 
                style={styles.bypassButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onBypassRequest();
                }}
              >
                <Text style={styles.bypassButtonText}>Request Bypass</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {station.services && station.services.length > 0 && (
          <View style={styles.servicesContainer}>
            <Text style={styles.servicesLabel}>Services:</Text>
            <Text style={styles.services} numberOfLines={1}>
              {station.services.join(', ')}
            </Text>
          </View>
        )}
      </View>
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
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
  },
  details: {
    gap: 8,
  },
  address: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  distanceContainer: {
    alignSelf: 'flex-start',
  },
  distance: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hours: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  bypassInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bypassText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bypassButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bypassButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  servicesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  servicesLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  services: {
    fontSize: 13,
    color: colors.text.secondary,
    flex: 1,
  },
});