const prisma = require("../lib/prisma");

const {
  toCloudFrontUrl
} = require("../middleware/editorialUpload");


// ==================================================
// CONSTANTS
// ==================================================

const ALLOWED_TYPES = [
  "IMAGE",
  "VIDEO",
  "AUDIO"
];

const ALLOWED_PROVIDERS = [
  "YOUTUBE",
  "R2"
];


// ==================================================
// GET MEDIA ASSETS
// ==================================================

async function getMediaAssets(req, res) {
  try {

    const {
      type,
      provider
    } = req.query;


    const where = {};


    // Optional type filter
    if (
      type &&
      ALLOWED_TYPES.includes(
        String(type).toUpperCase()
      )
    ) {
      where.type =
        String(type).toUpperCase();
    }


    // Optional provider filter
    if (
      provider &&
      ALLOWED_PROVIDERS.includes(
        String(provider).toUpperCase()
      )
    ) {
      where.provider =
        String(provider).toUpperCase();
    }


    const media =
      await prisma.mediaAsset.findMany({
        where,

        orderBy: {
          createdAt: "desc"
        }
      });


    return res.json({
      media
    });


  } catch (error) {

    console.error(
      "Get media assets error:",
      error
    );


    return res.status(500).json({
      message:
        "Unable to retrieve media assets"
    });
  }
}


// ==================================================
// CREATE MEDIA ASSET
// ==================================================

async function createMedia(req, res) {
  try {

    const {
      type,
      provider,
      url,
      externalId,
      filename,
      mimeType,
      altText,
      caption,
      credit,
      width,
      height,
      duration
    } = req.body;


    // ----------------------------------------------
    // MEDIA TYPE
    // ----------------------------------------------

    if (
      !type ||
      !ALLOWED_TYPES.includes(type)
    ) {
      return res.status(400).json({
        message:
          "Invalid media type"
      });
    }


    // ----------------------------------------------
    // MEDIA PROVIDER
    // ----------------------------------------------

    if (
      !provider ||
      !ALLOWED_PROVIDERS.includes(provider)
    ) {
      return res.status(400).json({
        message:
          "Invalid media provider"
      });
    }


    // ----------------------------------------------
    // URL
    // ----------------------------------------------

    if (
      !url ||
      typeof url !== "string"
    ) {
      return res.status(400).json({
        message:
          "Media URL is required"
      });
    }


    // ----------------------------------------------
    // YOUTUBE VALIDATION
    // ----------------------------------------------

    if (
      provider === "YOUTUBE" &&
      type !== "VIDEO"
    ) {
      return res.status(400).json({
        message:
          "YouTube media must be VIDEO"
      });
    }


    // YouTube videos should have an external ID.
    if (
      provider === "YOUTUBE" &&
      (
        !externalId ||
        typeof externalId !== "string"
      )
    ) {
      return res.status(400).json({
        message:
          "YouTube externalId is required"
      });
    }


    // ----------------------------------------------
    // R2 VALIDATION
    // ----------------------------------------------

    if (
      provider === "R2" &&
      externalId
    ) {
      return res.status(400).json({
        message:
          "R2 media cannot have a YouTube externalId"
      });
    }


    // ----------------------------------------------
    // CREATE DATABASE RECORD
    // ----------------------------------------------

    const media =
      await prisma.mediaAsset.create({
        data: {

          type,

          provider,

          url,

          externalId:
            externalId || null,

          filename:
            filename || null,

          mimeType:
            mimeType || null,

          altText:
            altText || null,

          caption:
            caption || null,

          credit:
            credit || null,

          width:
            width ?? null,

          height:
            height ?? null,

          duration:
            duration ?? null
        }
      });


    return res.status(201).json({
      message:
        "Media asset created",

      media
    });


  } catch (error) {

    console.error(
      "Create media error:",
      error
    );


    return res.status(500).json({
      message:
        "Unable to create media asset"
    });
  }
}


// ==================================================
// GET MEDIA ASSET
// ==================================================

async function getMedia(req, res) {
  try {

    const {
      id
    } = req.params;


    const media =
      await prisma.mediaAsset.findUnique({
        where: {
          id
        }
      });


    if (!media) {

      return res.status(404).json({
        message:
          "Media asset not found"
      });
    }


    return res.json({
      media
    });


  } catch (error) {

    console.error(
      "Get media error:",
      error
    );


    return res.status(500).json({
      message:
        "Unable to retrieve media asset"
    });
  }
}


// ==================================================
// DELETE MEDIA ASSET
// ==================================================

async function deleteMedia(req, res) {
  try {

    const {
      id
    } = req.params;


    const media =
      await prisma.mediaAsset.findUnique({
        where: {
          id
        }
      });


    if (!media) {

      return res.status(404).json({
        message:
          "Media asset not found"
      });
    }


    await prisma.mediaAsset.delete({
      where: {
        id
      }
    });


    return res.json({
      message:
        "Media asset deleted"
    });


  } catch (error) {

    console.error(
      "Delete media error:",
      error
    );


    return res.status(500).json({
      message:
        "Unable to delete media asset"
    });
  }
}


// ==================================================
// UPDATE MEDIA ASSET
// ==================================================

