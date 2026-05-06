import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";

const REVIEW_SOURCES = [
  {
    id: "whiskyhuset",
    name: "Whiskyhuset",
    label: "Dansk anmelder",
    description:
      "Grundige, danske whisky-anmeldelser med fokus på nordisk smag og kvalitet.",
    url: "https://whiskyhuset.net/whisky-anmeldelser/",
    flag: "🇩🇰",
    stars: 4,
    accentColor: "#b07d2e",
  },
  {
    id: "whiskyadvocate",
    name: "Whisky Advocate",
    label: "International side",
    description:
      "Verdens største whisky-database med tusindvis af internationale anmeldelser og ratings.",
    url: "https://whiskyadvocate.com/ratings-reviews",
    flag: "🇺🇸",
    stars: 5,
    accentColor: "#d4922a",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <ThemedText style={styles.stars}>
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </ThemedText>
  );
}

export default function ReviewScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.glassIcon}>🥃</ThemedText>
          <ThemedText style={styles.title}>Whiskyanmeldelser</ThemedText>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.subtitle}>UDVALGTE KILDER</ThemedText>
            <View style={styles.dividerLine} />
          </View>
        </View>

        {/* Cards */}
        {REVIEW_SOURCES.map((source) => (
          <Pressable
            key={source.id}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => Linking.openURL(source.url)}
          >
            <View
              style={[
                styles.cardAccent,
                { backgroundColor: source.accentColor },
              ]}
            />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <ThemedText style={styles.flag}>{source.flag}</ThemedText>
                <View>
                  <ThemedText style={styles.cardTitle}>
                    {source.name}
                  </ThemedText>
                  <ThemedText
                    style={[styles.cardLabel, { color: source.accentColor }]}
                  >
                    {source.label}
                  </ThemedText>
                </View>
              </View>
              <StarRating count={source.stars} />
              <ThemedText style={styles.cardDescription}>
                {source.description}
              </ThemedText>
              <ThemedText
                style={[styles.cardLink, { color: source.accentColor }]}
              >
                {source.url.replace("https://", "").split("/")[0]} →
              </ThemedText>
            </View>
          </Pressable>
        ))}

        {/* Info box */}
        <View style={styles.infoBox}>
          <ThemedText style={styles.infoLabel}>OM ANMELDELSER</ThemedText>
          <ThemedText style={styles.infoText}>
            Ratings er subjektive — lad næsen og ganen være den endelige dommer.
          </ThemedText>
        </View>

        <Link href="/" dismissTo style={styles.backLink}>
          <ThemedText style={styles.backText}>← Tilbage til home</ThemedText>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf6ec",
  },
  scroll: {
    padding: 20,
    paddingTop: 48,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  glassIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3b2407",
    letterSpacing: 1.5,
    textAlign: "center",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
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
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#e8d5b0",
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#b07d2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.75,
  },
  cardAccent: {
    width: 5,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    gap: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  flag: {
    fontSize: 30,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3b2407",
  },
  cardLabel: {
    fontSize: 13,
    letterSpacing: 0.5,
  },
  stars: {
    fontSize: 16,
    color: "#c9973a",
    letterSpacing: 2,
  },
  cardDescription: {
    fontSize: 14,
    color: "#7a6040",
    lineHeight: 20,
  },
  cardLink: {
    fontSize: 13,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: "#fdf0db",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e8d5b0",
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
    gap: 6,
  },
  infoLabel: {
    fontSize: 12,
    letterSpacing: 3,
    color: "#b07d2e",
  },
  infoText: {
    fontSize: 13,
    color: "#9a7850",
    textAlign: "center",
    lineHeight: 19,
  },
  backLink: {
    alignSelf: "center",
    paddingVertical: 12,
  },
  backText: {
    color: "#b07d2e",
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
