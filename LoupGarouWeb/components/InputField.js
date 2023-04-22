import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export const InputField = (props) => {
  return (
    <TextInput
      style={styles.form}
      onChangeText={props.onChangeText}
      value={props.value}
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
    height: '10%',

    backgroundColor: 'rgba(120, 88, 166, 0.1)',
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#7858A6',

  },
});

