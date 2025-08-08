import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowRight, Smartphone, Layout, Grid3X3 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import AppBrand from '@/components/AppBrand';

const { width } = Dimensions.get('window');

export default function DashboardSelector() {
  const dashboardOptions = [
    {
      id: 1,
      title: 'Dashboard Option 1',
      description: 'Modern gradient header with quick actions grid and comprehensive status overview',
      route: '/dashboard-option-1',
      icon: Smartphone,
      features: ['Gradient Header', 'Quick Actions', 'Status Cards', 'Weekly Stats']
    },
    {
      id: 2,
      title: 'Dashboard Option 2',
      description: 'Clean minimal design with progress bars and organized navigation grid',
      route: '/dashboard-option-2',
      icon: Layout,
      features: ['Minimal Header', 'Progress Bars', 'Navigation Grid', 'Performance Metrics']
    },
    {
      id: 3,
      title: 'Dashboard Option 3',
      description: 'Professional edition with search, badges, and detailed performance analytics',
      route: '/dashboard-option-3',
      icon: Grid3X3,
      features: ['Search Bar', 'Feature Badges', 'Performance Analytics', 'Priority Indicators']
    }
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Dashboard Options',
        headerStyle: { backgroundColor: colors.background.primary },
        headerTintColor: colors.text.primary
      }} />
      
      <View style={styles.header}>
        <AppBrand size="medium" showText={true} />
        <Text style={styles.headerTitle}>Choose Your Dashboard Style</Text>
        <Text style={styles.headerSubtitle}>Select one of the three professional dashboard designs</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {dashboardOptions.map((option) => {
          const IconComp = option.icon;
          return (
            <TouchableOpacity 
              key={option.id}
              style={styles.optionCard}
              onPress={() => router.push(option.route as any)}
            >
              <View style={styles.optionHeader}>
                <View style={styles.optionIcon}>
                  <IconComp size={24} color={colors.primary} />
                </View>
                <View style={styles.optionTitleContainer}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <ArrowRight size={20} color={colors.text.secondary} />
              </View>
              
              <View style={styles.featuresContainer}>
                {option.features.map((feature, index) => (
                  <View key={index} style={styles.featureTag}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to Use</Text>
          <Text style={styles.infoText}>
            • Tap on any dashboard option to preview it{"\n"}
            • Each design uses the same blue color scheme{"\n"}
            • All dashboards are fully functional{"\n"}
            • Choose the one that best fits your workflow
          </Text>
        </View>
        
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 16,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  optionCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitleContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
  },
  infoCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  footer: {
    height: 40,
  },
});