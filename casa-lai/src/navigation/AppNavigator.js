import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { ActivityIndicator, View } from 'react-native';
import COLORS from '../constants/colors';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';

// Navigators - usar solo Bottom Tabs
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, appReady } = useSelector((state) => state.auth);

  if (!appReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      {isAuthenticated ? (
        // Navegación principal con solo Bottom Tabs
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      ) : (
        // Pantallas de autenticación
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;