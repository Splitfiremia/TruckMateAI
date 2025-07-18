import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useUserStore } from '@/store/userStore';
import { useTheme } from '@/store/themeStore';

export default function Index() {
  const { isOnboarded, user } = useUserStore();
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    // Delay navigation to ensure everything is ready
    const timer = setTimeout(() => {
      try {
        if (!user || !isOnboarded) {
          router.replace('/onboarding');
        } else {
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [user, isOnboarded, isMounted]);

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