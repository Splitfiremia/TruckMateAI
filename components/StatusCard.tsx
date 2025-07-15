import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, AlertTriangle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { DutyStatus } from '@/types';
import { useLogbookStore } from '@/store/logbookStore';

interface StatusCardProps {
  onStatusChange?: () => void;
}

export default function StatusCard({ onStatusChange }: StatusCardProps) {
  const { currentStatus, drivingHoursToday, isOnBreak } = useLogbookStore();
  
  const getStatusColor = (status: DutyStatus) => {
    switch (status) {
      case 'Driving':
        return colors.primaryLight;
      case 'On Duty Not Driving':
        return colors.warning;
      case 'Off Duty':
        return colors.secondary;
      case 'Sleeper Berth':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };
  
  const getTimeRemaining = () => {
    const maxDailyDriving = 11; // 11-hour rule
    const remaining = maxDailyDriving - drivingHoursToday;
    
    if (remaining <= 0) {
      return "0h 0m";
    }
    
    const hours = Math.floor(remaining);
    const minutes = Math.round((remaining - hours) * 60);
    
    return `${hours}h ${minutes}m`;
  };
  
  const getBreakStatus = () => {
    // 8-hour rule: need 30-min break after 8 hours of driving
    const breakNeededAfter = 8;
    const timeUntilBreak = breakNeededAfter - drivingHoursToday;
    
    if (isOnBreak) {
      return "On Break";
    }
    
    if (timeUntilBreak <= 0) {
      return "Break Required Now";
    }
    
    const hours = Math.floor(timeUntilBreak);
    const minutes = Math.round((timeUntilBreak - hours) * 60);
    
    return `Break in ${hours}h ${minutes}m`;
  };
  
  const needsBreakSoon = !isOnBreak && (8 - drivingHoursToday) < 1.5;
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onStatusChange}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(currentStatus) }]} />
        <Text style={styles.statusText}>{currentStatus}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Clock size={18} color={colors.text} />
          <Text style={styles.infoLabel}>Drive Time Remaining</Text>
          <Text style={styles.infoValue}>{getTimeRemaining()}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.infoItem}>
          {needsBreakSoon && !isOnBreak && (
            <AlertTriangle size={18} color={colors.warning} />
          )}
          {!needsBreakSoon && (
            <Clock size={18} color={colors.text} />
          )}
          <Text style={[
            styles.infoLabel,
            needsBreakSoon && !isOnBreak && { color: colors.warning }
          ]}>
            {getBreakStatus()}
          </Text>
          <Text style={styles.infoValue}>
            {isOnBreak ? "30 min required" : `${drivingHoursToday.toFixed(1)}h driven`}
          </Text>
        </View>
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
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
});