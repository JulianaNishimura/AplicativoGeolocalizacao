import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default function TelaInicial() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);

  const toggleGps = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão de localização negada.");
      setLoading(false);
      return;
    }

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setLocation(coords);

      if (mapRef.current) {
        mapRef.current.animateCamera({
          center: coords,
          zoom: 16,
        });
      }
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      alert("Erro ao obter localização: " + (error.message || "Desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  const renderMap = () => {
    if (location) {
      return (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
          showsMyLocationButton={false}
        >
          <Marker
            coordinate={location}
            title="Sua localização"
            description={`Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`}
          />
        </MapView>
      );
    } else {
      return (
        <View style={[styles.map, styles.mapPlaceholder]}>
          {loading ? (
            <ActivityIndicator size="large" color="#00bcd4" />
          ) : (
            <View style={styles.placeholderContent}>
              <Text style={styles.placeholderTitle}>
                📱 Location Reminders
              </Text>
              <Text style={styles.placeholderText}>
                Clique no botão + para ativar sua localização
              </Text>
              <Text style={styles.placeholderSubtext}>
                Permitiremos que você defina lembretes baseados em localização
              </Text>
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Location Reminders</Text>
        </View>

        {renderMap()}

        <View style={styles.navigator}>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navText}>🗺️</Text>
            <Text style={styles.navLabel}>Map</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navText}>📝</Text>
            <Text style={styles.navLabel}>List</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={toggleGps}>
            <Text style={styles.addButtonText}>
              {loading ? "..." : location ? "📍" : "+"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navText}>⚙️</Text>
            <Text style={styles.navLabel}>Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b21ff",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1f",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  mapPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2a2a2f",
  },
  placeholderContent: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  placeholderTitle: {
    color: "#00bcd4",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  placeholderSubtext: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  navigator: {
    flexDirection: "row",
    height: 80,
    backgroundColor: "#1a1a1f",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navText: {
    fontSize: 20,
    marginBottom: 4,
  },
  navLabel: {
    color: "#fff",
    fontSize: 12,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00bcd4",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});