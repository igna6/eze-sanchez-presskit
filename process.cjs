const { Jimp } = require('jimp');

async function processLogo() {
  const image = await Jimp.read('public/logo.jpg');
  // 1024x1024. Crop only top and bottom.
  // y: 300, h: 424 leaves from 300 to 724.
  image.crop({x: 0, y: 300, w: 1024, h: 424});
  
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // If pixel is not pure white/light grey, make transparent
    if (r < 100 && g < 100 && b < 100) {
      this.bitmap.data[idx + 3] = 0; // alpha = 0
    }
  });

  await image.write('public/nav-logo.png');
  console.log('Done!');
}
processLogo().catch(console.error);
