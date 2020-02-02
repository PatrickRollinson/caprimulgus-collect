function getData() {
    return new Promise((resolve, reject)=> {
        let request = new XMLHttpRequest();
        request.open('GET', '/audio/song2.mp3', true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            console.log('Loaded')
            resolve(request.response)
        }
        request.onerror = (error) => {
            reject(error)
        }
        request.send();
    })
}

async function processAudio ( decodedBuffer, fftSize ){
    return new Promise((resolve, reject)=> {
        console.log('processAudio', decodedBuffer)
        let data = [];

        // offline
        let offlineCtx = new OfflineAudioContext(decodedBuffer.numberOfChannels, decodedBuffer.length, decodedBuffer.sampleRate);
        let source = offlineCtx.createBufferSource();
        source.buffer = decodedBuffer;
        
        let analyser = offlineCtx.createAnalyser();
        analyser.fftSize = fftSize;
        let bufferLength = analyser.frequencyBinCount;
        console.log('bufferLength:', offlineCtx);

        // connecting
        source.connect(analyser);
        analyser.connect(offlineCtx.destination);

        //source.loop = true;
        function onsuspended() {
            // console.log('Suspended', offlineCtx.currentTime);
            var dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);
            // console.log(dataArray)
            data.push(dataArray)
            offlineCtx.suspend(offlineCtx.currentTime + 0.0001).then(onsuspended);
            offlineCtx.resume();
        }

        source.start();
        offlineCtx.suspend(0.0).then(onsuspended);
        offlineCtx.startRendering().then(()=>{
            console.log('Rendering completed successfully');
            resolve(data)
        }).catch((err)=>{
            console.log('Rendering failed: ' + err);
            reject(err);
        })
    })
} 
       


async function init (){
    try {
        let audioCtx = new AudioContext();
        let buffer = await getData().then( x => x).catch(e => {throw e});
        let fftSize = 1024;
        let freqBands = fftSize/2;
        let decodedBuffer = await audioCtx.decodeAudioData(buffer)
            .then( x => x)
            .catch((e) => { throw e })
        let duration = decodedBuffer.duration;
        let audioData = await processAudio(decodedBuffer, fftSize);
        
        // connecting up the audio
        let song = audioCtx.createBufferSource();
        song.buffer = decodedBuffer;
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

        // spectogram
        let canvas = document.getElementById("spectogram");
        let ctx = canvas.getContext("2d");

        let imgData = await generateSpectogram(audioData) //generate spectogram
        timeLoop() // updates the timeLine on canvas

        async function generateSpectogram(data){
            return new Promise((resolve, reject)=>{
                console.log('data: ', data.length)
                
                let divWidth = canvas.width / data.length;
                let divHeight = canvas.height / freqBands;

                let numFreqBands = data[0].length;
                let numTimeSteps = data.length;
                

                // generate a second canvas
                var renderer = document.createElement('canvas');
                renderer.width = numTimeSteps;
                renderer.height = numFreqBands;

                // render our ImageData on this canvas
                renCtx = renderer.getContext('2d')
                let imageData = renCtx.getImageData(0, 0, numTimeSteps, numFreqBands);
                console.log(imageData)

                let pixels = imageData.data;
                let pixelData = [];
                for(let f = numFreqBands; f > 0; f--){
                    //console.log('freq:', f);
                    for (let t = 0; t < data.length; t++){
                        //console.log('time:', t);
                        let timeData = data[t];
                        pixelData.push(timeData[f]);    
                    }
                }
                for(let p =0; p < pixelData.length; p++){
                    pixels[(p*4)+3] = pixelData[p]
                }
                console.log('freqData', numFreqBands*numTimeSteps, numFreqBands*numTimeSteps)
                //console.log('pixelData:', pixelData)
                renCtx.putImageData(imageData, 0, 0)

                let width = window.innerWidth -30;
                let height = 300//window.innerHeight;
                canvas.width = width;
                canvas.height = height;
                
                ctx.drawImage(renderer, 0, 0, width, height)
                let imgData = ctx.getImageData(0,0, width, height)

                //console.log(ctx.getImageData(0, 0, width, height))
                // ctx.drawImage(canvas, 0, 0, window.width, 300)
                resolve(imgData)
            })  
        }

        function timeLoop(){
            window.requestAnimationFrame(timeLoop)
            let currTime = audioCtx.currentTime;
            let currX = currTime/duration * canvas.width;
            
            ctx.putImageData(imgData, 0, 0);
        
            ctx.beginPath();
            ctx.strokeStyle = "#FF0000";
            ctx.moveTo(currX, 0);
            ctx.lineTo(currX, canvas.height);
            ctx.stroke();
        }
    }catch(err){
        console.error(err);
    }
}

init()