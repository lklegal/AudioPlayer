import * as React from 'react';
import { View, Button, Text, StyleSheet, Dimensions } from 'react-native';

export default function App() {
    const [n1, setN1] = React.useState('')
    const [n2, setN2] = React.useState('')
    const [resultado, setResultado] = React.useState('')

    return(
        <View style={styles.fundo}>
            <Text style={[styles.nomeMusica]}>Nome da música</Text>
            <Button title={"somar"} onPress={()=>{
                setResultado(parseFloat(n1) + parseFloat(n2))
            }}/>
        </View>
    );
}

//const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    fundo: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "#111111"
    },
    nomeMusica: {
        top: "60%",
        fontSize: 24,
        fontWeight: 'normal',
        color: 'white',
        position: 'absolute',
    },
    botao: {
        
    }
  });