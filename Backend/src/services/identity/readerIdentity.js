

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

  // Very unlikely collision.
  // Keep generating until a unique username is found.
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

  // Check whether this reader already exists.
  let reader = await prisma.user.findUnique({
    where: {
      readerTokenHash: tokenHash
    }
  });

  // Existing reader.
  if (reader) {
    return {
      id: reader.id,
      username: reader.username,
      displayName: reader.displayName,
      avatarUrl: reader.avatarUrl,
      role: reader.role
    };
  }

  // Generate initial public username.
  const username = await generateUniqueUsername(readerToken);

  // Create the reader.
  reader = await prisma.user.create({
    data: {
      readerTokenHash: tokenHash,
      username,
      role: "READER"
    }
  });

  return {
    id: reader.id,
    username: reader.username,
    displayName: reader.displayName,
    avatarUrl: reader.avatarUrl,
    role: reader.role
  };
}

module.exports = {
  getOrCreateReader
};