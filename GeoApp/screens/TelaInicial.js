// TelaInicial.js
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Footer from './Footer'; // **Importe o Footer aqui**

export default function TelaInicial() {
  const [isGpsEnabled, setIsGpsEnabled] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eta, setEta] = useState(null);

  const getGpsStatus = () => {
    if (loading) {
      return "Conectando...";
    }
    if (isGpsEnabled && location) {
      return "Online";
    }
    return "Offline";
  };

  const toggleGps = async () => {
    // ... sua lógica existente para ligar/desligar o GPS
    if (!isGpsEnabled) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão para acessar a localização foi negada.");
        return;
      }
      setLoading(true);
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setLoading(false);
    } else {
      setLocation(null);
    }
    setIsGpsEnabled((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {/* ... o restante do seu código (header, mapa, etc.) */}
      
      {/* O componente Footer deve vir por último */}
      <Footer status={getGpsStatus()} eta={eta} />
    </View>
  );
}

// ... seus estilos existentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b21ff",
  },
  // ... outros estilos
});