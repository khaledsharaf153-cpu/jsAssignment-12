import {
  checkFieldsType,
  checkFilesType,
  processFile,
} from "../commen/utils/multer/multer.service.js";

export async function checkFileContent({
  req,
  acceptedFileTypes = [],
  folderName,
}) {
  if (req.file) {
    await processFile({ file: req.file, acceptedFileTypes, folderName });
  } else if (Array.isArray(req.files)) {
    await checkFilesType({ files: req.files, acceptedFileTypes, folderName });
  } else if (typeof req.files === "object") {
    await checkFieldsType({
      fields: req.files,
      acceptedFileTypes,
      folderName,
    });
  }
}

export function handleFilesMiddleware({
  multerMiddleware,
  folderName,
  acceptedFileTypes,
}) {
  return async (req, res, next) => {
    const customNext = async (error) => {
      if (error) {
        next(error);
        return;
      }

      try {
        await checkFileContent({ req, folderName, acceptedFileTypes });
        next();
      } catch (error) {
        next(error);
      }
    };

    return multerMiddleware(req, res, customNext);
  };
}
