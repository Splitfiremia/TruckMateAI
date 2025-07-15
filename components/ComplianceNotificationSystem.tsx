import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Vibration
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  AlertTriangle, 
  X, 
  Clock,
  CheckCircle,
  Bell
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { usePredictiveComplianceStore } from '@/store/predictiveComplianceStore';

interface ComplianceNotificationSystemProps {
  onNotificationPress?: (alert: any) => void;
}

export const ComplianceNotificationSystem: React.FC<ComplianceNotificationSystemProps> = ({
  onNotificationPress
}) => {
  const { activeAlerts, dismissAlert } = usePredictiveComplianceStore();
  const [visibleAlerts, setVisibleAlerts] = useState<any[]>([]);
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    // Show only high priority alerts as notifications
    const highPriorityAlerts = activeAlerts.filter(alert => 
      alert.priority === 'Critical' || alert.priority === 'High'
    );

    if (highPriorityAlerts.length > 0) {
      setVisibleAlerts(highPriorityAlerts.slice(0, 3)); // Show max 3 notifications
      
      // Animate in
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

      // Vibrate for critical alerts
      const criticalAlerts = highPriorityAlerts.filter(a => a.priority === 'Critical');
      if (criticalAlerts.length > 0 && Platform.OS !== 'web') {
        Vibration.vibrate([0, 300, 100, 300]);
      }

      // Auto-dismiss non-critical alerts after 10 seconds
      const timer = setTimeout(() => {
        const nonCriticalAlerts = highPriorityAlerts.filter(a => a.priority !== 'Critical');
        nonCriticalAlerts.forEach(alert => {
          if (!alert.actionRequired) {
            dismissAlert(alert.id);
          }
        });
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      // Animate out
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setVisibleAlerts([]);
      });
    }
  }, [activeAlerts]);

  const handleDismiss = (alertId: string) => {
    dismissAlert(alertId);
  };

  const handlePress = (alert: any) => {
    if (onNotificationPress) {
      onNotificationPress(alert);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return colors.error;
      case 'High': return '#FF6B35';
      case 'Medium': return colors.warning;
      default: return colors.primary;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return AlertTriangle;
      case 'High': return AlertTriangle;
      default: return Bell;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      {visibleAlerts.map((alert, index) => {
        const PriorityIcon = getPriorityIcon(alert.priority);
        const priorityColor = getPriorityColor(alert.priority);
        
        return (
          <TouchableOpacity
            key={alert.id}
            style={[
              styles.notification,
              { marginTop: index > 0 ? 8 : 0 }
            ]}
            onPress={() => handlePress(alert)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[priorityColor + '20', priorityColor + '05']}
              style={styles.notificationContent}
            >
              <View style={styles.notificationHeader}>
                <View style={styles.notificationLeft}>
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: priorityColor + '20' }
                  ]}>
                    <PriorityIcon size={16} color={priorityColor} />
                  </View>
                  <View style={styles.notificationInfo}>
                    <Text style={styles.notificationTitle} numberOfLines={1}>
                      {alert.title}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {formatTimeAgo(alert.timestamp)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.dismissButton}
                  onPress={() => handleDismiss(alert.id)}
                >
                  <X size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.notificationMessage} numberOfLines={2}>
                {alert.message}
              </Text>
              
              {alert.actionRequired && (
                <View style={styles.actionIndicator}>
                  <Clock size={12} color={priorityColor} />
                  <Text style={[styles.actionText, { color: priorityColor }]}>
                    Action Required
                  </Text>
                </View>
              )}
              
              {alert.expiresAt && (
                <View style={styles.expiryIndicator}>
                  <Text style={styles.expiryText}>
                    Expires: {new Date(alert.expiresAt).toLocaleTimeString()}
                  </Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  notification: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  notificationContent: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dismissButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationMessage: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
    marginBottom: 8,
  },
  actionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  expiryIndicator: {
    marginTop: 4,
  },
  expiryText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});