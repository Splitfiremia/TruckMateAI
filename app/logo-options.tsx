import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Truck, Zap, Shield, Target, Brain } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';



export default function LogoOptions() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerTitle: 'TruckMate AI - Logo Options',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Choose Your TruckMate AI Logo</Text>
        <Text style={styles.pageSubtitle}>Select the logo design that best represents your fleet management vision</Text>
        
        {/* Logo Option 1 - Modern Gradient */}
        <View style={styles.logoCard}>
          <Text style={styles.logoTitle}>Option 1 - Modern Gradient</Text>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8', '#1e40af']}
              style={styles.gradientLogo}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Truck size={32} color="white" />
              <Zap size={16} color="white" style={styles.aiIcon} />
            </LinearGradient>
            <View style={styles.logoText}>
              <Text style={styles.brandName}>TruckMate</Text>
              <Text style={styles.aiText}>AI</Text>
            </View>
          </View>
          <Text style={styles.logoDescription}>
            Clean, modern gradient design with integrated AI symbol. Perfect for tech-forward companies.
          </Text>
        </View>
        
        {/* Logo Option 2 - Shield Protection */}
        <View style={styles.logoCard}>
          <Text style={styles.logoTitle}>Option 2 - Shield Protection</Text>
          <View style={styles.logoContainer}>
            <View style={styles.shieldLogo}>
              <Shield size={40} color="#10b981" />
              <Truck size={20} color="white" style={styles.innerIcon} />
            </View>
            <View style={styles.logoText}>
              <Text style={styles.brandName}>TruckMate</Text>
              <Text style={[styles.aiText, { color: '#10b981' }]}>AI</Text>
            </View>
          </View>
          <Text style={styles.logoDescription}>
            Security-focused design emphasizing safety and protection. Ideal for safety-conscious fleets.
          </Text>
        </View>
        
        {/* Logo Option 3 - Target Precision */}
        <View style={styles.logoCard}>
          <Text style={styles.logoTitle}>Option 3 - Target Precision</Text>
          <View style={styles.logoContainer}>
            <View style={styles.targetLogo}>
              <Target size={48} color="#f59e0b" />
              <Truck size={20} color="#f59e0b" style={styles.centerIcon} />
            </View>
            <View style={styles.logoText}>
              <Text style={styles.brandName}>TruckMate</Text>
              <Text style={[styles.aiText, { color: '#f59e0b' }]}>AI</Text>
            </View>
          </View>
          <Text style={styles.logoDescription}>
            Precision-focused design highlighting accuracy and efficiency. Great for logistics optimization.
          </Text>
        </View>
        
        {/* Logo Option 4 - Brain Intelligence */}
        <View style={styles.logoCard}>
          <Text style={styles.logoTitle}>Option 4 - Brain Intelligence</Text>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed', '#6d28d9']}
              style={styles.brainLogo}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Brain size={28} color="white" />
              <Truck size={14} color="white" style={styles.brainTruck} />
            </LinearGradient>
            <View style={styles.logoText}>
              <Text style={styles.brandName}>TruckMate</Text>
              <Text style={[styles.aiText, { color: '#8b5cf6' }]}>AI</Text>
            </View>
          </View>
          <Text style={styles.logoDescription}>
            Intelligence-focused design emphasizing AI capabilities and smart decision making.
          </Text>
        </View>
        
        {/* Logo Option 5 - Minimalist Circle */}
        <View style={styles.logoCard}>
          <Text style={styles.logoTitle}>Option 5 - Minimalist Circle</Text>
          <View style={styles.logoContainer}>
            <View style={styles.circleLogo}>
              <View style={styles.circleOuter}>
                <View style={styles.circleInner}>
                  <Truck size={24} color="#1f2937" />
                </View>
                <Text style={styles.circleAI}>AI</Text>
              </View>
            </View>
            <View style={styles.logoText}>
              <Text style={[styles.brandName, { color: '#1f2937' }]}>TruckMate</Text>
              <Text style={[styles.aiText, { color: '#6b7280' }]}>AI</Text>
            </View>
          </View>
          <Text style={styles.logoDescription}>
            Clean, minimalist design with subtle AI integration. Perfect for professional, understated branding.
          </Text>
        </View>
        
        {/* Selection Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to Choose</Text>
          <Text style={styles.instructionsText}>
            Consider your brand personality:
            {'\n'}• Modern & Tech-Forward → Option 1
            {'\n'}• Safety & Security Focus → Option 2  
            {'\n'}• Precision & Efficiency → Option 3
            {'\n'}• AI & Intelligence → Option 4
            {'\n'}• Professional & Clean → Option 5
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
    backgroundColor: '#f8fafc',
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  logoCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  gradientLogo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  aiIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  shieldLogo: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  innerIcon: {
    position: 'absolute',
  },
  targetLogo: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  centerIcon: {
    position: 'absolute',
  },
  brainLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  brainTruck: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  circleLogo: {
    marginRight: 16,
  },
  circleOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleAI: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6b7280',
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  logoText: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  aiText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginTop: 2,
  },
  logoDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  instructionsCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  footer: {
    height: 20,
  },
});