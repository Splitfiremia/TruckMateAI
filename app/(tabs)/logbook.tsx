import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { Clock, Calendar, MapPin, AlertTriangle, CheckCircle, Truck, Coffee, Bed, FileText, Activity, RotateCcw } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useLogbookStore } from '@/store/logbookStore';
import { useComplianceStore } from '@/store/complianceStore';
import { StatusChangeLog, BreakLog, TripOverrideLog } from '@/types';
import StatusCard from '@/components/StatusCard';
import StatusChangeModal from '@/components/StatusChangeModal';
import VoiceCommandButton from '@/components/VoiceCommandButton';
import CommandResponseModal from '@/components/CommandResponseModal';
import { useVoiceCommandStore } from '@/store/voiceCommandStore';

export default function LogbookScreen() {
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [commandModalVisible, setCommandModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'current' | 'status' | 'breaks' | 'overrides'>('current');
  const { lastCommand, lastResponse } = useVoiceCommandStore();
  
  const { 
    currentStatus, 
    statusStartTime, 
    drivingHoursToday, 
    drivingHoursWeek,
    lastLocation,
    breakTime,
    isOnBreak,
    violations,
    getStatusChangeLogs,
    getBreakLogs,
    tripOverrideLogs
  } = useLogbookStore();
  
  const { rules } = useComplianceStore();
  const statusChangeLogs = getStatusChangeLogs(7); // Last 7 days
  const breakLogs = getBreakLogs(7); // Last 7 days
  const recentOverrides = tripOverrideLogs.slice(0, 10); // Last 10 overrides
  
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
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Driving':
        return <Truck size={20} color={colors.primary} />;
      case 'On Duty Not Driving':
        return <Clock size={20} color={colors.warning} />;
      case 'Off Duty':
        return <Coffee size={20} color={colors.secondary} />;
      case 'Sleeper Berth':
        return <Bed size={20} color={colors.textSecondary} />;
      default:
        return <Clock size={20} color={colors.textSecondary} />;
    }
  };
  
  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
    
    if (duration < 1) {
      return `${Math.round(duration * 60)}m`;
    }
    return `${duration.toFixed(1)}h`;
  };
  
  const renderStatusChangeLog = ({ item }: { item: StatusChangeLog }) => (
    <View style={styles.logItem}>
      <View style={styles.logHeader}>
        <View style={styles.logIconContainer}>
          {getStatusIcon(item.toStatus)}
        </View>
        <View style={styles.logContent}>
          <Text style={styles.logTitle}>
            {item.fromStatus} → {item.toStatus}
          </Text>
          <Text style={styles.logTime}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
          <Text style={styles.logLocation}>
            <MapPin size={12} color={colors.textSecondary} /> {item.location}
          </Text>
        </View>
      </View>
    </View>
  );
  
  const renderBreakLog = ({ item }: { item: BreakLog }) => (
    <View style={styles.logItem}>
      <View style={styles.logHeader}>
        <View style={[styles.logIconContainer, { backgroundColor: colors.secondary + '20' }]}>
          <Coffee size={16} color={colors.secondary} />
        </View>
        <View style={styles.logContent}>
          <Text style={styles.logTitle}>
            {item.type === '30-minute' ? '30-Minute Break' : 'Off Duty Break'}
          </Text>
          <Text style={styles.logTime}>
            {new Date(item.startTime).toLocaleString()}
            {item.endTime && ` - ${new Date(item.endTime).toLocaleTimeString()}`}
          </Text>
          <Text style={styles.logDuration}>
            Duration: {item.duration ? `${item.duration.toFixed(1)}h` : formatDuration(item.startTime, item.endTime)}
          </Text>
          <Text style={styles.logLocation}>
            <MapPin size={12} color={colors.textSecondary} /> {item.location}
          </Text>
        </View>
      </View>
    </View>
  );
  
  const renderOverrideLog = ({ item }: { item: TripOverrideLog }) => (
    <View style={styles.logItem}>
      <View style={styles.logHeader}>
        <View style={[styles.logIconContainer, { backgroundColor: colors.warning + '20' }]}>
          <AlertTriangle size={16} color={colors.warning} />
        </View>
        <View style={styles.logContent}>
          <Text style={styles.logTitle}>
            {item.violationType} Override
          </Text>
          <Text style={styles.logTime}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
          <Text style={styles.logReason}>
            Reason: {item.reason}
          </Text>
          <Text style={styles.logLocation}>
            <MapPin size={12} color={colors.textSecondary} /> {item.location}
          </Text>
          <View style={styles.riskBadge}>
            <Text style={[styles.riskText, { 
              color: item.riskLevel === 'Critical' ? colors.error : 
                     item.riskLevel === 'High' ? colors.warning : colors.primary 
            }]}>
              {item.riskLevel} Risk
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
  
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
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'current' && styles.activeTab]}
            onPress={() => setSelectedTab('current')}
          >
            <Activity size={16} color={selectedTab === 'current' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, selectedTab === 'current' && styles.activeTabText]}>Current</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'status' && styles.activeTab]}
            onPress={() => setSelectedTab('status')}
          >
            <RotateCcw size={16} color={selectedTab === 'status' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, selectedTab === 'status' && styles.activeTabText]}>Status</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'breaks' && styles.activeTab]}
            onPress={() => setSelectedTab('breaks')}
          >
            <Coffee size={16} color={selectedTab === 'breaks' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, selectedTab === 'breaks' && styles.activeTabText]}>Breaks</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'overrides' && styles.activeTab]}
            onPress={() => setSelectedTab('overrides')}
          >
            <AlertTriangle size={16} color={selectedTab === 'overrides' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, selectedTab === 'overrides' && styles.activeTabText]}>Overrides</Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        {selectedTab === 'current' && (
          <View style={styles.currentStatusContainer}>
            <View style={styles.currentStatusCard}>
              <View style={styles.currentStatusHeader}>
                {getStatusIcon(currentStatus)}
                <Text style={styles.currentStatusText}>{currentStatus}</Text>
              </View>
              <Text style={styles.currentStatusTime}>
                Since: {new Date(statusStartTime).toLocaleString()}
              </Text>
              <Text style={styles.currentStatusDuration}>
                Duration: {formatDuration(statusStartTime)}
              </Text>
              {isOnBreak && (
                <View style={styles.breakIndicator}>
                  <Coffee size={16} color={colors.secondary} />
                  <Text style={styles.breakText}>Currently on break</Text>
                </View>
              )}
            </View>
          </View>
        )}
        
        {selectedTab === 'status' && (
          <View style={styles.logContainer}>
            <Text style={styles.sectionTitle}>Status Changes (Last 7 Days)</Text>
            {statusChangeLogs.length > 0 ? (
              <FlatList
                data={statusChangeLogs}
                renderItem={renderStatusChangeLog}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={styles.logList}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No status changes recorded</Text>
            )}
          </View>
        )}
        
        {selectedTab === 'breaks' && (
          <View style={styles.logContainer}>
            <Text style={styles.sectionTitle}>Break History (Last 7 Days)</Text>
            {breakLogs.length > 0 ? (
              <FlatList
                data={breakLogs}
                renderItem={renderBreakLog}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={styles.logList}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No breaks recorded</Text>
            )}
          </View>
        )}
        
        {selectedTab === 'overrides' && (
          <View style={styles.logContainer}>
            <Text style={styles.sectionTitle}>Violation Overrides</Text>
            {recentOverrides.length > 0 ? (
              <FlatList
                data={recentOverrides}
                renderItem={renderOverrideLog}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={styles.logList}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No overrides recorded</Text>
            )}
          </View>
        )}
        
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
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.background.secondary,
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
  
  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 4,
    marginVertical: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: colors.background.primary,
  },
  tabText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  
  // Current Status Styles
  currentStatusContainer: {
    marginBottom: 20,
  },
  currentStatusCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currentStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  currentStatusText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  currentStatusTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  currentStatusDuration: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  breakIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.secondary + '20',
    borderRadius: 8,
  },
  breakText: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500',
  },
  
  // Log Styles
  logContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  logList: {
    maxHeight: 400,
  },
  logItem: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  logIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logContent: {
    flex: 1,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  logTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  logDuration: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  logLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logReason: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  riskBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 32,
    fontStyle: 'italic',
  },
});