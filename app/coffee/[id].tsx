import { Image } from "expo-image";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COFFEE_ITEMS, COFFEE_TINT } from "@/constants/coffee";
import { useCartStore } from "@/store/cart";

const SIZES = ["S", "M", "L"];

export default function CoffeeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [selectedSize, setSelectedSize] = useState("M");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const coffee = COFFEE_ITEMS.find((item) => item.id === id) ?? COFFEE_ITEMS[0];
  const fullDescription = "fullDescription" in coffee ? coffee.fullDescription : coffee.description;
  const addItem = useCartStore((s) => s.addItem);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerButton}
          hitSlop={12}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Detail</Text>
        <Pressable style={styles.headerButton} hitSlop={12}>
          <MaterialIcons name="favorite-border" size={24} color="#1F2937" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={coffee.image}
            style={styles.productImage}
            contentFit="cover"
          />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.productNameRow}>
            <View style={styles.productNameBlock}>
              <Text style={styles.productName}>{coffee.name}</Text>
              <Text style={styles.productSubtitle}>Ice/Hot</Text>
            </View>
            <View style={styles.featureIcons}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons
                  name="truck-delivery"
                  size={20}
                  color={COFFEE_TINT}
                />
              </View>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons
                  name="coffee"
                  size={20}
                  color={COFFEE_TINT}
                />
              </View>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons
                  name="cup-outline"
                  size={20}
                  color={COFFEE_TINT}
                />
              </View>
            </View>
          </View>

          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={20} color="#FBBF24" />
            <Text style={styles.ratingText}>{coffee.rating}</Text>
            <Text style={styles.reviewsText}>
              ({"reviews" in coffee ? coffee.reviews : "230"})
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText} numberOfLines={showFullDescription ? undefined : 3}>
            {fullDescription}
          </Text>
          <Pressable onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text style={styles.readMoreText}>
              {showFullDescription ? "Read Less" : "Read More"}
            </Text>
          </Pressable>
        </View>

        {/* Size Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.sizeButtons}>
            {SIZES.map((size) => (
              <Pressable
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.sizeButtonActive,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.sizeButtonText,
                    selectedSize === size && styles.sizeButtonTextActive,
                  ]}
                >
                  {size}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + 16 },
        ]}
      >
        <View style={styles.priceBlock}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>$ {coffee.price}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.buyButton,
            pressed && styles.buyButtonPressed,
          ]}
          onPress={() => {
            addItem({
              coffeeId: coffee.id,
              name: coffee.name,
              description: coffee.description,
              price: coffee.price,
              size: selectedSize,
              image: coffee.image,
            });
            router.dismissTo("/(tabs)/cart");
          }}
        >
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerButton: {
    width: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  imageContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: "#F3F4F6",
  },
  productImage: {
    width: "100%",
    height: 280,
  },
  productInfo: {
    marginBottom: 24,
  },
  productNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  productNameBlock: {
    flex: 1,
  },
  productName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  productSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  featureIcons: {
    flexDirection: "row",
    gap: 8,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F5E6D3",
    alignItems: "center",
    justifyContent: "center",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  reviewsText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 24,
    marginBottom: 8,
  },
  readMoreText: {
    fontSize: 15,
    color: COFFEE_TINT,
    fontWeight: "600",
  },
  sizeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  sizeButtonActive: {
    backgroundColor: COFFEE_TINT,
    borderColor: COFFEE_TINT,
  },
  sizeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  sizeButtonTextActive: {
    color: "#FFFFFF",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  priceBlock: {},
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: "700",
    color: COFFEE_TINT,
  },
  buyButton: {
    flex: 1,
    maxWidth: 200,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: COFFEE_TINT,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 24,
  },
  buyButtonPressed: {
    opacity: 0.9,
  },
  buyButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
