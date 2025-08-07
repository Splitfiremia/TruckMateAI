import { Tabs, Redirect, useRouter, usePathname } from "expo-router";
import { 
  BarChart, 
  BookOpen, 
  Home, 
  Receipt, 
  Settings, 
  Users, 
  Shield, 
  Cloud, 
  Zap, 
  Wrench, 
  Navigation, 
  Bot, 
  Truck, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight,
  Gauge,
  Package,
  Route,
  ScanLine,
  CheckCircle2,
  Activity,
  Sun,
  Building2,
  Settings2,
  Sparkles,
  Link,
  DollarSign,
  Clipboard
} from "lucide-react-native";
import React, { useState, useRef, useEffect } from "react";
import { Animated, Platform, TouchableWithoutFeedback, View, Pressable, ScrollView, StyleSheet } from "react-native";

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
  
  // Modern professional color palette
  const navColors = {
    primary: settings.primaryColor || colors.primary,
    secondary: settings.secondaryColor || colors.secondary,
    background: '#FFFFFF', // Clean white background
    backgroundSecondary: '#F8FAFC', // Light gray for depth
    activeBackground: 'rgba(59, 130, 246, 0.08)', // Subtle blue highlight
    activeBorder: '#3B82F6', // Primary blue
    activeGlow: 'rgba(59, 130, 246, 0.2)', // Glow effect
    text: '#1E293B', // Dark text for contrast
    textSecondary: '#64748B', // Muted gray text
    textActive: '#3B82F6', // Blue for active text
    accent: colors.accent,
    shadow: 'rgba(0, 0, 0, 0.08)', // Subtle shadow
    border: 'rgba(148, 163, 184, 0.15)', // Light border
    indicator: '#EF4444', // Red for notifications/alerts
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
        Animated.spring(heightAnim, {
          toValue: 140, // Increased height for better readability
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        })
      ]).start();
    }
  };

  const collapseTabBar = () => {
    // Set a timeout to auto-collapse after 4 seconds for better UX
    collapseTimeoutRef.current = setTimeout(() => {
      if (expanded) {
        setExpanded(false);
        Animated.parallel([
          Animated.spring(heightAnim, {
            toValue: 75, // Slightly taller collapsed state
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.95,
            duration: 250,
            useNativeDriver: false,
          })
        ]).start();
      }
    }, 4000);
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

  // Enhanced tab items with better icons and descriptions
  const tabItems = [
    { route: '/', icon: Gauge, title: 'Dashboard', description: 'Overview' },
    { route: '/logbook', icon: BookOpen, title: 'Logbook', description: 'Hours & Status' },
    { route: '/loads', icon: Package, title: 'Loads', description: 'Cargo Management' },
    { route: '/route-optimization', icon: Route, title: 'Routes', description: 'Navigation' },
    { route: '/receipts', icon: ScanLine, title: 'Receipts', description: 'Expense Tracking' },
    { route: '/compliance', icon: CheckCircle2, title: 'Compliance', description: 'DOT & Safety' },
    { route: '/eld-integration', icon: Activity, title: 'ELD', description: 'Electronic Logs' },
    { route: '/weather', icon: Sun, title: 'Weather', description: 'Conditions' },
    ...(isFleetCompany() ? [{ route: '/fleet', icon: Building2, title: 'Fleet', description: 'Team Management' }] : []),
    { route: '/maintenance', icon: Wrench, title: 'Maintenance', description: 'Vehicle Care' },
    { route: '/ai-assistant', icon: Sparkles, title: 'AI Assist', description: 'Smart Helper' },
    { route: '/integrations', icon: Link, title: 'Integrations', description: 'Connected Apps' },
    { route: '/pricing', icon: DollarSign, title: 'Pricing', description: 'Plans & Billing' },
    { route: '/settings', icon: Settings2, title: 'Settings', description: 'Preferences' },
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
              tabBarIcon: ({ color }) => <BookOpen color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="loads"
            options={{
              title: "Loads",
              tabBarIcon: ({ color }) => <Package color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="route-optimization"
            options={{
              title: "Routes",
              tabBarIcon: ({ color }) => <Route color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="receipts"
            options={{
              title: "Receipts",
              tabBarIcon: ({ color }) => <ScanLine color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="compliance"
            options={{
              title: "Compliance",
              tabBarIcon: ({ color }) => <CheckCircle2 color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="eld-integration"
            options={{
              title: "ELD",
              tabBarIcon: ({ color }) => <Activity color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="weather"
            options={{
              title: "Weather",
              tabBarIcon: ({ color }) => <Sun color={color} size={expanded ? 22 : 20} />,
            }}
          />
          {/* Fleet tab only visible for fleet companies */}
          {isFleetCompany() && (
            <Tabs.Screen
              name="fleet"
              options={{
                title: "Fleet",
                tabBarIcon: ({ color }) => <Building2 color={color} size={expanded ? 22 : 20} />,
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
              tabBarIcon: ({ color }) => <Sparkles color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="integrations"
            options={{
              title: "Integrations",
              tabBarIcon: ({ color }) => <Link color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="pricing"
            options={{
              title: "Pricing",
              tabBarIcon: ({ color }) => <DollarSign color={color} size={expanded ? 22 : 20} />,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: "Settings",
              tabBarIcon: ({ color }) => <Settings2 color={color} size={expanded ? 22 : 20} />,
            }}
          />
        </Tabs>
      
      {/* Modern Enhanced Bottom Navigation */}
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
              paddingBottom: Platform.OS === 'ios' ? 34 : 24,
              paddingTop: expanded ? 24 : 18,
            }
          ]}
        >
          {/* Modern top indicator */}
          <View style={styles.topIndicator} />
          
          {/* Enhanced Navigation Arrows */}
          {showLeftArrow && (
            <View style={[styles.arrowContainer, styles.leftArrow]}>
              <View style={styles.arrowBackground}>
                <ChevronLeft color={navColors.textActive} size={20} strokeWidth={2} />
              </View>
            </View>
          )}

          {showRightArrow && (
            <View style={[styles.arrowContainer, styles.rightArrow]}>
              <View style={styles.arrowBackground}>
                <ChevronRight color={navColors.textActive} size={20} strokeWidth={2} />
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
                paddingHorizontal: showLeftArrow || showRightArrow ? 55 : 24,
                gap: expanded ? 16 : 12,
                minHeight: expanded ? 100 : 75,
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
                      minWidth: expanded ? 90 : 70,
                      paddingHorizontal: expanded ? 16 : 10,
                      paddingVertical: expanded ? 14 : 10,
                      backgroundColor: isActive ? navColors.activeBackground : 'transparent',
                      borderRadius: expanded ? 16 : 12,
                      borderWidth: isActive ? 2 : 0,
                      borderColor: isActive ? navColors.activeBorder : 'transparent',
                      transform: [{ scale: isActive ? 1.02 : 1 }],
                    }
                  ]}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <View style={styles.activeIndicator} />
                  )}
                  
                  <View style={[
                    styles.iconContainer,
                    {
                      backgroundColor: isActive ? navColors.activeGlow : 'transparent',
                      borderRadius: expanded ? 12 : 8,
                      padding: expanded ? 8 : 6,
                      shadowColor: isActive ? navColors.activeBorder : 'transparent',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isActive ? 0.3 : 0,
                      shadowRadius: 4,
                      elevation: isActive ? 3 : 0,
                    }
                  ]}>
                    <IconComponent 
                      color={isActive ? navColors.textActive : navColors.textSecondary}
                      size={expanded ? 24 : 20} 
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </View>
                  
                  <Animated.Text
                    style={[
                      styles.tabText,
                      {
                        fontSize: expanded ? 12 : 10,
                        fontWeight: isActive ? '700' : '600',
                        color: isActive ? navColors.textActive : navColors.textSecondary,
                        marginTop: expanded ? 8 : 4,
                        opacity: expanded ? 1 : 0.95,
                        lineHeight: expanded ? 14 : 12,
                        width: expanded ? 80 : 'auto',
                      }
                    ]}
                    numberOfLines={expanded ? 2 : 1}
                    ellipsizeMode="tail"
                  >
                    {item.title}
                  </Animated.Text>
                  
                  {/* Description text for expanded state */}
                  {expanded && (
                    <Animated.Text
                      style={[
                        styles.descriptionText,
                        {
                          color: isActive ? navColors.textActive : navColors.textSecondary,
                          opacity: 0.7,
                        }
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.description}
                    </Animated.Text>
                  )}
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  topIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  arrowContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  leftArrow: {
    left: 0,
    background: 'linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  rightArrow: {
    right: 0,
    background: 'linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  arrowBackground: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderRadius: 24,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  scrollContent: {
    flexDirection: 'row',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    width: 6,
    height: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    textAlign: 'center',
    letterSpacing: 0.2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  descriptionText: {
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '400',
    marginTop: 2,
    letterSpacing: 0.1,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});
