const getMediaBtn = document.querySelector('.container .getMedia');
const startWaveBtn = document.querySelector('.container .startWave');
const endWaveBtn = document.querySelector('.container .endWave');
let stream;
  
let wave;
let micContext;
let mediaStreamSource;
let levelChecker;

let createWaveSurfer = function(stream) {
    if (wave) wave.destroy();

    wave = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'rgb(31,159,252)',
        barHeight: 3,
        barGap: 2,
        backgroundColor: "rgba(0,0,0,0)",
        cursorColor: "rgba(0,0,0,0)",
        audioRate: 1,
        barWidth: 2,
        interact: false, 
    });

    micContext = wave.backend.getAudioContext();
    mediaStreamSource = micContext.createMediaStreamSource(stream);
    levelChecker = micContext.createScriptProcessor(4096, 1, 1);

    mediaStreamSource.connect(levelChecker);
    levelChecker.connect(micContext.destination);

    levelChecker.onaudioprocess = function (event) {
        wave.empty();
        wave.loadDecodedBuffer(event.inputBuffer);
    };
};

let destroyWaveSurfer = function() {
    if (wave) {
        wave.destroy();
        console.log("hi");
        document.querySelector("#waveform").innerHTML = "";
        wave = undefined;
    }

    if (mediaStreamSource) {
        mediaStreamSource.disconnect();
        mediaStreamSource = undefined;
    }

    if (levelChecker) {
        levelChecker.disconnect();
        levelChecker.onaudioprocess = undefined;
        levelChecker = undefined;
    }
};

getMediaBtn.onclick = () => {
    const constraints = { audio: true, video: { facingMode: "user" } };
    navigator.mediaDevices.getUserMedia(constraints)
    .then(mediaStream => {
        stream = mediaStream;
        document.querySelector(".container video").srcObject = stream;
    })
    .catch(err => console.log(err));
}

startWaveBtn.onclick = () => {
    createWaveSurfer(stream);
}

endWaveBtn.onclick = destroyWaveSurfer;