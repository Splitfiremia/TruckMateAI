import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useUserStore } from '@/store/userStore';
import { useTheme } from '@/store/themeStore';

export default function Index() {
  const { isAuthenticated, isOnboarded, user } = useUserStore();
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
        if (!user) {
          // No user signed in, go to sign-in screen
          router.replace('/sign-in');
        } else if (!isOnboarded) {
          // User signed in but not onboarded
          router.replace('/onboarding');
        } else {
          // User signed in and onboarded
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback navigation after a longer delay
        setTimeout(() => {
          try {
            if (!user) {
              router.push('/sign-in');
            } else if (!isOnboarded) {
              router.push('/onboarding');
            } else {
              router.push('/(tabs)');
            }
          } catch (fallbackError) {
            console.error('Fallback navigation error:', fallbackError);
          }
        }, 1000);
      }
    }, 500);

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