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

// Ternary operator til API_BASE afhængigt af platform (web eller native).
// Dette gør det muligt for appen at hente data fra det korrekte endpoint,
// uanset om den kører i en webbrowser eller som en native app.
const API_BASE =
  Platform.OS === "web"
    ? "/api/distilleries_info/"
    : "https://whiskyhunter.net/api/distilleries_info/";

export default function WhiskyScreen() {
  // State til at gemme destillerierne i et array af objekter med type Distillery
  const [distilleries, setDistilleries] = useState<Distillery[]>([]);

  //useEffect: kør denne kode når komponenten loader.
  // UseEffect er en React Hook, der bruges til at håndtere sideeffekter i
  // funktionelle komponenter.
  // Den må ikke være async direkte, så jeg laver en intern async funktion og kalder den med det samme.
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(API_BASE);
        // Henter data fra API og parser det som JSON. Forventer at data er et array af objekter, der matcher Distillery-typen.
        const data: Distillery[] = await res.json();

        //Fjern dubletter i data ved at filtrere arrayet, så kun unikke destillerier (baseret på slug) bliver gemt i state.
        //Den looper gennem data-arrayet og sammenligner hvert element med det første element i arrayet, der har samme slug.
        // Hvis det er det samme element, bliver det inkluderet i det nye array (unique), ellers bliver det filtreret fra.
        // Item er det aktuelle element i loopet, index er dets position i arrayet, og self er hele arrayet.
        // index === self.findIndex((d) => d.slug === item.slug) betyder, at kun det første element med en given slug vil blive inkluderet
        // Har forsøgt at fjerne denne filtrering, da den også forekommer i route,
        // men det resulterer i dubletter i state, som så resulterer i dubletter i UI.
        const unique = data.filter(
          (item, index, self) =>
            index === self.findIndex((d) => d.slug === item.slug),
        );

        //opdaterer state
        setDistilleries(unique);
      } catch (err) {
        console.log(err);
      }
    }

    loadData();
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
        {/* map() er måden man “konverterer data → UI”. Map betyder “tag hvert element i et array og lav noget nyt ud af det” */}
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
