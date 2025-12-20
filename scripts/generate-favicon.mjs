import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function u32be(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n >>> 0, 0);
  return b;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = u32be(data.length);
  const crc = u32be(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePng({ width, height, pixelsRgba }) {
  // Build raw scanlines: each row is prefixed with filter byte 0.
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    pixelsRgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    header,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", idat),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function makeBeamxPixels32() {
  const width = 32;
  const height = 32;

  // Brand-ish colors (approx): navy + cyan
  const navy = [0x0c, 0x2a, 0x4a, 0xff]; // deep blue
  const cyan = [0x22, 0xd3, 0xee, 0xff]; // bright cyan

  const pixels = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Base fill
      let c = navy;

      // Diagonal accent stripe
      if (x - y >= 6 && x - y <= 10) c = cyan;

      // Soft inner highlight around stripe
      if (x - y === 5 || x - y === 11) c = [0x6b, 0xe7, 0xf5, 0xff];

      const i = (y * width + x) * 4;
      pixels[i + 0] = c[0];
      pixels[i + 1] = c[1];
      pixels[i + 2] = c[2];
      pixels[i + 3] = c[3];
    }
  }

  return { width, height, pixels };
}

function makeIcoFromPng(pngBuf, { size }) {
  // ICO wrapper with PNG payload (supported by modern browsers)
  const ICONDIR = Buffer.alloc(6);
  ICONDIR.writeUInt16LE(0, 0); // reserved
  ICONDIR.writeUInt16LE(1, 2); // type 1 = icon
  ICONDIR.writeUInt16LE(1, 4); // count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0); // width
  entry.writeUInt8(size === 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // color count
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bitcount
  entry.writeUInt32LE(pngBuf.length, 8); // bytes in res
  entry.writeUInt32LE(6 + 16, 12); // image offset

  return Buffer.concat([ICONDIR, entry, pngBuf]);
}

const repoRoot = process.cwd();
const publicDir = path.join(repoRoot, "public");

const { width, height, pixels } = makeBeamxPixels32();
const png = makePng({ width, height, pixelsRgba: pixels });
const ico = makeIcoFromPng(png, { size: 32 });

fs.writeFileSync(path.join(publicDir, "favicon.png"), png);
fs.writeFileSync(path.join(publicDir, "favicon.ico"), ico);

console.log("Generated public/favicon.png and public/favicon.ico");
