import { Tabs } from 'expo-router';
import React from 'react';
import {
  Home,
  Navigation,
  MessageCircle,
  AlertTriangle,
  User,
  Route,
  Camera,
  Clock,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function DriverTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="active-trip"
        options={{
          title: 'Trip',
          tabBarIcon: ({ color, size }) => (
            <Navigation color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <MessageCircle color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="report-issue"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }) => (
            <AlertTriangle color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
      
      {/* Hidden screens - accessible via navigation but not shown in tab bar */}
      <Tabs.Screen
        name="proof-of-delivery"
        options={{
          href: null, // This hides the tab
          title: 'Proof of Delivery',
        }}
      />
      <Tabs.Screen
        name="trip-history"
        options={{
          href: null, // This hides the tab
          title: 'Trip History',
        }}
      />
    </Tabs>
  );
}