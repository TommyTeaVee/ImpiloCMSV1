const multer = require("multer");

const {
  S3Client
} = require("@aws-sdk/client-s3");

const multerS3 = require("multer-s3");
const path = require("path");
const crypto = require("crypto");


// ==================================================
// R2 / MEDIA CONFIGURATION
// ==================================================

const CLOUDFRONT_URL = (
  process.env.CLOUDFRONT_URL || ""
).replace(/\/$/, "");

const R2_ENDPOINT =
  process.env.R2_ENDPOINT;

const R2_REGION =
  process.env.R2_REGION || "auto";

const R2_ACCESS_KEY_ID =
  process.env.R2_ACCESS_KEY_ID;

const R2_SECRET_ACCESS_KEY =
  process.env.R2_SECRET_ACCESS_KEY;


// ==================================================
// R2 S3 CLIENT
// ==================================================

const s3 = new S3Client({
  region: R2_REGION,

  endpoint: R2_ENDPOINT,

  credentials: {
    accessKeyId:
      R2_ACCESS_KEY_ID,

    secretAccessKey:
      R2_SECRET_ACCESS_KEY
  }
});


// ==================================================
// R2 STORAGE
// ==================================================

const storage = multerS3({

  s3,

  bucket:
    process.env.S3_BUCKETS,

  contentType:
    multerS3.AUTO_CONTENT_TYPE,

  key: (
    req,
    file,
    cb
  ) => {

    try {

      const extension =
        path
          .extname(
            file.originalname
          )
          .toLowerCase();


      let mediaType;


      // ------------------------------------------
      // IMAGE
      // ------------------------------------------

      if (
        file.mimetype.startsWith(
          "image/"
        )
      ) {

        mediaType = "images";


      // ------------------------------------------
      // VIDEO
      // ------------------------------------------

      } else if (
        file.mimetype.startsWith(
          "video/"
        )
      ) {

        mediaType = "videos";


      // ------------------------------------------
      // AUDIO
      // ------------------------------------------

      } else if (
        file.mimetype.startsWith(
          "audio/"
        )
      ) {

        mediaType = "audio";


      // ------------------------------------------
      // OTHER
      // ------------------------------------------

      } else {

        mediaType = "other";
      }


      // ------------------------------------------
      // UNIQUE FILE NAME
      // ------------------------------------------

      const filename =
        `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;


      // ------------------------------------------
      // OBJECT KEY
      // ------------------------------------------

      const key =
        `articles/editorial/${mediaType}/${filename}`;


      console.log(
        "Editorial R2 upload key:",
        key
      );


      cb(
        null,
        key
      );


    } catch (error) {

      console.error(
        "Editorial R2 key error:",
        error
      );

      cb(error);
    }
  }
});


// ==================================================
// MULTER
// ==================================================

const upload =
  multer({

    storage,

    limits: {

      // ----------------------------------------
      // MAXIMUM FILE SIZE: 500 MB
      // ----------------------------------------

      fileSize:
        500 * 1024 * 1024
    },


    // ------------------------------------------
    // FILE FILTER
    // ------------------------------------------

    fileFilter: (
      req,
      file,
      cb
    ) => {

      console.log(
        "Editorial upload received:",
        {
          name:
            file.originalname,

          mime:
            file.mimetype
        }
      );


      const allowed =
        file.mimetype.startsWith(
          "image/"
        ) ||

        file.mimetype.startsWith(
          "video/"
        ) ||

        file.mimetype.startsWith(
          "audio/"
        );


      if (!allowed) {

        console.log(
          "Rejected media type:",
          file.mimetype
        );

        return cb(
          new Error(
            "Only image, video and audio files are allowed"
          )
        );
      }


      cb(
        null,
        true
      );
    }
  });


// ==================================================
// CLOUDFRONT / R2 PUBLIC URL
// ==================================================

function toCloudFrontUrl(
  key
) {

  if (!key) {
    return null;
  }

  return `${CLOUDFRONT_URL}/${key}`;
}


// ==================================================
// EXPORT
// ==================================================

module.exports = {

  upload,

  toCloudFrontUrl

};