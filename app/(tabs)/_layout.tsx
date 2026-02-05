import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";

const COFFEE_TINT = "#A0522D";

export default function TabLayout() {
  const itemCount = useCartStore((s) => s.getItemCount());
  const favoritesCount = useFavoritesStore((s) => s.getCount());

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COFFEE_TINT,
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarBadge: favoritesCount > 0 ? favoritesCount : undefined,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite-border" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="shopping-cart" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="notifications-none" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
