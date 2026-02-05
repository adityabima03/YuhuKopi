import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const COFFEE_TINT = "#A0522D";

type Props = {
  destination: { latitude: number; longitude: number };
  initialRegion?: object;
  routeCoordinates?: object[];
  courierPosition?: object;
  mapRef?: React.RefObject<any>;
};

export default function DeliveryMap({ destination }: Props) {
  const openMapsWeb = () => {
    const url = `https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={[styles.map, styles.placeholder]}>
      <MaterialCommunityIcons name="map-marker" size={48} color={COFFEE_TINT} />
      <Text variant="bodyLarge" style={styles.placeholderText}>
        Peta hanya tersedia di Android/iOS
      </Text>
      <Pressable style={styles.button} onPress={openMapsWeb}>
        <Text variant="labelLarge" style={styles.buttonText}>
          Buka di Google Maps
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  placeholderText: {
    color: "#6B7280",
  },
  button: {
    backgroundColor: COFFEE_TINT,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
  },
});
