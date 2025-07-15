import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle, CheckCircle, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useComplianceStore } from '@/store/complianceStore';

interface ComplianceAlertProps {
  onPress?: () => void;
}

export default function ComplianceAlert({ onPress }: ComplianceAlertProps) {
  const { status, issues } = useComplianceStore();
  
  const getStatusColor = () => {
    switch (status) {
      case 'Good Standing':
        return colors.secondary;
      case 'Warning':
        return colors.warning;
      case 'Violation':
        return colors.danger;
      default:
        return colors.secondary;
    }
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case 'Good Standing':
        return <CheckCircle size={22} color={colors.secondary} />;
      case 'Warning':
        return <AlertCircle size={22} color={colors.warning} />;
      case 'Violation':
        return <AlertCircle size={22} color={colors.danger} />;
      default:
        return <CheckCircle size={22} color={colors.secondary} />;
    }
  };
  
  const getMessage = () => {
    if (issues.length === 0) {
      return "All compliance requirements met";
    }
    
    if (issues.length === 1) {
      return issues[0].message;
    }
    
    return `${issues.length} compliance issues need attention`;
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, { borderLeftColor: getStatusColor() }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {getStatusIcon()}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Compliance Status: {status}</Text>
        <Text style={styles.message}>{getMessage()}</Text>
      </View>
      
      <ChevronRight size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});