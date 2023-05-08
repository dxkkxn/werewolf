import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import {useState} from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import Card from './Card.js';

const ruler = require("../assets/ruler&pen.svg");
const add = require("../assets/add-circle.svg");

export default function Welcome({ route }) {
  const navigation = useNavigation()
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  const { username } = route.params;
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Bonjour {username}</Text>
      <Card icon={ruler} text="Créer une partie" onPress={()=>navigation.navigate('Form')}/>
      <Card icon={add} text="Rejoindre une partie" onPress={()=>navigation.navigate('Join')} />
		</View>
	);
}

const styles = StyleSheet.create({
  container: {
    height: "80%",
    top: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontFamily: 'Poppins'
  },
})
