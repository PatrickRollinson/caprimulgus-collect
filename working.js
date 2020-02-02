// define online and offline audio context

var audioCtx = new AudioContext();



let data = []
// use XHR to load an audio track, and
// decodeAudioData to decode it and OfflineAudioContext to render it

function getData() {
  request = new XMLHttpRequest();
  request.open('GET', '/audio/song12.mp3', true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;
    audioCtx.decodeAudioData(audioData, function(buffer) {
        myBuffer = buffer;
        var duration = buffer.duration;
        
        // analyser
        var offlineCtx = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
       
        var source = offlineCtx.createBufferSource();
        source.buffer = myBuffer;
        const analyser = offlineCtx.createAnalyser();
        analyser.fftSize = 1024;
        var bufferLength = analyser.frequencyBinCount;
        console.log(offlineCtx)

        source.connect(analyser);
        analyser.connect(offlineCtx.destination);
        source.start();
        //source.loop = true;
        function onsuspended() {
            // console.log('Suspended', offlineCtx.currentTime);
            var dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);
            data.push(dataArray)
            offlineCtx.suspend(offlineCtx.currentTime + 0.001).then(onsuspended);
            offlineCtx.resume();
        }
        offlineCtx.suspend(0.0).then(onsuspended);

      offlineCtx.startRendering().then(function(renderedBuffer) {
        console.log('Rendering completed successfully');
        // console.log(data);


        var canvas = document.getElementById("spectogram");
        var ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = 300;


        let freqBands = bufferLength
        let divWidth = canvas.width / data.length;
        let divHeight = canvas.height / freqBands;

        ctx.fillStyle = 'hsl(280, 100%, 10%)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // console.log(divWidth);
        for(let i = 0; i < data.length; i++){
            let timeData = data[i];
            for(let j = 0; j < freqBands; j++){
                
                let x = i * divWidth;
                let y = canvas.height - (divHeight * j);
                let w = divWidth;
                let h = divHeight;

                // console.log(x, y, w, h, timeData[j])

                let rat = timeData[j] / 255;
                let hue = Math.round((rat * 120) + 280 % 360);
                let sat = '100%';
                let lit = 10 + (70 * rat) + '%';
                let strokeStyle = `hsl(${hue}, ${sat}, ${lit})`;
                //console.log(strokeStyle)
                ctx.fillStyle = strokeStyle;
                ctx.fillRect(x, y, w, h);
            }   
        }
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        loop()

        function loop(){
            window.requestAnimationFrame(loop)
            let currTime = audioCtx.currentTime;
            let currX = currTime/duration * canvas.width;
            
            ctx.putImageData(imgData, 0, 0);
            // console.log(currX)
            ctx.beginPath();
            ctx.strokeStyle = "#FF0000";
            ctx.moveTo(currX, 0);
            ctx.lineTo(currX, canvas.height);
            ctx.stroke();
        }



        var song = audioCtx.createBufferSource();
        song.buffer = renderedBuffer;
        song.connect(audioCtx.destination);
        const play = document.querySelector('button');
        play.addEventListener('click', function() {

            // check if context is in suspended state (autoplay policy)
            if (audioCtx.state === 'suspended') {
                console.log('suspended')
                audioCtx.resume();
            }
        
            // play or pause track depending on state
            if (this.dataset.playing === 'false') {
                song.start(); //.play();
                this.dataset.playing = 'true';
                console.log('play')
            } else if (this.dataset.playing === 'true') {
                song.stop();
                this.dataset.playing = 'false';
                console.log('pause')
            }
        }, false);
      }).catch(function(err) {
          console.log('Rendering failed: ' + err);
          // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
      });
    });
  }

  request.send();
}

// Run getData to start the process off

getData();