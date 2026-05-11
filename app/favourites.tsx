import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Whisky {
  id: string;
  name: string;
  distillery: string;
  region: string;
  age: number;
  votes: number;
  accentColor: string;
  flag: string;
}

// ─── Repository Pattern ─────────────────────────────────────────────
// En Promise i JavaScript er en måde at håndtere asynkrone operationer på (altså ting der tager tid og ikke sker med det samme).
interface IWhiskyRepository {
  getAll(): Promise<Whisky[]>;
  save(whiskies: Whisky[]): Promise<void>;
  vote(id: string, whiskies: Whisky[]): Promise<Whisky[]>;
  removeVote(id: string, whiskies: Whisky[]): Promise<Whisky[]>;
}

class WhiskyRepository implements IWhiskyRepository {
  // Den plads i AsyncStorage hvor whisky-data gemmes.
  // AsyncStorage er en lokal lagringsløsning i React Native,
  // som bruges til at gemme data direkte på brugerens enhed.
  private readonly STORAGE_KEY = "whisky_votes";

  private readonly defaultWhiskies: Whisky[] = [
    {
      id: "1",
      name: "Lagavulin 16",
      distillery: "Lagavulin",
      region: "Islay",
      age: 16,
      votes: 0,
      accentColor: "#7a4a1e",
      flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    },
    {
      id: "2",
      name: "Glenfiddich 18",
      distillery: "Glenfiddich",
      region: "Speyside",
      age: 18,
      votes: 0,
      accentColor: "#b07d2e",
      flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    },
    {
      id: "3",
      name: "Macallan 12",
      distillery: "The Macallan",
      region: "Speyside",
      age: 12,
      votes: 0,
      accentColor: "#c9973a",
      flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    },
    {
      id: "4",
      name: "Laphroaig 10",
      distillery: "Laphroaig",
      region: "Islay",
      age: 10,
      votes: 0,
      accentColor: "#5a6e2e",
      flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    },
    {
      id: "5",
      name: "Highland Park 18",
      distillery: "Highland Park",
      region: "Highland",
      age: 18,
      votes: 0,
      accentColor: "#d4922a",
      flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    },
    {
      id: "6",
      name: "Oban 14",
      distillery: "Oban",
      region: "Highland",
      age: 14,
      votes: 0,
      accentColor: "#8a6030",
      flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    },
    {
      id: "7",
      name: "Ardbeg 10",
      distillery: "Ardbeg",
      region: "Islay",
      age: 10,
      votes: 0,
      accentColor: "#3a6e4a",
      flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    },
    {
      id: "8",
      name: "Balvenie DoubleWood 12",
      distillery: "The Balvenie",
      region: "Speyside",
      age: 12,
      votes: 0,
      accentColor: "#b07d2e",
      flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    },
  ];

  // Asynkron hentning - hvis ikke der er gemte data, returneres default-listen og gemmes i AsyncStorage for fremtidig brug.
  async getAll(): Promise<Whisky[]> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Whisky[];
      await this.save(this.defaultWhiskies);
      return this.defaultWhiskies;
    } catch {
      return this.defaultWhiskies;
    }
  }

  // Gem lokalt på enheden via AsyncStorage
  async save(whiskies: Whisky[]): Promise<void> {
    await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(whiskies));
  }

  // Opdaterer stemmer ved at finde den whisky der matches på ID, og enten øge eller mindske dens stemmeantal.
  async vote(id: string, whiskies: Whisky[]): Promise<Whisky[]> {
    const updated = whiskies.map((w) =>
      w.id === id ? { ...w, votes: w.votes + 1 } : w,
    );
    await this.save(updated);
    return updated;
  }

  // Fjerner en stemme ved at finde den whisky der matches på ID, og mindske dens stemmeantal, men aldrig under 0.
  async removeVote(id: string, whiskies: Whisky[]): Promise<Whisky[]> {
    const updated = whiskies.map((w) =>
      w.id === id ? { ...w, votes: Math.max(0, w.votes - 1) } : w,
    );
    await this.save(updated);
    return updated;
  }
}

