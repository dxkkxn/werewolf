import React from 'react';
import { useFonts } from 'expo-font';
import { View, StyleSheet, Text } from 'react-native';
import SquareButton from './SquareButton.js';
import CreerPartie from '../assets/CreerPartie.png'
import RejoindrePartie from '../assets/RejoindrePartie.png'

export const Home = ({pseudo}) => {
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}> Bonjour {pseudo} ! </Text>
      <SquareButton icon={CreerPartie} onPress={() => alert('Button 1 pressed')} size={0.3} title="Créer une partie" />
      <SquareButton icon={RejoindrePartie} onPress={() => alert('Button 2 pressed')} size={0.3} title="Rejoindre une partie" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '70%',
    top: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text:{
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 28,
    lineHeight: 42,
    color: 'white',
  },
});

