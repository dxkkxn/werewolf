import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LockScreen from './LockScreen';
import Welcome from './Welcome';
import Form from './Form';
import Join from './Join';
import WaitingRoom from './WaitingRoom.js';
import Avatars from './AvailableAvatars';
import Partie from './Partie.js';

const Stack = createNativeStackNavigator();

export function MainNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="LockScreen" component={LockScreen} options={{headerShown: false}} />
            <Stack.Screen name="Avatars" component={Avatars} options={{headerShown: false}} />
            <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}} />
            <Stack.Screen name="Form" component={Form} options={{headerShown: false}} />
            <Stack.Screen name="Join" component={Join} options={{headerShown: false}} />
            <Stack.Screen name="Partie" component={Partie} options={{headerShown: false}} />
            <Stack.Screen name="WaitingRoom" component={WaitingRoom} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}

