import { Tabs, Redirect } from "expo-router";
import { BarChart, Clipboard, Home, Receipt, Settings, Users, Shield, Cloud, Zap, Wrench, Navigation, Bot, Truck, CreditCard } from "lucide-react-native";
import React, { useState } from "react";
import { Animated, Platform } from "react-native";

import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/userStore";
import { useBrandingStore } from "@/store/brandingStore";

export default function TabLayout() {
  const { isOnboarded, isOwnerOperator, isFleetCompany } = useUserStore();
  const { settings } = useBrandingStore();
  const [expanded, setExpanded] = useState(false);
  const [heightAnim] = useState(new Animated.Value(80));
  
  // Redirect to onboarding if not completed
  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }
  
  // Use custom colors if branding is customized
  const activeColors = {
    primary: settings.primaryColor || colors.primaryLight,
    secondary: settings.secondaryColor || colors.secondary,
    background: colors.background.primary,
    textSecondary: colors.textSecondary,
    border: colors.border,
    text: colors.text.primary,
  };

  const handleTabBarPress = () => {
    const newState = !expanded;
    setExpanded(newState);
    Animated.timing(heightAnim, {
      toValue: newState ? 100 : 80,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColors.primary,
        tabBarInactiveTintColor: activeColors.textSecondary,
        tabBarStyle: {
          backgroundColor: activeColors.background,
          borderTopColor: activeColors.border,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 12,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: expanded ? 100 : 80,
        },
        tabBarLabelStyle: {
          fontSize: expanded ? 12 : 10,
          fontWeight: '500',
          marginTop: expanded ? 6 : 4,
          paddingHorizontal: 4,
          textAlign: 'center',
          lineHeight: expanded ? 14 : 12,
        },
        tabBarItemStyle: {
          paddingVertical: expanded ? 8 : 6,
          paddingHorizontal: 12,
          minWidth: 80,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIconStyle: {
          marginBottom: expanded ? 4 : 2,
        },
        tabBarPressColor: activeColors.primary + '20',
        tabBarButton: (props) => (
          <Animated.View
            {...props}
            onTouchStart={handleTabBarPress}
            style={[
              props.style,
              {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }
            ]}
          />
        ),
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
              tabBarIcon: ({ color }) => <Home color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="logbook"
            options={{
              title: "Logbook",
              tabBarIcon: ({ color }) => <Clipboard color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="loads"
            options={{
              title: "Loads",
              tabBarIcon: ({ color }) => <BarChart color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="route-optimization"
            options={{
              title: "Routes",
              tabBarIcon: ({ color }) => <Navigation color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="receipts"
            options={{
              title: "Receipts",
              tabBarIcon: ({ color }) => <Receipt color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="compliance"
            options={{
              title: "Compliance",
              tabBarIcon: ({ color }) => <Shield color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="eld-integration"
            options={{
              title: "ELD",
              tabBarIcon: ({ color }) => <Truck color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="weather"
            options={{
              title: "Weather",
              tabBarIcon: ({ color }) => <Cloud color={color} size={expanded ? 22 : 20} />,
            }}
          />
          {/* Fleet tab only visible for fleet companies */}
          {isFleetCompany() && (
            <Tabs.Screen
              name="fleet"
              options={{
                title: "Fleet",
                tabBarIcon: ({ color }) => <Users color={color} size={expanded ? 22 : 20} />,
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
              tabBarIcon: ({ color }) => <Wrench color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="ai-assistant"
            options={{
              title: "Assistant",
              tabBarIcon: ({ color }) => <Bot color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="integrations"
            options={{
              title: "Integrations",
              tabBarIcon: ({ color }) => <Zap color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="pricing"
            options={{
              title: "Pricing",
              tabBarIcon: ({ color }) => <CreditCard color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: "Settings",
              tabBarIcon: ({ color }) => <Settings color={color} size={expanded ? 22 : 20} />,
            }}
          />
        </Tabs>
  );
}
