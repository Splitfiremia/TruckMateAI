import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Truck, User, Calendar, Wrench, AlertTriangle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { FleetVehicle } from '@/types/fleet';
import { useFleetStore } from '@/store/fleetStore';

interface FleetVehicleCardProps {
  vehicle: FleetVehicle;
  onPress?: () => void;
}

export default function FleetVehicleCard({ vehicle, onPress }: FleetVehicleCardProps) {
  const { drivers } = useFleetStore();
  const assignedDriver = drivers.find(d => d.id === vehicle.assignedDriverId);
  
  const getStatusColor = () => {
    switch (vehicle.status) {
      case 'active':
        return colors.secondary;
      case 'maintenance':
        return colors.warning;
      case 'out_of_service':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };
  
  const isMaintenanceOverdue = () => {
    const dueDate = new Date(vehicle.nextMaintenanceDue);
    const now = new Date();
    return dueDate < now;
  };
  
  const getMaintenanceStatus = () => {
    const dueDate = new Date(vehicle.nextMaintenanceDue);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, color: colors.danger };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, color: colors.warning };
    } else {
      return { text: `Due ${dueDate.toLocaleDateString()}`, color: colors.textSecondary };
    }
  };
  
  const maintenanceStatus = getMaintenanceStatus();
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.vehicleInfo}>
          <View style={[styles.icon, { backgroundColor: getStatusColor() }]}>
            <Truck size={20} color={colors.text} />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.unitNumber}>{vehicle.unitNumber}</Text>
            <Text style={styles.makeModel}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.status, { color: getStatusColor() }]}>
            {vehicle.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>VIN:</Text>
          <Text style={styles.detailValue}>{vehicle.vin}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>License:</Text>
          <Text style={styles.detailValue}>{vehicle.licensePlate}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mileage:</Text>
          <Text style={styles.detailValue}>{vehicle.mileage.toLocaleString()} mi</Text>
        </View>
        
        {assignedDriver && (
          <View style={styles.driverAssignment}>
            <User size={14} color={colors.primaryLight} />
            <Text style={styles.driverName}>Assigned to {assignedDriver.name}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.maintenance}>
        <View style={styles.maintenanceRow}>
          <View style={styles.maintenanceItem}>
            <Text style={styles.maintenanceLabel}>Last Inspection</Text>
            <View style={styles.maintenanceValueContainer}>
              <Calendar size={14} color={colors.textSecondary} />
              <Text style={styles.maintenanceValue}>
                {new Date(vehicle.lastInspection).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          <View style={styles.maintenanceItem}>
            <Text style={styles.maintenanceLabel}>Next Maintenance</Text>
            <View style={styles.maintenanceValueContainer}>
              <Wrench size={14} color={maintenanceStatus.color} />
              <Text style={[styles.maintenanceValue, { color: maintenanceStatus.color }]}>
                {maintenanceStatus.text}
              </Text>
              {isMaintenanceOverdue() && (
                <AlertTriangle size={14} color={colors.danger} style={{ marginLeft: 4 }} />
              )}
            </View>
          </View>
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
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
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
  unitNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  makeModel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  driverAssignment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  driverName: {
    fontSize: 14,
    color: colors.primaryLight,
    marginLeft: 6,
    fontWeight: '500',
  },
  maintenance: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  maintenanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  maintenanceItem: {
    flex: 1,
  },
  maintenanceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  maintenanceValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maintenanceValue: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});