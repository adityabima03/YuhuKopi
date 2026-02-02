import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomepageScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Gambar full screen - cover agar mengisi seluruh layar */}
      <Image
        source={require("@/assets/images/6.png")}
        style={[styles.fullScreenImage, { width, height }]}
        contentFit="contain"
        contentPosition="top"
      />

      {/* Gradient overlay untuk keterbacaan teks */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.85)"]}
        locations={[0.3, 0.6, 1]}
        style={[styles.gradientOverlay, { width, height }]}
        pointerEvents="none"
      />

      {/* Overlay konten */}
      <View
        style={[
          styles.contentOverlay,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 20,
          },
        ]}
      >
        <View style={styles.spacer} />
        <View style={styles.textBlock}>
          <Text style={styles.title}>
            Fall in Love with Coffee in Blissful{"\n"}Delight!
          </Text>
          <Text style={styles.description}>
            Welcome to our cozy coffee corner, where every cup is a delightful
            for you.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.ctaButtonPressed,
            ]}
            onPress={() =>
              router.replace("/(tabs)" as Parameters<typeof router.replace>[0])
            }
          >
            <Text style={styles.ctaButtonText}>Get Started</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  fullScreenImage: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  contentOverlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 28,
  },
  spacer: {
    flex: 1,
  },
  textBlock: {
    marginBottom: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 38,
    marginBottom: 14,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "rgba(255,255,255,0.95)",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    paddingBottom: 4,
  },
  ctaButton: {
    backgroundColor: "#A0522D",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaButtonPressed: {
    opacity: 0.9,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
