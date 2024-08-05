async function fetchYThumbnail() {
  const maxResUrl = `https://img.youtube.com/vi/Kf5pXDhx5Vc/maxresdefault.jpg`;

  const { body } = await fetch(maxResUrl);
  const buffers = [];

  for await (const chuck of body) {
    buffers.push(chuck);
  }

  const buffer = Buffer.concat(buffers);

  if (buffer) {
    const processedBuffer = buffer;
    const imageUrl = await uploadToOwnServer(processedBuffer);
    return imageUrl;
  } else {
    throw new Error("Failed to fetch image from YouTube");
  }

  async function uploadToOwnServer(imageBuffer) {
    try {
      const imageData = imageBuffer.toString("base64");
      const response = await fetch("http://localhost:3000/yt/upload", {
        method: "POST",
        body: JSON.stringify({ image: imageData }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${require("../src/config").BEARER_KEY}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      } else {
        throw new Error("Failed to upload image to your own server");
      }
    } catch (error) {
      console.error(
        "Failed to upload image to your own server:",
        error.message
      );
      return null;
    }
  }
}

fetchYThumbnail()
  .then((imageUrl) => {
    console.log("Uploaded image URL:", imageUrl);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
