import { Tabs } from "expo-router";
import { BarChart, Clipboard, Home, Receipt, Settings, Users, Shield, Cloud, Zap } from "lucide-react-native";
import React from "react";

import { colors } from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Home color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="logbook"
        options={{
          title: "Logbook",
          tabBarIcon: ({ color }) => <Clipboard color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="loads"
        options={{
          title: "Loads",
          tabBarIcon: ({ color }) => <BarChart color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="receipts"
        options={{
          title: "Receipts",
          tabBarIcon: ({ color }) => <Receipt color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="compliance"
        options={{
          title: "AI Compliance",
          tabBarIcon: ({ color }) => <Shield color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: "Weather",
          tabBarIcon: ({ color }) => <Cloud color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="fleet"
        options={{
          title: "Fleet Admin",
          tabBarIcon: ({ color }) => <Users color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="integrations"
        options={{
          title: "Integrations",
          tabBarIcon: ({ color }) => <Zap color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}