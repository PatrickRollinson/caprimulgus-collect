// code was just to create colour spectogram, keeping it for future reference 
async function generateSpectogram(data){
    return new Promise((resolve, reject)=>{
        console.log('data: ', data.length)
        canvas.width = window.innerWidth;
        canvas.height = 300;
        let divWidth = canvas.width / data.length;
        let divHeight = canvas.height / freqBands;
    
        ctx.fillStyle = 'hsl(280, 100%, 10%)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // console.log(divWidth);
        for(let i = 0; i < data.length; i++){
            let timeData = data[i];
            console.log(timeData)
            for(let j = 0; j < freqBands; j++){
                let x = i * divWidth;
                let y = canvas.height - (divHeight * j);
                let w = divWidth;
                let h = divHeight;
    
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
        resolve(imgData);
    })  
}