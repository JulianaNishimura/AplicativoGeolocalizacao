import PinnedLocations from "@/components/PinnedLocations";
import { RootState } from "@/store";
import { addPin, addWalk, setDestination } from "@/store/walksSlice";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import haversine from "haversine";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import "react-native-get-random-values";
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function WalkApp() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(
    null,
  );
  const route = useRef<Location.LocationObjectCoords[]>([]);
  const [isWalking, setIsWalking] = useState(false);
  const [distance, setDistance] = useState(0);
  const watchId = useRef<Location.LocationSubscription>(null);
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const destination = useSelector((state: RootState) => state.walks.destination);

  const ARRIVAL_THRESHOLD = 50;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão negada para acessar a localização");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        zoom: 17,
      });
    }
  }, [location]);

  const startWalk = useCallback(async () => {
    setIsWalking(true);
    route.current = [];
    setDistance(0);

    watchId.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 5 },
      (loc) => {
        setLocation(loc.coords);
        route.current = [...route.current, loc.coords];

        if (route.current.length > 1) {
          const last = route.current[route.current.length - 2];
          const newDist = haversine(last, loc.coords, { unit: "meter" });

          setDistance((d) => d + newDist);
        }

        if (destination) {
          const distanceToDestination = haversine(loc.coords, destination, {
            unit: "meter",
          });
          if (distanceToDestination < ARRIVAL_THRESHOLD) {
            Notifications.scheduleNotificationAsync({
              content: {
                title: "Destino alcançado!",
                body: `Você chegou ao seu destino: ${destination.name}`,
              },
              trigger: null,
            });
            dispatch(setDestination(null));
          }
        }
      },
    );
  }, [destination, dispatch]);

  const stopWalk = useCallback(() => {
    setIsWalking(false);
    if (watchId.current) {
      watchId.current.remove();
    }

    if (route.current.length > 1) {
      dispatch(
        addWalk({
          id: uuid(),
          distance,
          date: new Date().toLocaleString("pt-BR"),
          route: route.current,
        }),
      );
    }
  }, [dispatch, distance]);

  const handleNavigateToHistory = useCallback(() => {
    router.navigate("/history");
  }, [router]);

  const handlePinLocation = useCallback(() => {
    if (location) {
      Alert.prompt("Pin Location", "Enter a name for this location", (name) => {
        if (name) {
          dispatch(
            addPin({
              id: uuid(),
              name,
              latitude: location.latitude,
              longitude: location.longitude,
            }),
          );
        }
      });
    }
  }, [dispatch, location]);

  if (!location) {
    return <Text>Carregando localização...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        customMapStyle={colorScheme === "dark" ? darkMapStyle : undefined}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        <Polyline
          coordinates={route.current}
          strokeWidth={5}
          strokeColor="blue"
        />
        {route.current.length > 0 && (
          <Marker coordinate={route.current[0]} title="Início" />
        )}
        {route.current.length > 1 && (
          <Marker
            coordinate={route.current[route.current.length - 1]}
            title="Agora"
          />
        )}
        {destination && (
          <Marker
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            title={destination.name}
            pinColor="green"
          />
        )}
      </MapView>

      <View
        style={[
          styles.panel,
          colorScheme === "dark" ? styles.panelDark : styles.panelLight,
          { bottom: insets.bottom + 40 },
        ]}
      >
        <Text style={[styles.text, colorScheme === "dark" ? { color: "white" } : { color: "black" }]}>
          Distância:{" "}
          {(distance / 1000).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          km
        </Text>
        {destination && (
          <Text style={styles.text}>
            Destino: {destination.name} (
            {(
              haversine(location, destination, { unit: "meter" }) / 1000
            ).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            km)
          </Text>
        )}
        {!isWalking ? (
          <Button title="Iniciar Caminhada" onPress={startWalk} />
        ) : (
          <Button title="Parar" onPress={stopWalk} />
        )}
        <Button title="Pin Location" onPress={handlePinLocation} />
        <Button title="Ver histórico" onPress={handleNavigateToHistory} />
        <PinnedLocations />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative" },
  map: { flex: 1 },
  panel: {
    position: "absolute",
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    gap: 10,
    elevation: 4,
  },
  text: { fontSize: 18 },
  panelLight: {
    backgroundColor: "white",
  },
  panelDark: {
    backgroundColor: "#333",
  },
});

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#303030" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1c1c1c" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
];
