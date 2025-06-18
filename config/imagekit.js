// config/imagekit.js
import ImageKit from "imagekit";

// ⚠️ Development-only fix
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;
