let width = 1000;
let height = 1000

let canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;

let ctx = canvas.getContext('2d');
// console.log('Test')
// let imgData= ctx.createImageData(width, height)
// console.log(imgData)

let before = ctx.getImageData(0, 0, width, height);
console.log('before:', before);

let pixels = before.data;
for (let i = 0; i < width*height; i++){
    pixels[(i*4)+3] = Math.random()*255;
}
console.log(pixels)
ctx.putImageData(before, 0, 0);

// console.log(cid)
// let imgData = new ImageData(width, height);
// imgData.data = cid;

// ctx.putImageData(testImg, 0, 0)
// console.log('created: ', ctx.createImageData(width, height))