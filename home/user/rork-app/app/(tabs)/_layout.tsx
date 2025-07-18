import { Tabs, Redirect } from "expo-router";
import { BarChart, Clipboard, Home, Receipt, Settings, Users, Shield, Cloud, Zap, Wrench } from "lucide-react-native";
import React from "react";

import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/userStore";
import { useBrandingStore } from "@/store/brandingStore";

export default function TabLayout() {
  const { isOnboarded, isOwnerOperator, isFleetCompany } = useUserStore();
  const { settings } = useBrandingStore();
  
  // Redirect to onboarding if not completed
  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }
  
  // Use custom colors if branding is customized
  const activeColors = {
    primary: settings.primaryColor || colors.primaryLight,
    secondary: settings.secondaryColor || colors.secondary,
    background: colors.background.primary,
    textSecondary: colors.secondary,
    border: colors.border,
    text: colors.text.primary,
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColors.primary,
        tabBarInactiveTintColor: activeColors.textSecondary,
        tabBarStyle: {
          backgroundColor: activeColors.background,
          borderTopColor: activeColors.border,
          height: 85,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: activeColors.background,
        },
        headerTintColor: activeColors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Home color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="logbook"
        options={{
          title: "Logbook",
          tabBarIcon: ({ color }) => <Clipboard color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="loads"
        options={{
          title: "Loads",
          tabBarIcon: ({ color }) => <BarChart color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="receipts"
        options={{
          title: "Receipts",
          tabBarIcon: ({ color }) => <Receipt color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="compliance"
        options={{
          title: "Compliance",
          tabBarIcon: ({ color }) => <Shield color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: "Weather",
          tabBarIcon: ({ color }) => <Cloud color={color} size={20} />,
        }}
      />
      {/* Fleet tab only visible for fleet companies */}
      {isFleetCompany() && (
        <Tabs.Screen
          name="fleet"
          options={{
            title: "Fleet",
            tabBarIcon: ({ color }) => <Users color={color} size={20} />,
          }}
        />
      )}
      {/* Hide fleet tab for owner-operators */}
      {isOwnerOperator() && (
        <Tabs.Screen
          name="fleet"
          options={{
            href: null, // This hides the tab
          }}
        />
      )}
      <Tabs.Screen
        name="maintenance"
        options={{
          title: "Maintenance",
          tabBarIcon: ({ color }) => <Wrench color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="integrations"
        options={{
          title: "Integrations",
          tabBarIcon: ({ color }) => <Zap color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings color={color} size={20} />,
        }}
      />
    </Tabs>
  );
}