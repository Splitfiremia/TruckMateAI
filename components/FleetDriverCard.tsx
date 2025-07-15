import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  User, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Truck,
  Phone,
  Mail
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { FleetDriver } from '@/store/fleetStore';

interface FleetDriverCardProps {
  driver: FleetDriver;
  onStatusChange?: (status: FleetDriver['status']) => void;
}

export default function FleetDriverCard({ driver, onStatusChange }: FleetDriverCardProps) {
  const getStatusColor = (status: FleetDriver['status']) => {
    switch (status) {
      case 'Driving':
        return colors.primaryLight;
      case 'Active':
        return colors.secondary;
      case 'On Break':
        return colors.warning;
      case 'Off Duty':
        return colors.textSecondary;
      case 'Inactive':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };
  
  const getComplianceIcon = () => {
    if (driver.complianceScore >= 95) {
      return <CheckCircle size={16} color={colors.secondary} />;
    } else if (driver.complianceScore >= 85) {
      return <AlertTriangle size={16} color={colors.warning} />;
    } else {
      return <AlertTriangle size={16} color={colors.danger} />;
    }
  };
  
  const formatLastActivity = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.driverInfo}>
          <View style={styles.avatar}>
            <User size={24} color={colors.text} />
          </View>
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <Text style={styles.licenseNumber}>CDL: {driver.licenseNumber}</Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(driver.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(driver.status) }]}>
            {driver.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={styles.metricLabel}>Today</Text>
          <Text style={styles.metricValue}>{driver.hoursToday.toFixed(1)}h</Text>
        </View>
        
        <View style={styles.metric}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={styles.metricLabel}>Week</Text>
          <Text style={styles.metricValue}>{driver.hoursWeek.toFixed(1)}h</Text>
        </View>
        
        <View style={styles.metric}>
          {getComplianceIcon()}
          <Text style={styles.metricLabel}>Compliance</Text>
          <Text style={styles.metricValue}>{driver.complianceScore}%</Text>
        </View>
        
        <View style={styles.metric}>
          <AlertTriangle size={16} color={driver.violations > 0 ? colors.danger : colors.secondary} />
          <Text style={styles.metricLabel}>Violations</Text>
          <Text style={[
            styles.metricValue,
            { color: driver.violations > 0 ? colors.danger : colors.secondary }
          ]}>
            {driver.violations}
          </Text>
        </View>
      </View>
      
      <View style={styles.locationRow}>
        <MapPin size={16} color={colors.primaryLight} />
        <Text style={styles.locationText}>{driver.currentLocation}</Text>
        <Text style={styles.lastActivity}>• {formatLastActivity(driver.lastActivity)}</Text>
      </View>
      
      {driver.vehicleAssigned && (
        <View style={styles.vehicleRow}>
          <Truck size={16} color={colors.textSecondary} />
          <Text style={styles.vehicleText}>Vehicle: {driver.vehicleAssigned}</Text>
        </View>
      )}
      
      <View style={styles.contactRow}>
        <TouchableOpacity style={styles.contactButton}>
          <Phone size={16} color={colors.primaryLight} />
          <Text style={styles.contactButtonText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.contactButton}>
          <Mail size={16} color={colors.primaryLight} />
          <Text style={styles.contactButtonText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  licenseNumber: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
    flex: 1,
  },
  lastActivity: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  contactButtonText: {
    fontSize: 14,
    color: colors.primaryLight,
    fontWeight: '500',
  },
  viewButton: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
});