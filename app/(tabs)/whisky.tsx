import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

type Distillery = {
  slug: string;
  name: string;
  country: string;
};

const API_BASE =
  Platform.OS === "web"
    ? "/api/distilleries_info/"
    : "https://whiskyhunter.net/api/distilleries_info/";

export default function WhiskyScreen() {
  const [distilleries, setDistilleries] = useState<Distillery[]>([]);

  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data: Distillery[]) => {
        const unique = data.filter(
          (item: Distillery, index: number, self: Distillery[]) =>
            index === self.findIndex((d) => d.slug === item.slug),
        );
        setDistilleries(unique);
      })
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
        <ThemedText type="title" style={styles.title}>
          Whiskydestillerier
        </ThemedText>

        {distilleries.map((item) => (
          <View key={item.slug} style={styles.card}>
            <ThemedText style={styles.name}>{item.name}</ThemedText>
            <ThemedText style={styles.country}>{item.country}</ThemedText>
          </View>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    paddingTop: 26,
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
  },
  card: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e8d5b0",
    gap: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  country: {
    fontSize: 14,
    color: "#9a7850",
  },
});
