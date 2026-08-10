const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function generateReaderUsername(token) {
  const hash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const number =
    parseInt(hash.substring(0, 8), 16) % 10000;

  return `avidreader${String(number).padStart(4, "0")}`;
}

async function generateUniqueUsername(readerToken) {
  const baseUsername = generateReaderUsername(readerToken);

  const existingUsername = await prisma.user.findUnique({
    where: {
      username: baseUsername
    }
  });

  if (!existingUsername) {
    return baseUsername;
  }

  while (true) {
    const username =
      `avidreader${crypto.randomInt(1000, 10000)}`;

    const usernameExists = await prisma.user.findUnique({
      where: {
        username
      }
    });

    if (!usernameExists) {
      return username;
    }
  }
}

async function getOrCreateReader(readerToken) {
  if (!readerToken) {
    throw new Error("Reader token is required");
  }

  const tokenHash = hashToken(readerToken);

  let reader = await prisma.user.findUnique({
    where: {
      readerTokenHash: tokenHash
    }
  });

  if (reader) {
    return reader;
  }

  const username = await generateUniqueUsername(readerToken);

  reader = await prisma.user.create({
    data: {
      readerTokenHash: tokenHash,
      username,
      role: "READER"
    }
  });

  return reader;
}

async function identifyReader(req, res) {
  try {
    const { userId } = req.body;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        message: "Reader userId is required"
      });
    }

    const reader = await getOrCreateReader(userId);

    const token = jwt.sign(
      {
        userId: reader.id,
        role: reader.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d"
      }
    );

    return res.status(200).json({
      message: "Reader identified",
      token,
      user: {
        id: reader.id,
        username: reader.username,
        displayName: reader.displayName,
        avatarUrl: reader.avatarUrl,
        role: reader.role
      }
    });

  } catch (error) {
    console.error("Reader identity error:", error);

    return res.status(500).json({
      message: "Unable to identify reader"
    });
  }
}

module.exports = {
  getOrCreateReader,
  identifyReader
};