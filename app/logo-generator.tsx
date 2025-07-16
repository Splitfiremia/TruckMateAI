import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import LogoGenerator from '@/components/LogoGenerator';
import { colors } from '@/constants/colors';

export default function LogoGeneratorScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Logo Generator',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
        }} 
      />
      <LogoGenerator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});