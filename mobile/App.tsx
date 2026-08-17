import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

import NoticiasPTScreen from './screens/NoticiasPT';
import NoticiasIntScreen from './screens/NoticiasInt';
import FutebolScreen from './screens/Futebol';
import FinancasScreen from './screens/Financas';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: any;

              if (route.name === 'Portugal') {
                iconName = focused ? 'globe' : 'globe';
              } else if (route.name === 'Internacional') {
                iconName = focused ? 'earth' : 'earth';
              } else if (route.name === 'Futebol') {
                iconName = focused ? 'soccer-ball-o' : 'soccer-ball-o';
              } else if (route.name === 'Finanças') {
                iconName = focused ? 'money' : 'money';
              }

              return <FontAwesome name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#51D6C4',
            tabBarInactiveTintColor: '#8A93A0',
            tabBarStyle: {
              backgroundColor: '#11151A',
              borderTopColor: '#2A3038',
              paddingBottom: 8,
            },
            headerStyle: {
              backgroundColor: '#0A0D10',
              borderBottomColor: '#2A3038',
              borderBottomWidth: 1,
            },
            headerTintColor: '#E9ECEF',
            headerTitleStyle: {
              fontWeight: '600',
            },
          })}
        >
          <Tab.Screen
            name="Portugal"
            component={NoticiasPTScreen}
            options={{ title: 'Portugal' }}
          />
          <Tab.Screen
            name="Internacional"
            component={NoticiasIntScreen}
            options={{ title: 'Internacional' }}
          />
          <Tab.Screen
            name="Futebol"
            component={FutebolScreen}
            options={{ title: 'Futebol' }}
          />
          <Tab.Screen
            name="Finanças"
            component={FinancasScreen}
            options={{ title: 'Finanças' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
