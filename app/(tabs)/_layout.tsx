import { Tabs, Redirect } from "expo-router";
import { BarChart, Clipboard, Home, Receipt, Settings, Users, Shield, Cloud, Zap, Wrench, Navigation, Bot, Truck, CreditCard } from "lucide-react-native";
import React, { useState } from "react";
import { Animated, TouchableWithoutFeedback, StyleSheet } from "react-native";

import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/userStore";
import { useBrandingStore } from "@/store/brandingStore";

export default function TabLayout() {
  const { isOnboarded, isOwnerOperator, isFleetCompany } = useUserStore();
  const { settings } = useBrandingStore();
  const [expanded, setExpanded] = useState(false);
  const [heightAnim] = useState(new Animated.Value(85));
  
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

  const toggleExpand = () => {
    const newState = !expanded;
    setExpanded(newState);
    Animated.timing(heightAnim, {
      toValue: newState ? 110 : 85,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <TouchableWithoutFeedback onPress={toggleExpand}>
      <Animated.View style={[styles.container, { height: heightAnim }]}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: activeColors.primary,
            tabBarInactiveTintColor: activeColors.textSecondary,
            tabBarStyle: {
              backgroundColor: activeColors.background,
              borderTopColor: activeColors.border,
              height: '100%',
              paddingBottom: 10,
              paddingTop: 10,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
            },
            tabBarLabelStyle: {
              fontSize: expanded ? 12 : 11,
              fontWeight: '500',
              marginTop: 2,
              paddingHorizontal: 2,
              textAlign: 'center',
            },
            tabBarItemStyle: {
              paddingVertical: 4,
              minHeight: expanded ? 90 : 70,
              justifyContent: 'center',
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
            name="route-optimization"
            options={{
              title: "Routes",
              tabBarIcon: ({ color }) => <Navigation color={color} size={20} />,
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
            name="eld-integration"
            options={{
              title: "ELD",
              tabBarIcon: ({ color }) => <Truck color={color} size={20} />,
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
            name="ai-assistant"
            options={{
              title: "Assistant",
              tabBarIcon: ({ color }) => <Bot color={color} size={20} />,
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
            name="pricing"
            options={{
              title: "Pricing",
              tabBarIcon: ({ color }) => <CreditCard color={color} size={20} />,
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
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'visible',
  },
});
