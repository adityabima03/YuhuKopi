import MapView, { Marker, Polyline } from "react-native-maps";
import { StyleSheet } from "react-native";

const COFFEE_TINT = "#A0522D";

type Props = {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  routeCoordinates: Array<{ latitude: number; longitude: number }>;
  destination: { latitude: number; longitude: number };
  courierPosition: { latitude: number; longitude: number };
  mapRef: React.RefObject<MapView | null>;
};

export default function DeliveryMap({
  initialRegion,
  routeCoordinates,
  destination,
  courierPosition,
  mapRef,
}: Props) {
  return (
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
        coordinate={courierPosition}
        title="Kurir"
        pinColor={COFFEE_TINT}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
