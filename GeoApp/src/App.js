import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import TelaInicial from "../screens/TelaInicial";
export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#131317ff" />
      <TelaInicial />
    </>
  );
}
