import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { AdminDashboard } from '@/components/AdminDashboard';

export default function AdminPage() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'FleetPilot Admin',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      
      <AdminDashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});