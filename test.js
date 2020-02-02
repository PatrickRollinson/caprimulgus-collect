function callback(data) {
    callback.count = callback.count || 0;
    console.log(callback.count++, data);
}
fftAnalyser = function(buff, sampleRate, fftSize, callback, onend) {

    // by Zibri (2019)
    var frequencies = [1000, 1200,1400,1600]; //for example
    var frequencyBinValue = (f)=>{
        const hzPerBin = (ctx.sampleRate) / (2 * analyser.frequencyBinCount);
        const index = parseInt((f + hzPerBin / 2) / hzPerBin);
        return data[index]+1;
    }
    ctx = new OfflineAudioContext(1,buff.length,sampleRate);
    ctx.sampleRate = sampleRate;
    ctx.destination.channelCount = 1;

    processor = ctx.createScriptProcessor(1024, 1, 1);
    processor.connect(ctx.destination);

    analyser = ctx.createAnalyser();
    analyser.fftSize = fftSize;
    analyser.smoothingTimeConstant = 0.0;

    //analyser.minDecibels = -60;
    //analyser.maxDecibels = -20;

    source = ctx.createBufferSource();
    source.connect(analyser);

    processor.onaudioprocess = function(e) {
        data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        state = frequencies.map(frequencyBinValue.bind(this))
        if ("function" == typeof callback)
            onend();
        callback(state);
    }

    analyser.connect(processor);

    var sbuffer = ctx.createBuffer(1, buff.length, ctx.sampleRate);
    sbuffer.getChannelData(0).set(buff);
    source.buffer = sbuffer;

    source.onended = function(e) {
        console.log("Analysys ended.");
        if ("function" == typeof onend)
            onend();
    }

    console.log("Start Analysis.");

    source.start(0);
    ctx.startRendering();
}