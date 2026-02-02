import { Image } from "expo-image";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useCartStore } from "@/store/cart";

const COFFEE_TINT = "#A0522D";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  const total = getTotal();

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
        <MaterialIcons name="shopping-cart" size={80} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
        <Text style={styles.emptyText}>
          Tambahkan kopi favorit Anda dari menu Home
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart</Text>
        <Text style={styles.itemCount}>{items.length} item</Text>
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
          <View key={item.id} style={styles.cartItem}>
            <Image
              source={item.image}
              style={styles.itemImage}
              contentFit="cover"
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>
                Size {item.size} • $ {item.price}
              </Text>
              <View style={styles.quantityRow}>
                <View style={styles.quantityControls}>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                  >
                    <MaterialIcons name="remove" size={20} color="#6B7280" />
                  </Pressable>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    <MaterialIcons name="add" size={20} color="#6B7280" />
                  </Pressable>
                </View>
                <Text style={styles.itemTotal}>
                  $ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
            <Pressable
              style={styles.removeButton}
              onPress={() => removeItem(item.id)}
            >
              <MaterialIcons name="delete-outline" size={22} color="#EF4444" />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + 16 },
        ]}
      >
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>$ {total.toFixed(2)}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.checkoutButton,
            pressed && styles.checkoutButtonPressed,
          ]}
          onPress={() => router.push("/order")}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
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
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  itemCount: {
    fontSize: 14,
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
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 13,
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
    padding: 8,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    minWidth: 28,
    textAlign: "center",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: COFFEE_TINT,
  },
  removeButton: {
    padding: 8,
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
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  checkoutButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    backgroundColor: COFFEE_TINT,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutButtonPressed: {
    opacity: 0.9,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
