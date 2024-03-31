import * as React from 'react';
import { View, Button, Text, ScrollView } from 'react-native';
import RNFS from 'react-native-fs';
import { request, check, PERMISSIONS } from 'react-native-permissions';
import Sound from 'react-native-sound';
import styles from './Styles';
import formatarTempo from './utils/formatarTempo';

export default function App() {
  const [pausarOuTocar, setPausarOuTocar] = React.useState("Tocar");
  const [tempoAtual, setTempoAtual] = React.useState(0);
  const [tempoTotal, setTempoTotal] = React.useState(0);
  const [arquivos, setArquivos] = React.useState([]);
  const [som, setSom] = React.useState(null);
  const [downloadsDir, setDownloadsDir] = React.useState(RNFS.DownloadDirectoryPath);
  const [dirAudio, setDirAudio] = React.useState("");
  const [nomeMusicaAtual, setNomeMusicaAtual] = React.useState("Nome da música");
  const [musicaAtual, setMusicaAtual] = React.useState(0);
  const [corBotaoPlay, setCorBotaoPlay] = React.useState("#124812")
  const timerRef = React.useRef();

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
      let apenasAudios = [];
      for (const arquivo of files) {
        const fullPath = downloadsDir + "/" + arquivo;
        const stat = await RNFS.stat(fullPath);
        if(stat.isFile()){
          apenasAudios.push(arquivo);
        }
      }
      let apenasAudiosOrdenados = apenasAudios.sort();
      setArquivos(apenasAudiosOrdenados);
      return apenasAudiosOrdenados;
    } catch (error) {
      console.log('Erro ao listar os arquivos:', error);
    }
  };

  const carregarAudio = async (quaisArquivos, qualMusicaAtual) => {
    setNomeMusicaAtual(quaisArquivos[qualMusicaAtual]);
    if (quaisArquivos.length > 0) {
      setDirAudio(downloadsDir + "/" + quaisArquivos[qualMusicaAtual]);
      let novoSom = new Sound(downloadsDir + "/" + quaisArquivos[qualMusicaAtual], Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('Erro ao carregar o arquivo de áudio:', error);
          return;
        }
      });

      setSom(novoSom);
    }
  };

  React.useEffect(() => {
    const carregarPrimeiroAudio = async () => {
      const arquivos2 = await lerArquivos();
      carregarAudio(arquivos2, musicaAtual);
    }
    carregarPrimeiroAudio();
  }, []);

  if (timerRef.current){
    clearInterval(timerRef.current);
  }
  timerRef.current = setInterval(() => {
    if(som){
      som.getCurrentTime((segundos) => {
          setTempoAtual(segundos);
          setTempoTotal(som.getDuration())
      });
    }
  }, 300);

  const MudarAudio = (proximoOuAnterior) => {
    const indiceUltimoAudio = arquivos.length-1;
    let indiceNovoAudio;
    if(indiceUltimoAudio !== 0){
      indiceNovoAudio = (musicaAtual + proximoOuAnterior) % indiceUltimoAudio;
    }else{
      indiceNovoAudio = 0;
    }
    if(indiceNovoAudio < 0){
      indiceNovoAudio = indiceUltimoAudio;
    }
    setMusicaAtual(indiceNovoAudio);
    som.release();
    setPausarOuTocar("Tocar");
    setCorBotaoPlay("#124812");
    const carregarNovoAudio = async () => {
      await carregarAudio(arquivos, indiceNovoAudio);
    }
    carregarNovoAudio();
  }

  return (
    <View style={styles.fundo}>
      <Text style={styles.nomeMusica}>{nomeMusicaAtual}</Text>
      <View style={styles.botao}>
        <Button
          title={"Anterior"} color={"#242424"}
          onPress={() => {
            MudarAudio(-1);
          }}
        />
        <Button
          title={pausarOuTocar} color={corBotaoPlay}
          onPress={() => {
            if (pausarOuTocar === "Pausa") {
              setPausarOuTocar("Tocar");
              setCorBotaoPlay("#124812");
              som.pause();
            } else {
              setPausarOuTocar("Pausa");
              setCorBotaoPlay("#481212");
              if(tempoTotal === 0){
                setTempoTotal(som.getDuration());
              }
              som.play(() => {
                setPausarOuTocar("Tocar");
                setCorBotaoPlay("#124812");
              });
            }
          }}
        />
        <Button
          title={"Próximo"} color={"#242424"}
          onPress={() => {
            MudarAudio(1);
          }}
        />
      </View>
      <Text style={styles.tempoMusica}>{formatarTempo(tempoAtual)}/{formatarTempo(tempoTotal)}</Text>
    </View>
  );
}