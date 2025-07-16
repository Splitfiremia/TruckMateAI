import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { 
  Mail, MessageSquare, Users, HardDrive, Cloud, Calendar, 
  Webhook, CheckCircle, AlertCircle, Settings, Send 
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Integration } from '@/store/integrationStore';

interface IntegrationCardProps {
  integration: Integration;
  onConnect: () => void;
  onDisconnect: () => void;
  onConfigure: () => void;
  onSync: () => void;
}

const getIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    Mail,
    MessageSquare,
    Users,
    HardDrive,
    Cloud,
    Calendar,
    Webhook,
  };
  return iconMap[iconName] || Mail;
};

const getTypeColor = (type: Integration['type']) => {
  const typeColors = {
    email: colors.primary,
    messaging: colors.secondary,
    storage: colors.warning,
    crm: colors.primaryLight,
    calendar: colors.success,
    other: colors.textSecondary,
  };
  return typeColors[type] || colors.textSecondary;
};

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onConnect,
  onDisconnect,
  onConfigure,
  onSync,
}) => {
  const IconComponent = getIcon(integration.icon);
  const typeColor = getTypeColor(integration.type);
  
  const formatLastSync = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconBackground, { backgroundColor: typeColor + '20' }]}>
            <IconComponent color={typeColor} size={24} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{integration.name}</Text>
            <Text style={styles.type}>{integration.type.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          {integration.isConnected ? (
            <View style={styles.connectedBadge}>
              <CheckCircle color={colors.success} size={16} />
              <Text style={styles.connectedText}>Connected</Text>
            </View>
          ) : (
            <View style={styles.disconnectedBadge}>
              <AlertCircle color={colors.textSecondary} size={16} />
              <Text style={styles.disconnectedText}>Not Connected</Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={styles.description}>{integration.description}</Text>
      
      {integration.isConnected && (
        <View style={styles.syncInfo}>
          <Text style={styles.syncText}>
            Last sync: {formatLastSync(integration.lastSync)}
          </Text>
        </View>
      )}
      
      <View style={styles.actions}>
        {integration.isConnected ? (
          <>
            <TouchableOpacity style={styles.syncButton} onPress={onSync}>
              <Send color={colors.primaryLight} size={16} />
              <Text style={styles.syncButtonText}>Sync</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.configureButton} onPress={onConfigure}>
              <Settings color={colors.text} size={16} />
              <Text style={styles.configureButtonText}>Configure</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.disconnectButton} onPress={onDisconnect}>
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.connectButton} onPress={onConnect}>
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  type: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectedText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.success,
    marginLeft: 4,
  },
  disconnectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.textSecondary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  disconnectedText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  syncInfo: {
    marginBottom: 12,
  },
  syncText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  connectButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  connectButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight + '20',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  syncButtonText: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '500',
  },
  configureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  configureButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  disconnectButton: {
    backgroundColor: colors.danger + '20',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  disconnectButtonText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '500',
  },
});