// ─── Service hook (Mål 12 + 13) ──────────────────────────────────────────────
// Et custom React hook, der håndterer al logik relateret til whisky-data og stemmeafgivning.
// En hook i React (og React Native) er en funktion, der giver mulighed for at bruge state
// og React-funktionalitet inde i funktionelle komponenter.
// Det er en “kobling ind i React”, så komponenten kan huske data, reagere på ændringer og køre side effects.
function useWhiskyService(repository: IWhiskyRepository) {
  // React hooks (useState, useCallback) bruges til at håndtere state og
  // at gemme funktioner i hukommelsen, så de ikke bliver genskabt unødvendigt ved hver render.
  const [whiskies, setWhiskies] = useState<Whisky[]>([]);
  const [loading, setLoading] = useState(true);

  // useCallback bruges til at gemme funktioner, så de kun genskabes hvis deres afhængigheder ændrer sig.
  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await repository.getAll();
    setWhiskies([...data].sort((a, b) => b.votes - a.votes));
    setLoading(false);
  }, [repository]);

  // Stem op
  const castVote = useCallback(
    async (id: string) => {
      const updated = await repository.vote(id, whiskies);
      setWhiskies([...updated].sort((a, b) => b.votes - a.votes));
    },
    [whiskies, repository],
  );

  // Stem ned
  const removeVote = useCallback(
    async (id: string) => {
      const whisky = whiskies.find((w) => w.id === id);
      if (!whisky || whisky.votes === 0) return;
      const updated = await repository.removeVote(id, whiskies);
      setWhiskies([...updated].sort((a, b) => b.votes - a.votes));
    },
    [whiskies, repository],
  );

  // Nulstil alle stemmer til 0, med en bekræftelsesdialog for at undgå utilsigtet nulstilling.
  const resetVotes = useCallback(async () => {
    Alert.alert(
      "Nulstil stemmer",
      "Er du sikker på, at du vil nulstille alle stemmer?",
      [
        { text: "Annuller", style: "cancel" },
        {
          text: "Nulstil",
          style: "destructive",
          onPress: async () => {
            const reset = whiskies.map((w) => ({ ...w, votes: 0 }));
            await repository.save(reset);
            setWhiskies(reset);
          },
        },
      ],
    );
  }, [whiskies, repository]);

  return { whiskies, loading, fetchData, castVote, removeVote, resetVotes };
}

// ─── Medal helper ─────────────────────────────────────────────────────────────

const getMedal = (index: number) => {
  if (index === 0) return "🥇 1. plads";
  if (index === 1) return "🥈 2. plads";
  if (index === 2) return "🥉 3. plads";
  return `#${index + 1}`;
};

// ─── Whisky-kort ──────────────────────────────────────────────────────────────

interface WhiskyCardProps {
  item: Whisky;
  index: number;
  onVote: (id: string) => void;
  onRemove: (id: string) => void;
}

// WhiskyCard er en komponent der repræsenterer hver whisky i listen,
// og viser dens information, antal stemmer, og + / − knapper til at stemme.
// Den har også en lille "bounce" animation
// Den er en “UI blok” for én whisky. Data ind via props (properties), den måde, en React-komponent får data udefra.
function WhiskyCard({ item, index, onVote, onRemove }: WhiskyCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const bounce = (fn: () => void) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 70,
        useNativeDriver: true,
      }),
    ]).start();
    fn();
  };

  const barPercent = item.votes > 0 ? Math.min(100, item.votes * 12 + 8) : 0;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <View style={styles.card}>
        {/* Farvet venstrekant */}
        <View
          style={[styles.cardAccent, { backgroundColor: item.accentColor }]}
        />
        {/* Cards */}
        <View style={styles.cardContent}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.flag}>{item.flag}</Text>
            <View style={styles.cardTitleGroup}>
              <ThemedText style={styles.cardTitle}>{item.name}</ThemedText>
              <ThemedText
                style={[styles.cardLabel, { color: item.accentColor }]}
              >
                {item.distillery} · {item.region} · {item.age} år
              </ThemedText>
            </View>
          </View>

          {/* Rang + stemmer */}
          <View style={styles.rankRow}>
            <ThemedText style={styles.rankText}>{getMedal(index)}</ThemedText>
            <ThemedText style={[styles.voteCount, { color: item.accentColor }]}>
              {item.votes} {item.votes === 1 ? "stemme" : "stemmer"}
            </ThemedText>
          </View>

          {/* Stemme-bar */}
          <View style={styles.voteBarContainer}>
            <View
              style={[
                styles.voteBar,
                { width: `${barPercent}%`, backgroundColor: item.accentColor },
              ]}
            />
          </View>

          {/* + / − knapper */}
          <View style={styles.voteControls}>
            <TouchableOpacity
              style={[
                styles.controlBtn,
                styles.controlBtnMinus,
                item.votes === 0 && styles.controlBtnDisabled,
              ]}
              onPress={() => bounce(() => onRemove(item.id))}
              disabled={item.votes === 0}
            >
              <ThemedText
                style={[
                  styles.controlBtnText,
                  item.votes === 0 && styles.controlBtnTextDisabled,
                ]}
              >
                −
              </ThemedText>
            </TouchableOpacity>

            <ThemedText
              style={[styles.voteNumber, { color: item.accentColor }]}
            >
              {item.votes}
            </ThemedText>

            <TouchableOpacity
              style={[
                styles.controlBtn,
                {
                  backgroundColor: item.accentColor,
                  borderColor: item.accentColor,
                },
              ]}
              onPress={() => bounce(() => onVote(item.id))}
            >
              <ThemedText style={styles.controlBtnTextActive}>+</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Hoved-skærm ──────────────────────────────────────────────────────────────

