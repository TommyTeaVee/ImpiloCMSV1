const prisma = require("../lib/prisma");

const ALLOWED_TYPES = [
  "IMAGE",
  "VIDEO",
  "AUDIO"
];

const ALLOWED_PROVIDERS = [
  "YOUTUBE",
  "CLOUDFRONT"
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

    if (!type || !ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({
        message: "Invalid media type"
      });
    }

    if (
      !provider ||
      !ALLOWED_PROVIDERS.includes(provider)
    ) {
      return res.status(400).json({
        message: "Invalid media provider"
      });
    }

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        message: "Media URL is required"
      });
    }

    // YouTube-specific validation
    if (provider === "YOUTUBE" && type !== "VIDEO") {
      return res.status(400).json({
        message: "YouTube media must be VIDEO"
      });
    }

    // YouTube videos should have an external ID.
    if (
      provider === "YOUTUBE" &&
      (!externalId || typeof externalId !== "string")
    ) {
      return res.status(400).json({
        message: "YouTube externalId is required"
      });
    }

    // CloudFront media should not use a YouTube external ID.
    if (
      provider === "CLOUDFRONT" &&
      externalId
    ) {
      return res.status(400).json({
        message:
          "CloudFront media cannot have a YouTube externalId"
      });
    }

    const media = await prisma.mediaAsset.create({
      data: {
        type,
        provider,
        url,
        externalId: externalId || null,
        filename: filename || null,
        mimeType: mimeType || null,
        altText: altText || null,
        caption: caption || null,
        credit: credit || null,
        width: width ?? null,
        height: height ?? null,
        duration: duration ?? null
      }
    });

    return res.status(201).json({
      message: "Media asset created",
      media
    });

  } catch (error) {
    console.error(
      "Create media error:",
      error
    );

    return res.status(500).json({
      message: "Unable to create media asset"
    });
  }
}


// ==================================================
// GET MEDIA ASSET
// ==================================================

async function getMedia(req, res) {
  try {
    const { id } = req.params;

    const media = await prisma.mediaAsset.findUnique({
      where: {
        id
      }
    });

    if (!media) {
      return res.status(404).json({
        message: "Media asset not found"
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
      message: "Unable to retrieve media asset"
    });
  }
}


// ==================================================
// DELETE MEDIA ASSET
// ==================================================

async function deleteMedia(req, res) {
  try {
    const { id } = req.params;

    const media = await prisma.mediaAsset.findUnique({
      where: {
        id
      }
    });

    if (!media) {
      return res.status(404).json({
        message: "Media asset not found"
      });
    }

    await prisma.mediaAsset.delete({
      where: {
        id
      }
    });

    return res.json({
      message: "Media asset deleted"
    });

  } catch (error) {
    console.error(
      "Delete media error:",
      error
    );

    return res.status(500).json({
      message: "Unable to delete media asset"
    });
  }
}
async function updateMedia(req, res) {
  try {
    const { id } = req.params;

    const existing = await prisma.mediaAsset.findUnique({
      where: {
        id
      }
    });

    if (!existing) {
      return res.status(404).json({
        message: "Media asset not found"
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

    if (type !== undefined) {
      if (!ALLOWED_TYPES.includes(type)) {
        return res.status(400).json({
          message: "Invalid media type"
        });
      }

      data.type = type;
    }

    if (provider !== undefined) {
      if (!ALLOWED_PROVIDERS.includes(provider)) {
        return res.status(400).json({
          message: "Invalid media provider"
        });
      }

      data.provider = provider;
    }

    if (url !== undefined) {
      if (
        typeof url !== "string" ||
        !url.trim()
      ) {
        return res.status(400).json({
          message: "Media URL cannot be empty"
        });
      }

      data.url = url.trim();
    }

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


    // Validate the final provider/type combination.

    const finalType =
      data.type ?? existing.type;

    const finalProvider =
      data.provider ?? existing.provider;

    const finalExternalId =
      data.externalId !== undefined
        ? data.externalId
        : existing.externalId;


    if (
      finalProvider === "YOUTUBE" &&
      finalType !== "VIDEO"
    ) {
      return res.status(400).json({
        message: "YouTube media must be VIDEO"
      });
    }

    if (
      finalProvider === "YOUTUBE" &&
      !finalExternalId
    ) {
      return res.status(400).json({
        message: "YouTube externalId is required"
      });
    }

    if (
      finalProvider === "CLOUDFRONT" &&
      finalExternalId
    ) {
      return res.status(400).json({
        message:
          "CloudFront media cannot have a YouTube externalId"
      });
    }


    const media = await prisma.mediaAsset.update({
      where: {
        id
      },

      data
    });

    return res.json({
      message: "Media asset updated",
      media
    });

  } catch (error) {
    console.error(
      "Update media error:",
      error
    );

    return res.status(500).json({
      message: "Unable to update media asset"
    });
  }
}

module.exports = {
  createMedia,
  getMediaAssets,
  getMedia,
  updateMedia,
  deleteMedia
};