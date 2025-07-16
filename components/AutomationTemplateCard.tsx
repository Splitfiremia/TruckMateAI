import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, Plus, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { IntegrationTemplate } from '@/store/integrationStore';

interface AutomationTemplateCardProps {
  template: IntegrationTemplate;
  onUse: () => void;
}

export const AutomationTemplateCard: React.FC<AutomationTemplateCardProps> = ({
  template,
  onUse,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onUse}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{template.name}</Text>
          {template.popular && (
            <View style={styles.popularBadge}>
              <Star color={colors.warning} size={12} fill={colors.warning} />
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}
        </View>
        
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{template.category}</Text>
        </View>
      </View>
      
      <Text style={styles.description}>{template.description}</Text>
      
      <View style={styles.flow}>
        <View style={styles.flowStep}>
          <Text style={styles.flowStepText}>{template.trigger.integration}</Text>
          <Text style={styles.flowStepSubtext}>{template.trigger.event}</Text>
        </View>
        
        <ArrowRight color={colors.textSecondary} size={16} style={styles.arrow} />
        
        <View style={styles.actionsContainer}>
          {template.actions.map((action, index) => (
            <View key={index} style={styles.flowStep}>
              <Text style={styles.flowStepText}>{action.integration}</Text>
              <Text style={styles.flowStepSubtext}>{action.action}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.useButton} onPress={onUse}>
          <Plus color={colors.primary} size={16} />
          <Text style={styles.useButtonText}>Use Template</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.warning,
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primaryLight,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  flow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  flowStep: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 80,
  },
  flowStepText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  flowStepSubtext: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  arrow: {
    marginHorizontal: 8,
  },
  actionsContainer: {
    flex: 1,
    gap: 4,
  },
  footer: {
    alignItems: 'flex-end',
  },
  useButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  useButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});