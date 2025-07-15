import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { 
  Users, 
  Truck, 
  AlertTriangle, 
  TrendingUp, 
  Settings, 
  Shield,
  DollarSign,
  Fuel,
  Wrench
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useFleetStore } from '@/store/fleetStore';
import FleetStatsCard from '@/components/fleet/FleetStatsCard';
import FleetDriverCard from '@/components/fleet/FleetDriverCard';
import FleetVehicleCard from '@/components/fleet/FleetVehicleCard';
import ComplianceViolationCard from '@/components/fleet/ComplianceViolationCard';
import FleetSettingsModal from '@/components/fleet/FleetSettingsModal';

export default function FleetScreen() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'vehicles' | 'compliance'>('overview');
  
  const {
    currentFleet,
    drivers,
    vehicles,
    dashboardStats,
    violations,
    isFleetManager,
    updateDashboardStats,
    getDriversByStatus,
    getVehiclesByStatus,
    getUnresolvedViolations,
    initializeMockData,
  } = useFleetStore();
  
  useEffect(() => {
    if (!currentFleet) {
      initializeMockData();
    }
    updateDashboardStats();
  }, []);
  
  if (!isFleetManager || !currentFleet) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Fleet Management' }} />
        <View style={styles.noAccessContainer}>
          <Shield size={48} color={colors.textSecondary} />
          <Text style={styles.noAccessText}>Fleet Management Access Required</Text>
          <Text style={styles.noAccessSubtext}>
            Contact your fleet administrator for access to this feature
          </Text>
        </View>
      </View>
    );
  }
  
  const activeDrivers = getDriversByStatus('active');
  const activeVehicles = getVehiclesByStatus('active');
  const unresolvedViolations = getUnresolvedViolations();
  
  const renderTabButton = (tab: typeof activeTab, icon: React.ReactNode, label: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && styles.activeTabButton
      ]}
      onPress={() => setActiveTab(tab)}
    >
      {icon}
      <Text style={[
        styles.tabButtonText,
        activeTab === tab && styles.activeTabButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  const renderOverview = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.statsGrid}>
        <FleetStatsCard
          title="Active Drivers"
          value={dashboardStats?.activeDrivers.toString() || '0'}
          total={dashboardStats?.totalDrivers.toString() || '0'}
          icon={<Users size={24} color={colors.primaryLight} />}
          color={colors.primaryLight}
        />
        
        <FleetStatsCard
          title="Active Vehicles"
          value={dashboardStats?.activeVehicles.toString() || '0'}
          total={dashboardStats?.totalVehicles.toString() || '0'}
          icon={<Truck size={24} color={colors.secondary} />}
          color={colors.secondary}
        />
        
        <FleetStatsCard
          title="Compliance Score"
          value={`${dashboardStats?.complianceScore || 0}%`}
          icon={<Shield size={24} color={colors.secondary} />}
          color={colors.secondary}
        />
        
        <FleetStatsCard
          title="Violations"
          value={dashboardStats?.violationsThisWeek.toString() || '0'}
          subtitle="This Week"
          icon={<AlertTriangle size={24} color={colors.warning} />}
          color={colors.warning}
        />
      </View>
      
      <View style={styles.performanceGrid}>
        <FleetStatsCard
          title="Revenue"
          value={`$${(dashboardStats?.revenue || 0).toLocaleString()}`}
          subtitle="This Month"
          icon={<DollarSign size={24} color={colors.secondary} />}
          color={colors.secondary}
        />
        
        <FleetStatsCard
          title="Miles Driven"
          value={(dashboardStats?.miles || 0).toLocaleString()}
          subtitle="This Month"
          icon={<TrendingUp size={24} color={colors.primaryLight} />}
          color={colors.primaryLight}
        />
        
        <FleetStatsCard
          title="Fuel Costs"
          value={`$${(dashboardStats?.fuelCosts || 0).toLocaleString()}`}
          subtitle="This Month"
          icon={<Fuel size={24} color={colors.warning} />}
          color={colors.warning}
        />
        
        <FleetStatsCard
          title="Maintenance Due"
          value={dashboardStats?.maintenanceOverdue.toString() || '0'}
          subtitle="Overdue"
          icon={<Wrench size={24} color={colors.danger} />}
          color={colors.danger}
        />
      </View>
      
      {unresolvedViolations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Violations</Text>
          {unresolvedViolations.slice(0, 3).map((violation) => (
            <ComplianceViolationCard key={violation.id} violation={violation} />
          ))}
        </View>
      )}
    </ScrollView>
  );
  
  const renderDrivers = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Drivers ({activeDrivers.length})</Text>
        {activeDrivers.map((driver) => (
          <FleetDriverCard key={driver.id} driver={driver} />
        ))}
      </View>
      
      {getDriversByStatus('inactive').length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inactive Drivers</Text>
          {getDriversByStatus('inactive').map((driver) => (
            <FleetDriverCard key={driver.id} driver={driver} />
          ))}
        </View>
      )}
    </ScrollView>
  );
  
  const renderVehicles = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Vehicles ({activeVehicles.length})</Text>
        {activeVehicles.map((vehicle) => (
          <FleetVehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </View>
      
      {getVehiclesByStatus('maintenance').length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>In Maintenance</Text>
          {getVehiclesByStatus('maintenance').map((vehicle) => (
            <FleetVehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </View>
      )}
    </ScrollView>
  );
  
  const renderCompliance = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.complianceHeader}>
        <Text style={styles.complianceScore}>
          Compliance Score: {dashboardStats?.complianceScore || 0}%
        </Text>
        <View style={[
          styles.complianceIndicator,
          { backgroundColor: (dashboardStats?.complianceScore || 0) >= 90 ? colors.secondary : colors.warning }
        ]} />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Violations</Text>
        {violations.map((violation) => (
          <ComplianceViolationCard key={violation.id} violation={violation} />
        ))}
      </View>
    </ScrollView>
  );
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: currentFleet.name,
          headerRight: () => (
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => setSettingsVisible(true)}
            >
              <Settings size={22} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.header}>
        {currentFleet.logo && (
          <Image source={{ uri: currentFleet.logo }} style={styles.companyLogo} />
        )}
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{currentFleet.name}</Text>
          <Text style={styles.companyDetails}>DOT: {currentFleet.dotNumber}</Text>
          <Text style={styles.companyDetails}>MC: {currentFleet.mcNumber}</Text>
        </View>
      </View>
      
      <View style={styles.tabBar}>
        {renderTabButton('overview', <TrendingUp size={18} color={activeTab === 'overview' ? colors.text : colors.textSecondary} />, 'Overview')}
        {renderTabButton('drivers', <Users size={18} color={activeTab === 'drivers' ? colors.text : colors.textSecondary} />, 'Drivers')}
        {renderTabButton('vehicles', <Truck size={18} color={activeTab === 'vehicles' ? colors.text : colors.textSecondary} />, 'Vehicles')}
        {renderTabButton('compliance', <Shield size={18} color={activeTab === 'compliance' ? colors.text : colors.textSecondary} />, 'Compliance')}
      </View>
      
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'drivers' && renderDrivers()}
      {activeTab === 'vehicles' && renderVehicles()}
      {activeTab === 'compliance' && renderCompliance()}
      
      <FleetSettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  noAccessContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noAccessText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  noAccessSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  settingsButton: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  companyDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryLight,
  },
  tabButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeTabButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  complianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  complianceScore: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  complianceIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});