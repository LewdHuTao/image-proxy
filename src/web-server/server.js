const fs = require("fs").promises;
const path = require("path");
const logger = require("../logger");

const storageDir = path.join(__dirname, "storage");

async function processFile(filePath, filename) {
  try {
    const uploadPath = path.join(storageDir, filename);
    await fs.rename(filePath, uploadPath);
    return `http://localhost:3000/image/${filename}`;
  } catch (error) {
    logger.error("Error processing file:", error);
    throw error;
  }
}

function scheduleDeletion(filename, expirationTime) {
  setTimeout(async () => {
    try {
      const filePath = path.join(storageDir, filename);
      await fs.unlink(filePath);
      logger.info(`Deleted file: ${filename} after ${expirationTime} ms`);
    } catch (error) {
      logger.error(`Error deleting file ${filename}:`, error);
    }
  }, expirationTime);
}

module.exports = {
  processFile,
  scheduleDeletion
};
