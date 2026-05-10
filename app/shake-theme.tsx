import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

// Accelerometer importeres kun én gang øverst – undgår Pedometer-fejl
import { Accelerometer } from "expo-sensors";

// ─── Temaer ───────────────────────────────────────────────────────────────────

interface WhiskyTheme {
  id: string;
  title: string;
  emoji: string;
  description: string;
  suggestions: string[];
  accentColor: string;
  bgColor: string;
}

const THEMES: WhiskyTheme[] = [
  {
    id: "smoky",
    title: "Røget aften",
    emoji: "💨",
    description:
      "En aften dedikeret til de tunge, tørverøgede dråber fra Skotlands vestkyst.",
    suggestions: [
      "Lagavulin 16",
      "Ardbeg 10",
      "Laphroaig Quarter Cask",
      "Caol Ila 12",
    ],
    accentColor: "#4a3a2a",
    bgColor: "#f5ede0",
  },
  {
    id: "islay",
    title: "Islay Whisky",
    emoji: "🏝️",
    description:
      "Direkte fra Skotlands mest ikoniske whisky-ø — salte, røgede og komplekse.",
    suggestions: [
      "Bowmore 12",
      "Bruichladdich Classic Laddie",
      "Kilchoman Machir Bay",
      "Bunnahabhain 12",
    ],
    accentColor: "#2a4a5a",
    bgColor: "#e8f0f5",
  },
  {
    id: "scottish",
    title: "Skotsk Whisky",
    emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    description:
      "En klassisk skotsk aften med det bedste fra Highland, Speyside og Lowland.",
    suggestions: [
      "Glenfiddich 18",
      "Macallan 12",
      "Highland Park 18",
      "Oban 14",
    ],
    accentColor: "#3a2a5a",
    bgColor: "#ede8f5",
  },
  {
    id: "blended",
    title: "Blended Whisky",
    emoji: "🔀",
    description:
      "Mesterblenderens kunst — harmoniske og tilgængelige whiskyer for alle.",
    suggestions: [
      "Johnnie Walker Black Label",
      "Chivas Regal 12",
      "Monkey Shoulder",
      "Famous Grouse",
    ],
    accentColor: "#5a3a1a",
    bgColor: "#f5ede0",
  },
  {
    id: "singlemalt",
    title: "Single Malt",
    emoji: "🌾",
    description:
      "Ét destilleri, ét korn, uendelig kompleksitet. Den pureste whiskyoplevelse.",
    suggestions: [
      "Glenfarclas 15",
      "Springbank 10",
      "GlenDronach 12",
      "Aberlour A'Bunadh",
    ],
    accentColor: "#5a4a1a",
    bgColor: "#fdf5e0",
  },
  {
    id: "japanese",
    title: "Japansk Blended",
    emoji: "🗾",
    description:
      "Japansk præcision og elegance — floral, frugtig og forfinet til perfektion.",
    suggestions: [
      "Suntory Toki",
      "Nikka From the Barrel",
      "Hibiki Harmony",
      "Yamazaki 12",
    ],
    accentColor: "#5a1a2a",
    bgColor: "#f5e8ea",
  },
  {
    id: "nonscottish",
    title: "Ikke-skotsk Whisky",
    emoji: "🌍",
    description:
      "Verden er større end Skotland — udforsk irsk, amerikansk og canadisk whisky.",
    suggestions: [
      "Redbreast 12 (Irsk)",
      "Buffalo Trace (Bourbon)",
      "Crown Royal (Canadisk)",
      "Tullamore D.E.W.",
    ],
    accentColor: "#1a4a2a",
    bgColor: "#e8f5ec",
  },
  {
    id: "nordic",
    title: "Nordisk Whisky",
    emoji: "🌲",
    description:
      "Fra de nordiske skove og fjorde — frisk, urteagtig og overraskende kompleks.",
    suggestions: [
      "Stauning KAOS (DK)",
      "Mackmyra Svensk Rök (SE)",
      "Teerenpeli (FI)",
      "Thy Whisky (DK)",
    ],
    accentColor: "#1a3a4a",
    bgColor: "#e8f0f5",
  },
];

