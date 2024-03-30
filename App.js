import * as React from 'react';
import { View, Button, Text, ScrollView } from 'react-native';
import RNFS from 'react-native-fs';
import { request, check, PERMISSIONS } from 'react-native-permissions';
import styles from './Styles';

export default function App() {
  const [pausarContinuar, setPausarContinuar] = React.useState("Pausar");
  const [tempoAtual, setTempoAtual] = React.useState("00:00");
  const [tempoTotal, setTempoTotal] = React.useState("00:00");
  const [arquivos, setArquivos] = React.useState([]);

  const lerArquivos = async () => {
    /// Verifica a permissão de áudio
    const hasAudioPermission = await check(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO);
    if (hasAudioPermission !== 'granted') {
      const { status } = await request(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO);
      if (status !== 'granted') {
        console.log('Permissão de áudio negada');
        return;
      }
    }

    // Obtém o caminho da pasta de downloads
    const downloadsDir = RNFS.DownloadDirectoryPath;

    try {
      const files = await RNFS.readdir(downloadsDir);
      apenasAudios = [];
      for (const arquivo of files) {
        const fullPath = downloadsDir + "/" + arquivo;
        const stat = await RNFS.stat(fullPath);
        if(stat.isFile()){
            apenasAudios.push(arquivo);
        }
      }
      setArquivos(apenasAudios);
      console.log(apenasAudios);
    } catch (error) {
      console.log('Erro ao listar os arquivos:', error);
    }
  };

  React.useEffect(() => {
    lerArquivos();
  }, []);

  return (
    <View style={styles.fundo}>
      <Text style={styles.nomeMusica}>Nome da música</Text>
      <Button
        title={pausarContinuar}
        onPress={() => {
          if (pausarContinuar === "Pausar") {
            setPausarContinuar("Continuar");
          } else {
            setPausarContinuar("Pausar");//
          }
        }}
      />
      <Text style={styles.tempoMusica}>{tempoAtual}/{tempoTotal}</Text>
    </View>
  );
}