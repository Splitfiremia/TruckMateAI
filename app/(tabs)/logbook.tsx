import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Clock, Calendar, MapPin, AlertTriangle, CheckCircle } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useLogbookStore } from '@/store/logbookStore';
import { useComplianceStore } from '@/store/complianceStore';
import StatusCard from '@/components/StatusCard';
import StatusChangeModal from '@/components/StatusChangeModal';
import VoiceCommandButton from '@/components/VoiceCommandButton';
import CommandResponseModal from '@/components/CommandResponseModal';
import { useVoiceCommandStore } from '@/store/voiceCommandStore';

export default function LogbookScreen() {
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [commandModalVisible, setCommandModalVisible] = useState(false);
  const { lastCommand, lastResponse } = useVoiceCommandStore();
  
  const { 
    currentStatus, 
    statusStartTime, 
    drivingHoursToday, 
    drivingHoursWeek,
    lastLocation 
  } = useLogbookStore();
  
  const { rules } = useComplianceStore();
  
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const getRemainingDrivingHours = () => {
    const maxDailyDriving = rules.hoursOfService.drivingLimit;
    const remaining = maxDailyDriving - drivingHoursToday;
    
    if (remaining <= 0) {
      return "0h 0m";
    }
    
    const hours = Math.floor(remaining);
    const minutes = Math.round((remaining - hours) * 60);
    
    return `${hours}h ${minutes}m`;
  };
  
  const getRemainingCycleHours = () => {
    const maxCycleHours = rules.hoursOfService.weeklyLimit;
    const remaining = maxCycleHours - drivingHoursWeek;
    
    if (remaining <= 0) {
      return "0h 0m";
    }
    
    const hours = Math.floor(remaining);
    const minutes = Math.round((remaining - hours) * 60);
    
    return `${hours}h ${minutes}m`;
  };
  
  const getBreakRequirement = () => {
    const { breakRequired } = rules.hoursOfService;
    const timeUntilBreak = breakRequired.after - drivingHoursToday;
    
    if (timeUntilBreak <= 0) {
      return (
        <View style={styles.warningContainer}>
          <AlertTriangle size={16} color={colors.warning} />
          <Text style={[styles.infoValue, { color: colors.warning }]}>
            Break required now
          </Text>
        </View>
      );
    }
    
    const hours = Math.floor(timeUntilBreak);
    const minutes = Math.round((timeUntilBreak - hours) * 60);
    
    return (
      <View style={styles.infoValueContainer}>
        <CheckCircle size={16} color={colors.secondary} />
        <Text style={[styles.infoValue, { color: colors.secondary }]}>
          {`Break in ${hours}h ${minutes}m`}
        </Text>
      </View>
    );
  };
  
  const handleCommandProcessed = () => {
    setCommandModalVisible(true);
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Logbook',
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <StatusCard onStatusChange={() => setStatusModalVisible(true)} />
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Status Details</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>{currentStatus}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Since</Text>
              <Text style={styles.infoValue}>{formatTime(statusStartTime)}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Location</Text>
              <View style={styles.infoValueContainer}>
                <MapPin size={16} color={colors.primaryLight} />
                <Text style={styles.infoValue}>{lastLocation}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hours of Service</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Daily Driving</Text>
              <View style={styles.infoValueContainer}>
                <Clock size={16} color={colors.text} />
                <Text style={styles.infoValue}>{drivingHoursToday.toFixed(1)}h</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Remaining</Text>
              <Text style={styles.infoValue}>{getRemainingDrivingHours()}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Cycle Hours</Text>
              <View style={styles.infoValueContainer}>
                <Calendar size={16} color={colors.text} />
                <Text style={styles.infoValue}>{drivingHoursWeek.toFixed(1)}h</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Cycle Remaining</Text>
              <Text style={styles.infoValue}>{getRemainingCycleHours()}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Break Status</Text>
              {getBreakRequirement()}
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Compliance Rules</Text>
          
          <View style={styles.ruleItem}>
            <Text style={styles.ruleLabel}>Daily Driving Limit</Text>
            <Text style={styles.ruleValue}>{rules.hoursOfService.drivingLimit} hours</Text>
          </View>
          
          <View style={styles.ruleItem}>
            <Text style={styles.ruleLabel}>Daily Duty Limit</Text>
            <Text style={styles.ruleValue}>{rules.hoursOfService.dutyLimit} hours</Text>
          </View>
          
          <View style={styles.ruleItem}>
            <Text style={styles.ruleLabel}>Required Rest Period</Text>
            <Text style={styles.ruleValue}>{rules.hoursOfService.restRequired} hours</Text>
          </View>
          
          <View style={styles.ruleItem}>
            <Text style={styles.ruleLabel}>Weekly Cycle Limit</Text>
            <Text style={styles.ruleValue}>{rules.hoursOfService.weeklyLimit} hours / 8 days</Text>
          </View>
          
          <View style={styles.ruleItem}>
            <Text style={styles.ruleLabel}>Break Requirement</Text>
            <Text style={styles.ruleValue}>
              {rules.hoursOfService.breakRequired.duration * 60} min after {rules.hoursOfService.breakRequired.after}h driving
            </Text>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setStatusModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>Change Status</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer} />
      </ScrollView>
      
      <View style={styles.voiceButtonContainer}>
        <VoiceCommandButton onCommandProcessed={handleCommandProcessed} />
      </View>
      
      <StatusChangeModal 
        visible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
      />
      
      <CommandResponseModal
        visible={commandModalVisible}
        onClose={() => setCommandModalVisible(false)}
        command={lastCommand}
        response={lastResponse}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ruleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ruleLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  ruleValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  actionsContainer: {
    marginVertical: 16,
  },
  actionButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  footer: {
    height: 100, // Space for the floating button
  },
  voiceButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});