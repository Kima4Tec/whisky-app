import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

const SCORES = Array.from({ length: 26 }, (_, i) => i); // 0–25

type ScoreFieldProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  isDark: boolean;
};
// Point slider component, der viser en række prikker som brugeren kan trykke på for at sætte score.
function ScoreField({ label, value, onChange, isDark }: ScoreFieldProps) {
  return (
    <View style={styles.scoreBlock}>
      <View style={styles.scoreLabelRow}>
        <ThemedText style={styles.scoreLabel}>{label}</ThemedText>
        <View style={styles.scoreBadge}>
          <ThemedText style={styles.scoreBadgeText}>{value}</ThemedText>
        </View>
      </View>
      <View style={styles.sliderRow}>
        {/* looper gennem SCORES-arrayet og laver en Pressable for hver score (0–25). 
        Når en prik trykkes, opdateres scoren via onChange-funktionen. 
        Prikkernes farve ændres afhængigt af om de er under eller lig med den aktuelle score, 
        og der bruges forskellige farver for højere scores. */}
        {SCORES.map((s) => (
          <Pressable
            key={s}
            onPress={() => onChange(s)}
            style={[
              styles.sliderDot,
              {
                backgroundColor:
                  s <= value
                    ? s >= 20
                      ? "#b07d2e"
                      : s >= 10
                        ? "#c9973e"
                        : "#ddb96a"
                    : isDark
                      ? "#333"
                      : "#e0e0e0",
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.sliderLabels}>
        <ThemedText style={styles.sliderLabelText}>0</ThemedText>
        <ThemedText style={styles.sliderLabelText}>25</ThemedText>
      </View>
    </View>
  );
}

export default function AddReviewScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [name, setName] = useState("");
  const [naese, setNaese] = useState(12);
  const [smag, setSmag] = useState(12);
  const [balance, setBalance] = useState(12);
  const [afslutning, setAfslutning] = useState(12);
  const [noter, setNoter] = useState("");

  const total = naese + smag + balance + afslutning;

  // Data gemmes via AsyncStorage, der er en lokal lagringsløsning i React Native, som bruges til at gemme data direkte på brugerens enhed.
  async function handleSave() {
    // Tjekker at brugeren har indtastet et navn
    if (!name.trim()) {
      Alert.alert("Manglende navn", "Angiv whiskyens navn for at gemme.");
      return;
    }
    // Opretter review-objektet som skal gemmes i AsyncStorage. ID genereres ud fra timestamp, og dato gemmes i ISO-format.
    const review = {
      id: Date.now().toString(),
      name: name.trim(),
      naese,
      smag,
      balance,
      afslutning,
      noter: noter.trim(),
      total,
      date: new Date().toISOString(),
    };
    try {
      // Henter eksisterende reviews fra AsyncStorage
      const existing = await AsyncStorage.getItem("whisky_reviews");
      // Parser listen eller starter en ny tom liste
      const list = existing ? JSON.parse(existing) : [];
      // Tilføjer den nye review i starten af listen (nyeste først)
      list.unshift(review);
      // Gemmer den opdaterede liste tilbage i AsyncStorage
      await AsyncStorage.setItem("whisky_reviews", JSON.stringify(list));
      // Går tilbage til forrige screen efter succes
      router.back();
    } catch {
      // Viser fejl hvis noget går galt under gemning
      Alert.alert("Fejl", "Kunne ikke gemme anmeldelsen.");
    }
  }

  const inputStyle = [
    styles.input,
    {
      backgroundColor: isDark ? "#1a1a1a" : "#fafafa",
      borderColor: isDark ? "#333" : "#e0e0e0",
      color: isDark ? "#fff" : "#111",
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: isDark ? "#111" : "#f5f0eb" }}
        contentContainerStyle={styles.container}
      >
        {/* Whisky name */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.label}>Whiskyens navn</ThemedText>
          <TextInput
            style={inputStyle}
            placeholder="f.eks. Laphroaig 10 Year"
            placeholderTextColor={isDark ? "#555" : "#aaa"}
            value={name}
            onChangeText={setName}
          />
        </ThemedView>

        {/* Score fields */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>KARAKTERER</ThemedText>
          <ScoreField
            label="Næse"
            value={naese}
            onChange={setNaese}
            isDark={isDark}
          />
          <ScoreField
            label="Smag"
            value={smag}
            onChange={setSmag}
            isDark={isDark}
          />
          <ScoreField
            label="Balance"
            value={balance}
            onChange={setBalance}
            isDark={isDark}
          />
          <ScoreField
            label="Afslutning"
            value={afslutning}
            onChange={setAfslutning}
            isDark={isDark}
          />
        </ThemedView>

        {/* Total score */}
        <View style={styles.totalRow}>
          <ThemedText style={styles.totalLabel}>Total score</ThemedText>
          <View style={styles.totalBadge}>
            <ThemedText style={styles.totalScore}>{total}</ThemedText>
            <ThemedText style={styles.totalMax}>/100</ThemedText>
          </View>
        </View>

        <View style={styles.dividerLine} />

        {/* Notes */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.label}>Noter</ThemedText>
          <TextInput
            style={[inputStyle, styles.notesInput]}
            placeholder="Generelle noter om whiskyen..."
            placeholderTextColor={isDark ? "#555" : "#aaa"}
            value={noter}
            onChangeText={setNoter}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </ThemedView>

        {/* Save button */}
        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Ionicons name="checkmark" size={20} color="#fff" />
          <ThemedText style={styles.saveBtnText}>Gem anmeldelse</ThemedText>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 48,
    gap: 16,
  },
  section: {
    gap: 10,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 3,
    color: "#b07d2e",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  notesInput: {
    height: 110,
    paddingTop: 12,
  },
  scoreBlock: {
    gap: 6,
    marginBottom: 8,
  },
  scoreLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  scoreBadge: {
    backgroundColor: "#b07d2e",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  scoreBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  sliderRow: {
    flexDirection: "row",
    gap: 3,
  },
  sliderDot: {
    flex: 1,
    height: 12,
    borderRadius: 3,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderLabelText: {
    fontSize: 11,
    opacity: 0.4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  totalBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  totalScore: {
    fontSize: 24,
    fontWeight: "800",
    color: "#b07d2e",
  },
  totalMax: {
    fontSize: 16,
    opacity: 0.5,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#b07d2e",
    opacity: 0.4,
  },
  saveBtn: {
    backgroundColor: "#b07d2e",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
