import { create } from "zustand";

export interface DeliveryAddress {
  street: string;
  fullAddress: string;
  city?: string;
  region?: string;
  latitude: number;
  longitude: number;
}

// Hanya untuk fallback koordinat map saat address belum tersedia
export const FALLBACK_COORDS = { latitude: 0, longitude: 0 };

interface AddressStore {
  address: DeliveryAddress | null;
  isLoading: boolean;
  error: string | null;
  setAddress: (address: DeliveryAddress) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getDisplayAddress: () => string;
  getShortAddress: () => string;
  getLocationDisplay: () => string;
}

export const useAddressStore = create<AddressStore>((set, get) => ({
  address: null,
  isLoading: false,
  error: null,

  setAddress: (address) => set({ address, error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  getDisplayAddress: () => {
    const { address, isLoading } = get();
    if (!address) return isLoading ? "Getting location..." : "Location not set";
    return address.fullAddress || address.street;
  },

  getShortAddress: () => {
    const { address, isLoading } = get();
    if (!address) return isLoading ? "Getting location..." : "Location";
    return address.street || address.fullAddress?.split(",")[0] || "Address";
  },

  getLocationDisplay: () => {
    const { address, isLoading } = get();
    if (!address) return isLoading ? "Getting location..." : "Location";
    if (address.city && address.region) return `${address.city}, ${address.region}`;
    return address.street || address.fullAddress?.split(",")[0] || "Address";
  },
}));
