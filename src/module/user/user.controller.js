import { Router } from "express";
import { auth } from "../../middleware/authentication.middleware.js";
import {
  getUserProfile,
  logout,
  logoutAll,
  rotateToken,
  uploadProfilePic,
} from "./user.service.js";
import { authorization } from "../../middleware/authorization.middleware.js";
import { userRoleEnum } from "../../commen/enum/user.enum.js";
import { tokenTypeEnum } from "../../commen/enum/token.enum.js";
import { successResponse } from "../../commen/response/success.response.js";
import { upload } from "../../commen/utils/multer/multer.config.js";
import { FileTypeEnum } from "../../commen/enum/multer.enum.js";
import {
  checkFileContent,
  handleFilesMiddleware,
} from "../../middleware/multer.middleware.js";

export const userRouter = Router();

userRouter.post(
  "/rotate-token",
  auth(tokenTypeEnum.REFRESH),
  async (req, res) => {
    const result = rotateToken(req.payload);
    successResponse({ res, statusCode: 200, msg: result });
  },
);

userRouter.get("/get-profile", auth(), async (req, res) => {
  const result = getUserProfile(req.user);
  successResponse({ res, statusCode: 200, data: result });
});

// test for admin authorization
userRouter.get(
  "/test",
  auth(),
  authorization(userRoleEnum.ADMIN),
  async (req, res) => {
    const result = "test done";
    successResponse({ res, statusCode: 200, data: result });
  },
);
//////////

userRouter.post("/logout", auth(), async (req, res) => {
  await logout(req.payload);
  successResponse({ res, statusCode: 200 });
});

userRouter.post("/logout-all", auth(), async (req, res) => {
  await logoutAll(req.user, req.payload);
  successResponse({ res, statusCode: 200 });
});

userRouter.post(
  "/upload-profile-pic",
  auth(),
  handleFilesMiddleware({
    multerMiddleware: upload({
      acceptedFileTypes: FileTypeEnum.image,
      fileSizeMB: 15,
      folderName: "User",
    }).single("profile-pic"),
    folderName: "User",
    acceptedFileTypes: FileTypeEnum.image,
  }),
  async (req, res) => {
    await uploadProfilePic(req.user, req.file);

    successResponse({
      res,
      statusCode: 200,
    });
  },
);
