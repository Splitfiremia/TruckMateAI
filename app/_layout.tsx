import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/userStore";
import { useBrandingStore } from "@/store/brandingStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isOnboarded } = useUserStore();
  const { settings } = useBrandingStore();
  
  // Use custom colors if branding is customized
  const activeColors = {
    background: colors.background.primary,
    text: colors.text.primary,
    primary: settings.primaryColor || colors.primary,
  };
  
  return (
    <Stack 
      screenOptions={{ 
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: activeColors.background,
        },
        headerTintColor: activeColors.text,
        contentStyle: {
          backgroundColor: activeColors.background,
        },
      }}
    >
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}