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

export default function TelaInicial() {
    const [loading, setLoading] = useState(false);
    const [isGpsEnabled, setIsGpsEnabled] = useState(false);
    const [location, setLocation] = useState(null);

    const toggleGps = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
        alert("Permissão para acessar a localização foi negada.");
        setIsGpsEnabled(false);
        return;
        }
        setIsGpsEnabled((prev) => !prev);
    };

    useEffect(() => {
        if (isGpsEnabled) {
        const getGpsLocation = async () => {
            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
        };
        getGpsLocation();
        } else {
        setLocation(null);
        }
    }, [isGpsEnabled]);

    return (
        <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
            <Text style={styles.headerText}>Location Reminders</Text>
            </View>

            {location ? (
            <MapView
                style={styles.map}
                region={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
                }}
            >
                <Marker
                coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                }}
                title="Você está aqui"
                />
            </MapView>
            ) : (
            <View style={[styles.map, styles.mapPlaceholder]}>
                {loading ? (
                <ActivityIndicator size="large" color="#00bcd4" />
                ) : (
                <Text style={{ color: "#ccc" }}>
                    Ative o GPS para mostrar sua localização
                </Text>
                )}
            </View>
            )}

            <View style={styles.navigator}>
            <TouchableOpacity style={styles.navButton}>
                <Text style={styles.navText}>Map</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
                <Text style={styles.navText}>List</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={toggleGps}>
                <Text style={styles.addButtonText}>
                {isGpsEnabled ? "📍" : "+"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
                <Text style={styles.navText}>Settings</Text>
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
        height: "95%",
        width: "100%",
    },
    mapPlaceholder: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2a2a2f",
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
        color: "#fff",
        fontSize: 14,
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#00bcd4",
        alignItems: "center",
        justifyContent: "center",
    },
    addButtonText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
    });