import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Clock, DollarSign, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Load } from '@/types';

interface UpcomingLoadCardProps {
  load: Load;
  onPress?: () => void;
}

export default function UpcomingLoadCard({ load, onPress }: UpcomingLoadCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.loadId}>{load.id}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: load.status === 'Confirmed' ? colors.secondary : colors.warning }
        ]}>
          <Text style={styles.statusText}>{load.status}</Text>
        </View>
      </View>
      
      <View style={styles.routeContainer}>
        <View style={styles.locationContainer}>
          <MapPin size={16} color={colors.primaryLight} />
          <Text style={styles.locationText}>{load.pickup.location}</Text>
          <Clock size={14} color={colors.textSecondary} style={styles.timeIcon} />
          <Text style={styles.timeText}>{formatDate(load.pickup.time)}</Text>
        </View>
        
        <View style={styles.routeLine}>
          <View style={styles.routeDot} />
          <View style={styles.routeDash} />
          <View style={styles.routeDot} />
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={16} color={colors.danger} />
          <Text style={styles.locationText}>{load.delivery.location}</Text>
          <Clock size={14} color={colors.textSecondary} style={styles.timeIcon} />
          <Text style={styles.timeText}>{formatDate(load.delivery.time)}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Distance</Text>
          <Text style={styles.infoValue}>{load.miles} mi</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Rate</Text>
          <Text style={styles.infoValue}>{load.rate}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <DollarSign size={16} color={colors.secondary} />
          <Text style={[styles.infoValue, { color: colors.secondary }]}>{load.totalPay}</Text>
        </View>
        
        <ChevronRight size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loadId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  routeContainer: {
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  locationText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  timeIcon: {
    marginLeft: 8,
  },
  timeText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    height: 24,
  },
  routeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryLight,
  },
  routeDash: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primaryLight,
    marginHorizontal: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
});