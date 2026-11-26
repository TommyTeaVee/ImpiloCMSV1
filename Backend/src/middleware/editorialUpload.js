const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const crypto = require("crypto");

const CLOUDFRONT_URL = (process.env.CLOUDFRONT_URL || "").replace(/\/$/, "");

const s3 = new S3Client({
  region: process.env.R2_REGION || "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Allow-list: MIME type -> [folder, extension]. The extension comes from HERE, never from
// the uploaded file name, so a file called x.html can never be stored as .html.
// SVG is deliberately absent: it can carry scripts.
const ALLOWED = {
  "image/jpeg": ["images", ".jpg"],
  "image/png": ["images", ".png"],
  "image/webp": ["images", ".webp"],
  "image/gif": ["images", ".gif"],
  "image/avif": ["images", ".avif"],
  "video/mp4": ["videos", ".mp4"],
  "video/webm": ["videos", ".webm"],
  "audio/mpeg": ["audio", ".mp3"],
  "audio/mp4": ["audio", ".m4a"],
  "audio/ogg": ["audio", ".ogg"],
  "audio/wav": ["audio", ".wav"],
};

const MAX_BYTES = {
  images: 25 * 1024 * 1024,
  videos: 300 * 1024 * 1024,
  audio: 50 * 1024 * 1024,
};

const storage = multerS3({
  s3,
  bucket: process.env.S3_BUCKETS,
  contentType: (req, file, cb) => cb(null, file.mimetype), // exactly what we allowed, no sniffing
  contentDisposition: "inline",
  key: (req, file, cb) => {
    const rule = ALLOWED[file.mimetype];
    if (!rule) return cb(new Error("Unsupported media type"));
    const [folder, ext] = rule;
    const name = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
    cb(null, `articles/editorial/${folder}/${name}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES.videos, files: 1 }, // hard ceiling; per-type check is in fileFilter
  fileFilter: (req, file, cb) => {
    if (!ALLOWED[file.mimetype]) {
      const err = new Error("Only JPEG, PNG, WebP, GIF, AVIF images, MP4/WebM video and MP3/M4A/OGG/WAV audio are allowed");
      err.code = "UNSUPPORTED_MEDIA";
      return cb(err);
    }
    // Content-Length is a hint only; the multer limit above is the real stop.
    const folder = ALLOWED[file.mimetype][0];
    const declared = parseInt(req.headers["content-length"] || "0", 10);
    if (declared > MAX_BYTES[folder] + 1024 * 1024) {
      const err = new Error(`File too large for ${folder} (max ${Math.round(MAX_BYTES[folder] / 1048576)}MB)`);
      err.code = "UNSUPPORTED_MEDIA";
      return cb(err);
    }
    cb(null, true);
  },
});

function toCloudFrontUrl(key) {
  return key ? `${CLOUDFRONT_URL}/${key}` : null;
}

module.exports = { upload, toCloudFrontUrl };
