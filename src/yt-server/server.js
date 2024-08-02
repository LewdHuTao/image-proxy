const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");
const logger = require("../logger");
require("dotenv").config();

let url;

if (require("../config").PRODUCTION === true) {
  url = require("../config").DOMAIN;
} else {
  url = `localhost:${require("../config").PORT}`;
}

const storageDir = path.join(__dirname, "storage");

async function processImage(imageBuffer, filename) {
  try {
    let image = sharp(imageBuffer);

    image = image.resize({ width: 300, height: 300, fit: "cover" });

    const metadata = await image.metadata();
    const { width, height } = metadata;
    const hasMargins = width > 300 || height > 300;
    if (hasMargins) {
      image = image.trim({ tolerance: 50 });
    }
    const filePath = path.join(storageDir, filename);
    await image.jpeg({ quality: 100 }).toFile(filePath);

    return `http://${url}/media/${filename}`;
  } catch (error) {
    logger.error("Error processing image:", error);
    throw error;
  }
}

function scheduleDeletion(filename, expirationTime) {
  setTimeout(async () => {
    try {
      const filePath = path.join(storageDir, filename);
      await fs.unlink(filePath);
      logger.info(`Deleted file: ${filename} after ${expirationTime / 1000 / 60} minutes`);
    } catch (error) {
      logger.error(`Error deleting file ${filename}:`, error);
    }
  }, expirationTime);
}

async function clearUploadsFolder() {
  try {
    const files = await fs.readdir(storageDir);

    const now = Date.now();
    const timer = 8 * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(storageDir, file);
      const stats = await fs.stat(filePath);
      const fileAge = now - stats.birthtimeMs;

      if (fileAge > timer) {
        await fs.unlink(filePath);
      }
    }

    logger.warn("Uploads folder daily checked successfully.");
  } catch (error) {
    logger.error("Error clearing uploads folder:", error);
  }
}

module.exports = {
  processImage,
  scheduleDeletion,
  clearUploadsFolder,
};
