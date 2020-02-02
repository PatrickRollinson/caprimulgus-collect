var canvas = document.getElementById("spectogram");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = 200;

let test = [
    new Uint8Array([Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255]),
    new Uint8Array([Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255]),
    new Uint8Array([Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255]),
    new Uint8Array([Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255]),
    new Uint8Array([Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255]),
    new Uint8Array([Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255]),
    new Uint8Array([Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255]),
    new Uint8Array([Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255]),
    new Uint8Array([Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255]),
    new Uint8Array([Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255]),
    new Uint8Array([Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255, Math.random()*255])
]
let freqBands = 10
let divWidth = canvas.width / test.length;
let divHeight = canvas.height / freqBands;
console.log(divWidth);
for(let i = 0; i < test.length; i++){
    let timeData = test[i];
    for(let j = 0; j < freqBands; j++){
        
        let x = i * divWidth;
        let y = canvas.height - (divHeight * j);
        let w = divWidth;
        let h = divHeight;

        console.log(x, y, w, h, timeData[j])

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

