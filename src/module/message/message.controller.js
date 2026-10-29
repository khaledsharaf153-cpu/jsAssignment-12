import { Router } from "express";
import { auth } from "../../middleware/authentication.middleware.js";
import { handleFilesMiddleware } from "../../middleware/multer.middleware.js";
import { upload } from "../../commen/utils/multer/multer.config.js";
import {
  deleteMessage,
  getAllMessages,
  getMessageById,
  sendMessage,
} from "./message.service.js";
import { successResponse } from "../../commen/response/success.response.js";

export const messageRouter = Router();

messageRouter.post(
  "/send-message",
  (req, res, next) => {
    if (req.headers.authorization) {
      return auth()(req, res, next);
    }

    next();
  },
  handleFilesMiddleware({
    folderName: "Message",
    multerMiddleware: upload({ folderName: "Message", fileSizeMB: 15 }).any(),
  }),

  async (req, res) => {
    const message = await sendMessage(req.body, req.files, req.user);

    successResponse({ res, statusCode: 201, msg: "done", data: message });
  },
);

messageRouter.delete("/delete-message/:messageId", auth(), async (req, res) => {
  await deleteMessage(req.params.messageId, req.user);

  successResponse({ res, statusCode: 200, msg: "done" });
});

messageRouter.get("/get-message/:messageId", auth(), async (req, res) => {
  const message = await getMessageById(req.params.messageId, req.user);

  successResponse({ res, statusCode: 200, msg: "done", data: message });
});

messageRouter.get("/get-all-messages", auth(), async (req, res) => {
  const messages = await getAllMessages(req.user);

  successResponse({ res, statusCode: 200, msg: "done", data: messages });
});
