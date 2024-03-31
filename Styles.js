import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    fundo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#111111"
    },
    nomeMusica: {
        top: "15%",
        fontSize: 24,
        fontWeight: 'normal',
        color: 'white',
        position: 'absolute',
    },
    tempoMusica: {
        top: "65%",
        fontSize: 15,
        fontWeight: 'normal',
        color: 'white',
        position: 'absolute',
    },
    botao: {
        width: 280,
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: "absolute",
        color: "#242424"
    }
  });

  export default styles;