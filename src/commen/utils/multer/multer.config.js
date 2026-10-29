import multer from "multer";
import { mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";

export const upload = ({ acceptedFileTypes = [], fileSizeMB, folderName }) => {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const dist = `./assets/${folderName}`;
      await mkdir(dist, { recursive: true });
      cb(null, dist);
    },

    filename: (req, file, cb) => {
      cb(null, randomUUID() + file.originalname);
    },
  });
  // const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (
      acceptedFileTypes.length &&
      !acceptedFileTypes.includes(file.mimetype)
    ) {
      cb(new Error("Invalid file format", { cause: { statusCode: 400 } }));
      return;
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: fileSizeMB * 1024 * 1024 },
  });
};
