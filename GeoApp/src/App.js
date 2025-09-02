import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import TelaInicial from "../screens/TelaInicial";
export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#131317ff" />
      <TelaInicial />
    </>
  );
}
