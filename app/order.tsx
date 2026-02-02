import { Image } from "expo-image";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAddressStore } from "@/store/address";
import { useCartStore } from "@/store/cart";
import { useDeliveryAddress } from "@/hooks/useDeliveryAddress";

const COFFEE_TINT = "#A0522D";
const DELIVERY_FEE_ORIGINAL = 2.0;
const DELIVERY_FEE_DISCOUNTED = 1.0;

export default function OrderScreen() {
  const insets = useSafeAreaInsets();
  const { items, updateQuantity, getTotal, clearCart } = useCartStore();
  const getDisplayAddress = useAddressStore((s) => s.getDisplayAddress);
  const getShortAddress = useAddressStore((s) => s.getShortAddress);
  useDeliveryAddress();
  const [deliveryType, setDeliveryType] = useState<"deliver" | "pickup">("deliver");
  const isPlacingOrder = useRef(false);

  const displayAddress = getDisplayAddress();
  const shortAddress = getShortAddress();

  const subtotal = getTotal();
  const deliveryFee = deliveryType === "deliver" ? DELIVERY_FEE_DISCOUNTED : 0;
  const total = subtotal + deliveryFee;

  useFocusEffect(
    useCallback(() => {
      if (items.length === 0 && !isPlacingOrder.current) {
        router.back();
      }
    }, [items.length])
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Order</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* Deliver / Pick Up Toggle */}
        <View style={styles.toggleContainer}>
          <Pressable
            style={[
              styles.toggleButton,
              deliveryType === "deliver" && styles.toggleButtonActive,
            ]}
            onPress={() => setDeliveryType("deliver")}
          >
            <Text
              style={[
                styles.toggleText,
                deliveryType === "deliver" && styles.toggleTextActive,
              ]}
            >
              Deliver
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleButton,
              deliveryType === "pickup" && styles.toggleButtonActive,
            ]}
            onPress={() => setDeliveryType("pickup")}
          >
            <Text
              style={[
                styles.toggleText,
                deliveryType === "pickup" && styles.toggleTextActive,
              ]}
            >
              Pick Up
            </Text>
          </Pressable>
        </View>

        {/* Delivery Address */}
        {deliveryType === "deliver" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressCard}>
              <Text style={styles.addressLine}>{shortAddress}</Text>
              <Text style={styles.addressLine}>{displayAddress}</Text>
              <View style={styles.addressButtons}>
                <Pressable
                  style={styles.addressButton}
                  onPress={() => router.push("/edit-address")}
                >
                  <MaterialIcons name="edit" size={18} color={COFFEE_TINT} />
                  <Text style={styles.addressButtonText}>Edit Address</Text>
                </Pressable>
                <Pressable style={styles.addressButton}>
                  <MaterialIcons name="note-add" size={18} color={COFFEE_TINT} />
                  <Text style={styles.addressButtonText}>Add Note</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* Order Items */}
        <View style={styles.section}>
          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Image
                source={item.image}
                style={styles.orderItemImage}
                contentFit="cover"
              />
              <View style={styles.orderItemDetails}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemDesc}>{item.description}</Text>
                <View style={styles.quantityRow}>
                  <Pressable
                    style={styles.quantityBtn}
                    onPress={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                  >
                    <MaterialIcons name="remove" size={20} color="#6B7280" />
                  </Pressable>
                  <Text style={styles.quantityValue}>{item.quantity}</Text>
                  <Pressable
                    style={styles.quantityBtn}
                    onPress={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    <MaterialIcons name="add" size={20} color="#6B7280" />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Discount */}
        <Pressable style={styles.discountBanner}>
          <MaterialIcons name="local-offer" size={22} color={COFFEE_TINT} />
          <Text style={styles.discountText}>1 Discount is Applies</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </Pressable>

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Price</Text>
            <Text style={styles.summaryValue}>$ {subtotal.toFixed(2)}</Text>
          </View>
          {deliveryType === "deliver" && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <View style={styles.deliveryFeeRow}>
                <Text style={styles.deliveryFeeOriginal}>
                  $ {DELIVERY_FEE_ORIGINAL.toFixed(1)}
                </Text>
                <Text style={styles.summaryValue}>
                  $ {DELIVERY_FEE_DISCOUNTED.toFixed(1)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.paymentSection}>
          <Pressable style={styles.paymentMethod}>
            <MaterialIcons name="account-balance-wallet" size={24} color={COFFEE_TINT} />
            <View style={styles.paymentMethodInfo}>
              <Text style={styles.paymentMethodLabel}>Cash/Wallet</Text>
              <Text style={styles.paymentTotal}>$ {total.toFixed(2)}</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#9CA3AF" />
          </Pressable>
        </View>
      </ScrollView>

      {/* Order Button */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + 16 },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.orderButton,
            pressed && styles.orderButtonPressed,
          ]}
          onPress={() => {
            isPlacingOrder.current = true;
            router.replace("/delivery");
            clearCart();
          }}
        >
          <Text style={styles.orderButtonText}>Order</Text>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    padding: 24,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },
  toggleTextActive: {
    color: COFFEE_TINT,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  addressCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  addressLine: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 4,
  },
  addressButtons: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },
  addressButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addressButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COFFEE_TINT,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  orderItemImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E5E7EB",
  },
  orderItemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  orderItemDesc: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  quantityBtn: {
    padding: 8,
  },
  quantityValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    minWidth: 24,
    textAlign: "center",
  },
  discountBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  discountText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#92400E",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  deliveryFeeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deliveryFeeOriginal: {
    fontSize: 15,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  paymentSection: {
    marginBottom: 24,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 16,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  paymentTotal: {
    fontSize: 20,
    fontWeight: "700",
    color: COFFEE_TINT,
    marginTop: 4,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  orderButton: {
    paddingVertical: 18,
    borderRadius: 14,
    backgroundColor: COFFEE_TINT,
    alignItems: "center",
    justifyContent: "center",
  },
  orderButtonPressed: {
    opacity: 0.9,
  },
  orderButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
