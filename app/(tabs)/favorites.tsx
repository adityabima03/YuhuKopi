import { Surface, Text } from "react-native-paper";

export default function FavoritesScreen() {
  return (
    <Surface
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F0",
      }}
      elevation={0}
    >
      <Text variant="titleLarge" style={{ color: "#333" }}>
        Favorites
      </Text>
    </Surface>
  );
}
