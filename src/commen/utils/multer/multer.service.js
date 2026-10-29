import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileTypeFromBuffer } from "file-type";
import { badRequestException } from "../../exceptions/exceptions.js";
import { randomUUID } from "node:crypto";

export async function processFile({
  file,
  acceptedFileTypes,
  folderName = "General",
}) {
  let fileBuffer;

  if (file.path) {
    fileBuffer = await readFile(resolve(file.path));
  } else {
    fileBuffer = file.buffer;
  }

  const fileType = await fileTypeFromBuffer(fileBuffer);

  if (
    !fileType ||
    (acceptedFileTypes.length && !acceptedFileTypes.includes(fileType.mime))
  ) {
    throw badRequestException({ errMsg: "Invalid file format" });
  }

  if (!file.path) {
    const dirPath = `./assets/${folderName}`;
    const filePath = `${dirPath}/${randomUUID()}.${fileType.ext}`;

    await mkdir(dirPath, { recursive: true });
    await writeFile(resolve(filePath), fileBuffer);

    file.path = filePath;
  }
}

// req.files = [{},{}]
export async function checkFilesType({ files, acceptedFileTypes, folderName }) {
  for (const file of files) {
    await processFile({ file, acceptedFileTypes, folderName });
  }
}

// req.files = {profilePic : [], coverPic : []}
export async function checkFieldsType({
  fields,
  acceptedFileTypes,
  folderName,
}) {
  for (const key of Object.keys(fields)) {
    await checkFilesType({ files: fields[key], acceptedFileTypes, folderName });
  }
}
