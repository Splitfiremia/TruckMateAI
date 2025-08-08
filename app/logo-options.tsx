import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Truck, Zap, Shield, Target, BarChart3 } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function LogoOptions() {
  const logoOptions = [
    {
      id: 1,
      name: 'Classic Shield',
      description: 'Professional shield design with truck icon',
      icon: Shield,
      primaryColor: colors.primary,
      secondaryColor: colors.accent,
      style: 'classic'
    },
    {
      id: 2,
      name: 'Modern Bolt',
      description: 'Dynamic lightning bolt representing speed and efficiency',
      icon: Zap,
      primaryColor: colors.primary,
      secondaryColor: colors.warning,
      style: 'modern'
    },
    {
      id: 3,
      name: 'Target Focus',
      description: 'Precision target symbolizing accuracy and goals',
      icon: Target,
      primaryColor: colors.primary,
      secondaryColor: colors.success,
      style: 'geometric'
    },
    {
      id: 4,
      name: 'Truck Emblem',
      description: 'Direct truck representation with clean lines',
      icon: Truck,
      primaryColor: colors.primary,
      secondaryColor: colors.accent,
      style: 'industrial'
    },
    {
      id: 5,
      name: 'Analytics Graph',
      description: 'Data-driven chart design for AI emphasis',
      icon: BarChart3,
      primaryColor: colors.primary,
      secondaryColor: colors.success,
      style: 'tech'
    }
  ];

  const renderLogo = (logo: typeof logoOptions[0], size: 'small' | 'medium' | 'large' = 'medium') => {
    const IconComp = logo.icon;
    const logoSize = size === 'small' ? 40 : size === 'medium' ? 60 : 80;
    const iconSize = size === 'small' ? 20 : size === 'medium' ? 30 : 40;
    
    return (
      <View style={[styles.logoContainer, { 
        width: logoSize, 
        height: logoSize,
        backgroundColor: logo.primaryColor 
      }]}>
        <IconComp size={iconSize} color={colors.white} />
        {size !== 'small' && (
          <View style={[styles.logoAccent, { backgroundColor: logo.secondaryColor }]} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Logo Options',
        headerStyle: { backgroundColor: colors.background.secondary },
        headerTintColor: colors.text.primary
      }} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Logo</Text>
        <Text style={styles.headerSubtitle}>Select a logo design for TruckMate AI</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {logoOptions.map((logo) => (
          <TouchableOpacity key={logo.id} style={styles.logoCard}>
            <View style={styles.logoPreview}>
              {renderLogo(logo, 'large')}
              <View style={styles.logoSizes}>
                <Text style={styles.sizesLabel}>Sizes:</Text>
                <View style={styles.sizeVariants}>
                  {renderLogo(logo, 'small')}
                  {renderLogo(logo, 'medium')}
                </View>
              </View>
            </View>
            
            <View style={styles.logoInfo}>
              <Text style={styles.logoName}>{logo.name}</Text>
              <Text style={styles.logoDescription}>{logo.description}</Text>
              <View style={styles.logoMeta}>
                <View style={styles.styleTag}>
                  <Text style={styles.styleText}>{logo.style}</Text>
                </View>
                <View style={styles.colorPalette}>
                  <View style={[styles.colorDot, { backgroundColor: logo.primaryColor }]} />
                  <View style={[styles.colorDot, { backgroundColor: logo.secondaryColor }]} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Logo Usage Guidelines</Text>
          <Text style={styles.infoText}>
            • All logos are designed to work with the blue color scheme{'\n'}
            • Each logo includes multiple size variants{'\n'}
            • Logos maintain readability at all sizes{'\n'}
            • Professional appearance across all platforms
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
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoCard: {
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
  logoPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 20,
  },
  logoContainer: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoAccent: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.white,
  },
  logoSizes: {
    flex: 1,
  },
  sizesLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  sizeVariants: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  logoInfo: {
    gap: 8,
  },
  logoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  logoDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  logoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  styleTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  styleText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
    textTransform: 'capitalize',
  },
  colorPalette: {
    flexDirection: 'row',
    gap: 8,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
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