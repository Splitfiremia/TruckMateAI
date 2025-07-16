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
        
        {showDistance && station.distance && (
          <View style={styles.distanceContainer}>
            <Text style={styles.distance}>
              {station.distance.toFixed(1)} miles away
            </Text>
          </View>
        )}

        <View style={styles.statusRow}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
          
          {station.bypassEligible && (
            <View style={styles.bypassInfo}>
              <Text style={styles.bypassText}>Bypass Eligible</Text>
              {station.bypassStatus && (
                <View style={[styles.bypassStatusBadge, { backgroundColor: getBypassStatusColor() }]}>
                  <Text style={styles.bypassStatusText}>
                    {station.bypassStatus.charAt(0).toUpperCase() + station.bypassStatus.slice(1)}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {station.operatingHours && (
          <View style={styles.hoursContainer}>
            <Clock size={12} color={colors.text.secondary} />
            <Text style={styles.hoursText}>
              {station.operatingHours[new Date().toLocaleLowerCase().slice(0, 3) as keyof typeof station.operatingHours] || 'Hours vary'}
            </Text>
          </View>
        )}

        {station.services && station.services.length > 0 && (
          <View style={styles.servicesContainer}>
            <Text style={styles.servicesLabel}>Services:</Text>
            <Text style={styles.servicesText} numberOfLines={1}>
              {station.services.join(', ')}
            </Text>
          </View>
        )}
      </View>

      {station.bypassEligible && station.status === 'bypass_available' && onBypassRequest && (
        <TouchableOpacity
          style={styles.bypassButton}
          onPress={(e) => {
            e.stopPropagation();
            onBypassRequest();
          }}
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    borderRadius: 20,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bypassInfo: {
    alignItems: 'flex-end',
    gap: 4,
  },
  bypassText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  bypassStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  bypassStatusText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hoursText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  servicesContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  servicesLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  servicesText: {
    fontSize: 12,
    color: colors.text.secondary,
    flex: 1,
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