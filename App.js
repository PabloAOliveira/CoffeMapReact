import * as React from "react";
import "react-native-get-random-values";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";
import WelcomeScreen from "./src/views/WelcomeScreen";
import TipoUsuario from "./src/views/TipoUsuario";
import CadastroScreen from "./src/views/CadastroScreen";
import LoginScreen from "./src/views/LoginScreen";
import LoginCliente from "./src/views/LoginCliente";
import CadastroCliente from "./src/views/CadastroCliente";
import HomeMap from "./src/views/HomeMap";
import ProfileScreen from "./src/views/ProfileScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen
          name="WelcomeScreen"
          options={{ headerShown: false }}
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="TipoUsuario"
          options={{ headerShown: false }}
          component={TipoUsuario}
        />
        <Stack.Screen
          name="LoginScreen"
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="LoginCliente"
          options={{ headerShown: false }}
          component={LoginCliente}
        />
        <Stack.Screen
          name="HomeMap"
          options={{ headerShown: false }}
          component={HomeMap}
        />
        <Stack.Screen
          name="CadastroScreen"
          options={{ headerShown: false }}
          component={CadastroScreen}
        />
        <Stack.Screen
          name="ProfileScreen"
          options={{ headerShown: false }}
          component={ProfileScreen}
        />
        <Stack.Screen
          name="CadastroCliente"
          options={{ headerShown: false }}
          component={CadastroCliente}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
