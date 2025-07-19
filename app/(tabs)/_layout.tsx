import { Tabs, Redirect, useRouter, usePathname } from "expo-router";
import { BarChart, Clipboard, Home, Receipt, Settings, Users, Shield, Cloud, Zap, Wrench, Navigation, Bot, Truck, CreditCard, ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useState, useRef, useEffect } from "react";
import { Animated, Platform, TouchableWithoutFeedback, View, Text, Pressable, ScrollView, StyleSheet } from "react-native";

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
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current);
      }
    };
  }, []);

  // Redirect to onboarding if not completed
  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }
  
  // Professional color palette for enhanced navigation
  const navColors = {
    primary: settings.primaryColor || colors.primary,
    secondary: settings.secondaryColor || colors.secondary,
    background: '#0F172A', // Sophisticated dark blue-gray
    backgroundGradient: ['#1E293B', '#0F172A'], // Gradient for depth
    activeBackground: 'rgba(59, 130, 246, 0.15)', // Subtle blue glow for active items
    activeBorder: '#3B82F6', // Bright blue for active indicators
    text: '#F8FAFC', // Clean white text
    textSecondary: '#CBD5E1', // Muted text for inactive items
    accent: colors.accent,
    shadow: 'rgba(0, 0, 0, 0.25)', // Enhanced shadow
    border: 'rgba(148, 163, 184, 0.2)', // Subtle border
  };

  const expandTabBar = () => {
    // Clear any existing collapse timeout
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
    
    if (!expanded) {
      setExpanded(true);
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: 120, // Increased height to show full text
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
    // Set a timeout to auto-collapse after 3 seconds
    collapseTimeoutRef.current = setTimeout(() => {
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
    }, 3000);
  };

  const navigateToTab = (route: string) => {
    router.push(route as any);
  };

  const isActiveTab = (route: string) => {
    return pathname === route || pathname.startsWith(route);
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollX = contentOffset.x;
    const maxScrollX = contentSize.width - layoutMeasurement.width;
    
    setShowLeftArrow(scrollX > 10);
    setShowRightArrow(scrollX < maxScrollX - 10);
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
          tabBarActiveTintColor: colors.primary, // Chase blue (#117ACA)
          tabBarInactiveTintColor: '#888888', // Inactive gray for contrast
          tabBarStyle: {
            display: 'none', // Hide default tab bar (using custom expandable nav)
          },
          headerStyle: {
            backgroundColor: colors.background.primary, // Light gray background (#F7F7F7)
          },
          headerTintColor: colors.text.primary, // Primary text color (#333333)
          headerTitleStyle: {
            fontWeight: '600',
            color: colors.text.primary, // Ensure consistent text color
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
      
      {/* Professional Enhanced Bottom Navigation */}
      <TouchableWithoutFeedback
        onPressIn={expandTabBar}
        onPressOut={collapseTabBar}
        onPress={expandTabBar}
      >
        <Animated.View
          style={[
            styles.navigationContainer,
            {
              height: heightAnim,
              opacity: opacityAnim,
              paddingBottom: Platform.OS === 'ios' ? 34 : 20,
              paddingTop: expanded ? 20 : 16,
            }
          ]}
        >
          {/* Gradient overlay for enhanced depth */}
          <View style={styles.gradientOverlay} />
          {/* Enhanced Navigation Arrows */}
          {showLeftArrow && (
            <View style={[styles.arrowContainer, styles.leftArrow]}>
              <View style={styles.arrowBackground}>
                <ChevronLeft color={navColors.text} size={18} strokeWidth={2.5} />
              </View>
            </View>
          )}

          {showRightArrow && (
            <View style={[styles.arrowContainer, styles.rightArrow]}>
              <View style={styles.arrowBackground}>
                <ChevronRight color={navColors.text} size={18} strokeWidth={2.5} />
              </View>
            </View>
          )}

          <Animated.ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={[
              styles.scrollContent,
              {
                alignItems: expanded ? 'flex-start' : 'center',
                paddingHorizontal: showLeftArrow || showRightArrow ? 50 : 20,
                gap: expanded ? 12 : 8,
                minHeight: expanded ? 90 : 60,
              }
            ]}
            style={{ flex: 1 }}
          >
            {tabItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = isActiveTab(item.route);
              
              return (
                <Pressable
                  key={index}
                  onPress={() => navigateToTab(item.route)}
                  style={[
                    styles.tabItem,
                    {
                      minWidth: expanded ? 85 : 65,
                      paddingHorizontal: expanded ? 14 : 8,
                      paddingVertical: expanded ? 12 : 8,
                      backgroundColor: isActive ? navColors.activeBackground : 'transparent',
                      borderRadius: expanded ? 12 : 8,
                      borderWidth: isActive ? 1 : 0,
                      borderColor: isActive ? navColors.activeBorder : 'transparent',
                    }
                  ]}
                >
                  <View style={[
                    styles.iconContainer,
                    {
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      borderRadius: expanded ? 8 : 6,
                      padding: expanded ? 6 : 4,
                    }
                  ]}>
                    <IconComponent 
                      color={isActive ? navColors.activeBorder : navColors.textSecondary}
                      size={expanded ? 22 : 18} 
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </View>
                  <Animated.Text
                    style={[
                      styles.tabText,
                      {
                        fontSize: expanded ? 11 : 9,
                        fontWeight: isActive ? '600' : '500',
                        color: isActive ? navColors.text : navColors.textSecondary,
                        marginTop: expanded ? 6 : 3,
                        opacity: expanded ? 1 : 0.9,
                        lineHeight: expanded ? 13 : 11,
                        width: expanded ? 75 : 'auto',
                      }
                    ]}
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

const styles = StyleSheet.create({
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.3)',
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.4)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  arrowContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  leftArrow: {
    left: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  rightArrow: {
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  arrowBackground: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    flexDirection: 'row',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tabText: {
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
