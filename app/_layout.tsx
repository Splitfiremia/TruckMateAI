import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Pressable } from "react-native";
import { LogOut } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/userStore";
import { useBrandingStore } from "@/store/brandingStore";
import { ThemeProvider, useTheme } from "@/store/themeStore";
import APIStatusBanner from "@/components/APIStatusBanner";

import { trpc, trpcClient } from "@/lib/trpc";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isOnboarded, user, logout } = useUserStore();
  const { settings } = useBrandingStore();
  const { theme, isDark } = useTheme();
  
  // Use custom colors if branding is customized, otherwise use theme colors
  const activeColors = {
    background: theme.background.primary,
    text: theme.text.primary,
    primary: settings.primaryColor || theme.primary,
  };
  
  return (
    <>
      <APIStatusBanner />

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
          headerRight: () => (
            <Pressable
              onPress={() => {
                try {
                  logout();
                } catch (e) {
                  console.log("Sign out error", e);
                }
              }}
              style={{ paddingHorizontal: 12, paddingVertical: 8 }}
              accessibilityLabel="Sign out"
              testID="sign-out-button"
            >
              <LogOut color={activeColors.text} size={22} />
            </Pressable>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding-flow" options={{ headerShown: false }} />
        <Stack.Screen name="logo-generator" options={{ title: "Logo Generator" }} />
        <Stack.Screen name="api-settings" options={{ title: "API Settings" }} />
        <Stack.Screen name="api-testing" options={{ title: "API Testing" }} />
        <Stack.Screen name="pricing" options={{ title: "Pricing" }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBarWrapper />
            <RootLayoutNav />
          </GestureHandlerRootView>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function StatusBarWrapper() {
  const { isDark } = useTheme();
  return <StatusBar style="dark" backgroundColor={colors.background.primary} />;
}