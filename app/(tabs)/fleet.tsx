import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { 
  Users, 
  Settings, 
  Palette, 
  Shield, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  FileText,
  Eye,
  Edit3,
  Plus,
  Building2
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useFleetStore } from '@/store/fleetStore';
import { useUserStore } from '@/store/userStore';
import { useBrandingStore } from '@/store/brandingStore';
import FleetDriverCard from '@/components/FleetDriverCard';
import FleetStatsCard from '@/components/FleetStatsCard';
import BrandingCustomizer from '@/components/BrandingCustomizer';
import ComplianceOverview from '@/components/ComplianceOverview';

export default function FleetAdminScreen() {
  const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'branding' | 'compliance' | 'settings'>('overview');
  
  const { 
    fleetInfo, 
    drivers, 
    fleetStats, 
    complianceOverview,
    fleetSettings,
    updateFleetSettings,
    addDriver,
    updateDriverStatus
  } = useFleetStore();
  
  const { user, isFleetCompany } = useUserStore();
  const { settings } = useBrandingStore();
  
  // Redirect if not fleet company
  if (!isFleetCompany()) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Fleet Admin' }} />
        <View style={styles.accessDenied}>
          <AlertTriangle size={48} color={colors.warning} />
          <Text style={styles.accessDeniedTitle}>Access Restricted</Text>
          <Text style={styles.accessDeniedText}>
            Fleet management features are only available for Fleet Company accounts.
          </Text>
        </View>
      </View>
    );
  }

  const renderTabButton = (
    tab: typeof activeTab,
    icon: React.ReactNode,
    label: string
  ) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && { backgroundColor: colors.primaryLight }
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <View style={styles.tabButtonIcon}>
        {icon}
      </View>
      <Text style={[
        styles.tabButtonText,
        activeTab === tab && { color: colors.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.fleetHeader}>
        <View>
          <Text style={styles.fleetName}>{fleetInfo.name}</Text>
          <Text style={styles.fleetDetails}>
            {fleetInfo.totalDrivers} Drivers • {fleetInfo.totalVehicles} Vehicles
          </Text>
          <Text style={styles.fleetDetails}>DOT: {fleetInfo.dotNumber}</Text>
        </View>
        <View style={styles.fleetStatus}>
          <View style={[styles.statusIndicator, { backgroundColor: colors.secondary }]} />
          <Text style={styles.statusText}>Active</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <FleetStatsCard
          title="Active Drivers"
          value={fleetStats.activeDrivers.toString()}
          subtitle={`${fleetStats.availableDrivers} available`}
          icon={<Users size={24} color={colors.primaryLight} />}
          color={colors.primaryLight}
        />
        
        <FleetStatsCard
          title="HOS Violations"
          value={fleetStats.hosViolations.toString()}
          subtitle="This week"
          icon={<AlertTriangle size={24} color={fleetStats.hosViolations > 0 ? colors.warning : colors.secondary} />}
          color={fleetStats.hosViolations > 0 ? colors.warning : colors.secondary}
        />
        
        <FleetStatsCard
          title="Compliance Score"
          value={`${fleetStats.complianceScore}%`}
          subtitle="Fleet average"
          icon={<Shield size={24} color={colors.secondary} />}
          color={colors.secondary}
        />
        
        <FleetStatsCard
          title="Revenue"
          value={`$${fleetStats.weeklyRevenue.toLocaleString()}`}
          subtitle="This week"
          icon={<BarChart3 size={24} color={colors.secondary} />}
          color={colors.secondary}
        />
      </View>

      <ComplianceOverview data={complianceOverview} />
    </ScrollView>
  );

  const renderDriversTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Driver Management</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color={colors.text.primary} />
          <Text style={styles.addButtonText}>Add Driver</Text>
        </TouchableOpacity>
      </View>

      {drivers.map((driver) => (
        <FleetDriverCard
          key={driver.id}
          driver={driver}
          onStatusChange={(status) => updateDriverStatus(driver.id, status)}
        />
      ))}
    </ScrollView>
  );

  const renderBrandingTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.brandingHeader}>
        <Building2 size={24} color={settings.primaryColor || colors.primary} />
        <View style={styles.brandingInfo}>
          <Text style={[styles.brandingTitle, { color: settings.primaryColor || colors.text }]}>
            {user?.companyName || 'Your Fleet Company'}
          </Text>
          <Text style={styles.brandingSubtitle}>
            Customize your white-label experience
          </Text>
          {settings && (
            <Text style={styles.brandingStatus}>✓ Custom branding active</Text>
          )}
        </View>
      </View>
      
      <BrandingCustomizer />
    </ScrollView>
  );

  const renderComplianceTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.complianceSection}>
        <Text style={styles.sectionTitle}>Fleet Compliance Monitoring</Text>
        
        <View style={styles.complianceCard}>
          <View style={styles.complianceHeader}>
            <Shield size={24} color={colors.secondary} />
            <Text style={styles.complianceTitle}>Overall Fleet Health</Text>
            <View style={[styles.complianceStatus, { backgroundColor: colors.secondary }]}>
              <Text style={styles.complianceStatusText}>Good</Text>
            </View>
          </View>
          
          <View style={styles.complianceMetrics}>
            <View style={styles.complianceMetric}>
              <Text style={styles.metricValue}>94%</Text>
              <Text style={styles.metricLabel}>On-Time Inspections</Text>
            </View>
            <View style={styles.complianceMetric}>
              <Text style={styles.metricValue}>2</Text>
              <Text style={styles.metricLabel}>Active Violations</Text>
            </View>
            <View style={styles.complianceMetric}>
              <Text style={styles.metricValue}>15</Text>
              <Text style={styles.metricLabel}>Expiring Docs</Text>
            </View>
          </View>
        </View>

        <View style={styles.alertsList}>
          <Text style={styles.alertsTitle}>Recent Compliance Alerts</Text>
          
          <View style={styles.alertItem}>
            <AlertTriangle size={20} color={colors.warning} />
            <View style={styles.alertContent}>
              <Text style={styles.alertText}>Driver M. Johnson - Medical cert expires in 15 days</Text>
              <Text style={styles.alertTime}>2 hours ago</Text>
            </View>
          </View>
          
          <View style={styles.alertItem}>
            <Clock size={20} color={colors.danger} />
            <View style={styles.alertContent}>
              <Text style={styles.alertText}>Driver S. Williams - HOS violation risk detected</Text>
              <Text style={styles.alertTime}>4 hours ago</Text>
            </View>
          </View>
          
          <View style={styles.alertItem}>
            <CheckCircle size={20} color={colors.secondary} />
            <View style={styles.alertContent}>
              <Text style={styles.alertText}>Vehicle FL-4872 - Inspection completed</Text>
              <Text style={styles.alertTime}>6 hours ago</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderSettingsTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Fleet Settings</Text>
        
        <View style={styles.settingGroup}>
          <Text style={styles.settingGroupTitle}>Compliance Policies</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Enforce Pre-Trip Inspections</Text>
              <Text style={styles.settingDescription}>Require daily pre-trip inspections</Text>
            </View>
            <Switch
              value={fleetSettings.enforcePreTrip}
              onValueChange={(value) => updateFleetSettings({ enforcePreTrip: value })}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={colors.text.primary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Auto HOS Tracking</Text>
              <Text style={styles.settingDescription}>Automatically track hours of service</Text>
            </View>
            <Switch
              value={fleetSettings.autoHOSTracking}
              onValueChange={(value) => updateFleetSettings({ autoHOSTracking: value })}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={colors.text.primary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Speed Limit Alerts</Text>
              <Text style={styles.settingDescription}>Alert drivers when exceeding speed limits</Text>
            </View>
            <Switch
              value={fleetSettings.speedAlerts}
              onValueChange={(value) => updateFleetSettings({ speedAlerts: value })}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={colors.text.primary}
            />
          </View>
        </View>

        <View style={styles.settingGroup}>
          <Text style={styles.settingGroupTitle}>Notification Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Real-time Alerts</Text>
              <Text style={styles.settingDescription}>Send immediate compliance alerts</Text>
            </View>
            <Switch
              value={fleetSettings.realtimeAlerts}
              onValueChange={(value) => updateFleetSettings({ realtimeAlerts: value })}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={colors.text.primary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Daily Reports</Text>
              <Text style={styles.settingDescription}>Email daily fleet summary reports</Text>
            </View>
            <Switch
              value={fleetSettings.dailyReports}
              onValueChange={(value) => updateFleetSettings({ dailyReports: value })}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={colors.text.primary}
            />
          </View>
        </View>

        <View style={styles.settingGroup}>
          <Text style={styles.settingGroupTitle}>Data & Privacy</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Location Tracking</Text>
              <Text style={styles.settingDescription}>Track vehicle locations for compliance</Text>
            </View>
            <Switch
              value={fleetSettings.locationTracking}
              onValueChange={(value) => updateFleetSettings({ locationTracking: value })}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={colors.text.primary}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Fleet Administration',
        }} 
      />
      
      <View style={styles.tabBar}>
        <View style={styles.tabGrid}>
          <View style={styles.tabRow}>
            {renderTabButton('overview', <BarChart3 size={18} color={activeTab === 'overview' ? colors.text : colors.textSecondary} />, 'Fleet Overview')}
            {renderTabButton('drivers', <Users size={18} color={activeTab === 'drivers' ? colors.text : colors.textSecondary} />, 'Driver Management')}
            {renderTabButton('branding', <Palette size={18} color={activeTab === 'branding' ? (settings.primaryColor || colors.text) : colors.textSecondary} />, 'White-Label Branding')}
          </View>
          <View style={styles.tabRow}>
            {renderTabButton('compliance', <Shield size={18} color={activeTab === 'compliance' ? colors.text : colors.textSecondary} />, 'Compliance Monitor')}
            {renderTabButton('settings', <Settings size={18} color={activeTab === 'settings' ? colors.text : colors.textSecondary} />, 'Fleet Settings')}
            <View style={styles.tabPlaceholder} />
          </View>
        </View>
      </View>

      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'drivers' && renderDriversTab()}
      {activeTab === 'branding' && renderBrandingTab()}
      {activeTab === 'compliance' && renderComplianceTab()}
      {activeTab === 'settings' && renderSettingsTab()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  tabBar: {
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
  },
  tabGrid: {
    paddingHorizontal: 8,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    minHeight: 60,
    justifyContent: 'center',
  },
  tabButtonIcon: {
    marginBottom: 4,
  },
  tabButtonText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
  tabPlaceholder: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  fleetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  fleetName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  fleetDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  fleetStatus: {
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
    color: colors.text.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  complianceSection: {
    marginTop: 16,
  },
  complianceCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  complianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  complianceStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  complianceStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
  },
  complianceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  complianceMetric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  alertsList: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
  },
  alertsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertText: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  settingsSection: {
    marginTop: 16,
  },
  settingGroup: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  settingGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    padding: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  accessDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  accessDeniedTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  accessDeniedText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  brandingHeader: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  brandingInfo: {
    marginLeft: 12,
    flex: 1,
  },
  brandingTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  brandingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  brandingStatus: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '500',
  },
});