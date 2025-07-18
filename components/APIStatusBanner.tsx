import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { AlertTriangle, Wifi, WifiOff, Settings, X } from 'lucide-react-native';
import { hybridApiService } from '@/services/hybridApiService';
import { colors } from '@/constants/colors';

interface APIStatusBannerProps {
  visible?: boolean;
}

interface APIStatus {
  name: string;
  dailyUsage: number;
  dailyLimit: number;
  monthlyUsage: number;
  monthlyLimit: number;
  status: 'healthy' | 'warning' | 'critical';
}

export default function APIStatusBanner({ visible = true }: APIStatusBannerProps) {
  const [isDegradedMode, setIsDegradedMode] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    checkAPIStatus();
    const interval = setInterval(checkAPIStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const checkAPIStatus = async () => {
    try {
      const degraded = hybridApiService.isDegradedMode();
      setIsDegradedMode(degraded);
      
      const usageStatus = await hybridApiService.getUsageStatus();
      setApiStatuses(usageStatus.apis);
      setRecommendations(usageStatus.recommendations);
    } catch (error) {
      console.error('Failed to check API status:', error);
    }
  };

  const getBannerStyle = () => {
    if (!isDegradedMode) return null;
    
    const criticalAPIs = apiStatuses.filter(api => api.status === 'critical');
    if (criticalAPIs.length > 0) {
      return styles.criticalBanner;
    }
    
    return styles.warningBanner;
  };

  const getBannerText = () => {
    if (!isDegradedMode) return null;
    
    const criticalAPIs = apiStatuses.filter(api => api.status === 'critical');
    if (criticalAPIs.length > 0) {
      return 'Limited data mode - Some features unavailable';
    }
    
    return 'Using backup services - Reduced functionality';
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy':
        return <Wifi size={16} color={colors.success} />;
      case 'warning':
        return <AlertTriangle size={16} color={colors.warning} />;
      case 'critical':
        return <WifiOff size={16} color={colors.danger} />;
    }
  };

  if (!visible || !isDegradedMode) {
    return null;
  }

  return (
    <>
      <View style={[styles.banner, getBannerStyle()]}>
        <View style={styles.bannerContent}>
          <AlertTriangle size={16} color={colors.white} />
          <Text style={styles.bannerText}>{getBannerText()}</Text>
        </View>
        <Pressable
          style={styles.detailsButton}
          onPress={() => setShowDetails(true)}
        >
          <Settings size={16} color={colors.white} />
        </Pressable>
      </View>

      <Modal
        visible={showDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>API Status & Usage</Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowDetails(false)}
            >
              <X size={24} color={colors.text.primary} />
            </Pressable>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Service Status</Text>
            
            {apiStatuses.map((api, index) => (
              <View key={index} style={styles.apiStatusCard}>
                <View style={styles.apiHeader}>
                  <View style={styles.apiNameContainer}>
                    {getStatusIcon(api.status)}
                    <Text style={styles.apiName}>{api.name}</Text>
                  </View>
                  <Text style={[styles.statusText, styles[`${api.status}Status`]]}>
                    {api.status.toUpperCase()}
                  </Text>
                </View>
                
                <View style={styles.usageContainer}>
                  <View style={styles.usageRow}>
                    <Text style={styles.usageLabel}>Daily Usage:</Text>
                    <Text style={styles.usageValue}>
                      {api.dailyUsage} / {api.dailyLimit}
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${Math.min((api.dailyUsage / api.dailyLimit) * 100, 100)}%`,
                          backgroundColor: api.status === 'critical' ? colors.danger : 
                                         api.status === 'warning' ? colors.warning : colors.success
                        }
                      ]} 
                    />
                  </View>
                  
                  <View style={styles.usageRow}>
                    <Text style={styles.usageLabel}>Monthly Usage:</Text>
                    <Text style={styles.usageValue}>
                      {api.monthlyUsage} / {api.monthlyLimit}
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${Math.min((api.monthlyUsage / api.monthlyLimit) * 100, 100)}%`,
                          backgroundColor: api.status === 'critical' ? colors.danger : 
                                         api.status === 'warning' ? colors.warning : colors.success
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            ))}

            {recommendations.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Recommendations</Text>
                {recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationCard}>
                    <AlertTriangle size={16} color={colors.warning} />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </>
            )}

            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>What does this mean?</Text>
              <Text style={styles.infoText}>
                • <Text style={styles.bold}>Healthy:</Text> All services operating normally{'\n'}
                • <Text style={styles.bold}>Warning:</Text> High usage, monitor closely{'\n'}
                • <Text style={styles.bold}>Critical:</Text> Service limits reached, using fallbacks{'\n'}
                {'\n'}
                ELD compliance features remain fully functional at all times.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  warningBanner: {
    backgroundColor: colors.warning,
  },
  criticalBanner: {
    backgroundColor: colors.danger,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500' as const,
    marginLeft: 8,
  },
  detailsButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 12,
    marginTop: 16,
  },
  apiStatusCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  apiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  apiNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  apiName: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text.primary,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  healthyStatus: {
    color: colors.success,
  },
  warningStatus: {
    color: colors.warning,
  },
  criticalStatus: {
    color: colors.danger,
  },
  usageContainer: {
    gap: 8,
  },
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  usageValue: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.text.primary,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.background.tertiary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  infoSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
});