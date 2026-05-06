import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Wave } from "@/components/wave";
import { Link } from "expo-router";

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

      <ThemedView style={styles.stepContainer}>
        <Link href="/reviews">
          <Link.Trigger>
            <ThemedText type="subtitle">Anmeldelser</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction
              title="Action"
              icon="cube"
              onPress={() => alert("Action pressed")}
            />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert("Share pressed")}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert("Delete pressed")}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Her kan du finde links til forskellige anmeldelser af whisky.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/shops">
          <Link.Trigger>
            <ThemedText type="subtitle">Whisky-butikker </ThemedText>{" "}
          </Link.Trigger>
        </Link>
        <ThemedText>
          {`Danske butikker på internettet, hvor du kan bestille whisky.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Whiskydestillerier</ThemedText>
        <ThemedText>
          Tryk på destillerier-knappen for at se en omfattende liste over
          whiskydestillerier hentet fra
          https://whiskyhunter.net/api/distilleries_info/{" "}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Meget mere </ThemedText>
        <ThemedText>
          {`Tryk på explore-knappen for at finde danske whiskyklubber, events og meget mere.`}
        </ThemedText>
      </ThemedView>
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
});
