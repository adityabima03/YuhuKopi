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
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Surface,
  Text,
} from "react-native-paper";

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
    <Surface style={[styles.container, { paddingTop: insets.top }]} elevation={0}>
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
        <Text variant="titleLarge" style={styles.headerTitle}>
          Detail
        </Text>
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
              <Text variant="headlineSmall" style={styles.productName}>
                {coffee.name}
              </Text>
              <Text variant="bodyMedium" style={styles.productSubtitle}>
                Ice/Hot
              </Text>
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
            <Text variant="titleMedium" style={styles.ratingText}>
              {coffee.rating}
            </Text>
            <Text variant="bodyMedium" style={styles.reviewsText}>
              ({"reviews" in coffee ? coffee.reviews : "230"})
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Description
          </Text>
          <Text
            variant="bodyMedium"
            style={styles.descriptionText}
            numberOfLines={showFullDescription ? undefined : 3}
          >
            {fullDescription}
          </Text>
          <Pressable onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text variant="labelLarge" style={styles.readMoreText}>
              {showFullDescription ? "Read Less" : "Read More"}
            </Text>
          </Pressable>
        </View>

        {/* Size Selection */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Size
          </Text>
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
                  variant="titleMedium"
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
      <Surface
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + 16 },
        ]}
        elevation={1}
      >
        <View style={styles.priceBlock}>
          <Text variant="bodySmall" style={styles.priceLabel}>
            Price
          </Text>
          <Text variant="titleLarge" style={styles.priceValue}>
            $ {coffee.price}
          </Text>
        </View>
        <Button
          mode="contained"
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
          buttonColor={COFFEE_TINT}
          style={styles.buyButton}
        >
          Buy Now
        </Button>
      </Surface>
    </Surface>
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
    color: "#1F2937",
    fontWeight: "700",
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
    color: "#1F2937",
    fontWeight: "700",
    marginBottom: 4,
  },
  productSubtitle: {
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
    color: "#1F2937",
    fontWeight: "700",
  },
  reviewsText: {
    color: "#9CA3AF",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#1F2937",
    fontWeight: "700",
    marginBottom: 12,
  },
  descriptionText: {
    color: "#6B7280",
    lineHeight: 24,
    marginBottom: 8,
  },
  readMoreText: {
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
    color: "#1F2937",
    fontWeight: "600",
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
    color: "#6B7280",
    marginBottom: 2,
  },
  priceValue: {
    color: COFFEE_TINT,
    fontWeight: "700",
  },
  buyButton: {
    flex: 1,
    maxWidth: 200,
    marginLeft: 24,
  },
});
