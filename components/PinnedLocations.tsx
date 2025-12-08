import { RootState } from "@/store";
import { PinnedLocation, removePin, setDestination } from "@/store/walksSlice";
import React from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const PinnedLocations = () => {
  const pinnedLocations = useSelector(
    (state: RootState) => state.walks.pinnedLocations,
  );
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  const handleSetDestination = (location: PinnedLocation) => {
    dispatch(setDestination(location));
  };

  const handleRemovePin = (id: string) => {
    dispatch(removePin(id));
  };

  const containerStyle =
    colorScheme === "dark" ? styles.containerDark : styles.containerLight;
  const textStyle = colorScheme === "dark" ? styles.textDark : styles.textLight;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, textStyle]}>Pinned Locations</Text>
      <FlatList
        data={pinnedLocations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.pinItem}>
            <Text style={textStyle}>{item.name}</Text>
            <Button
              title="Set as Destination"
              onPress={() => handleSetDestination(item)}
            />
            <Button title="Remove" onPress={() => handleRemovePin(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  containerLight: {
    backgroundColor: "white",
  },
  containerDark: {
    backgroundColor: "#333",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pinItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  textLight: {
    color: "black",
  },
  textDark: {
    color: "white",
  },
});

export default PinnedLocations;
