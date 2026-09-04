import fs from 'fs';
import { PNG } from 'pngjs';

function processImage(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return;
  }

  fs.createReadStream(filePath)
    .pipe(new PNG({ filterType: 4 }))
    .on('parsed', function () {
      let changedPixels = 0;
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const idx = (this.width * y + x) << 2;

          const r = this.data[idx];
          const g = this.data[idx + 1];
          const b = this.data[idx + 2];

          // If pixel is near white (R > 235, G > 235, B > 235)
          if (r > 235 && g > 235 && b > 235) {
            this.data[idx + 3] = 0; // Make 100% transparent alpha!
            changedPixels++;
          }
        }
      }

      this.pack().pipe(fs.createWriteStream(filePath)).on('finish', () => {
        console.log(`Successfully made ${filePath} transparent! (${changedPixels} pixels converted to alpha 0)`);
      });
    });
}

const assetsDir = './public/assets';
const files = ['skye_flying_transparent.png', 'skye_hero.png', 'skye_birthday.png'];

files.forEach(file => {
  processImage(`${assetsDir}/${file}`);
});
