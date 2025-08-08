import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { useUserStore } from '@/store/userStore';
import { useDriverStore } from '@/store/driverStore';
import { useTheme } from '@/store/themeStore';
import { colors } from '@/constants/colors';

export default function Index() {
  const { user, isOnboarded } = useUserStore();
  const { isAuthenticated: isDriverAuthenticated } = useDriverStore();
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);
    console.log('Index component mounted');
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    console.log('Checking authentication state:', {
      user: !!user,
      isOnboarded,
      isDriverAuthenticated,
    });
    
    // Delay navigation to ensure everything is ready
    const timer = setTimeout(() => {
      try {
        // Check if user is a driver (logged in through driver portal)
        if (isDriverAuthenticated) {
          console.log('Driver authenticated, navigating to driver dashboard');
          setLoadingText('Loading driver dashboard...');
          router.replace('/driver-dashboard');
          return;
        }
        
        // Check main app authentication
        if (!user) {
          console.log('No user signed in, navigating to sign-in');
          setLoadingText('Redirecting to sign-in...');
          router.replace('/sign-in');
        } else if (!isOnboarded) {
          console.log('User signed in but not onboarded, navigating to onboarding');
          setLoadingText('Setting up your account...');
          router.replace('/onboarding');
        } else {
          console.log('User authenticated and onboarded, navigating to main app');
          setLoadingText('Loading dashboard...');
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Navigation error:', error);
        setLoadingText('Navigation error, retrying...');
        
        // Fallback navigation after a longer delay
        setTimeout(() => {
          try {
            console.log('Attempting fallback navigation');
            if (isDriverAuthenticated) {
              router.push('/driver-dashboard');
            } else if (!user) {
              router.push('/sign-in');
            } else if (!isOnboarded) {
              router.push('/onboarding');
            } else {
              router.push('/(tabs)');
            }
          } catch (fallbackError) {
            console.error('Fallback navigation error:', fallbackError);
            setLoadingText('Please refresh the app');
          }
        }, 1000);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [user, isOnboarded, isDriverAuthenticated, isMounted]);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: theme.background.primary,
      padding: 20,
    }}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={{
        marginTop: 16,
        fontSize: 16,
        color: colors.text.secondary,
        textAlign: 'center',
      }}>
        {loadingText}
      </Text>
    </View>
  );
}