// ─── Ryst-hook ────────────────────────────────────────────────────────────────

const SHAKE_THRESHOLD = 1.8;
const SHAKE_COOLDOWN = 1200;

function useShakeDetector(onShake: () => void) {
  const lastShake = useRef(0);
  const onShakeRef = useRef(onShake);

  // Hold callback opdateret uden at genstarte subscription
  useEffect(() => {
    onShakeRef.current = onShake;
  }, [onShake]);

  useEffect(() => {
    let subscription: ReturnType<typeof Accelerometer.addListener> | null =
      null;

    const start = async () => {
      try {
        // Tjek tilgængelighed før subscribe (undgår Pedometer-fejl på iOS)
        const available = await Accelerometer.isAvailableAsync();
        if (!available) return;

        Accelerometer.setUpdateInterval(100);
        subscription = Accelerometer.addListener(({ x, y, z }) => {
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          const now = Date.now();
          if (
            magnitude > SHAKE_THRESHOLD &&
            now - lastShake.current > SHAKE_COOLDOWN
          ) {
            lastShake.current = now;
            onShakeRef.current();
          }
        });
      } catch (e) {
        // Sensor ikke tilgængelig på denne enhed — silent fail, knappen virker stadig
        console.warn("Accelerometer ikke tilgængeligt:", e);
      }
    };

    start();
    return () => {
      subscription?.remove();
    };
  }, []); // Tom dependency array — starter kun én gang
}

// ─── Tema-kort ────────────────────────────────────────────────────────────────

