import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Play, Pause, Settings, Trash2, Zap, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Automation } from '@/store/integrationStore';

interface AutomationCardProps {
  automation: Automation;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  integrations: Array<{ id: string; name: string; icon: string }>;
}

export const AutomationCard: React.FC<AutomationCardProps> = ({
  automation,
  onToggle,
  onEdit,
  onDelete,
  integrations,
}) => {
  const getTriggerIntegration = () => {
    return integrations.find(i => i.id === automation.trigger.integrationId) || 
           { id: 'app', name: 'TruckLogix', icon: 'Truck' };
  };
  
  const getActionIntegrations = () => {
    return automation.actions.map(action => 
      integrations.find(i => i.id === action.integrationId) || 
      { id: action.integrationId, name: action.integrationId, icon: 'Settings' }
    );
  };
  
  const formatLastRun = (date?: Date) => {
    if (!date) return 'Never run';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just ran';
    if (minutes < 60) return `Ran ${minutes}m ago`;
    if (hours < 24) return `Ran ${hours}h ago`;
    return `Ran ${days}d ago`;
  };
  
  const triggerIntegration = getTriggerIntegration();
  const actionIntegrations = getActionIntegrations();
  
  return (
    <View style={[styles.container, !automation.isActive && styles.inactiveContainer]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Zap 
              color={automation.isActive ? colors.warning : colors.textSecondary} 
              size={20} 
            />
          </View>
          <View style={styles.titleInfo}>
            <Text style={[styles.title, !automation.isActive && styles.inactiveText]}>
              {automation.name}
            </Text>
            <Text style={styles.description}>{automation.description}</Text>
          </View>
        </View>
        
        <Switch
          value={automation.isActive}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary + '40' }}
          thumbColor={automation.isActive ? colors.primary : colors.textSecondary}
        />
      </View>
      
      <View style={styles.flow}>
        <View style={styles.flowItem}>
          <Text style={styles.flowLabel}>WHEN</Text>
          <View style={styles.flowCard}>
            <Text style={styles.flowCardTitle}>{triggerIntegration.name}</Text>
            <Text style={styles.flowCardSubtitle}>{automation.trigger.event}</Text>
          </View>
        </View>
        
        <ArrowRight color={colors.textSecondary} size={16} style={styles.arrow} />
        
        <View style={styles.flowItem}>
          <Text style={styles.flowLabel}>THEN</Text>
          <View style={styles.actionsContainer}>
            {actionIntegrations.map((integration, index) => (
              <View key={index} style={styles.flowCard}>
                <Text style={styles.flowCardTitle}>{integration.name}</Text>
                <Text style={styles.flowCardSubtitle}>
                  {automation.actions[index].action}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{automation.runCount}</Text>
          <Text style={styles.statLabel}>Runs</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatLastRun(automation.lastRun)}</Text>
          <Text style={styles.statLabel}>Last Activity</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Settings color={colors.textSecondary} size={16} />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Trash2 color={colors.danger} size={16} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inactiveContainer: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  inactiveText: {
    color: colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  flow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  flowItem: {
    flex: 1,
  },
  flowLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  flowCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  flowCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  flowCardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  arrow: {
    marginHorizontal: 12,
    marginTop: 24,
  },
  actionsContainer: {
    gap: 8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger + '20',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.danger,
  },
});