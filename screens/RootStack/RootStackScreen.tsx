import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import ProjectAdd from "./ProjectAdd/ProjectAdd.main";
import {HomeStackScreen} from "./HomePageScreen/HomeStackScreen";


export type RootStackParamList = {
  HomeStackScreen: undefined;
  ProjectAdd: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export function RootStackScreen() {
  const options = { headerShown: false };
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{ presentation: "modal" }}
        initialRouteName="ProjectAdd"
      >
        <RootStack.Screen
          name="ProjectAdd"
          options={options}
          component={ProjectAdd}
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