async function updateMedia(req, res) {
  try {

    const {
      id
    } = req.params;


    const existing =
      await prisma.mediaAsset.findUnique({
        where: {
          id
        }
      });


    if (!existing) {

      return res.status(404).json({
        message:
          "Media asset not found"
      });
    }


    const {
      type,
      provider,
      url,
      externalId,
      filename,
      mimeType,
      altText,
      caption,
      credit,
      width,
      height,
      duration
    } = req.body;


    const data = {};


    // ----------------------------------------------
    // TYPE
    // ----------------------------------------------

    if (type !== undefined) {

      if (
        !ALLOWED_TYPES.includes(type)
      ) {
        return res.status(400).json({
          message:
            "Invalid media type"
        });
      }


      data.type = type;
    }


    // ----------------------------------------------
    // PROVIDER
    // ----------------------------------------------

    if (provider !== undefined) {

      if (
        !ALLOWED_PROVIDERS.includes(provider)
      ) {
        return res.status(400).json({
          message:
            "Invalid media provider"
        });
      }


      data.provider = provider;
    }


    // ----------------------------------------------
    // URL
    // ----------------------------------------------

    if (url !== undefined) {

      if (
        typeof url !== "string" ||
        !url.trim()
      ) {
        return res.status(400).json({
          message:
            "Media URL cannot be empty"
        });
      }


      data.url =
        url.trim();
    }


    // ----------------------------------------------
    // OPTIONAL FIELDS
    // ----------------------------------------------

    if (externalId !== undefined) {

      data.externalId =
        externalId || null;
    }


    if (filename !== undefined) {

      data.filename =
        filename || null;
    }


    if (mimeType !== undefined) {

      data.mimeType =
        mimeType || null;
    }


    if (altText !== undefined) {

      data.altText =
        altText || null;
    }


    if (caption !== undefined) {

      data.caption =
        caption || null;
    }


    if (credit !== undefined) {

      data.credit =
        credit || null;
    }


    if (width !== undefined) {

      data.width =
        width ?? null;
    }


    if (height !== undefined) {

      data.height =
        height ?? null;
    }


    if (duration !== undefined) {

      data.duration =
        duration ?? null;
    }


    // ----------------------------------------------
    // FINAL VALIDATION
    // ----------------------------------------------

    const finalType =
      data.type ??
      existing.type;


    const finalProvider =
      data.provider ??
      existing.provider;


    const finalExternalId =
      data.externalId !== undefined
        ? data.externalId
        : existing.externalId;


    // YouTube must be VIDEO
    if (
      finalProvider === "YOUTUBE" &&
      finalType !== "VIDEO"
    ) {
      return res.status(400).json({
        message:
          "YouTube media must be VIDEO"
      });
    }


    // YouTube requires external ID
    if (
      finalProvider === "YOUTUBE" &&
      !finalExternalId
    ) {
      return res.status(400).json({
        message:
          "YouTube externalId is required"
      });
    }


    // R2 must not use YouTube external ID
    if (
      finalProvider === "R2" &&
      finalExternalId
    ) {
      return res.status(400).json({
        message:
          "R2 media cannot have a YouTube externalId"
      });
    }


    // ----------------------------------------------
    // UPDATE DATABASE
    // ----------------------------------------------

    const media =
      await prisma.mediaAsset.update({
        where: {
          id
        },

        data
      });


    return res.json({
      message:
        "Media asset updated",

      media
    });


  } catch (error) {

    console.error(
      "Update media error:",
      error
    );


    return res.status(500).json({
      message:
        "Unable to update media asset"
    });
  }
}


// ==================================================
// UPLOAD EDITORIAL MEDIA
// ==================================================

async function uploadEditorialMedia(
  req,
  res
) {

  try {

    if (!req.file) {

      return res.status(400).json({
        message:
          "Media file is required"
      });
    }


    const file =
      req.file;


    // ----------------------------------------------
    // DETERMINE MEDIA TYPE
    // ----------------------------------------------

    let type;


    if (
      file.mimetype.startsWith(
        "image/"
      )
    ) {

      type = "IMAGE";


    } else if (
      file.mimetype.startsWith(
        "video/"
      )
    ) {

      type = "VIDEO";


    } else if (
      file.mimetype.startsWith(
        "audio/"
      )
    ) {

      type = "AUDIO";


    } else {

      return res.status(400).json({
        message:
          "Unsupported media type"
      });
    }


    // ----------------------------------------------
    // BUILD PUBLIC R2 URL
    // ----------------------------------------------

    const cloudFrontUrl =
      toCloudFrontUrl(
        file.key
      );


    // ----------------------------------------------
    // CREATE MEDIA RECORD
    // ----------------------------------------------

    const media =
      await prisma.mediaAsset.create({
        data: {

          type,

          provider:
            "R2",

          url:
            cloudFrontUrl,

          externalId:
            null,

          filename:
            file.originalname ||
            null,

          mimeType:
            file.mimetype ||
            null,

          altText:
            null,

          caption:
            null,

          credit:
            null,

          width:
            null,

          height:
            null,

          duration:
            null
        }
      });


    return res.status(201).json({

      message:
        "Editorial media uploaded",

      media

    });


  } catch (error) {

    console.error(
      "Editorial media upload error:",
      error
    );


    return res.status(500).json({
      message:
        "Unable to upload editorial media"
    });
  }
}


// ==================================================
// EXPORT
// ==================================================

module.exports = {

  createMedia,

  getMediaAssets,

  getMedia,

  updateMedia,

  deleteMedia,

  uploadEditorialMedia

};