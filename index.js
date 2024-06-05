const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const path = require("path");
const logger = require("./logger");
const app = express();
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "media.shittybot.xyz";
require("dotenv").config();

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use((req, res, next) => {
  req.headers["user-agent"] = "Custom-User-Agent";
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"))
});

app.all('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.none(), async (req, res) => {
  try {
    if (!req.body.image) {
      throw new Error("No image provided in the request body");
    }

    const imageBuffer = Buffer.from(req.body.image, "base64");
    const uniqueFilename = uuidv4() + ".jpg";
    const processedImageUrl = await processImage(imageBuffer, uniqueFilename);
    res.status(200).json({ imageUrl: processedImageUrl });
  } catch (error) {
    logger.error("Error uploading image:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/upload", express.static("uploads"));

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
    const fiveHours = 5 * 60 * 60 * 1000; // 5 hours

    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const stats = await fs.stat(filePath);
      const fileAge = now - stats.birthtimeMs;

      if (fileAge > fiveHours) {
        await fs.unlink(filePath);
      }
    }

    logger.warn("Uploads folder daily checked successfully.");
  } catch (error) {
    logger.error("Error clearing uploads folder:", error);
  }
}

const intervalInMilliseconds = 10 * 60 * 1000;
setInterval(clearUploadsFolder, intervalInMilliseconds);

app.listen(PORT, () => {
  logger.info(`Image Proxy Service running on: http://localhost:${PORT}`);
});
