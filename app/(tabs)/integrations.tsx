import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Stack } from 'expo-router';
import { Plus, Zap, Search, Filter } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useIntegrationStore, Integration } from '@/store/integrationStore';
import { IntegrationCard } from '@/components/IntegrationCard';
import { IntegrationConnectionModal } from '@/components/IntegrationConnectionModal';
import { AutomationCard } from '@/components/AutomationCard';
import { AutomationTemplateCard } from '@/components/AutomationTemplateCard';

type TabType = 'integrations' | 'automations' | 'templates';

export default function IntegrationsScreen() {
  const {
    integrations,
    automations,
    templates,
    isLoading,
    error,
    connectIntegration,
    disconnectIntegration,
    syncIntegration,
    toggleAutomation,
    removeAutomation,
    addAutomation,
  } = useIntegrationStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('integrations');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const connectedIntegrations = integrations.filter(i => i.isConnected);
  const availableIntegrations = integrations.filter(i => !i.isConnected);
  
  const handleConnect = (integration: any) => {
    setSelectedIntegration(integration);
    setShowConnectionModal(true);
  };
  
  const handleDisconnect = (integration: any) => {
    Alert.alert(
      'Disconnect Integration',
      `Are you sure you want to disconnect ${integration.name}? This will disable all related automations.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => disconnectIntegration(integration.id),
        },
      ]
    );
  };
  
  const handleConnectionSubmit = async (credentials: Record<string, any>) => {
    if (!selectedIntegration) return false;
    
    const success = await connectIntegration(selectedIntegration.id, credentials);
    if (success) {
      Alert.alert('Success', `${selectedIntegration.name} connected successfully!`);
    }
    return success;
  };
  
  const handleSync = async (integration: any) => {
    await syncIntegration(integration.id);
    if (!error) {
      Alert.alert('Success', `${integration.name} synced successfully!`);
    }
  };
  
  const handleDeleteAutomation = (automation: any) => {
    Alert.alert(
      'Delete Automation',
      `Are you sure you want to delete "${automation.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeAutomation(automation.id),
        },
      ]
    );
  };
  
  const handleUseTemplate = (template: any) => {
    // Check if required integrations are connected
    const requiredIntegrations = [
      template.trigger.integration,
      ...template.actions.map((a: any) => a.integration),
    ].filter(name => name !== 'app');
    
    const missingIntegrations = requiredIntegrations.filter(name => 
      !integrations.find(i => i.name.toLowerCase().includes(name.toLowerCase()) && i.isConnected)
    );
    
    if (missingIntegrations.length > 0) {
      Alert.alert(
        'Missing Integrations',
        `Please connect the following integrations first: ${missingIntegrations.join(', ')}`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Create automation from template
    const newAutomation = {
      name: template.name,
      description: template.description,
      trigger: {
        integrationId: template.trigger.integration === 'app' ? 'app' : 
          integrations.find(i => i.name.toLowerCase().includes(template.trigger.integration.toLowerCase()))?.id || 'app',
        event: template.trigger.event,
      },
      actions: template.actions.map((action: any) => ({
        integrationId: integrations.find(i => i.name.toLowerCase().includes(action.integration.toLowerCase()))?.id || action.integration,
        action: action.action,
        parameters: {},
      })),
      isActive: true,
    };
    
    addAutomation(newAutomation);
    setActiveTab('automations');
    Alert.alert('Success', 'Automation created from template!');
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };
  
  const renderTabButton = (tab: TabType, title: string, icon: any) => {
    const IconComponent = icon;
    return (
      <TouchableOpacity
        style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
        onPress={() => setActiveTab(tab)}
      >
        <IconComponent 
          color={activeTab === tab ? colors.primary : colors.textSecondary} 
          size={18} 
        />
        <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderIntegrationsTab = () => (
    <>
      {connectedIntegrations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected ({connectedIntegrations.length})</Text>
          {connectedIntegrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onConnect={() => handleConnect(integration)}
              onDisconnect={() => handleDisconnect(integration)}
              onConfigure={() => handleConnect(integration)}
              onSync={() => handleSync(integration)}
            />
          ))}
        </View>
      )}
      
      {availableIntegrations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available ({availableIntegrations.length})</Text>
          {availableIntegrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onConnect={() => handleConnect(integration)}
              onDisconnect={() => handleDisconnect(integration)}
              onConfigure={() => handleConnect(integration)}
              onSync={() => handleSync(integration)}
            />
          ))}
        </View>
      )}
    </>
  );
  
  const renderAutomationsTab = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Automations ({automations.length})</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus color={colors.primary} size={20} />
        </TouchableOpacity>
      </View>
      
      {automations.length === 0 ? (
        <View style={styles.emptyState}>
          <Zap color={colors.textSecondary} size={48} />
          <Text style={styles.emptyStateTitle}>No Automations Yet</Text>
          <Text style={styles.emptyStateText}>
            Create your first automation from a template or build one from scratch.
          </Text>
        </View>
      ) : (
        automations.map((automation) => (
          <AutomationCard
            key={automation.id}
            automation={automation}
            onToggle={() => toggleAutomation(automation.id)}
            onEdit={() => console.log('Edit automation:', automation.id)}
            onDelete={() => handleDeleteAutomation(automation)}
            integrations={integrations}
          />
        ))
      )}
    </View>
  );
  
  const renderTemplatesTab = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Popular Templates</Text>
      {templates.filter(t => t.popular).map((template) => (
        <AutomationTemplateCard
          key={template.id}
          template={template}
          onUse={() => handleUseTemplate(template)}
        />
      ))}
      
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>All Templates</Text>
      {templates.filter(t => !t.popular).map((template) => (
        <AutomationTemplateCard
          key={template.id}
          template={template}
          onUse={() => handleUseTemplate(template)}
        />
      ))}
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Integrations',
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Search color={colors.text} size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Filter color={colors.text} size={20} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <View style={styles.tabs}>
        {renderTabButton('integrations', 'Integrations', Search)}
        {renderTabButton('automations', 'Automations', Zap)}
        {renderTabButton('templates', 'Templates', Plus)}
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.primary}
          />
        }
      >
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {activeTab === 'integrations' && renderIntegrationsTab()}
        {activeTab === 'automations' && renderAutomationsTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
      </ScrollView>
      
      <IntegrationConnectionModal
        visible={showConnectionModal}
        integration={selectedIntegration}
        onClose={() => {
          setShowConnectionModal(false);
          setSelectedIntegration(null);
        }}
        onConnect={handleConnectionSubmit}
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    margin: 16,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: colors.background.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabButtonText: {
    color: colors.primary.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBanner: {
    backgroundColor: colors.danger + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});