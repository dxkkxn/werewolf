import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LockScreen from './LockScreen';
import Welcome from './Welcome';

const Stack = createNativeStackNavigator();

export function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LockScreen" component={LockScreen} options={{headerShown: false}} />
      <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

