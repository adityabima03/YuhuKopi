import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef } from "react";
import {
  Dimensions,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import DeliveryMap from "@/components/DeliveryMap";
import { useAddressStore } from "@/store/address";

const COFFEE_TINT = "#A0522D";

// Binus University Anggrek - Jl. Kebon Jeruk Raya No.27, Jakarta Barat
const BINUS_ANGGREK_COORDS = {
  latitude: -6.2017561,
  longitude: 106.7823984,
};
// Rute motor: dirflg=l (two wheeler/motorcycle)
const getMotorRouteUrl = (
  origin: { latitude: number; longitude: number },
  dest: { latitude: number; longitude: number }
) =>
  `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${dest.latitude},${dest.longitude}&dirflg=l`;

const COURIER_POSITION = BINUS_ANGGREK_COORDS;

export default function DeliveryScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<any>(null);
  const getShortAddress = useAddressStore((s) => s.getShortAddress);
  const address = useAddressStore((s) => s.address);

  const destination = address
    ? { latitude: address.latitude, longitude: address.longitude }
    : BINUS_ANGGREK_COORDS;
  const routeCoordinates = [
    {
      latitude: BINUS_ANGGREK_COORDS.latitude - 0.002,
      longitude: BINUS_ANGGREK_COORDS.longitude - 0.002,
    },
    COURIER_POSITION,
    destination,
  ];
  const initialRegion = {
    latitude: destination.latitude,
    longitude: destination.longitude,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  };

  const centerOnLocation = () => {
    mapRef.current?.animateToRegion?.(
      {
        ...COURIER_POSITION,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      500
    );
  };

  const openMapsMotorRoute = () => {
    const url = getMotorRouteUrl(BINUS_ANGGREK_COORDS, destination);
    Linking.openURL(url);
  };

  const { height } = Dimensions.get("window");
  const mapHeight = height * 0.55;
  const isWeb = Platform.OS === "web";

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Map Section - DeliveryMap.web.tsx di web, DeliveryMap.tsx di native */}
      <View style={[styles.mapContainer, { height: mapHeight }]}>
        <DeliveryMap
          destination={destination}
          initialRegion={initialRegion}
          routeCoordinates={routeCoordinates}
          courierPosition={COURIER_POSITION}
          mapRef={mapRef}
        />

        {/* Map Controls */}
        <View style={[styles.mapControls, { top: insets.top + 12 }]}>
          <Pressable style={styles.mapButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
          </Pressable>
          <Pressable
            style={styles.mapButton}
            onPress={isWeb ? openMapsMotorRoute : centerOnLocation}
          >
            <MaterialIcons name="my-location" size={24} color="#1F2937" />
          </Pressable>
        </View>
      </View>

      {/* Bottom Info Section */}
      <Surface
        style={[styles.bottomSection, { paddingBottom: insets.bottom + 24 }]}
        elevation={0}
      >
        <Text variant="headlineSmall" style={styles.timeLeft}>
          10 minutes left
        </Text>
        <Text variant="bodyLarge" style={styles.deliveryTo}>
          Delivery to {getShortAddress()}
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressSegment, styles.progressFilled]} />
          <View style={[styles.progressSegment, styles.progressFilled]} />
          <View style={[styles.progressSegment, styles.progressEmpty]} />
        </View>

        {/* Delivery Status Card */}
        <Surface style={styles.statusCard} elevation={0}>
          <View style={styles.scooterIcon}>
            <MaterialCommunityIcons
              name="moped"
              size={32}
              color={COFFEE_TINT}
            />
          </View>
          <View style={styles.statusContent}>
            <Text variant="titleMedium" style={styles.statusTitle}>
              Delivered your order
            </Text>
            <Text variant="bodyMedium" style={styles.statusDesc}>
              Kurir motor akan mengantar pesanan Anda dalam waktu tercepat.
            </Text>
          </View>
        </Surface>

        {/* Courier Card */}
        <Surface style={styles.courierCard} elevation={0}>
          <View style={styles.courierAvatar}>
            <MaterialIcons name="person" size={32} color="#9CA3AF" />
          </View>
          <View style={styles.courierInfo}>
            <Text variant="titleMedium" style={styles.courierName}>
              Tapir Terbang
            </Text>
            <Pressable
              onPress={() =>
                Linking.openURL(
                  getMotorRouteUrl(BINUS_ANGGREK_COORDS, destination)
                )
              }
              style={styles.courierRolePressable}
            >
              <Text variant="bodyMedium" style={styles.courierRole}>
                Binus Anggrek
              </Text>
              <MaterialIcons
                name="open-in-new"
                size={16}
                color={COFFEE_TINT}
                style={styles.mapLinkIcon}
              />
            </Pressable>
          </View>
          <Pressable style={styles.callButton}>
            <MaterialIcons name="call" size={24} color="#FFFFFF" />
          </Pressable>
        </Surface>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mapContainer: {
    width: "100%",
    position: "relative",
  },
  mapControls: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mapButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: "#FFFFFF",
  },
  timeLeft: {
    color: "#1F2937",
    fontWeight: "700",
    marginBottom: 4,
  },
  deliveryTo: {
    color: "#6B7280",
    marginBottom: 12,
  },
  progressBar: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 20,
  },
  progressSegment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  progressFilled: {
    backgroundColor: "#22C55E",
  },
  progressEmpty: {
    backgroundColor: "#E5E7EB",
  },
  statusCard: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  scooterIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  statusContent: {
    flex: 1,
    marginLeft: 16,
  },
  statusTitle: {
    color: "#1F2937",
    fontWeight: "700",
    marginBottom: 4,
  },
  statusDesc: {
    color: "#6B7280",
    lineHeight: 20,
  },
  courierCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  courierAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  courierInfo: {
    flex: 1,
    marginLeft: 16,
  },
  courierName: {
    color: "#1F2937",
    fontWeight: "700",
    marginBottom: 2,
  },
  courierRolePressable: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  courierRole: {
    color: COFFEE_TINT,
    marginRight: 4,
  },
  mapLinkIcon: {
    marginTop: 2,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COFFEE_TINT,
    alignItems: "center",
    justifyContent: "center",
  },
});
