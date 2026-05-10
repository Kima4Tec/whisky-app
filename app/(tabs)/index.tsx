import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Wave } from "@/components/wave";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/homelogo.png")}
          style={styles.reactLogo}
          contentFit="cover"
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Whisky!</ThemedText>
        <Wave />
      </ThemedView>

      {/* Distilleries */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Whiskydestillerier</ThemedText>
        <ThemedText>
          Tryk på destillerier-knappen for at se en omfattende liste over
          whiskydestillerier hentet fra
          https://whiskyhunter.net/api/distilleries_info/{" "}
        </ThemedText>
      </ThemedView>
      {/* Explore */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Klubber og events </ThemedText>
        <ThemedText>
          {`Tryk på explore-knappen for at finde danske whiskyklubber, events og meget mere.`}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}></ThemedView>
      <ThemedView style={styles.stepContainer}></ThemedView>
      <View style={styles.dividerLine} />
      <ThemedText style={styles.subtitle}>SPÆNDENDE LINKS</ThemedText>
      <View style={styles.dividerLine} />

      {/* Reviews */}
      <Link href="/reviews" asChild>
        <Pressable style={styles.card}>
          <ThemedView style={styles.row}>
            <ThemedText type="subtitle">Anmeldelser</ThemedText>

            <Ionicons name="chevron-forward" size={20} color="#888" />
          </ThemedView>

          <ThemedText>
            Her kan du finde links til forskellige anmeldelser af whisky.
          </ThemedText>
        </Pressable>
      </Link>

      <Link href="/myReviews" asChild>
        <Pressable style={styles.card}>
          <ThemedView style={styles.row}>
            <ThemedText type="subtitle">Mine anmeldelser</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </ThemedView>
          <ThemedText>Skriv og gem dine egne whisky-anmeldelser.</ThemedText>
        </Pressable>
      </Link>

      {/* Shops*/}
      <Link href="/shops" asChild>
        <Pressable style={styles.card}>
          <ThemedView style={styles.row}>
            <ThemedText type="subtitle">Whisky-butikker</ThemedText>

            <Ionicons name="chevron-forward" size={20} color="#888" />
          </ThemedView>

          <ThemedText>
            Danske butikker på internettet, hvor du kan bestille whisky.
          </ThemedText>
        </Pressable>
      </Link>
      {/* Favourites */}
      <Link href="/favourites" asChild>
        <Pressable style={styles.card}>
          <ThemedView style={styles.row}>
            <ThemedText type="subtitle">Favoritwhisky</ThemedText>

            <Ionicons name="chevron-forward" size={20} color="#888" />
          </ThemedView>

          <ThemedText>Her kan du stemme på din favoritwhisky.</ThemedText>
        </Pressable>
      </Link>
      {/* Shake Theme  */}
      <Link href="/shake-theme" asChild>
        <Pressable style={styles.card}>
          <ThemedView style={styles.row}>
            <ThemedText type="subtitle">Aftenens tema</ThemedText>

            <Ionicons name="chevron-forward" size={20} color="#888" />
          </ThemedView>

          <ThemedText>
            Ryst din telefon og få et tilfældigt tema til whiskyaftenen — røget,
            nordisk, japansk og meget mere.
          </ThemedText>
        </Pressable>
      </Link>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#b07d2e",
    opacity: 0.5,
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 3,
    color: "#b07d2e",
  },
});
