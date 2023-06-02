import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { COLOR_ACCENT, COLOR_PRIMARY } from "./AppStyles";
import { initializeApp, getApps } from "firebase/app";
import { NavigationContainer } from "@react-navigation/native";
import { EntryStackScreen } from "./screens/EntryStackScreen";
import { createStackNavigator } from "@react-navigation/stack";


const firebaseConfig = require("./keys.json");

if (getApps().length == 0) {
  initializeApp(firebaseConfig);
}
/*
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: COLOR_PRIMARY,
    accent: COLOR_ACCENT,
  },
};
*/
export default function App() {
  // To use React Native Paper, we wrap our EntryStackScreen in
  // PaperProvider.
  // Learn More: https://callstack.github.io/react-native-paper/getting-started.html#usage
  return (
    <SafeAreaProvider>
      <PaperProvider /*theme={theme}*/>
        <EntryStackScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
