import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import HomeScreen from "./src/HomeScreen";
import BusScreen from "./src/BusScreen";
import LogoutScreen from "./src/LogoutScreen";
import RegisterScreen from "./src/RegisterScreen";
import LoginScreen from "./src/LoginScreen";
import HospitalDetial from "./src/HospitalDetial";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Detail" component={HospitalDetial} />
        <Stack.Screen name="Home" component={DrawerNav} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const DrawerNav = () => {
  return (
    <Drawer.Navigator initialRouteName="Stops">
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  );
};
