import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native";

export default function TelaInicial() {
    const [loading, setLoading] = useState(false);
    const [isGpsEnabled, setIsGpsEnabled] = useState(false);
    const [location, setLocation] = useState(null);

    const toggleGps = async () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        coords: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        }
                    });
                    setIsGpsEnabled(true);
                    setLoading(false);
                },
                (error) => {
                    alert("Erro ao obter localização: " + error.message);
                    setIsGpsEnabled(false);
                    setLoading(false);
                },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            );
        } else {
            alert("Geolocalização não é suportada neste navegador.");
        }
    };

    const renderMap = () => {
        if (location) {
            const { latitude, longitude } = location.coords;
            return (
                <View style={styles.map}>
                    <View style={styles.locationInfo}>
                        <Text style={styles.locationText}>
                            📍 Sua localização
                        </Text>
                        <Text style={styles.coordsText}>
                            Lat: {latitude.toFixed(6)}
                        </Text>
                        <Text style={styles.coordsText}>
                            Lng: {longitude.toFixed(6)}
                        </Text>
                        <TouchableOpacity 
                            style={styles.openMapButton}
                            onPress={() => {
                                const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
                                if (typeof window !== 'undefined') {
                                    window.open(url, '_blank');
                                }
                            }}
                        >
                            <Text style={styles.openMapText}>
                                Abrir no Google Maps
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
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