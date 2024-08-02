const express = require("express");
const multer = require("multer");
const { processImage } = require("./server");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "home.html"));
});

router.post("/upload", upload.none(), async (req, res) => {
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

router.use("/upload", express.static("uploads"));

module.exports = router;
