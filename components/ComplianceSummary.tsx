import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Shield, 
  TrendingUp, 
  Clock, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Zap,
  Eye,
  FileText,
  Bell
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { usePredictiveComplianceStore } from '@/store/predictiveComplianceStore';

interface ComplianceSummaryProps {
  onViewDetails?: () => void;
}

export const ComplianceSummary: React.FC<ComplianceSummaryProps> = ({
  onViewDetails
}) => {
  const { metrics, violationPredictions, activeAlerts, dotRules } = usePredictiveComplianceStore();

  const features = [
    {
      icon: TrendingUp,
      title: 'Real-Time DOT Rule Updates',
      description: 'Automatically scrapes FMCSA/DOT websites for regulation changes',
      value: `${dotRules.length} rules monitored`,
      color: colors.primary
    },
    {
      icon: AlertTriangle,
      title: 'Violation Prevention',
      description: 'AI predicts violations before they occur with actionable alerts',
      value: `${violationPredictions.length} active predictions`,
      color: colors.warning
    },
    {
      icon: Clock,
      title: 'HOS Compliance',
      description: 'Monitors 11-hour driving, 14-hour window, and break requirements',
      value: `${Math.round(metrics.hoursUntilViolation)}h until next risk`,
      color: colors.success
    },
    {
      icon: DollarSign,
      title: 'Fine Prevention',
      description: 'Prevents costly violations with estimated savings tracking',
      value: '$2,340 saved this month',
      color: colors.secondary
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Zero-Touch Compliance',
      description: 'Automated monitoring eliminates manual logbook errors'
    },
    {
      icon: Zap,
      title: 'Predictive Alerts',
      description: 'Get warned 22+ minutes before potential violations'
    },
    {
      icon: Eye,
      title: 'Real-Time Monitoring',
      description: 'Continuous analysis of driving patterns and regulations'
    },
    {
      icon: FileText,
      title: 'Auto Rule Updates',
      description: 'Always compliant with latest DOT/FMCSA regulations'
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary + '20', colors.primary + '05']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Shield size={32} color={colors.primary} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>AI-Powered Predictive Compliance</Text>
            <Text style={styles.headerSubtitle}>
              Real-time DOT violation prevention system
            </Text>
          </View>
        </View>
        
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>{metrics.complianceScore}%</Text>
            <Text style={styles.headerStatLabel}>Compliant</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={[
              styles.headerStatValue,
              { color: metrics.violationRisk > 60 ? colors.error : 
                       metrics.violationRisk > 30 ? colors.warning : colors.success }
            ]}>
              {metrics.violationRisk}%
            </Text>
            <Text style={styles.headerStatLabel}>Risk Level</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>{activeAlerts.length}</Text>
            <Text style={styles.headerStatLabel}>Active Alerts</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Key Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Key Features</Text>
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <IconComponent size={20} color={feature.color} />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
              <Text style={[styles.featureValue, { color: feature.color }]}>
                {feature.value}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Benefits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ Benefits</Text>
        <View style={styles.benefitsGrid}>
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <View key={index} style={styles.benefitCard}>
                <View style={[styles.benefitIcon, { backgroundColor: colors.primary + '20' }]}>
                  <IconComponent size={18} color={colors.primary} />
                </View>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* How It Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ How It Works</Text>
        <View style={styles.processContainer}>
          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>1</Text>
            </View>
            <View style={styles.processContent}>
              <Text style={styles.processTitle}>Real-Time Monitoring</Text>
              <Text style={styles.processDescription}>
                AI continuously analyzes your driving data, HOS status, and current location
              </Text>
            </View>
          </View>
          
          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>2</Text>
            </View>
            <View style={styles.processContent}>
              <Text style={styles.processTitle}>Violation Prediction</Text>
              <Text style={styles.processDescription}>
                Advanced algorithms predict potential violations 22+ minutes before they occur
              </Text>
            </View>
          </View>
          
          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>3</Text>
            </View>
            <View style={styles.processContent}>
              <Text style={styles.processTitle}>Prevention Actions</Text>
              <Text style={styles.processDescription}>
                Receive actionable alerts with specific recommendations to avoid violations
              </Text>
            </View>
          </View>
          
          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>4</Text>
            </View>
            <View style={styles.processContent}>
              <Text style={styles.processTitle}>Auto Compliance</Text>
              <Text style={styles.processDescription}>
                System automatically updates with latest DOT rules and adjusts monitoring
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Call to Action */}
      <TouchableOpacity style={styles.ctaButton} onPress={onViewDetails}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.ctaGradient}
        >
          <Text style={styles.ctaText}>View Full Dashboard</Text>
          <TrendingUp size={20} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    borderRadius: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  headerStat: {
    alignItems: 'center',
  },
  headerStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  headerStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  featureValue: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  benefitCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  processContainer: {
    gap: 16,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  processNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  processContent: {
    flex: 1,
  },
  processTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  processDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  ctaButton: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});