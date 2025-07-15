import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, Phone, Mail, Truck, Calendar, AlertTriangle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { FleetDriver } from '@/types/fleet';
import { useFleetStore } from '@/store/fleetStore';

interface FleetDriverCardProps {
  driver: FleetDriver;
  onPress?: () => void;
}

export default function FleetDriverCard({ driver, onPress }: FleetDriverCardProps) {
  const { vehicles } = useFleetStore();
  const assignedVehicle = vehicles.find(v => v.id === driver.vehicleAssigned);
  
  const getStatusColor = () => {
    switch (driver.status) {
      case 'active':
        return colors.secondary;
      case 'inactive':
        return colors.textSecondary;
      case 'suspended':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };
  
  const isExpiringSoon = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.driverInfo}>
          <View style={[styles.avatar, { backgroundColor: getStatusColor() }]}>
            <User size={20} color={colors.text} />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{driver.name}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
              <Text style={[styles.status, { color: getStatusColor() }]}>
                {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.role}>{driver.role.replace('_', ' ').toUpperCase()}</Text>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Mail size={14} color={colors.textSecondary} />
          <Text style={styles.detailText}>{driver.email}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Phone size={14} color={colors.textSecondary} />
          <Text style={styles.detailText}>{driver.phone}</Text>
        </View>
        
        {assignedVehicle && (
          <View style={styles.detailRow}>
            <Truck size={14} color={colors.primaryLight} />
            <Text style={styles.detailText}>
              {assignedVehicle.unitNumber} - {assignedVehicle.make} {assignedVehicle.model}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.certifications}>
        <View style={styles.certItem}>
          <Text style={styles.certLabel}>CDL Expires</Text>
          <View style={styles.certValueContainer}>
            <Text style={[
              styles.certValue,
              isExpiringSoon(driver.licenseExpiry) && { color: colors.warning }
            ]}>
              {new Date(driver.licenseExpiry).toLocaleDateString()}
            </Text>
            {isExpiringSoon(driver.licenseExpiry) && (
              <AlertTriangle size={14} color={colors.warning} />
            )}
          </View>
        </View>
        
        <View style={styles.certItem}>
          <Text style={styles.certLabel}>Medical Expires</Text>
          <View style={styles.certValueContainer}>
            <Text style={[
              styles.certValue,
              isExpiringSoon(driver.medicalCertExpiry) && { color: colors.warning }
            ]}>
              {new Date(driver.medicalCertExpiry).toLocaleDateString()}
            </Text>
            {isExpiringSoon(driver.medicalCertExpiry) && (
              <AlertTriangle size={14} color={colors.warning} />
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.hireDate}>
          <Calendar size={14} color={colors.textSecondary} />
          <Text style={styles.hireDateText}>
            Hired {new Date(driver.hireDate).toLocaleDateString()}
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
    marginBottom: 12,
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
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
  },
  role: {
    fontSize: 12,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  certifications: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  certItem: {
    flex: 1,
  },
  certLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  certValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginRight: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hireDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hireDateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});