import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConectaBanco() {
    const [db, setDb] = useState(null);
    const [dados, setDados] = useState([]);

    useEffect(() => { criarBanco(); }, []);

    const criarBanco = async () => {
        const database = await SQLite.openDatabaseAsync('BancoApp');
        setDb(database);
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS locaisSalvos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                latitude TEXT NOT NULL,
                longitude TEXT NOT NULL
            );
        `);
    };

    const salvar = async () => {
        if (!db) return;

        const nome = await AsyncStorage.getItem('nome');
        const latitude = await AsyncStorage.getItem('latitude');
        const longitude = await AsyncStorage.getItem('longitude');
        

        const statement = await db.prepareAsync(
            'INSERT INTO locaisSalvos (nome, latitude, longitude) VALUES ($nome, $latitude, $longitude)'
        );

        try {
            await statement.executeAsync({ $nome: nome, $latitude: latitude, $longitude: longitude });
            alert("localização salvas no banco!");
        } finally {
            await statement.finalizeAsync();
        }
    };

    const pegarTudo = async () => {
        if (!db) return;
        const allRows = await db.getAllAsync('SELECT * FROM locaisSalvos');
        setDados(allRows);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={salvar}>
                <Text>💾 Salvar Foto + Localização</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={pegarTudo}>
                <Text>📄 Ver o que está salvo</Text>
            </TouchableOpacity>

            <FlatList
                data={dados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 10, alignItems: 'center' }}>
                        <Text>Id: {item.id}</Text>
                        <Text>Localização: {item.localizacao}</Text>
                        <Image
                            source={{ uri: `data:image/jpeg;base64,${item.imagem}` }}
                            style={{ width: 100, height: 100, borderRadius: 8 }}
                        />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 8 },
    button: { alignItems: "center", backgroundColor: "#DDDDDD", padding: 10, marginVertical: 10 },
});