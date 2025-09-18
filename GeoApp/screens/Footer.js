import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = ({ status, eta }) => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.statusText}>Status: **{status}**</Text>
      {eta && <Text style={styles.etaText}>ETA: **{eta}**</Text>}
    </View>
  );
};

// Use StyleSheet.create para definir os estilos
const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#333',
    padding: 15,
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statusText: {
    margin: 0,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  etaText: {
    margin: 0,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
});

export default Footer;