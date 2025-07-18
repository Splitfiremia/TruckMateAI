import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useDeviceTesting } from '@/hooks/useDeviceTesting';
import { TestingHelpers } from '@/utils/testingHelpers';

export const DeviceTestingDashboard: React.FC = () => {
  const {
    isTestingMode,
    setIsTestingMode,
    simulateDevice,
    runAccessibilityTest,
    simulateLowBattery,
    getDeviceInfo
  } = useDeviceTesting();

  const deviceInfo = getDeviceInfo();

  const testButtons = [
    {
      title: 'iPhone 15 Pro',
      action: () => simulateDevice('iphone15pro'),
      color: '#007AFF'
    },
    {
      title: 'Pixel 7',
      action: () => simulateDevice('pixel7'),
      color: '#34A853'
    },
    {
      title: 'iPad Pro',
      action: () => simulateDevice('ipadpro'),
      color: '#FF9500'
    },
    {
      title: 'Low Battery Mode',
      action: simulateLowBattery,
      color: '#FF3B30'
    },
    {
      title: 'Accessibility Test',
      action: runAccessibilityTest,
      color: '#5856D6'
    },
    {
      title: 'Slow Network',
      action: () => TestingHelpers.simulateSlowNetwork(),
      color: '#FF9500'
    }
  ];

  if (!isTestingMode) {
    return (
      <Pressable
        style={styles.toggleButton}
        onPress={() => setIsTestingMode(true)}
      >
        <Text style={styles.toggleText}>🧪 Enable Testing Mode</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Device Testing Dashboard</Text>
        <Pressable
          style={styles.closeButton}
          onPress={() => setIsTestingMode(false)}
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Current Device Info</Text>
          <Text style={styles.infoText}>Platform: {deviceInfo.platform}</Text>
          <Text style={styles.infoText}>Screen: {deviceInfo.screenSize.width}×{deviceInfo.screenSize.height}</Text>
          <Text style={styles.infoText}>Simulating: {deviceInfo.currentDevice}</Text>
        </View>

        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>Device Simulations</Text>
          {testButtons.map((button, index) => (
            <Pressable
              key={index}
              style={[styles.testButton, { backgroundColor: button.color }]}
              onPress={button.action}
            >
              <Text style={styles.testButtonText}>{button.title}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>Real Device Testing</Text>
          <Text style={styles.instructionText}>
            📱 Scan the QR code with Expo Go to test on real devices
          </Text>
          <Text style={styles.instructionText}>
            🔍 Use browser dev tools for performance monitoring
          </Text>
          <Text style={styles.instructionText}>
            ♿ Enable screen reader to test accessibility
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  toggleButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1000,
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D1D1F',
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  content: {
    maxHeight: 400,
  },
  infoSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  testSection: {
    padding: 16,
  },
  instructionsSection: {
    padding: 16,
    backgroundColor: '#F2F2F7',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  testButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 6,
    lineHeight: 16,
  },
});