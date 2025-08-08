import { Tabs, Redirect, router } from "expo-router";
import { 
  BookOpen, 
  Home, 
  Package,
  Route as RouteIcon,
  ScanLine,
  CheckCircle2,
  Activity,
  Sun,
  Building2,
  Settings2,
  Sparkles,
  Link as LinkIcon,
  DollarSign,
  Wrench,
  ArrowLeft
} from "lucide-react-native";
import React from "react";
import { View, Pressable } from "react-native";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/userStore";

export default function TabLayout() {
  const { isOnboarded, isOwnerOperator, isFleetCompany } = useUserStore();

  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: true,
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
          tabBarStyle: { display: 'none' },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#888888',
          headerLeft: () =>
            route.name === "index" ? null : (
              <Pressable
                onPress={() => {
                  try {
                    router.replace("/(tabs)");
                  } catch (e) {
                    console.log("Header back press error", e);
                  }
                }}
                style={{ paddingHorizontal: 12, paddingVertical: 8 }}
                accessibilityLabel="Go back"
                testID="header-back-button"
              >
                <ArrowLeft color={colors.text.primary} size={22} />
              </Pressable>
            ),
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: "Dashboard",
            tabBarIcon: ({ color }) => <Home color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="logbook"
          options={{
            title: "Logbook",
            tabBarIcon: ({ color }) => <BookOpen color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="loads"
          options={{
            title: "Loads",
            tabBarIcon: ({ color }) => <Package color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="route-optimization"
          options={{
            title: "Routes",
            tabBarIcon: ({ color }) => <RouteIcon color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="receipts"
          options={{
            title: "Receipts",
            tabBarIcon: ({ color }) => <ScanLine color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="compliance"
          options={{
            title: "Compliance",
            tabBarIcon: ({ color }) => <CheckCircle2 color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="eld-integration"
          options={{
            title: "ELD",
            tabBarIcon: ({ color }) => <Activity color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="weather"
          options={{
            title: "Weather",
            tabBarIcon: ({ color }) => <Sun color={color} size={20} />,
          }}
        />
        {isFleetCompany() && (
          <Tabs.Screen
            name="fleet"
            options={{
              title: "Fleet",
              tabBarIcon: ({ color }) => <Building2 color={color} size={20} />,
            }}
          />
        )}
        {isOwnerOperator() && (
          <Tabs.Screen name="fleet" options={{ href: null }} />
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
            tabBarIcon: ({ color }) => <Sparkles color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="integrations"
          options={{
            title: "Integrations",
            tabBarIcon: ({ color }) => <LinkIcon color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="pricing"
          options={{
            title: "Pricing",
            tabBarIcon: ({ color }) => <DollarSign color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => <Settings2 color={color} size={20} />,
          }}
        />
      </Tabs>
    </View>
  );
}
