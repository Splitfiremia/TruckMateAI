import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useUserStore } from '@/store/userStore';
import { useTheme } from '@/store/themeStore';

export default function Index() {
  const { isOnboarded, user } = useUserStore();
  const { theme } = useTheme();

  useEffect(() => {
    // Small delay to ensure navigation is ready
    const timer = setTimeout(() => {
      if (!user || !isOnboarded) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user, isOnboarded]);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: theme.background.primary 
    }}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
}