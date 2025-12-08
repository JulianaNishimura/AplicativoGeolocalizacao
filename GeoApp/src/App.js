import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import React, { useState } from "react";
import TelaInicial from "../screens/TelaInicial";
import MarkerListScreen from "../screens/MarkerListScreen";

const Tab = createBottomTabNavigator();

export default function App() {
    const [markers, setMarkers] = useState([]);
    const [destination, setDestination] = useState(null);

    return (
        <>
            <StatusBar style="light" backgroundColor="#131317ff" />
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={{
                        tabBarStyle: { backgroundColor: "#1a1a1f" },
                        headerShown: false,
                    }}
                >
                    <Tab.Screen name="Mapa">
                        {(props) => (
                            <TelaInicial
                                {...props}
                                markers={markers}
                                setMarkers={setMarkers}
                                destination={destination}
                                setDestination={setDestination}
                            />
                        )}
                    </Tab.Screen>
                    <Tab.Screen name="Marcadores">
                        {(props) => (
                            <MarkerListScreen
                                {...props}
                                markers={markers}
                                setDestination={setDestination}
                            />
                        )}
                    </Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
        </>
    );
}
