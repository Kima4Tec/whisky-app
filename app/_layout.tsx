import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="reviews"
          options={{
            presentation: "modal",
            title: "Anmeldelser",
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
                <Ionicons
                  name="close"
                  size={24}
                  color={colorScheme === "dark" ? "#fff" : "#000"}
                />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="shops"
          options={{
            presentation: "modal",
            title: "Whiskybutikker",
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
                <Ionicons
                  name="close"
                  size={24}
                  color={colorScheme === "dark" ? "#fff" : "#000"}
                />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="favourites"
          options={{
            presentation: "modal",
            title: "Favoritter",
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
                <Ionicons
                  name="close"
                  size={24}
                  color={colorScheme === "dark" ? "#fff" : "#000"}
                />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="shake-theme"
          options={{
            presentation: "modal",
            title: "Ryst dig til et tema",
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
                <Ionicons
                  name="close"
                  size={24}
                  color={colorScheme === "dark" ? "#fff" : "#000"}
                />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="myReviews"
          options={{
            presentation: "modal",
            title: "Mine anmeldelser",
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
                <Ionicons
                  name="close"
                  size={24}
                  color={colorScheme === "dark" ? "#fff" : "#000"}
                />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="addReview"
          options={{
            title: "Ny anmeldelse",
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={colorScheme === "dark" ? "#fff" : "#000"}
                />
              </Pressable>
            ),
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
