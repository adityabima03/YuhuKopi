/**
 * API client untuk Mymobile Backend
 * Base URL otomatis untuk:
 * - iOS Simulator: http://localhost:8080
 * - Android Emulator: http://10.0.2.2:8080
 * - Physical device (Expo Go): http://<IP-KOMPUTER>:8080 (pakai IP yang sama dengan Metro)
 */

import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

const API_PORT = 8080;

const getBaseUrl = () => {
  if (!__DEV__) {
    return "https://api.mymobile.com";
  }

  // Physical device: ambil IP dari Expo (host Metro bundler)
  // hostUri = "192.168.1.5:8081" -> pakai 192.168.1.5:8080 untuk API
  const hostUri =
    Constants.expoConfig?.hostUri ?? Constants.manifest?.debuggerHost;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    return `http://${host}:${API_PORT}`;
  }

  // Emulator/Simulator
  return Platform.select({
    ios: `http://localhost:${API_PORT}`,
    android: `http://10.0.2.2:${API_PORT}`,
    default: `http://localhost:${API_PORT}`,
  });
};

export const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export interface Coffee {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  rating: string;
  reviews: string;
  image: string;
  fullDescription?: string;
}

interface ApiResponse<T> {
  data: T;
}

export async function fetchCoffees(): Promise<Coffee[]> {
  const res = await api.get<ApiResponse<Coffee[]>>("/api/coffees");
  return res.data.data;
}

export async function fetchCoffeeById(id: string): Promise<Coffee | null> {
  try {
    const res = await api.get<ApiResponse<Coffee>>(`/api/coffees/${id}`);
    return res.data.data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw new Error("Gagal mengambil detail coffee");
  }
}

// --- Order API ---

export interface OrderItemPayload {
  coffeeId: string;
  name: string;
  description: string;
  price: string;
  size: string;
  quantity: number;
}

export interface DeliveryAddressPayload {
  street: string;
  fullAddress: string;
  city?: string;
  region?: string;
  latitude: number;
  longitude: number;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
  deliveryType: "deliver" | "pickup";
  address?: DeliveryAddressPayload;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface CreateOrderResponse {
  data: {
    id: string;
    items: OrderItemPayload[];
    deliveryType: string;
    subtotal: number;
    deliveryFee: number;
    total: number;
    status: string;
  };
  message: string;
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const res = await api.post<CreateOrderResponse>("/api/orders", payload);
  return res.data;
}
