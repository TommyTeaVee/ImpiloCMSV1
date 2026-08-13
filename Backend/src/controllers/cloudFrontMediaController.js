const {
  S3Client,
  ListObjectsV2Command
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION
});

const BUCKET =
  process.env.S3_BUCKETS;

const CLOUDFRONT_URL =
  (
    process.env.CLOUDFRONT_URL || ""
  ).replace(/\/$/, "");


// ==================================================
// NORMALISE FOLDER
// ==================================================

function normalizeFolder(folder) {
  if (!folder) {
    return "";
  }

  return String(folder)
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}


// ==================================================
// BUILD CLOUDFRONT URL
// ==================================================

function toCloudFrontUrl(key) {
  if (!key) {
    return null;
  }

  return `${CLOUDFRONT_URL}/${key}`;
}


// ==================================================
// LIST CLOUDFRONT FOLDER
// ==================================================

async function listCloudFrontFolder(
  req,
  res
) {
  try {

    const folder =
      normalizeFolder(
        req.query.folder
      );

    if (!folder) {
      return res.status(400).json({
        message:
          "Folder name is required"
      });
    }


    const prefix =
      `${folder}/`;


    const command =
      new ListObjectsV2Command({
        Bucket: BUCKET,

        Prefix: prefix
      });


    const result =
      await s3.send(command);


    const objects =
      (result.Contents || [])

        .filter(
          (object) =>
            object.Key &&
            object.Key !== prefix
        )

        .filter(
          (object) =>
            !object.Key.endsWith("/")
        )

        .map(
          (object) => {

            const key =
              object.Key;

            const filename =
              key.split("/").pop();


            const extension =
              filename.includes(".")
                ? filename
                    .split(".")
                    .pop()
                    .toLowerCase()
                : "";


            return {
              key,

              filename,

              extension,

              url:
                toCloudFrontUrl(
                  key
                ),

              size:
                object.Size ?? null,

              lastModified:
                object.LastModified ??
                null,

              etag:
                object.ETag ??
                null
            };
          }
        );


    return res.json({
      folder,

      prefix,

      count:
        objects.length,

      objects
    });


  } catch (error) {

    console.error(
      "CloudFront folder error:",
      error
    );


    return res.status(500).json({
      message:
        "Unable to retrieve CloudFront folder"
    });
  }
}


module.exports = {
  listCloudFrontFolder
};