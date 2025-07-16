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

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MapPin size={16} color={colors.text.secondary} />
          <Text style={styles.name} numberOfLines={1}>
            {station.name}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          {getStatusIcon()}
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.address} numberOfLines={2}>
          {station.location.address}
        </Text>
        
        {showDistance && station.distance && (
          <View style={styles.distanceRow}>
            <Text style={styles.distance}>{station.distance.toFixed(1)} miles away</Text>
          </View>
        )}

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Clock size={14} color={colors.text.secondary} />
            <Text style={styles.detailText}>
              {station.operatingHours?.monday || 'Hours vary'}
            </Text>
          </View>
          
          {station.bypassEligible && (
            <View style={styles.bypassInfo}>
              <Text style={styles.bypassText}>Bypass Eligible</Text>
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
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  name: {
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
  content: {
    gap: 8,
  },
  address: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  details: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: colors.text.secondary,
    flex: 1,
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
    fontSize: 13,
    color: colors.success,
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
});