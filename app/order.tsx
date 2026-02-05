import { Image } from "expo-image";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  SegmentedButtons,
  Surface,
  Text,
} from "react-native-paper";

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
    <Surface style={[styles.container, { paddingTop: insets.top }]} elevation={0}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <Text variant="titleLarge" style={styles.headerTitle}>
          Order
        </Text>
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
        <SegmentedButtons
          value={deliveryType}
          onValueChange={(v) => setDeliveryType(v as "deliver" | "pickup")}
          buttons={[
            { value: "deliver", label: "Deliver" },
            { value: "pickup", label: "Pick Up" },
          ]}
          style={styles.toggleContainer}
        />

        {/* Delivery Address */}
        {deliveryType === "deliver" && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Delivery Address
            </Text>
            <Surface style={styles.addressCard} elevation={0}>
              <Text variant="bodyMedium" style={styles.addressLine}>
                {shortAddress}
              </Text>
              <Text variant="bodyMedium" style={styles.addressLine}>
                {displayAddress}
              </Text>
              <View style={styles.addressButtons}>
                <Pressable
                  style={styles.addressButton}
                  onPress={() => router.push("/edit-address")}
                >
                  <MaterialIcons name="edit" size={18} color={COFFEE_TINT} />
                  <Text variant="labelLarge" style={styles.addressButtonText}>
                    Edit Address
                  </Text>
                </Pressable>
                <Pressable style={styles.addressButton}>
                  <MaterialIcons name="note-add" size={18} color={COFFEE_TINT} />
                  <Text variant="labelLarge" style={styles.addressButtonText}>
                    Add Note
                  </Text>
                </Pressable>
              </View>
            </Surface>
          </View>
        )}

        {/* Order Items */}
        <View style={styles.section}>
          {items.map((item) => (
            <Surface key={item.id} style={styles.orderItem} elevation={0}>
              <Image
                source={item.image}
                style={styles.orderItemImage}
                contentFit="cover"
              />
              <View style={styles.orderItemDetails}>
                <Text variant="titleMedium" style={styles.orderItemName}>
                  {item.name}
                </Text>
                <Text variant="bodySmall" style={styles.orderItemDesc}>
                  {item.description}
                </Text>
                <View style={styles.quantityRow}>
                  <Pressable
                    style={styles.quantityBtn}
                    onPress={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                  >
                    <MaterialIcons name="remove" size={20} color="#6B7280" />
                  </Pressable>
                  <Text variant="titleMedium" style={styles.quantityValue}>
                    {item.quantity}
                  </Text>
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
            </Surface>
          ))}
        </View>

        {/* Discount */}
        <Surface style={styles.discountBanner} elevation={0}>
          <MaterialIcons name="local-offer" size={22} color={COFFEE_TINT} />
          <Text variant="titleMedium" style={styles.discountText}>
            1 Discount is Applies
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </Surface>

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Payment Summary
          </Text>
          <View style={styles.summaryRow}>
            <Text variant="bodyMedium" style={styles.summaryLabel}>
              Price
            </Text>
            <Text variant="bodyMedium" style={styles.summaryValue}>
              $ {subtotal.toFixed(2)}
            </Text>
          </View>
          {deliveryType === "deliver" && (
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium" style={styles.summaryLabel}>
                Delivery Fee
              </Text>
              <View style={styles.deliveryFeeRow}>
                <Text variant="bodyMedium" style={styles.deliveryFeeOriginal}>
                  $ {DELIVERY_FEE_ORIGINAL.toFixed(1)}
                </Text>
                <Text variant="bodyMedium" style={styles.summaryValue}>
                  $ {DELIVERY_FEE_DISCOUNTED.toFixed(1)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.paymentSection}>
          <Surface style={styles.paymentMethod} elevation={0}>
            <MaterialIcons name="account-balance-wallet" size={24} color={COFFEE_TINT} />
            <View style={styles.paymentMethodInfo}>
              <Text variant="titleMedium" style={styles.paymentMethodLabel}>
                Cash/Wallet
              </Text>
              <Text variant="headlineSmall" style={styles.paymentTotal}>
                $ {total.toFixed(2)}
              </Text>
            </View>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#9CA3AF" />
          </Surface>
        </View>
      </ScrollView>

      {/* Order Button */}
      <Surface
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + 16 },
        ]}
        elevation={2}
      >
        <Button
          mode="contained"
          onPress={() => {
            isPlacingOrder.current = true;
            router.replace("/delivery");
            clearCart();
          }}
          buttonColor={COFFEE_TINT}
          style={styles.orderButton}
        >
          Order
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: "#1F2937",
    fontWeight: "700",
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    padding: 24,
  },
  toggleContainer: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#1F2937",
    fontWeight: "700",
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
    color: COFFEE_TINT,
    fontWeight: "600",
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
    color: "#1F2937",
    fontWeight: "700",
    marginBottom: 2,
  },
  orderItemDesc: {
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
    color: "#1F2937",
    fontWeight: "600",
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
    color: "#92400E",
    fontWeight: "600",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    color: "#6B7280",
  },
  summaryValue: {
    color: "#1F2937",
    fontWeight: "700",
  },
  deliveryFeeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deliveryFeeOriginal: {
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
    color: "#1F2937",
    fontWeight: "600",
  },
  paymentTotal: {
    color: COFFEE_TINT,
    fontWeight: "700",
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
    paddingVertical: 6,
  },
});
