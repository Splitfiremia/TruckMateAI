import { Tabs, Redirect, useRouter, usePathname } from "expo-router";
import { BarChart, Clipboard, Home, Receipt, Settings, Users, Shield, Cloud, Zap, Wrench, Navigation, Bot, Truck, CreditCard } from "lucide-react-native";
import React, { useState, useRef } from "react";
import { Animated, Platform, TouchableWithoutFeedback, View, Text, Pressable, ScrollView } from "react-native";

import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/userStore";
import { useBrandingStore } from "@/store/brandingStore";

export default function TabLayout() {
  const { isOnboarded, isOwnerOperator, isFleetCompany } = useUserStore();
  const { settings } = useBrandingStore();
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;
  
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

  const expandTabBar = () => {
    if (!expanded) {
      setExpanded(true);
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: 140,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        })
      ]).start();
    }
  };

  const collapseTabBar = () => {
    if (expanded) {
      setExpanded(false);
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: 60,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: false,
        })
      ]).start();
    }
  };

  const navigateToTab = (route: string) => {
    router.push(route as any);
  };

  const isActiveTab = (route: string) => {
    return pathname === route || pathname.startsWith(route);
  };

  const tabItems = [
    { route: '/', icon: Home, title: 'Dashboard' },
    { route: '/logbook', icon: Clipboard, title: 'Logbook' },
    { route: '/loads', icon: BarChart, title: 'Loads' },
    { route: '/route-optimization', icon: Navigation, title: 'Routes' },
    { route: '/receipts', icon: Receipt, title: 'Receipts' },
    { route: '/compliance', icon: Shield, title: 'Compliance' },
    { route: '/eld-integration', icon: Truck, title: 'ELD' },
    { route: '/weather', icon: Cloud, title: 'Weather' },
    ...(isFleetCompany() ? [{ route: '/fleet', icon: Users, title: 'Fleet' }] : []),
    { route: '/maintenance', icon: Wrench, title: 'Maintenance' },
    { route: '/ai-assistant', icon: Bot, title: 'Assistant' },
    { route: '/integrations', icon: Zap, title: 'Integrations' },
    { route: '/pricing', icon: CreditCard, title: 'Pricing' },
    { route: '/settings', icon: Settings, title: 'Settings' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: activeColors.primary,
          tabBarInactiveTintColor: activeColors.textSecondary,
          tabBarStyle: {
            display: 'none', // Hide default tab bar
          },
          headerStyle: {
            backgroundColor: activeColors.background,
          },
          headerTintColor: activeColors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            paddingBottom: Platform.OS === 'ios' ? 110 : 100, // Add padding for custom nav bar
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
      
      {/* Custom Expandable Bottom Navigation */}
      <TouchableWithoutFeedback
        onPressIn={expandTabBar}
        onPressOut={collapseTabBar}
      >
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: heightAnim,
            backgroundColor: activeColors.background,
            borderTopColor: activeColors.border,
            borderTopWidth: 1,
            paddingBottom: Platform.OS === 'ios' ? 25 : 15,
            paddingTop: 12,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            opacity: opacityAnim,
          }}
        >
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              gap: 4,
            }}
            style={{ flex: 1 }}
          >
            {tabItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = isActiveTab(item.route);
              
              return (
                <Pressable
                  key={index}
                  onPress={() => navigateToTab(item.route)}
                  style={{
                    alignItems: 'center',
                    minWidth: expanded ? 85 : 70,
                    paddingHorizontal: expanded ? 10 : 6,
                    paddingVertical: 6,
                  }}
                >
                  <IconComponent 
                    color={isActive ? activeColors.primary : activeColors.textSecondary} 
                    size={expanded ? 22 : 16} 
                  />
                  <Animated.Text
                    style={{
                      fontSize: expanded ? 11 : 9,
                      fontWeight: '500',
                      color: isActive ? activeColors.primary : activeColors.textSecondary,
                      marginTop: expanded ? 6 : 2,
                      textAlign: 'center',
                      opacity: expanded ? 1 : 0.8,
                      lineHeight: expanded ? 13 : 12,
                    }}
                    numberOfLines={expanded ? 2 : 1}
                    ellipsizeMode="tail"
                  >
                    {item.title}
                  </Animated.Text>
                </Pressable>
              );
            })}
          </Animated.ScrollView>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}
