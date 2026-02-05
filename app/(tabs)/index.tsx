import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import {
  Card,
  Chip,
  IconButton,
  Surface,
  Text,
} from "react-native-paper";

import { useAddressStore } from "@/store/address";
import { useCartStore } from "@/store/cart";
import { useDeliveryAddress } from "@/hooks/useDeliveryAddress";
import { COFFEE_ITEMS, COFFEE_TINT } from "@/constants/coffee";

const CATEGORIES = ["All Coffee", "Machiato", "Latte", "Americano", "Cappuccino"];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const addItem = useCartStore((s) => s.addItem);
  const locationDisplay = useAddressStore((s) => s.getLocationDisplay());
  const isLoading = useAddressStore((s) => s.isLoading);
  const { refreshLocation } = useDeliveryAddress();

  return (
    <Surface style={[styles.container, { paddingTop: insets.top }]} elevation={0}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Dark section: Header + Search */}
        <Surface style={styles.darkSection} elevation={0}>
          <View style={styles.header}>
            <Text variant="bodyMedium" style={styles.locationLabel}>
              Location
            </Text>
            <View style={styles.locationRow}>
              <Pressable
                style={styles.locationSelector}
                onPress={() => router.push("/edit-address")}
              >
                <MaterialIcons name="location-on" size={20} color="#9CA3AF" />
                <Text variant="titleMedium" style={styles.locationText}>
                  {isLoading ? "Getting location..." : locationDisplay}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="#9CA3AF" />
              </Pressable>
              <Pressable
                style={[
                  styles.locationNowButton,
                  isLoading && styles.locationNowButtonDisabled,
                ]}
                onPress={refreshLocation}
                disabled={isLoading}
              >
                <MaterialIcons name="my-location" size={18} color="#FFFFFF" />
                <Text variant="labelLarge" style={styles.locationNowText}>
                  Now
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchInput}>
              <MaterialIcons name="search" size={22} color="#9CA3AF" />
              <TextInput
                style={styles.searchTextInput}
                placeholder="Search coffee"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <IconButton
              icon="tune"
              iconColor="#FFFFFF"
              size={22}
              style={styles.filterButton}
              onPress={() => {}}
            />
          </View>
        </Surface>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <Image
            source={require("@/assets/images/1.png")}
            style={styles.promoBannerImage}
            contentFit="cover"
          />
          <View style={styles.promoBannerOverlay}>
            <Chip
              style={[styles.promoTag, { backgroundColor: "#DC2626" }]}
              textStyle={styles.promoTagText}
              compact
            >
              Promo
            </Chip>
            <Text variant="headlineMedium" style={styles.promoTitle}>
              Buy one get one{"\n"}FREE
            </Text>
          </View>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat, index) => (
            <Chip
              key={cat}
              selected={index === 0}
              onPress={() => {}}
              style={[
                styles.categoryTab,
                index === 0 && styles.categoryTabActive,
              ]}
              textStyle={[
                styles.categoryText,
                index === 0 && styles.categoryTextActive,
              ]}
              selectedColor="#FFFFFF"
              showSelectedOverlay={false}
            >
              {cat}
            </Chip>
          ))}
        </ScrollView>

        {/* Coffee Grid */}
        <View style={styles.coffeeGrid}>
          {COFFEE_ITEMS.map((item) => (
            <Card
              key={item.id}
              style={styles.coffeeCard}
              onPress={() => router.push(`/coffee/${item.id}`)}
              contentStyle={styles.coffeeCardContent}
            >
              <View style={styles.coffeeImageContainer}>
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
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151718",
  },
  darkSection: {
    backgroundColor: "#1A1A1A",
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  locationLabel: {
    color: "#9CA3AF",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationSelector: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    flex: 1,
    color: "#FFFFFF",
  },
  locationNowButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COFFEE_TINT,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  locationNowButtonDisabled: {
    opacity: 0.6,
  },
  locationNowText: {
    color: "#FFFFFF",
  },
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D2D2D",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    padding: 0,
  },
  filterButton: {
    backgroundColor: COFFEE_TINT,
    borderRadius: 12,
  },
  promoBanner: {
    marginHorizontal: 24,
    marginTop: -20,
    borderRadius: 20,
    marginBottom: 24,
    minHeight: 140,
    overflow: "hidden",
    position: "relative",
  },
  promoBannerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  promoBannerOverlay: {
    padding: 24,
    minHeight: 140,
    justifyContent: "center",
    backgroundColor: "rgba(139, 105, 20, 0.5)",
  },
  promoTag: {
    alignSelf: "flex-start",
    backgroundColor: "#DC2626",
    marginBottom: 12,
  },
  promoTagText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  promoTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    lineHeight: 34,
  },
  categoriesScroll: {
    marginBottom: 20,
    backgroundColor: "#151718",
  },
  categoriesContent: {
    paddingHorizontal: 24,
    gap: 12,
    flexDirection: "row",
  },
  categoryTab: {
    marginRight: 12,
    backgroundColor: "#FFFFFF",
  },
  categoryTabActive: {
    backgroundColor: COFFEE_TINT,
  },
  categoryText: {
    color: "#4B5563",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  coffeeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    gap: 16,
    backgroundColor: "#151718",
  },
  coffeeCard: {
    width: "47%",
    backgroundColor: "#2D2D2D",
    borderRadius: 20,
    marginBottom: 8,
  },
  coffeeCardContent: {
    padding: 16,
  },
  coffeeImageContainer: {
    height: 120,
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
