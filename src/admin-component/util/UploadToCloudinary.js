const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const API_URL = CLOUD_NAME
  ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
  : "";

export const uploadImageToCloudinary = async (file) => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Missing Cloudinary env. Check REACT_APP_CLOUDINARY_* in .env.local");
  }

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(API_URL, { method: "POST", body: data });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${msg}`);
  }
  const fileData = await res.json();

  return fileData.secure_url || fileData.url;
};
