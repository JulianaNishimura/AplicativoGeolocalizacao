import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import * as Notifications from "expo-notifications";
import { API_KEY } from "../src/config";

export default function TelaInicial({
    navigation,
    markers,
    setMarkers,
    destination,
    setDestination,
}) {
    const [loading, setLoading] = useState(false);
    const [isGpsEnabled, setIsGpsEnabled] = useState(false);
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const requestNotificationPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permissão negada",
                    "A permissão de notificação é necessária para receber lembretes."
                );
            }
        };
        requestNotificationPermissions();
    }, []);

    useEffect(() => {
        if (location && destination) {
            const distance = getDistance(
                { latitude: location.coords.latitude, longitude: location.coords.longitude },
                destination
            );
            if (distance < 100) {
                scheduleNotification();
            }
        }
    }, [location, destination]);

    const getDistance = (p1, p2) => {
        const R = 6378137;
        const dLat = ((p2.latitude - p1.latitude) * Math.PI) / 180;
        const dLong = ((p2.longitude - p1.longitude) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((p1.latitude * Math.PI) / 180) *
            Math.cos((p2.latitude * Math.PI) / 180) *
            Math.sin(dLong / 2) *
            Math.sin(dLong / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    };

    const scheduleNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Lembrete de Localização",
                body: "Você chegou ao seu destino!",
            },
            trigger: null,
        });
    };

    useEffect(() => {
        let subscription;
        const startWatching = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permissão negada",
                    "A permissão de localização é necessária para usar o GPS."
                );
                return;
            }

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1000,
                    distanceInterval: 1,
                },
                (location) => {
                    setLocation(location);
                }
            );
        };

        if (isGpsEnabled) {
            startWatching();
        }

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [isGpsEnabled]);

    const handleAddMarker = (coordinate) => {
        Alert.prompt("Novo Marcador", "Digite um nome para o marcador:", [
            {
                text: "Cancelar",
                style: "cancel",
            },
            {
                text: "Salvar",
                onPress: (title) => {
                    if (title) {
                        setMarkers([
                            ...markers,
                            { coordinate, title },
                        ]);
                    }
                },
            },
        ]);
    };

    const toggleGps = async () => {
        setLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permissão negada",
                    "A permissão de localização é necessária para usar o GPS."
                );
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setIsGpsEnabled(true);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível obter a localização.");
        } finally {
            setLoading(false);
        }
    };

    const renderMap = () => {
        if (location) {
            const { latitude, longitude } = location.coords;
            return (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude,
                        longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onLongPress={(e) => handleAddMarker(e.nativeEvent.coordinate)}
                >
                    <Marker
                        coordinate={{ latitude, longitude }}
                        title="Sua localização"
                    />
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            coordinate={marker.coordinate}
                            title={marker.title}
                        />
                    ))}
                    {destination && (
                        <MapViewDirections
                            origin={location.coords}
                            destination={destination}
                            apikey={API_KEY}
                            strokeWidth={3}
                            strokeColor="hotpink"
                        />
                    )}
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
                            {loading ? "..." : isGpsEnabled ? "📍" : "+"}
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
    locationInfo: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2a2a2f",
        padding: 20,
    },
    locationText: {
        color: "#00bcd4",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    coordsText: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 8,
        fontFamily: "monospace",
    },
    openMapButton: {
        backgroundColor: "#00bcd4",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    openMapText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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