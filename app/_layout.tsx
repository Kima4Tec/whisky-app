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

  // Stack.Screen kommer fra React Navigation i React Native, og det bruges
  // til at definere de enkelte “skærme” i en stack-navigation
  // (altså en navigation der fungerer som en stak sider)

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="reviews"
          options={{
            presentation: "fullScreenModal",
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
            presentation: "fullScreenModal",
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
            presentation: "fullScreenModal",
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
            presentation: "fullScreenModal",
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
            presentation: "fullScreenModal",
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
            presentation: "fullScreenModal",
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
