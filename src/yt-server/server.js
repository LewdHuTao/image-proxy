const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const path = require("path");
const logger = require("../logger");
require("dotenv").config();

const URL = process.env.URL || "media.shittybot.xyz";

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
    await image.jpeg({ quality: 100 }).toFile(`uploads/${filename}`);

    return `https://${URL}/upload/${filename}`;
  } catch (error) {
    logger.error("Error processing image:", error);
    throw error;
  }
}

async function clearUploadsFolder() {
  try {
    const uploadDir = "uploads/";
    const files = await fs.readdir(uploadDir);

    const now = Date.now();
    const timer = 8 * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(uploadDir, file);
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
  clearUploadsFolder
};
