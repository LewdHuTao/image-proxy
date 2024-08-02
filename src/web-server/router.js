const express = require("express");
const multer = require("multer");
const path = require("path");
const { processFile, scheduleDeletion } = require("./server");
const logger = require("../logger");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const config = require("../config");

const router = express.Router();

const storageDir = path.join(__dirname, "storage");
const upload = multer({ dest: storageDir });

router.post("/upload", upload.single('file'), async (req, res) => {
  try {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader || !bearerHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Bearer key missing or invalid format" });
    }

    const bearerKey = bearerHeader.split(' ')[1];
    if (bearerKey !== config.BEARER_KEY) {
      return res.status(403).json({ error: "Invalid bearer key" });
    }

    console.log('File:', req.file);
    console.log('Body:', req.body);

    const { duration } = req.body;
    const uniqueFilename = uuidv4() + path.extname(req.file.originalname);
    const processedFileUrl = await processFile(req.file.path, uniqueFilename);

    if (duration !== 'forever') {
      const expirationTime = parseInt(duration, 10);
      scheduleDeletion(uniqueFilename, expirationTime);
    }

    res.status(200).json({ fileUrl: processedFileUrl });
  } catch (error) {
    logger.error("Error uploading file:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
