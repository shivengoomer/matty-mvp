import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react";

// In development, we use a relative URL which is proxied via vite.config.js to avoid CORS issues.
// In production, we point directly to the backend URL.
const getUploadUrl = () => {
  if (import.meta.env.DEV) return "/api/uploadthing";
  return (import.meta.env.VITE_API_URL || "https://matty-backend-2.onrender.com") + "/api/uploadthing";
};

const url = getUploadUrl();

export const UploadButton = generateUploadButton({ url });
export const UploadDropzone = generateUploadDropzone({ url });

export const { useUploadThing, uploadFiles } = generateReactHelpers({ url });
