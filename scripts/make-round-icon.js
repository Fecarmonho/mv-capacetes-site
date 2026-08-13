const sharp = require("sharp");
const path = require("path");

const projectDir = path.join(__dirname, "..");
const src = path.join(projectDir, "public", "brand", "logo.jpg");

async function run() {
  const size = 512;
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
  );

  const rounded = await sharp(src)
    .resize(size, size)
    .composite([{ input: circleMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  await sharp(rounded).resize(180, 180).toFile(path.join(projectDir, "app", "icon.png"));
  await sharp(rounded).toFile(path.join(projectDir, "public", "brand", "logo-round.png"));

  console.log("OK: app/icon.png e public/brand/logo-round.png gerados.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
