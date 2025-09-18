<<<<<<< HEAD
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
=======
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import TelaInicial from "../screens/TelaInicial";
export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#131317ff" />
      <TelaInicial />
    </>
>>>>>>> 7714afb6998187a9171d866a3a1c81f6a13cc061
  );
}
