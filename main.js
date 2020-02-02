
const audioContext = new AudioContext();

// get the audio element
const audioElement = document.querySelector('audio');

// pass it into the audio context
const track = audioContext.createMediaElementSource(audioElement);
track.connect(audioContext.destination);

console.log(audioContext);
console.log(audioElement);

// select our play button
const playButton = document.querySelector('button');

playButton.addEventListener('click', function() {

    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === 'suspended') {
        console.log('suspended')
        audioContext.resume();
    }

    // play or pause track depending on state
    if (this.dataset.playing === 'false') {
        audioElement.play();
        this.dataset.playing = 'true';
        console.log('play')
    } else if (this.dataset.playing === 'true') {
        audioElement.pause();
        this.dataset.playing = 'false';
        console.log('pause')
    }
}, false);


var audioCtx = new AudioContext();
var canvas = document.getElementById("spectogram");
var canvasCtx = canvas.getContext("2d");


audioContext.decodeAudioData(track).then((decodedData) => {
    console.log(decodedData)
    var offlineCtx = new OfflineAudioContext(decodedData.numberOfChannels, Math.ceil(decodedData.duration*decodedData.sampleRate), decodedData.sampleRate);
    source = offlineCtx.createBufferSource();
    source.buffer = decodedData
    console.log('source', source)
    console.log('offlineCtx', offlineCtx)
    const analyser = offlineCtx.createAnalyser();
    analyser.fftSize = 1024;
    // analyser.smoothingTimeConstant = 0.0;
    source.connect(analyser);
    analyser.connect(offlineCtx.destination)
    //for(let i = 0; i < source.buffer)
    length = source.buffer.duration;
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    let data = []
    function onsuspended() {
        console.log('Suspended', offlineCtx.currentTime);
        var dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        data.push(dataArray)
        offlineCtx.suspend(offlineCtx.currentTime + 1.0).then(onsuspended);
        offlineCtx.resume();
    }
    
    offlineCtx.suspend(0.0).then(onsuspended);
    offlineCtx.startRendering().then((renderedBuffer)=>{
        console.log(data)
        console.log('Rendering completed successfully');
    }); 
});

function getData() {
    return new Promise((resolve, reject)=> {
        request = new XMLHttpRequest();
        request.open('GET', 'song.mp3', true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            resolve(request.response);
        }
        request.send();
    })
}


getData().then((buffer)=>{
    let source = audioContext.decodeAudioData(buffer)
})

function getData() {
  var source = audioCtx.createBufferSource();
  var request = new XMLHttpRequest();
  request.open('GET', './audio/song.mp3', true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;
    audioCtx.decodeAudioData(audioData, function(buffer) {
        source.buffer = buffer;
        source.connect(audioCtx.destination);
      },
      function(e){ console.log("Error with decoding audio data" + e.err); });
  }
  request.send();
}

// wire up buttons to stop and play audio

play.onclick = function() {
  getData();
  source.start(0);
  play.setAttribute('disabled', 'disabled');
}

stop.onclick = function() {
  source.stop(0);
  play.removeAttribute('disabled');
}


