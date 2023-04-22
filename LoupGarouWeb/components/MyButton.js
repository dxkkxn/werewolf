//Button.js
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, View, Pressable, Text } from 'react-native';

export function MyButton({label, bg, onPress}){ //takes background color as parameter
  const bgStyle = {backgroundColor: bg};
	return (
		<View style={styles.buttonContainer}>
		<Pressable style={[styles.button, bgStyle]} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    height: '10%',
  },
  button: {
    borderRadius: 20,
    borderStyle: 'solild',
    borderColor: '#7858a6',
    borderWidth: 2,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 400,

    color: '#ffffff',
  },
});
