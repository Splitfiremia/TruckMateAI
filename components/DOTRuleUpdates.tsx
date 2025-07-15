import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  FileText, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  ExternalLink,
  Download,
  Bell,
  RefreshCw,
  Filter
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { usePredictiveComplianceStore } from '@/store/predictiveComplianceStore';
import { DOTRule, RuleUpdateNotification } from '@/types';

interface DOTRuleUpdatesProps {
  onRuleSelect?: (rule: DOTRule) => void;
}

export const DOTRuleUpdates: React.FC<DOTRuleUpdatesProps> = ({
  onRuleSelect
}) => {
  const {
    dotRules,
    ruleUpdates,
    lastRuleSync,
    syncDOTRules,
    checkForRuleUpdates
  } = usePredictiveComplianceStore();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showUpdatesOnly, setShowUpdatesOnly] = useState(false);

  const categories = ['All', 'HOS', 'ELD', 'Inspection', 'Medical', 'Vehicle', 'Driver'];

  useEffect(() => {
    // Check for rule updates on component mount
    checkForRuleUpdates();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await syncDOTRules();
      await checkForRuleUpdates();
    } catch (error) {
      Alert.alert('Error', 'Failed to sync DOT rules');
    } finally {
      setRefreshing(false);
    }
  };

  const getFilteredRules = () => {
    let filtered = dotRules;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(rule => rule.category === selectedCategory);
    }
    
    if (showUpdatesOnly) {
      const updatedRuleIds = ruleUpdates.map(update => update.ruleId);
      filtered = filtered.filter(rule => updatedRuleIds.includes(rule.id));
    }
    
    return filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  };

  const getRecentUpdates = () => {
    return ruleUpdates
      .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime())
      .slice(0, 5);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return colors.error;
      case 'Important': return colors.warning;
      default: return colors.primary;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return colors.error;
      case 'Medium': return colors.warning;
      default: return colors.success;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isRuleUpdated = (ruleId: string) => {
    return ruleUpdates.some(update => update.ruleId === ruleId);
  };

  const getRuleUpdate = (ruleId: string) => {
    return ruleUpdates.find(update => update.ruleId === ruleId);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <FileText size={24} color={colors.primary} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>DOT Rule Updates</Text>
            <Text style={styles.headerSubtitle}>
              Last synced: {formatDate(lastRuleSync)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleRefresh}
            style={styles.refreshButton}
          >
            <RefreshCw size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Updates Alert */}
      {ruleUpdates.length > 0 && (
        <LinearGradient
          colors={[colors.warning + '20', colors.warning + '05']}
          style={styles.updatesAlert}
        >
          <View style={styles.alertHeader}>
            <Bell size={20} color={colors.warning} />
            <Text style={styles.alertTitle}>
              {ruleUpdates.length} New Rule Update{ruleUpdates.length > 1 ? 's' : ''}
            </Text>
          </View>
          <Text style={styles.alertMessage}>
            Recent changes to DOT regulations require your attention
          </Text>
          <TouchableOpacity
            style={styles.viewUpdatesButton}
            onPress={() => setShowUpdatesOnly(!showUpdatesOnly)}
          >
            <Text style={styles.viewUpdatesText}>
              {showUpdatesOnly ? 'Show All Rules' : 'View Updates Only'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      )}

      {/* Filters */}
      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterButton,
                  selectedCategory === category && styles.activeFilter
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.filterText,
                  selectedCategory === category && styles.activeFilterText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Recent Rule Updates */}
      {getRecentUpdates().length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Recent Updates</Text>
          {getRecentUpdates().map((update) => (
            <View key={update.id} style={styles.updateCard}>
              <View style={styles.updateHeader}>
                <View style={styles.updateInfo}>
                  <Text style={styles.updateType}>
                    {update.changeType} Rule
                  </Text>
                  <View style={[
                    styles.impactBadge,
                    { backgroundColor: getImpactColor(update.impactLevel) + '20' }
                  ]}>
                    <Text style={[
                      styles.impactText,
                      { color: getImpactColor(update.impactLevel) }
                    ]}>
                      {update.impactLevel} Impact
                    </Text>
                  </View>
                </View>
                <View style={styles.updateDate}>
                  <Calendar size={14} color={colors.textSecondary} />
                  <Text style={styles.dateText}>
                    {formatDate(update.effectiveDate)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.updateSummary}>{update.summary}</Text>
              
              {update.actionRequired && (
                <View style={styles.actionRequired}>
                  <AlertCircle size={16} color={colors.warning} />
                  <Text style={styles.actionText}>Action Required</Text>
                  {update.deadline && (
                    <Text style={styles.deadlineText}>
                      by {formatDate(update.deadline)}
                    </Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* DOT Rules List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          📖 DOT Rules ({getFilteredRules().length})
        </Text>
        {getFilteredRules().map((rule) => {
          const ruleUpdate = getRuleUpdate(rule.id);
          const hasUpdate = isRuleUpdated(rule.id);
          
          return (
            <TouchableOpacity
              key={rule.id}
              style={[
                styles.ruleCard,
                hasUpdate && styles.updatedRuleCard
              ]}
              onPress={() => onRuleSelect?.(rule)}
            >
              <View style={styles.ruleHeader}>
                <View style={styles.ruleInfo}>
                  <View style={styles.ruleTitleRow}>
                    <Text style={styles.ruleTitle}>{rule.title}</Text>
                    {hasUpdate && (
                      <View style={styles.updateBadge}>
                        <Text style={styles.updateBadgeText}>NEW</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.ruleMetadata}>
                    <View style={[
                      styles.categoryBadge,
                      { backgroundColor: getSeverityColor(rule.severity) + '20' }
                    ]}>
                      <Text style={[
                        styles.categoryText,
                        { color: getSeverityColor(rule.severity) }
                      ]}>
                        {rule.category}
                      </Text>
                    </View>
                    <Text style={styles.sourceText}>{rule.source}</Text>
                  </View>
                </View>
                <View style={styles.ruleActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <ExternalLink size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <Text style={styles.ruleDescription} numberOfLines={2}>
                {rule.description}
              </Text>
              
              <View style={styles.ruleFooter}>
                <View style={styles.dateInfo}>
                  <Clock size={14} color={colors.textSecondary} />
                  <Text style={styles.dateText}>
                    Updated {formatDate(rule.lastUpdated)}
                  </Text>
                </View>
                <View style={styles.severityIndicator}>
                  <View style={[
                    styles.severityDot,
                    { backgroundColor: getSeverityColor(rule.severity) }
                  ]} />
                  <Text style={styles.severityText}>{rule.severity}</Text>
                </View>
              </View>

              {ruleUpdate && (
                <View style={styles.updatePreview}>
                  <Text style={styles.updatePreviewTitle}>Latest Update:</Text>
                  <Text style={styles.updatePreviewText}>
                    {ruleUpdate.summary}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Compliance Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Compliance Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Rules Monitored</Text>
            <Text style={styles.summaryValue}>{dotRules.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Recent Updates</Text>
            <Text style={styles.summaryValue}>{ruleUpdates.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Critical Rules</Text>
            <Text style={styles.summaryValue}>
              {dotRules.filter(r => r.severity === 'Critical').length}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Action Required</Text>
            <Text style={[
              styles.summaryValue,
              { color: ruleUpdates.filter(u => u.actionRequired).length > 0 ? colors.warning : colors.success }
            ]}>
              {ruleUpdates.filter(u => u.actionRequired).length}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updatesAlert: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  alertMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  viewUpdatesButton: {
    backgroundColor: colors.warning,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  viewUpdatesText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  filtersSection: {
    paddingVertical: 16,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilter: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
  },
  activeFilterText: {
    color: 'white',
    fontWeight: '600',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  updateCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  updateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  updateType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  impactText: {
    fontSize: 12,
    fontWeight: '600',
  },
  updateDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  updateSummary: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  actionRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.warning + '10',
    padding: 8,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.warning,
  },
  deadlineText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 'auto',
  },
  ruleCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  updatedRuleCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '05',
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ruleInfo: {
    flex: 1,
  },
  ruleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  updateBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  updateBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  ruleMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sourceText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  ruleActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  ruleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  severityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  severityText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  updatePreview: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  updatePreviewTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  updatePreviewText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});