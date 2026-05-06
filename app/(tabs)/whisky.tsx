import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";

type Distillery = {
  slug: string;
  name: string;
  country: string;
};

const API_BASE =
  Platform.OS === "web" && __DEV__
    ? "" // relative URL — Expo dev server handles it
    : "https://whiskyhunter.net/api";

export default function WhiskyScreen() {
  const [distilleries, setDistilleries] = useState<Distillery[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/distilleries_info/`)
      .then((res) => res.json())
      .then((data: Distillery[]) => setDistilleries(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/homelogoOLD.png")}
          style={styles.reactLogo}
          contentFit="cover"
        />
      }
    >
      <ThemedView style={styles.container}>
        <View>
          <Text style={{ fontSize: 32, fontWeight: "bold" }}>
            Whiskydestillerier
          </Text>

          <FlatList
            data={distilleries}
            keyExtractor={(item) => item.slug}
            renderItem={({ item }) => (
              <View>
                <Text> </Text>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {item.name}
                </Text>
                <Text>{item.country}</Text>
              </View>
            )}
          />
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 26,
    paddingLeft: 42,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  card: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  reactLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
