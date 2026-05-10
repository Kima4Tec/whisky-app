import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";

type Shop = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  emoji: string;
  accentColor: string;
  tags?: string[];
};

const FLAGSHIP: Shop[] = [
  {
    id: "juuls",
    name: "Juul's Vin & Spiritus",
    tagline: "En af de største i Norden · Fysisk + webshop",
    description:
      "+1400 flasker whisky og rom · Eksklusive aftapninger · Stort udvalg",
    url: "https://juuls.dk",
    emoji: "🍾",
    accentColor: "#b07d2e",
    tags: ["Fysisk butik", "Webshop"],
  },
  {
    id: "whiskydk",
    name: "Whisky.dk",
    tagline: "Danmarks største whiskyshop · Smagninger & events",
    description: "Independent bottlers · Bredt udvalg · Arrangementer",
    url: "https://whisky.dk",
    emoji: "🏆",
    accentColor: "#d4922a",
    tags: ["Webshop"],
  },
];

const SERIOUS: Shop[] = [
  {
    id: "sprit",
    name: "Sprit & Co",
    tagline: "Importør & distributør",
    description: "Mange specialflasker og nicheprodukter · Bredt netværk",
    url: "https://spritogco.dk",
    emoji: "🌿",
    accentColor: "#7aab6e",
  },
  {
    id: "hjhansen",
    name: "H.J. Hansen Vin",
    tagline: "Vin & spiritus · Stor whisky-sektion",
    description: "Etableret dansk forhandler · God bredde i udvalget",
    url: "https://hjhansen.dk",
    emoji: "🏛️",
    accentColor: "#6b9abf",
  },
  {
    id: "theis",
    name: "Theis Vine",
    tagline: "Mest vin, noget whisky",
    description: "Mainstream udvalg til den brede forbruger",
    url: "https://theisvine.dk",
    emoji: "🍷",
    accentColor: "#c4956a",
  },
  {
    id: "vinoble",
    name: "Vinoble",
    tagline: "Kæde med webshop",
    description: "Varierende whisky-udvalg · Tilgængeligt",
    url: "https://vinoble.dk",
    emoji: "🏪",
    accentColor: "#a47bbf",
  },
];

const NICHE: Shop[] = [
  {
    id: "rombo",
    name: "Rombo",
    tagline: "Rom + whisky",
    description: "Lille, kurateret udvalg til den kræsne",
    url: "https://rombo.dk",
    emoji: "🌴",
    accentColor: "#d4922a",
  },
  {
    id: "densidstedraabe",
    name: "Den Sidste Dråbe",
    tagline: "Connoisseur vibe",
    description: "Kvalitetsflasker til den seriøse samler",
    url: "https://densidstedraabe.dk",
    emoji: "💎",
    accentColor: "#b07d2e",
  },
  {
    id: "shoppencph",
    name: "Shoppen CPH",
    tagline: "Special spiritus · København",
    description: "Spændende, kureret udvalg af special spiritus",
    url: "https://shoppencph.dk",
    emoji: "🏙️",
    accentColor: "#5b8c7a",
  },
];

function ShopCard({
  shop,
  compact = false,
}: {
  shop: Shop;
  compact?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => Linking.openURL(shop.url)}
    >
      <View
        style={[styles.cardAccent, { backgroundColor: shop.accentColor }]}
      />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <ThemedText style={compact ? styles.emojiSm : styles.emoji}>
            {shop.emoji}
          </ThemedText>
          <View style={{ flex: 1 }}>
            <ThemedText style={compact ? styles.cardTitleSm : styles.cardTitle}>
              {shop.name}
            </ThemedText>
            <ThemedText
              style={[styles.cardTagline, { color: shop.accentColor }]}
            >
              {shop.tagline}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={styles.cardDescription}>
          {shop.description}
        </ThemedText>
        {shop.tags && (
          <View style={styles.tagsRow}>
            {shop.tags.map((t) => (
              <View key={t} style={styles.tag}>
                <ThemedText style={styles.tagText}>{t}</ThemedText>
              </View>
            ))}
          </View>
        )}
        <ThemedText style={[styles.cardLink, { color: shop.accentColor }]}>
          {shop.url.replace("https://", "")} →
        </ThemedText>
      </View>
    </Pressable>
  );
}

function SectionHeader({ emoji, label }: { emoji: string; label: string }) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionEmoji}>{emoji}</ThemedText>
      <ThemedText style={styles.sectionLabel}>{label}</ThemedText>
      <View style={styles.sectionLine} />
    </View>
  );
}

export default function ShopsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText style={styles.headerIcon}>🛍️</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Whiskybutikker
          </ThemedText>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.subtitle}>DANMARKS BEDSTE</ThemedText>
            <View style={styles.dividerLine} />
          </View>
        </View>

        <SectionHeader emoji="⭐" label="FLAGSKIBE" />
        {FLAGSHIP.map((s) => (
          <ShopCard key={s.id} shop={s} />
        ))}

        <SectionHeader emoji="🧠" label="SERIØSE WEBSHOPS" />
        {SERIOUS.map((s) => (
          <ShopCard key={s.id} shop={s} compact />
        ))}

        <SectionHeader emoji="🥃" label="NICHE & SPECIALISTER" />
        {NICHE.map((s) => (
          <ShopCard key={s.id} shop={s} compact />
        ))}

        <Link href="/" dismissTo style={styles.backLink}>
          <ThemedText type="link" style={styles.backText}>
            ← Tilbage til home
          </ThemedText>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf6ec" },
  scroll: { padding: 20, paddingTop: 48, paddingBottom: 40 },

  header: { alignItems: "center", marginBottom: 24 },
  headerIcon: { fontSize: 24, marginBottom: 8 },
  title: { color: "#3b2407", letterSpacing: 1.5, fontSize: 24 },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#b07d2e", opacity: 0.5 },
  subtitle: { fontSize: 12, letterSpacing: 3, color: "#b07d2e" },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionEmoji: { fontSize: 15 },
  sectionLabel: { fontSize: 12, letterSpacing: 2.5, color: "#b07d2e" },
  sectionLine: { flex: 1, height: 1, backgroundColor: "#e8d5b0" },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#e8d5b0",
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#b07d2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  cardPressed: { opacity: 0.75 },
  cardAccent: { width: 5 },
  cardContent: { flex: 1, padding: 14, gap: 6 },

  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  emoji: { fontSize: 28 },
  emojiSm: { fontSize: 24 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#3b2407" },
  cardTitleSm: { fontSize: 16, fontWeight: "700", color: "#3b2407" },
  cardTagline: { fontSize: 13 },
  cardDescription: { fontSize: 14, color: "#7a6040", lineHeight: 20 },

  tagsRow: { flexDirection: "row", gap: 6, marginTop: 2 },
  tag: {
    backgroundColor: "#fdf0db",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e8d5b0",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { fontSize: 12, color: "#9a7850" },

  cardLink: { fontSize: 13, letterSpacing: 0.5, marginTop: 2 },

  backLink: { alignSelf: "center", paddingVertical: 16 },
  backText: { fontSize: 15, letterSpacing: 0.5 },
});
