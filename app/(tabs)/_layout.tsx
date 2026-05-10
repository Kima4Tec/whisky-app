import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

// Definerer tab-navigationen med tre faner: Home, Explore og Destillerier
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // Aktiv fane farves med temaets tint-farve (lys/mørk tilstand)
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Header skjules — hver skærm styrer selv sin egen header
        headerShown: false,
        // Alle tab-knapper bruger HapticTab for haptisk feedback ved tryk
        tabBarButton: HapticTab,
      }}
    >
      {/* Hjemmeskærm */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="house" color={color} />
          ),
        }}
      />

      {/* Udforsk-skærm */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="paper-plane" color={color} />
          ),
        }}
      />

      {/* Destilleri-oversigt fra api */}
      <Tabs.Screen
        name="whisky"
        options={{
          title: "Destillerier",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="whiskey-glass" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
