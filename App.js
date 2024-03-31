import * as React from 'react';
import { View, Button, Text, ScrollView } from 'react-native';
import RNFS from 'react-native-fs';
import { request, check, PERMISSIONS } from 'react-native-permissions';
import Sound from 'react-native-sound';
import styles from './Styles';
import formatarTempo from './utils/formatarTempo';

export default function App() {
  const [pausarOuTocar, setPausarOuTocar] = React.useState("Tocar");
  const [tempoAtual, setTempoAtual] = React.useState("00:00");
  const [tempoTotal, setTempoTotal] = React.useState("00:00");
  const [arquivos, setArquivos] = React.useState([]);
  const [som, setSom] = React.useState(null);
  const [downloadsDir, setDownloadsDir] = React.useState(RNFS.DownloadDirectoryPath);
  const [dirAudio, setDirAudio] = React.useState("");
  const [nomeMusicaAtual, setNomeMusicaAtual] = React.useState("Nome da música");

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
      apenasAudiosOrdenados = apenasAudios.sort();
      setArquivos(apenasAudiosOrdenados);
      return apenasAudiosOrdenados;
    } catch (error) {
      console.log('Erro ao listar os arquivos:', error);
    }
  };

  React.useEffect(() => {
    const carregarAudio = async () => {
      const arquivos2 = await lerArquivos(); // Aguarda a leitura dos arquivos
      console.log(arquivos2.length);
      const musicaAtual = 0;
      setNomeMusicaAtual(arquivos2[musicaAtual]);
      if (arquivos2.length > 0) {
        setDirAudio(downloadsDir + "/" + arquivos2[musicaAtual]);
        let novoSom = new Sound(downloadsDir + "/" + arquivos2[musicaAtual], Sound.MAIN_BUNDLE, error => {
          if (error) {
            console.log('Erro ao carregar o arquivo de áudio:', error);
            return;
          }
        });

        setSom(novoSom);
      }
  };

  carregarAudio();
}, []);

  return (
    <View style={styles.fundo}>
      <Text style={styles.nomeMusica}>{nomeMusicaAtual}</Text>
      <Button
        title={pausarOuTocar}
        onPress={() => {
          if (pausarOuTocar === "Pausa") {
            setPausarOuTocar("Tocar");
            som.pause();
          } else {
            setPausarOuTocar("Pausa");
            if(tempoTotal === "00:00"){
              setTempoTotal(formatarTempo(som.getDuration()));
            }
            som.play(() => {
              //som.release();
              //setSom(null);
              setPausarOuTocar("Tocar");
            });
          }
        }}
      />
      <Text style={styles.tempoMusica}>{tempoAtual}/{tempoTotal}</Text>
    </View>
  );
}