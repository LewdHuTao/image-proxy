const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { processImage, scheduleDeletion } = require("./server");
const router = express.Router();

const storageDir = path.join(__dirname, "storage");
const upload = multer({ dest: storageDir });

router.use(express.json({ limit: "1000mb" }));
router.use(express.urlencoded({ extended: true, limit: "1000mb" }));

router.use((req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    if (bearerToken === require("../config").BEARER_KEY) {
      next();
    } else {
      res.status(403).json({ error: "Invalid Key." });
    }
  } else {
    res.status(403).json({ error: "No Key Provided." });
  }
});

router.post("/upload", upload.none(), async (req, res) => {
  try {
    if (!req.body.image) {
      throw new Error("No image provided in the request body");
    }

    const imageBuffer = Buffer.from(req.body.image, "base64");
    const uniqueFilename = uuidv4() + ".jpg";
    const processedImageUrl = await processImage(imageBuffer, uniqueFilename);

    scheduleDeletion(uniqueFilename, 8 * 60 * 1000);

    res.status(200).json({ imageUrl: processedImageUrl });
  } catch (error) {
    console.error("Error uploading image:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.use("/upload", express.static("storage"));

module.exports = router;
