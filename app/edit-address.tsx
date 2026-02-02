import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAddressStore } from "@/store/address";

const COFFEE_TINT = "#A0522D";

export default function EditAddressScreen() {
  const insets = useSafeAreaInsets();
  const { address, setAddress } = useAddressStore();
  const [street, setStreet] = useState(address?.street ?? "");
  const [fullAddress, setFullAddress] = useState(address?.fullAddress ?? "");
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    address ? { lat: address.latitude, lng: address.longitude } : null
  );
  const [cityRegion, setCityRegion] = useState<{ city?: string; region?: string } | null>(
    address ? { city: address.city, region: address.region } : null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const hasFetchedInitial = useRef(false);

  useEffect(() => {
    if (address) {
      setStreet(address.street);
      setFullAddress(address.fullAddress);
      setLatLng({ lat: address.latitude, lng: address.longitude });
      setCityRegion({ city: address.city, region: address.region });
    }
  }, [address]);

  const fetchLocationNow = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission", "Location permission is required.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
        maximumAge: 60000,
      });
      const [result] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (result) {
        const s =
          [result.street, result.streetNumber].filter(Boolean).join(" ") ||
          result.name ||
          "Current Location";
        const parts = [
          result.street,
          result.streetNumber,
          result.district,
          result.subregion,
          result.city,
          result.region,
          result.postalCode,
          result.country,
        ].filter(Boolean);
        const full = parts.length > 0 ? parts.join(", ") : s;
        setStreet(s);
        setFullAddress(full);
        setLatLng({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
        setCityRegion({ city: result.city ?? undefined, region: result.region ?? undefined });
      }
    } catch {
      Alert.alert("Error", "Could not get current location.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Default dari location now saat address kosong
  useEffect(() => {
    if (address || hasFetchedInitial.current) return;
    hasFetchedInitial.current = true;
    fetchLocationNow();
  }, [address]);

  const handleSave = () => {
    const trimmedStreet = street.trim();
    const trimmedFull = fullAddress.trim();
    if (!trimmedStreet || !trimmedFull) {
      Alert.alert("Error", "Please fill in both street and full address.");
      return;
    }
    setIsSaving(true);
    setAddress({
      street: trimmedStreet,
      fullAddress: trimmedFull,
      city: cityRegion?.city ?? address?.city,
      region: cityRegion?.region ?? address?.region,
      latitude: latLng?.lat ?? address?.latitude ?? 0,
      longitude: latLng?.lng ?? address?.longitude ?? 0,
    });
    setIsSaving(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Address</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.label}>Street / Main Address</Text>
        <TextInput
          style={styles.input}
          value={street}
          onChangeText={setStreet}
          placeholder="Street name"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Full Address</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={fullAddress}
          onChangeText={setFullAddress}
          placeholder="Street, city, region"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
        />

        <Pressable
          style={({ pressed }) => [
            styles.useLocationButton,
            (isLoadingLocation || pressed) && styles.useLocationButtonPressed,
          ]}
          onPress={fetchLocationNow}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <ActivityIndicator size="small" color={COFFEE_TINT} />
          ) : (
            <>
              <MaterialIcons name="my-location" size={20} color={COFFEE_TINT} />
              <Text style={styles.useLocationText}>Use Current Location</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            (isSaving || pressed) && styles.saveButtonPressed,
          ]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Address</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  content: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1F2937",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  useLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COFFEE_TINT,
    borderRadius: 12,
  },
  useLocationButtonPressed: {
    opacity: 0.8,
  },
  useLocationText: {
    fontSize: 16,
    fontWeight: "600",
    color: COFFEE_TINT,
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 18,
    borderRadius: 14,
    backgroundColor: COFFEE_TINT,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonPressed: {
    opacity: 0.9,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
