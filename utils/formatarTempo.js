const formatarTempo = (tempo) => {
    const tempoF = parseFloat(tempo);
    let minutos = Math.floor(tempoF/60);
    let segundos = Math.ceil(tempoF - (minutos * 60));
    let horas = Math.floor(minutos / 60);
    minutos -= (horas * 60);

    if(horas > 99){
        horas = "99"
    } else{
        horas = "" + horas;
    }

    if(minutos < 10){
        minutos = "0" + minutos;
    }else{
        minutos = "" + minutos;
    }

    if(segundos < 10){
        segundos = "0" + segundos;
    }else{
        segundos = "" + segundos;
    }

    let tempoFormatado = "" + horas + ":" + minutos + ":" + segundos;

    if(horas === "0"){
        tempoFormatado = minutos + ":" + segundos;
    }

    return tempoFormatado;
}

export default formatarTempo;