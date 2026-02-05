import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const COFFEE_TINT = "#A0522D";

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COFFEE_TINT,
    primaryContainer: "#F5E6D3",
    onPrimary: "#FFFFFF",
    onPrimaryContainer: "#3D2817",
  },
  roundness: 12,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COFFEE_TINT,
    primaryContainer: "#2D2D2D",
    onPrimary: "#FFFFFF",
    onPrimaryContainer: "#F5E6D3",
    surface: "#151718",
    background: "#151718",
  },
  roundness: 12,
};
