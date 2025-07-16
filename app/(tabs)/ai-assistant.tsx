import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAIAssistantStore } from '@/store/aiAssistantStore';
import { useLogbookStore } from '@/store/logbookStore';
import { useLoadStore } from '@/store/loadStore';
import { useWeatherStore } from '@/store/weatherStore';
import { usePredictiveMaintenanceStore } from '@/store/predictiveMaintenanceStore';
import AIAssistant from '@/components/AIAssistant';

export default function AIAssistantScreen() {
  const { updateTruckingContext } = useAIAssistantStore();
  const { currentStatus, hoursRemaining } = useLogbookStore();
  const { loads } = useLoadStore();
  const { currentWeather } = useWeatherStore();
  const { alerts } = usePredictiveMaintenanceStore();

  // Update trucking context when relevant data changes
  useEffect(() => {
    const currentLoad = loads.find(load => load.status === 'in_progress');
    const maintenanceAlerts = alerts
      .filter(alert => alert.severity === 'high' || alert.severity === 'critical')
      .map(alert => alert.message);

    updateTruckingContext({
      currentStatus,
      hoursRemaining,
      currentLoad: currentLoad ? {
        id: currentLoad.id,
        pickup: currentLoad.pickup.address,
        delivery: currentLoad.delivery.address,
        weight: currentLoad.weight,
      } : undefined,
      weatherConditions: currentWeather?.condition,
      maintenanceAlerts,
    });
  }, [
    currentStatus,
    hoursRemaining,
    loads,
    currentWeather,
    alerts,
    updateTruckingContext,
  ]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'AI Trucking Assistant',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      <AIAssistant showHeader={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});