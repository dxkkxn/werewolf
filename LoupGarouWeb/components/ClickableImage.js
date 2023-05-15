import { Image, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native-web';

export default function ClickableImage({ source, onPress, symbol }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Image
                source={source}
                style={symbol == 'burguerMenu' ? styles.burguerMenu : styles.leftArrow}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    burguerMenu: {
        width: '27px',
        height: '15px',
    // display: "inline-block",
    // color: "white",
    },
    leftArrow: {
        width: '25.5px',
        height: '18.21px',
    },
});