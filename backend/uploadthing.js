const { createUploadthing } = require("uploadthing/express");

const f = createUploadthing();

const uploadRouter = {
  mediaUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
  })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete:", file.url);
      return { url: file.url };
    }),
};

module.exports = { uploadRouter };
