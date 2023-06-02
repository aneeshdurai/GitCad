import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import BuddySearchScreen from "./ProjectAdd/ProjectAdd.main";
import {HomeStackScreen} from "./HomePageScreen/HomeStackScreen";
import ListofBuddies from "./HomePageScreen/ListofBuddies";


export type RootStackParamList = {
  HomeStackScreen: undefined;
  BuddySearchScreen: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export function RootStackScreen() {
  const options = { headerShown: false };
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{ presentation: "modal" }}
        initialRouteName="BuddySearchScreen"
      >
        <RootStack.Screen
          name="BuddySearchScreen"
          options={options}
          component={BuddySearchScreen}
        />
        <RootStack.Screen
          name="HomeStackScreen"
          component={HomeStackScreen}
          options={options}
        />
        
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
