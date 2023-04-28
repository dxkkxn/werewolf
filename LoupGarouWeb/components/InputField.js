import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

export const InputField = (props) => {
  const [loaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  return (
    <TextInput
      style={styles.form}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder}
      secureTextEntry={props.secureTextEntry}
      placeholderTextColor="rgba(255, 255, 255, 0.5)"
      
    />
  );
};


export default InputField;

const styles = StyleSheet.create({
  form: {
    boxSizing: 'border-box',
    height: 50,
    width: 250,
    margin: 5,
    backgroundColor: 'rgba(120, 88, 166, 0.1)',
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#7858A6',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    fontFamily: 'Poppins',
  },
});

