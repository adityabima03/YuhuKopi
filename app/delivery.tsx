import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FALLBACK_COORDS, useAddressStore } from "@/store/address";

const COFFEE_TINT = "#A0522D";

const COURIER_POSITION = { latitude: 2.985, longitude: 99.612 };

export default function DeliveryScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const getShortAddress = useAddressStore((s) => s.getShortAddress);
  const address = useAddressStore((s) => s.address);

  const destination = address
    ? { latitude: address.latitude, longitude: address.longitude }
    : FALLBACK_COORDS;
  const routeCoordinates = [
    { latitude: 2.982, longitude: 99.608 },
    { latitude: 2.983, longitude: 99.61 },
    COURIER_POSITION,
    { latitude: 2.984, longitude: 99.615 },
    destination,
  ];
  const initialRegion = {
    latitude: destination.latitude,
    longitude: destination.longitude,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  };

  const centerOnLocation = () => {
    mapRef.current?.animateToRegion({
      ...COURIER_POSITION,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 500);
  };

  const { height } = Dimensions.get("window");
  const mapHeight = height * 0.55;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Map Section */}
      <View style={[styles.mapContainer, { height: mapHeight }]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          mapType="standard"
          showsUserLocation={false}
          showsMyLocationButton={false}
        >
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={COFFEE_TINT}
            strokeWidth={5}
          />
          <Marker
            coordinate={destination}
            pinColor={COFFEE_TINT}
            title="Tujuan"
          />
          <Marker
            coordinate={COURIER_POSITION}
            title="Kurir"
            pinColor={COFFEE_TINT}
          />
        </MapView>

        {/* Map Controls */}
        <View style={[styles.mapControls, { top: insets.top + 12 }]}>
          <Pressable
            style={styles.mapButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
          </Pressable>
          <Pressable style={styles.mapButton} onPress={centerOnLocation}>
            <MaterialIcons name="my-location" size={24} color="#1F2937" />
          </Pressable>
        </View>
      </View>

      {/* Bottom Info Section */}
      <View
        style={[
          styles.bottomSection,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <Text style={styles.timeLeft}>10 minutes left</Text>
        <Text style={styles.deliveryTo}>Delivery to {getShortAddress()}</Text>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressSegment, styles.progressFilled]} />
          <View style={[styles.progressSegment, styles.progressFilled]} />
          <View style={[styles.progressSegment, styles.progressEmpty]} />
        </View>

        {/* Delivery Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.scooterIcon}>
            <MaterialCommunityIcons
              name="moped"
              size={32}
              color={COFFEE_TINT}
            />
          </View>
          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>Delivered your order</Text>
            <Text style={styles.statusDesc}>
              We will deliver your goods to you in the shortest possible time.
            </Text>
          </View>
        </View>

        {/* Courier Card */}
        <View style={styles.courierCard}>
          <View style={styles.courierAvatar}>
            <MaterialIcons name="person" size={32} color="#9CA3AF" />
          </View>
          <View style={styles.courierInfo}>
            <Text style={styles.courierName}>Brooklyn Simmons</Text>
            <Text style={styles.courierRole}>Personal Courier</Text>
          </View>
          <Pressable style={styles.callButton}>
            <MaterialIcons name="call" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
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
  map: {
    width: "100%",
    height: "100%",
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
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  deliveryTo: {
    fontSize: 15,
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
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  statusDesc: {
    fontSize: 14,
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
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  courierRole: {
    fontSize: 14,
    color: "#6B7280",
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