function ThemeCard({ theme }: { theme: WhiskyTheme }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    spinAnim.setValue(0);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [theme.id]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.themeCard,
        { borderColor: theme.accentColor, backgroundColor: theme.bgColor },
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View
        style={[
          styles.themeCardAccentTop,
          { backgroundColor: theme.accentColor },
        ]}
      />

      <View style={styles.themeCardInner}>
        <Animated.Text
          style={[styles.themeEmoji, { transform: [{ rotate: spin }] }]}
        >
          {theme.emoji}
        </Animated.Text>

        <ThemedText style={[styles.themeTitle, { color: theme.accentColor }]}>
          {theme.title}
        </ThemedText>
        <ThemedText style={styles.themeDescription}>
          {theme.description}
        </ThemedText>

        <View style={styles.dividerRow}>
          <View
            style={[styles.dividerLine, { backgroundColor: theme.accentColor }]}
          />
          <ThemedText
            style={[styles.dividerLabel, { color: theme.accentColor }]}
          >
            PRØV DISSE
          </ThemedText>
          <View
            style={[styles.dividerLine, { backgroundColor: theme.accentColor }]}
          />
        </View>

        {theme.suggestions.map((s) => (
          <View
            key={s}
            style={[
              styles.suggestionRow,
              { borderColor: theme.accentColor + "40" },
            ]}
          >
            <View
              style={[
                styles.suggestionDot,
                { backgroundColor: theme.accentColor },
              ]}
            />
            <ThemedText style={styles.suggestionText}>{s}</ThemedText>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

// ─── Hoved-skærm ──────────────────────────────────────────────────────────────

export default function ShakeThemeScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [currentTheme, setCurrentTheme] = useState<WhiskyTheme | null>(null);
  const [shakeCount, setShakeCount] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const pickRandomTheme = useCallback(() => {
    setCurrentTheme((prev) => {
      const pool = prev ? THEMES.filter((t) => t.id !== prev.id) : THEMES;
      return pool[Math.floor(Math.random() * pool.length)];
    });
    setShakeCount((n) => n + 1);

    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.4,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pulseAnim]);

  useShakeDetector(pickRandomTheme);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          isLandscape && styles.scrollLandscape,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.glassIcon}>🥃</ThemedText>
          <ThemedText style={styles.title}>Aftenens Tema</ThemedText>
          <View style={styles.headerDividerRow}>
            <View style={styles.headerDividerLine} />
            <ThemedText style={styles.headerSubtitle}>
              RYST FOR ET TILFÆLDIGT TEMA
            </ThemedText>
            <View style={styles.headerDividerLine} />
          </View>
        </View>

        {/* Ryst-indikator */}
        <View style={styles.shakeHint}>
          <Animated.Text
            style={[styles.shakeIcon, { transform: [{ scale: pulseAnim }] }]}
          >
            📱
          </Animated.Text>
          <ThemedText style={styles.shakeHintText}>
            {shakeCount === 0
              ? "Ryst din telefon for at få et tema!"
              : `Tema trukket ${shakeCount} ${shakeCount === 1 ? "gang" : "gange"} — ryst igen for et nyt!`}
          </ThemedText>
        </View>

        {/* Manuel knap */}
        <Pressable
          style={({ pressed }) => [
            styles.manualBtn,
            pressed && { opacity: 0.75 },
          ]}
          onPress={pickRandomTheme}
        >
          <ThemedText style={styles.manualBtnText}>
            🎲 Træk tilfældigt tema
          </ThemedText>
        </Pressable>

        {/* Tema-kort */}
        {currentTheme && <ThemeCard theme={currentTheme} />}

        {/* Oversigt når intet tema er valgt */}
        {!currentTheme && (
          <View style={styles.infoBox}>
            <ThemedText style={styles.infoLabel}>MULIGE TEMAER</ThemedText>
            {THEMES.map((t) => (
              <ThemedText key={t.id} style={styles.infoThemeRow}>
                {t.emoji}
                {"  "}
                {t.title}
              </ThemedText>
            ))}
          </View>
        )}

        <Link href="/" dismissTo style={styles.backLink}>
          <ThemedText style={styles.backText}>← Tilbage til home</ThemedText>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf6ec" },
  scroll: { padding: 20, paddingTop: 48, paddingBottom: 40 },
  scrollLandscape: { paddingTop: 24 },

  header: { alignItems: "center", marginBottom: 24 },
  glassIcon: { fontSize: 24, marginBottom: 8 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3b2407",
    letterSpacing: 1.5,
    textAlign: "center",
  },
  headerDividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
    width: "100%",
  },
  headerDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#b07d2e",
    opacity: 0.5,
  },
  headerSubtitle: { fontSize: 11, letterSpacing: 2.5, color: "#b07d2e" },

  shakeHint: { alignItems: "center", marginBottom: 16, gap: 8 },
  shakeIcon: { fontSize: 40 },
  shakeHintText: {
    fontSize: 14,
    color: "#9a7850",
    textAlign: "center",
    lineHeight: 20,
  },

  manualBtn: {
    alignSelf: "center",
    backgroundColor: "#fdf0db",
    borderWidth: 1.5,
    borderColor: "#b07d2e",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginBottom: 24,
  },
  manualBtnText: {
    color: "#b07d2e",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  themeCard: {
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  themeCardAccentTop: { height: 6 },
  themeCardInner: { padding: 24, alignItems: "center", gap: 10 },
  themeEmoji: { fontSize: 56, marginBottom: 4 },
  themeTitle: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 1,
    textAlign: "center",
  },
  themeDescription: {
    fontSize: 14,
    color: "#7a6040",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 4,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    marginVertical: 4,
  },
  dividerLine: { flex: 1, height: 1, opacity: 0.4 },
  dividerLabel: { fontSize: 11, letterSpacing: 2.5 },

  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    paddingVertical: 7,
    borderBottomWidth: 1,
  },
  suggestionDot: { width: 6, height: 6, borderRadius: 3 },
  suggestionText: { fontSize: 14, color: "#3b2407", flex: 1 },

  infoBox: {
    backgroundColor: "#fdf0db",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e8d5b0",
    padding: 16,
    marginBottom: 24,
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    letterSpacing: 3,
    color: "#b07d2e",
    textAlign: "center",
    marginBottom: 4,
  },
  infoThemeRow: { fontSize: 14, color: "#7a6040", paddingVertical: 2 },

  backLink: { alignSelf: "center", paddingVertical: 12 },
  backText: { color: "#b07d2e", fontSize: 15, letterSpacing: 0.5 },
});
