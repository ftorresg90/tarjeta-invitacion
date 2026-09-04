import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function processFile(filename) {
  const inputPath = path.join('./public/assets', filename);
  const tempPath = path.join('./public/assets', 'temp_' + filename);

  try {
    const image = sharp(inputPath);
    const { width, height } = await image.metadata();

    const rawBuffer = await image.ensureAlpha().raw().toBuffer();

    for (let i = 0; i < rawBuffer.length; i += 4) {
      const r = rawBuffer[i];
      const g = rawBuffer[i + 1];
      const b = rawBuffer[i + 2];

      // If near white, make 100% transparent
      if (r > 225 && g > 225 && b > 225) {
        rawBuffer[i + 3] = 0;
      }
    }

    await sharp(rawBuffer, {
      raw: { width, height, channels: 4 }
    })
    .png()
    .toFile(tempPath);

    fs.renameSync(tempPath, inputPath);
    console.log(`✨ Successfully converted ${filename} to REAL PNG WITH ALPHA TRANSPARENCY!`);
  } catch (err) {
    console.error(`Error processing ${filename}:`, err);
  }
}

async function run() {
  await processFile('skye_flying_transparent.png');
  await processFile('skye_hero.png');
  await processFile('skye_birthday.png');
}

run();
