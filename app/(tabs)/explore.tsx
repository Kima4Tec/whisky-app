import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { Fonts } from "@/constants/theme";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#fdf6ec", dark: "#2d1f0a" }}
      headerImage={
        <Image
          source={require("@/assets/images/homelogoOLD.png")}
          style={styles.reactLogo}
          contentFit="cover"
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{ fontFamily: Fonts.rounded, fontSize: 24 }}
        >
          🥃 Klubber & Events
        </ThemedText>
      </ThemedView>

      <ThemedText>
        Udforsk danske whiskyklubber og tilbagevendende events for
        whisky-entusiaster i hele landet.
      </ThemedText>
      <ThemedText style={styles.sectionLabel}>
        Dansk whiskyklubber og foreninger
      </ThemedText>
      {/* ── JYLLAND ── */}
      <ThemedText style={styles.regionLabel}>🔹 Jylland</ThemedText>

      <Collapsible title="Whiskyklubben Angels Share">
        <ThemedText>
          Stiftet i{" "}
          <ThemedText type="defaultSemiBold">Kolding i 2000</ThemedText>. Fokus
          på hygge, smagninger og viden om whisky. Privat klub — svær at blive
          medlem.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Herning Whisky Laug">
        <ThemedText>
          Ca. <ThemedText type="defaultSemiBold">60 medlemmer</ThemedText>,
          eksisteret siden 1999. Arrangerer løbende smagninger for medlemmerne.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Brabrand Whiskyklub Maltværket">
        <ThemedText>
          Stiftet i <ThemedText type="defaultSemiBold">2012</ThemedText> med 4–6
          arrangementer årligt. Afholder ofte åbne events — gode for nye
          entusiaster.
        </ThemedText>
      </Collapsible>

      <Collapsible title="The Scotch Malt Whisky Society">
        <ThemedText>
          International klub med base i{" "}
          <ThemedText type="defaultSemiBold">Vejle</ThemedText>. Medlemskab
          giver adgang til eksklusive smagninger og særlige aftapninger.
        </ThemedText>
      </Collapsible>

      {/* ── FYN / SJÆLLAND ── */}
      <ThemedText style={styles.regionLabel}>🔹 Fyn & Sjælland</ThemedText>

      <Collapsible title="Nyborg Whisky Club">
        <ThemedText>
          Stiftet i <ThemedText type="defaultSemiBold">2004</ThemedText> med
          fokus på single malt. Åben for nye medlemmer.
        </ThemedText>
      </Collapsible>

      <Collapsible title="TAS – The Angel Share">
        <ThemedText>
          Lokal klub i{" "}
          <ThemedText type="defaultSemiBold">Frederikssund</ThemedText>, ca. 15
          år gammel. Hyggeligt fællesskab for lokale whiskyentusiaster.
        </ThemedText>
      </Collapsible>

      {/* ── ANDRE ── */}
      <ThemedText style={styles.regionLabel}>🔹 Andre & lokale</ThemedText>

      <Collapsible title="The Whisky Club (Felixvine)">
        <ThemedText>
          Butiksbaseret klub med månedlige smagninger. Mere kommerciel end en
          klassisk forening — god indgang for begyndere.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Små lokale klubber & laug">
        <ThemedText>
          Der findes mange små, private klubber — ofte Facebook-baserede
          vennegrupper eller lukkede laug. Ikke altid offentligt listet, men
          værd at søge efter lokalt.
        </ThemedText>
      </Collapsible>

      {/* ── EVENTS ── */}
      <ThemedText style={styles.sectionLabel}>Store whisky-events</ThemedText>

      <Collapsible title="🥃 Whisky Fair — Kolding">
        <ThemedText>
          Danmarks største whisky-event. Afholdes hvert år i{" "}
          <ThemedText type="defaultSemiBold">Kolding</ThemedText>.{"\n"}
          Næste dato:{" "}
          <ThemedText type="defaultSemiBold">7. marts 2026</ThemedText>.{"\n\n"}
          Indeholder masterclasses, smagninger og besøg fra internationale
          producenter.
        </ThemedText>
      </Collapsible>

      <Collapsible title="🥃 Thy Whisky Festival — Nordjylland">
        <ThemedText>
          Afholdes i Nordjylland i det fri.{"\n"}
          Næste dato:{" "}
          <ThemedText type="defaultSemiBold">13. juni 2026</ThemedText>.{"\n\n"}
          Workshops, smagninger, bål og social hygge i naturen.
        </ThemedText>
      </Collapsible>

      <Collapsible title="🥃 Den Danske Rom og Whiskyfestival">
        <ThemedText>
          Stor festival med{" "}
          <ThemedText type="defaultSemiBold">+500 smagsprøver</ThemedText>.
          {"\n"}
          Næste dato:{" "}
          <ThemedText type="defaultSemiBold">6.–7. november 2026</ThemedText>.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  regionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#b07d2e",
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3b2407",
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 4,
  },
});
