import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";

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
        <Text variant="titleLarge" style={styles.headerTitle}>
          Edit Address
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <Surface style={[styles.content, { paddingBottom: insets.bottom + 24 }]} elevation={0}>
        <Text variant="labelLarge" style={styles.label}>
          Street / Main Address
        </Text>
        <TextInput
          mode="outlined"
          value={street}
          onChangeText={setStreet}
          placeholder="Street name"
          style={styles.input}
          outlineColor="#E5E7EB"
          activeOutlineColor={COFFEE_TINT}
        />

        <Text variant="labelLarge" style={styles.label}>
          Full Address
        </Text>
        <TextInput
          mode="outlined"
          value={fullAddress}
          onChangeText={setFullAddress}
          placeholder="Street, city, region"
          multiline
          numberOfLines={3}
          style={[styles.input, styles.inputMultiline]}
          outlineColor="#E5E7EB"
          activeOutlineColor={COFFEE_TINT}
        />

        <Button
          mode="outlined"
          onPress={fetchLocationNow}
          disabled={isLoadingLocation}
          style={styles.useLocationButton}
          textColor={COFFEE_TINT}
          icon={isLoadingLocation ? undefined : "crosshairs-gps"}
          loading={isLoadingLocation}
        >
          Use Current Location
        </Button>

        <Button
          mode="contained"
          onPress={handleSave}
          disabled={isSaving}
          buttonColor={COFFEE_TINT}
          style={styles.saveButton}
          loading={isSaving}
        >
          Save Address
        </Button>
      </Surface>
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
    color: "#1F2937",
    fontWeight: "700",
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  label: {
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    marginBottom: 20,
  },
  inputMultiline: {
    minHeight: 80,
  },
  useLocationButton: {
    borderColor: COFFEE_TINT,
    marginBottom: 24,
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 6,
  },
});
