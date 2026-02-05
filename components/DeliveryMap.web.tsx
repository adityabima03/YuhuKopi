import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const COFFEE_TINT = "#A0522D";

type Props = {
  destination: { latitude: number; longitude: number };
  initialRegion?: object;
  routeCoordinates?: object[];
  courierPosition?: { latitude: number; longitude: number };
  mapRef?: React.RefObject<any>;
};

// Rute motor: dirflg=l (two wheeler/motorcycle)
const getMotorRouteUrl = (
  origin: { latitude: number; longitude: number },
  dest: { latitude: number; longitude: number }
) =>
  `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${dest.latitude},${dest.longitude}&dirflg=l`;

export default function DeliveryMap({ destination, courierPosition }: Props) {
  const origin = courierPosition ?? destination;
  const openMapsMotorRoute = () => {
    const url = getMotorRouteUrl(origin, destination);
    Linking.openURL(url);
  };

  return (
    <View style={[styles.map, styles.placeholder]}>
      <MaterialCommunityIcons name="map-marker" size={48} color={COFFEE_TINT} />
      <Text variant="bodyLarge" style={styles.placeholderText}>
        Peta hanya tersedia di Android/iOS
      </Text>
      <Pressable style={styles.button} onPress={openMapsMotorRoute}>
        <Text variant="labelLarge" style={styles.buttonText}>
          Buka Rute Motor di Google Maps
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
