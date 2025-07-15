import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle, Clock, CheckCircle, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ComplianceViolation } from '@/types/fleet';
import { useFleetStore } from '@/store/fleetStore';

interface ComplianceViolationCardProps {
  violation: ComplianceViolation;
  onPress?: () => void;
}

export default function ComplianceViolationCard({ violation, onPress }: ComplianceViolationCardProps) {
  const { resolveViolation } = useFleetStore();
  
  const getSeverityColor = () => {
    switch (violation.severity) {
      case 'minor':
        return colors.warning;
      case 'major':
        return colors.danger;
      case 'critical':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };
  
  const getTypeIcon = () => {
    switch (violation.type) {
      case 'hos':
        return <Clock size={20} color={getSeverityColor()} />;
      case 'inspection':
        return <CheckCircle size={20} color={getSeverityColor()} />;
      case 'maintenance':
        return <AlertTriangle size={20} color={getSeverityColor()} />;
      case 'documentation':
        return <User size={20} color={getSeverityColor()} />;
      default:
        return <AlertTriangle size={20} color={getSeverityColor()} />;
    }
  };
  
  const handleResolve = () => {
    if (!violation.resolved) {
      resolveViolation(violation.id, 'Fleet Manager', 'Resolved via fleet dashboard');
    }
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { borderLeftColor: getSeverityColor() },
        violation.resolved && styles.resolvedContainer
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {getTypeIcon()}
        </View>
        
        <View style={styles.violationInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.driverName}>{violation.driverName}</Text>
            <View style={[
              styles.severityBadge,
              { backgroundColor: `${getSeverityColor()}20` }
            ]}>
              <Text style={[styles.severityText, { color: getSeverityColor() }]}>
                {violation.severity.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <Text style={styles.description}>{violation.description}</Text>
          
          <View style={styles.metadata}>
            <Text style={styles.date}>
              {new Date(violation.date).toLocaleDateString()}
            </Text>
            <Text style={styles.type}>
              {violation.type.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      
      {violation.resolved ? (
        <View style={styles.resolvedInfo}>
          <CheckCircle size={16} color={colors.secondary} />
          <Text style={styles.resolvedText}>
            Resolved by {violation.resolvedBy} on{' '}
            {violation.resolvedAt ? new Date(violation.resolvedAt).toLocaleDateString() : 'Unknown'}
          </Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.resolveButton}
          onPress={handleResolve}
        >
          <CheckCircle size={16} color={colors.text} />
          <Text style={styles.resolveButtonText}>Mark as Resolved</Text>
        </TouchableOpacity>
      )}
      
      {violation.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText}>{violation.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resolvedContainer: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  violationInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  type: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  resolvedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.secondary}20`,
    padding: 8,
    borderRadius: 8,
  },
  resolvedText: {
    fontSize: 12,
    color: colors.secondary,
    marginLeft: 6,
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    padding: 8,
    borderRadius: 8,
    gap: 6,
  },
  resolveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  notesLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    color: colors.text,
    fontStyle: 'italic',
  },
});