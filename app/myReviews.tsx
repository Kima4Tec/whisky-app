import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

type Review = {
  id: string;
  name: string;
  naese: number;
  smag: number;
  balance: number;
  afslutning: number;
  noter: string;
  total: number;
  date: string;
};

function ScoreBar({
  label,
  value,
  isDark,
}: {
  label: string;
  value: number;
  isDark: boolean;
}) {
  return (
    <View style={styles.scoreBarRow}>
      <ThemedText style={styles.scoreBarLabel}>{label}</ThemedText>
      <View
        style={[
          styles.scoreBarTrack,
          { backgroundColor: isDark ? "#2a2a2a" : "#ece8e2" },
        ]}
      >
        <View
          style={[
            styles.scoreBarFill,
            { width: `${(value / 25) * 100}%`, backgroundColor: "#b07d2e" },
          ]}
        />
      </View>
      <ThemedText style={styles.scoreBarValue}>{value}</ThemedText>
    </View>
  );
}

function ReviewCard({
  review,
  isDark,
  onDelete,
}: {
  review: Review;
  isDark: boolean;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(review.date).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const scoreColor =
    review.total >= 80
      ? "#2ecc71"
      : review.total >= 60
        ? "#b07d2e"
        : review.total >= 40
          ? "#e67e22"
          : "#e74c3c";

  return (
    <ThemedView
      style={[styles.card, { borderColor: isDark ? "#2a2a2a" : "#e8e2da" }]}
    >
      <Pressable onPress={() => setExpanded((v) => !v)}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleGroup}>
            <ThemedText style={styles.cardName}>{review.name}</ThemedText>
            <ThemedText style={styles.cardDate}>{date}</ThemedText>
          </View>
          <View style={styles.cardRight}>
            <View style={[styles.totalPill, { borderColor: scoreColor }]}>
              <ThemedText style={[styles.totalPillText, { color: scoreColor }]}>
                {review.total}
              </ThemedText>
            </View>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={18}
              color="#888"
            />
          </View>
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.cardBody}>
          <View
            style={[
              styles.divider,
              { backgroundColor: isDark ? "#2a2a2a" : "#ece8e2" },
            ]}
          />
          <ScoreBar label="Næse" value={review.naese} isDark={isDark} />
          <ScoreBar label="Smag" value={review.smag} isDark={isDark} />
          <ScoreBar label="Balance" value={review.balance} isDark={isDark} />
          <ScoreBar
            label="Afslutning"
            value={review.afslutning}
            isDark={isDark}
          />
          {review.noter ? (
            <View style={styles.noterBlock}>
              <ThemedText style={styles.noterLabel}>NOTER</ThemedText>
              <ThemedText style={styles.noterText}>{review.noter}</ThemedText>
            </View>
          ) : null}
          <Pressable style={styles.deleteBtn} onPress={onDelete}>
            <Ionicons name="trash-outline" size={14} color="#e74c3c" />
            <ThemedText style={styles.deleteBtnText}>Slet</ThemedText>
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}

export default function MyReviewsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [reviews, setReviews] = useState<Review[]>([]);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("whisky_reviews").then((data) => {
        setReviews(data ? JSON.parse(data) : []);
      });
    }, []),
  );

  async function handleDelete(id: string) {
    Alert.alert("Slet anmeldelse", "Er du sikker?", [
      { text: "Annuller", style: "cancel" },
      {
        text: "Slet",
        style: "destructive",
        onPress: async () => {
          const updated = reviews.filter((r) => r.id !== id);
          setReviews(updated);
          await AsyncStorage.setItem("whisky_reviews", JSON.stringify(updated));
        },
      },
    ]);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? "#111" : "#f5f0eb" }}
      contentContainerStyle={styles.container}
    >
      <Pressable
        style={styles.addBtn}
        onPress={() => router.push("/addReview")}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <ThemedText style={styles.addBtnText}>Skriv ny anmeldelse</ThemedText>
      </Pressable>

      {reviews.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons
            name="wine-outline"
            size={48}
            color="#b07d2e"
            style={{ opacity: 0.5 }}
          />
          <ThemedText style={styles.emptyText}>
            Ingen anmeldelser endnu.{"\n"}Tryk ovenfor for at tilføje din
            første.
          </ThemedText>
        </View>
      )}

      {reviews.map((r) => (
        <ReviewCard
          key={r.id}
          review={r}
          isDark={isDark}
          onDelete={() => handleDelete(r.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 48,
    gap: 12,
  },
  addBtn: {
    backgroundColor: "#b07d2e",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.5,
    lineHeight: 22,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  cardTitleGroup: {
    flex: 1,
    gap: 2,
  },
  cardName: {
    fontSize: 17,
    fontWeight: "700",
  },
  cardDate: {
    fontSize: 12,
    opacity: 0.45,
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  totalPill: {
    borderWidth: 2,
    borderRadius: 20,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  totalPillText: {
    fontWeight: "800",
    fontSize: 15,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 8,
  },
  divider: {
    height: 1,
    marginBottom: 4,
  },
  scoreBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scoreBarLabel: {
    width: 72,
    fontSize: 13,
    opacity: 0.7,
  },
  scoreBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  scoreBarValue: {
    width: 24,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "600",
    color: "#b07d2e",
  },
  noterBlock: {
    marginTop: 4,
    gap: 4,
  },
  noterLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: "#b07d2e",
  },
  noterText: {
    fontSize: 14,
    opacity: 0.75,
    lineHeight: 20,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-end",
    marginTop: 4,
    padding: 4,
  },
  deleteBtnText: {
    color: "#e74c3c",
    fontSize: 13,
  },
});
