import { StyleSheet, View, Text} from 'react-native';


export const Banner = () =>{
  return(
    <View> 
      <Text style={styles.banner}>Loup-Garou </Text>
      <Text style={styles.banner}>En Ligne </Text>
    </View>

  );}

const styles = StyleSheet.create({
  banner: {
    fontFamily: 'Righteous',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 40,
    lineHeight: 50,
    textAlign: 'center',

    color: 'white',
  },
});

