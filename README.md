<div align="center">

<img src="https://cdn.discordapp.com/avatars/884272327452393502/7942e8fa404c9e8fec4f8fd695087d91.webp?size=512" alt="Logo" width="200px" height="200px" style="border-radius:50%"/>

# image-proxy

**A simple and lightweight Image Proxy service.**

</div>

## Description

A simple and lightweight image proxy service that can resize YouTube thumbnails and trim the margins of the original thumbnail.

## Features

- Resize YouTube thumbnails to 300x300 pixels.
- Automatically trim the margins of the original thumbnail.
- Automatically delete all images after 10 minutes.

## Usage

To use the image proxy service:

1. Upload the image to the `/upload` endpoint.
2. The service will automatically resize YouTube thumbnails and trim the margins of the original thumbnail.
3. Access the processed image using the returned URL.

### Before and After Results

#### Before:

![Before](https://img.youtube.com/vi/Kf5pXDhx5Vc/maxresdefault.jpg)

#### After:

![After](https://media.discordapp.net/attachments/897715616155328542/1239406758699597865/ec342970-1068-4615-8624-7f389d45fc8b.jpg?ex=6642cefe&is=66417d7e&hm=ad300be54920fba62c1c73ff4ab36335bb87460f6e6871ba430f283257e1ccbf&=&format=webp)

## Contributing

Contributions are welcome! Feel free to open a pull request or submit an issue if you encounter any problems or have suggestions for improvements.

## License

This project is licensed under the [ISC License](LICENSE).
