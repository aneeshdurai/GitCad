import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomePageScreen from "./HomePageScreen";
import LogScreen from "./LogScreen";
import UpdateScreen from "./UpdateScreen";

export type HomeStackParamList = {
    HomePageScreen: undefined;
    LogScreen: undefined;
    UpdateScreen: undefined;
  };

const HomeStack = createStackNavigator<HomeStackParamList>();

export function HomeStackScreen() {
  const options = { headerShown: false }
  return (
    <HomeStack.Navigator
      initialRouteName="HomePageScreen"
      >
      <HomeStack.Screen
        name="HomePageScreen"
        options={options}
        component={HomePageScreen}
      />
      <HomeStack.Screen
        name="LogScreen"
        options={options}
        component={LogScreen}
      />
      <HomeStack.Screen
        name="UpdateScreen"
        options={options}
        component={UpdateScreen}
      />
    </HomeStack.Navigator>
  );
}
