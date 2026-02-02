import * as Location from "expo-location";
import { useCallback, useEffect } from "react";

import type { DeliveryAddress } from "@/store/address";
import { useAddressStore } from "@/store/address";

async function fetchCurrentLocation(
  setAddress: (a: DeliveryAddress) => void,
  setLoading: (v: boolean) => void,
  setError: (v: string | null) => void
) {
  setLoading(true);
  setError(null);
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError("Location permission denied");
      return;
    }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
        maximumAge: 60000,
      });
    const { latitude, longitude } = location.coords;
    const [result] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (!result) return;
    const street =
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
    const fullAddress = parts.length > 0 ? parts.join(", ") : street;
    setAddress({
      street,
      fullAddress,
      city: result.city ?? undefined,
      region: result.region ?? undefined,
      latitude,
      longitude,
    });
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to get location");
  } finally {
    setLoading(false);
  }
}

export function useDeliveryAddress() {
  const { address, setAddress, setLoading, setError } = useAddressStore();

  const refreshLocation = useCallback(() => {
    fetchCurrentLocation(setAddress, setLoading, setError);
  }, [setAddress, setLoading, setError]);

  useEffect(() => {
    if (address) return;
    fetchCurrentLocation(setAddress, setLoading, setError);
  }, [address, setAddress, setLoading, setError]);

  return {
    address,
    isLoading: useAddressStore((s) => s.isLoading),
    error: useAddressStore((s) => s.error),
    refreshLocation,
  };
}
