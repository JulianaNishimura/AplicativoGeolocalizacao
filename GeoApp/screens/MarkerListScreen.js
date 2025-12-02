import React from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

export default function MarkerListScreen({
    navigation,
    markers,
    setDestination,
}) {
    return (
        <View style={styles.container}>
            <FlatList
                data={markers}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.coords}>
                            Lat: {item.coordinate.latitude.toFixed(6)}, Lng:{" "}
                            {item.coordinate.longitude.toFixed(6)}
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                setDestination(item.coordinate);
                                navigation.navigate("Mapa");
                            }}
                        >
                            <Text style={styles.buttonText}>Definir como destino</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b21ff',
  },
  item: {
    backgroundColor: '#2a2a2f',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    color: '#fff',
  },
  coords: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#00bcd4",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});
