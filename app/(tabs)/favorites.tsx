import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Card, IconButton, Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COFFEE_ITEMS, COFFEE_TINT } from "@/constants/coffee";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";

const CARD_GAP = 10;

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const coffeeIds = useFavoritesStore((s) => s.coffeeIds);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const addItem = useCartStore((s) => s.addItem);

  const horizontalPadding = Math.max(16, Math.min(28, screenWidth * 0.06));
  const contentWidth = screenWidth - horizontalPadding * 2;
  const cardWidth = (contentWidth - CARD_GAP) / 2;
  const imageHeight = Math.max(80, cardWidth * 0.75);

  const favoriteItems = COFFEE_ITEMS.filter((item) =>
    coffeeIds.includes(item.id)
  );

  return (
    <Surface
      style={[styles.container, { paddingTop: insets.top }]}
      elevation={0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
      >
        <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
          <Text variant="headlineSmall" style={styles.title}>
            Favorites
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {`${favoriteItems.length} item${
              favoriteItems.length !== 1 ? "s" : ""
            } saved`}
          </Text>
        </View>

        {favoriteItems.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="favorite-border" size={64} color="#9CA3AF" />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No favorites yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptyDesc}>
              Tap the heart icon on coffee cards to add them here
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.coffeeGrid,
              {
                paddingHorizontal: horizontalPadding,
                gap: CARD_GAP,
              },
            ]}
          >
            {favoriteItems.map((item) => (
              <Card
                key={item.id}
                style={[
                  styles.coffeeCard,
                  {
                    width: "47%",
                    flexBasis: "47%",
                    flexGrow: 0,
                    flexShrink: 0,
                  },
                ]}
                onPress={() => router.push(`/coffee/${item.id}`)}
                contentStyle={styles.coffeeCardContent}
              >
                <View
                  style={[styles.coffeeImageContainer, { height: imageHeight }]}
                >
                  <Image
                    source={item.image}
                    style={styles.coffeeImage}
                    contentFit="cover"
                  />
                  <View style={styles.ratingBadge}>
                    <MaterialIcons name="star" size={14} color="#FBBF24" />
                    <Text variant="labelSmall" style={styles.ratingText}>
                      {item.rating}
                    </Text>
                  </View>
                  <Pressable
                    style={styles.favoriteCardButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <MaterialIcons name="favorite" size={20} color="#EF4444" />
                  </Pressable>
                </View>
                <Text variant="titleMedium" style={styles.coffeeName}>
                  {item.name}
                </Text>
                <Text variant="bodySmall" style={styles.coffeeDesc}>
                  {item.description}
                </Text>
                <View style={styles.coffeeFooter}>
                  <Text variant="titleLarge" style={styles.coffeePrice}>
                    $ {item.price}
                  </Text>
                  <IconButton
                    icon="plus"
                    iconColor="#FFFFFF"
                    size={24}
                    style={styles.addButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      addItem({
                        coffeeId: item.id,
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        size: "M",
                        image: item.image,
                      });
                    }}
                  />
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151718",
  },
  content: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 20,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: "#9CA3AF",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 12,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyDesc: {
    color: "#9CA3AF",
    textAlign: "center",
  },
  coffeeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#151718",
  },
  coffeeCard: {
    backgroundColor: "#2D2D2D",
    borderRadius: 20,
  },
  coffeeCardContent: {
    padding: 16,
  },
  coffeeImageContainer: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    position: "relative",
  },
  coffeeImage: {
    width: "100%",
    height: "100%",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  favoriteCardButton: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 6,
  },
  coffeeName: {
    color: "#FFFFFF",
    marginBottom: 4,
  },
  coffeeDesc: {
    color: "#9CA3AF",
    marginBottom: 12,
  },
  coffeeFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  coffeePrice: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  addButton: {
    backgroundColor: COFFEE_TINT,
    margin: 0,
  },
});
