import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text } from 'react-native';
import TelaInicial from './screens/TelaInicial';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#131317ff" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              backgroundColor: '#1a1a1f',
              borderTopColor: '#333',
            },
            tabBarActiveTintColor: '#00bcd4',
            tabBarInactiveTintColor: '#aaa',
          }}
        >
          <Tab.Screen
            name="Mapa"
            component={TelaInicial}
            options={{
              headerShown: false,
              tabBarIcon: () => <Text style={{ fontSize: 18 }}>🗺️</Text>,
              tabBarLabel: 'Mapa',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
