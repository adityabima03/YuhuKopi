import { Image } from "expo-image";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  IconButton,
  Surface,
  Text,
} from "react-native-paper";

import { useCartStore } from "@/store/cart";

const COFFEE_TINT = "#A0522D";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  const total = getTotal();

  if (items.length === 0) {
    return (
      <Surface style={[styles.emptyContainer, { paddingTop: insets.top }]} elevation={0}>
        <MaterialIcons name="shopping-cart" size={80} color="#D1D5DB" />
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          Keranjang Kosong
        </Text>
        <Text variant="bodyLarge" style={styles.emptyText}>
          Tambahkan kopi favorit Anda dari menu Home
        </Text>
      </Surface>
    );
  }

  return (
    <Surface style={[styles.container, { paddingTop: insets.top }]} elevation={0}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Cart
        </Text>
        <Text variant="bodyMedium" style={styles.itemCount}>
          {items.length} item
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <Surface key={item.id} style={styles.cartItem} elevation={0}>
            <Image
              source={item.image}
              style={styles.itemImage}
              contentFit="cover"
            />
            <View style={styles.itemDetails}>
              <Text variant="titleMedium" style={styles.itemName}>
                {item.name}
              </Text>
              <Text variant="bodySmall" style={styles.itemMeta}>
                Size {item.size} • $ {item.price}
              </Text>
              <View style={styles.quantityRow}>
                <View style={styles.quantityControls}>
                  <IconButton
                    icon="minus"
                    size={20}
                    iconColor="#6B7280"
                    style={styles.quantityButton}
                    onPress={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                  />
                  <Text variant="titleMedium" style={styles.quantityText}>
                    {item.quantity}
                  </Text>
                  <IconButton
                    icon="plus"
                    size={20}
                    iconColor="#6B7280"
                    style={styles.quantityButton}
                    onPress={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                  />
                </View>
                <Text variant="titleMedium" style={styles.itemTotal}>
                  $ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
            <IconButton
              icon="delete-outline"
              size={22}
              iconColor="#EF4444"
              style={styles.removeButton}
              onPress={() => removeItem(item.id)}
            />
          </Surface>
        ))}
      </ScrollView>

      <Surface
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + 16 },
        ]}
        elevation={2}
      >
        <View>
          <Text variant="bodySmall" style={styles.totalLabel}>
            Total
          </Text>
          <Text variant="headlineSmall" style={styles.totalValue}>
            $ {total.toFixed(2)}
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={() => router.push("/order")}
          buttonColor={COFFEE_TINT}
          style={styles.checkoutButton}
        >
          Checkout
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: "#1F2937",
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    color: "#6B7280",
    textAlign: "center",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    color: "#1F2937",
    fontWeight: "700",
  },
  itemCount: {
    color: "#6B7280",
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    color: "#1F2937",
    fontWeight: "700",
    marginBottom: 4,
  },
  itemMeta: {
    color: "#6B7280",
    marginBottom: 12,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  quantityButton: {
    margin: 0,
  },
  quantityText: {
    color: "#1F2937",
    fontWeight: "600",
    minWidth: 28,
    textAlign: "center",
  },
  itemTotal: {
    color: COFFEE_TINT,
    fontWeight: "700",
  },
  removeButton: {
    margin: 0,
    marginLeft: 8,
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
  totalLabel: {
    color: "#6B7280",
    marginBottom: 2,
  },
  totalValue: {
    color: "#1F2937",
    fontWeight: "700",
  },
  checkoutButton: {
    paddingHorizontal: 32,
  },
});
