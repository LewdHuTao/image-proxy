const express = require("express");
const path = require("path");
const logger = require("./logger");
const webRouter = require("./web-server/router");
const ytRouter = require("./yt-server/router");

const app = express();
const PORT = require("./config").PORT;

app.use(
  "/media",
  express.static(path.join(__dirname, "web-server", "storage"))
);
app.use("/media", express.static(path.join(__dirname, "yt-server", "storage")));
app.use("/web", webRouter);
app.use("/yt", ytRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "home.html"));
});

app.listen(PORT, () => {
  logger.info(`Image Proxy Service running on: http://localhost:${PORT}`);
});