const repository = new WhiskyRepository();

export default function FavouritesScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const { whiskies, loading, fetchData, castVote, removeVote, resetVotes } =
    useWhiskyService(repository);

  // Kør fetchData() når komponenten loader – og igen hvis fetchData ændrer sig
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalVotes = whiskies.reduce((sum, w) => sum + w.votes, 0);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#b07d2e"
          style={{ marginTop: 80 }}
        />
        <ThemedText style={styles.loadingText}>Henter whiskyer…</ThemedText>
      </ThemedView>
    );
  }

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
          <ThemedText style={styles.title}>Favorit Whisky</ThemedText>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.subtitle}>STEM PÅ DIN FAVORIT</ThemedText>
            <View style={styles.dividerLine} />
          </View>
        </View>

        {/* Vejledningsboks */}
        <View style={styles.infoBox}>
          <ThemedText style={styles.infoLabel}>VEJLEDNING</ThemedText>
          <ThemedText style={styles.infoText}>
            Tryk på + for at give en whisky en stemme, og − for at fjerne en
            stemme igen. Listen sorteres automatisk.
          </ThemedText>
        </View>

        {/* Dynamisk sorteret liste – Mål 4 */}
        {whiskies.map((item, index) => (
          <WhiskyCard
            key={item.id}
            item={item}
            index={index}
            onVote={castVote}
            onRemove={removeVote}
          />
        ))}

        {/* Statistik */}
        <View style={styles.infoBox}>
          <ThemedText style={styles.infoLabel}>STATISTIK</ThemedText>
          <ThemedText style={styles.infoText}>
            {totalVotes === 0
              ? "Ingen stemmer afgivet endnu — vær den første!"
              : `${totalVotes} ${totalVotes === 1 ? "stemme" : "stemmer"} afgivet i alt`}
          </ThemedText>
        </View>

        {/* Nulstil */}
        <Pressable
          style={({ pressed }) => [
            styles.resetButton,
            pressed && { opacity: 0.7 },
          ]}
          onPress={resetVotes}
        >
          <ThemedText style={styles.resetText}>Nulstil alle stemmer</ThemedText>
        </Pressable>

        <Link href="/" dismissTo style={styles.backLink}>
          <ThemedText style={styles.backText}>← Tilbage til home</ThemedText>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf6ec",
  },
  scroll: {
    padding: 20,
    paddingTop: 48,
    paddingBottom: 40,
  },
  scrollLandscape: {
    paddingTop: 24,
  },
  loadingText: {
    color: "#b07d2e",
    fontSize: 15,
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  glassIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
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
    width: "100%",
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

  // Info-boks
  infoBox: {
    backgroundColor: "#fdf0db",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e8d5b0",
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
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

  // Kort
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#e8d5b0",
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#b07d2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardAccent: {
    width: 5,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 2,
  },
  flag: {
    fontSize: 30,
  },
  cardTitleGroup: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#3b2407",
  },
  cardLabel: {
    fontSize: 13,
    letterSpacing: 0.3,
    marginTop: 1,
  },

  // Rang-række
  rankRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rankText: {
    fontSize: 13,
    color: "#7a6040",
    letterSpacing: 0.3,
  },
  voteCount: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  // Stemme-bar
  voteBarContainer: {
    height: 4,
    backgroundColor: "#f0e4c8",
    borderRadius: 2,
    overflow: "hidden",
  },
  voteBar: {
    height: "100%",
    borderRadius: 2,
  },

  // + / − kontroller
  voteControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginTop: 4,
  },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  controlBtnMinus: {
    backgroundColor: "#fdf6ec",
    borderColor: "#e8d5b0",
  },
  controlBtnDisabled: {
    backgroundColor: "#f5f0e8",
    borderColor: "#ede5d0",
  },
  controlBtnText: {
    fontSize: 22,
    lineHeight: 26,
    color: "#7a6040",
    fontWeight: "600",
  },
  controlBtnTextDisabled: {
    color: "#c8bca8",
  },
  controlBtnTextActive: {
    fontSize: 22,
    lineHeight: 26,
    color: "#ffffff",
    fontWeight: "600",
  },
  voteNumber: {
    fontSize: 22,
    fontWeight: "700",
    minWidth: 36,
    textAlign: "center",
  },

  // Nulstil
  resetButton: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e8d5b0",
    backgroundColor: "#fdf0db",
    marginBottom: 16,
  },
  resetText: {
    color: "#b07d2e",
    fontSize: 13,
    letterSpacing: 0.5,
  },

  // Tilbage
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
