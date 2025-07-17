import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { Truck, Settings, Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useELDStore } from '@/store/eldStore';
import ELDComplianceDashboard from '@/components/ELDComplianceDashboard';
import ELDOnboardingFlow from '@/components/ELDOnboardingFlow';
import ELDSettings from '@/components/ELDSettings';

type TabType = 'dashboard' | 'settings';

export default function ELDIntegrationScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { connection } = useELDStore();

  const isConnected = connection?.status === 'connected';

  const handleConnectELD = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setActiveTab('dashboard');
  };

  const handleOnboardingCancel = () => {
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <ELDOnboardingFlow 
          onComplete={handleOnboardingComplete}
          onCancel={handleOnboardingCancel}
        />
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'ELD Integration',
            headerStyle: { backgroundColor: colors.background.primary },
            headerTintColor: colors.text.primary,
          }} 
        />
        
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Truck size={64} color={colors.primary} />
          </View>
          
          <Text style={styles.emptyTitle}>Connect Your ELD System</Text>
          <Text style={styles.emptySubtitle}>
            Integrate with your Electronic Logging Device to unlock advanced compliance monitoring, 
            predictive maintenance, and fleet optimization features.
          </Text>
          
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✅</Text>
              <Text style={styles.benefitText}>Real-time HOS compliance monitoring</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🔧</Text>
              <Text style={styles.benefitText}>AI-powered maintenance predictions</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>⛽</Text>
              <Text style={styles.benefitText}>Fuel efficiency optimization</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>📊</Text>
              <Text style={styles.benefitText}>Advanced fleet analytics</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🛡️</Text>
              <Text style={styles.benefitText}>DOT inspection readiness</Text>
            </View>
          </View>
          
          <Pressable style={styles.connectButton} onPress={handleConnectELD}>
            <Plus size={20} color={colors.white} />
            <Text style={styles.connectButtonText}>Connect ELD Provider</Text>
          </Pressable>
          
          <Text style={styles.supportedProviders}>
            Supports Geotab, Samsara, Motive, Verizon Connect, and Omnitracs
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'ELD Integration',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
          headerRight: () => (
            <Pressable 
              style={styles.headerButton}
              onPress={() => setActiveTab(activeTab === 'dashboard' ? 'settings' : 'dashboard')}
            >
              {activeTab === 'dashboard' ? (
                <Settings size={20} color={colors.text.primary} />
              ) : (
                <Truck size={20} color={colors.text.primary} />
              )}
            </Pressable>
          ),
        }} 
      />
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Truck size={18} color={activeTab === 'dashboard' ? colors.primary : colors.textSecondary} />
          <Text style={[
            styles.tabText,
            activeTab === 'dashboard' && styles.activeTabText
          ]}>
            Dashboard
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Settings size={18} color={activeTab === 'settings' ? colors.primary : colors.textSecondary} />
          <Text style={[
            styles.tabText,
            activeTab === 'settings' && styles.activeTabText
          ]}>
            Settings
          </Text>
        </Pressable>
      </View>
      
      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === 'dashboard' ? (
          <ELDComplianceDashboard />
        ) : (
          <ELDSettings />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  benefitsList: {
    alignSelf: 'stretch',
    marginBottom: 40,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  benefitText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
    lineHeight: 22,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  connectButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.white,
  },
  supportedProviders: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600' as const,
  },
  tabContent: {
    flex: 1,
  },
});