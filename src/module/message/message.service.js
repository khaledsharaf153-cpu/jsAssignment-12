import { notFoundException } from "../../commen/exceptions/exceptions.js";
import { messageModel } from "../../DB/model/message.model.js";
import { userModel } from "../../DB/model/user.model.js";
import {
  createDoc,
  deleteDoc,
  findAllDocs,
  findDocById,
  findOneDoc,
} from "../../DB/repo.js";

export async function sendMessage(bodyData, attachments, user) {
  const { content, receiverId } = bodyData;

  const receiver = await findDocById({ model: userModel, id: receiverId });
  if (!receiver) {
    throw notFoundException({ errMsg: "User not found" });
  }

  const filesPaths = attachments.map((ob) => {
    return ob.path;
  });

  const message = await createDoc({
    model: messageModel,
    data: { content, attachments: filesPaths, senderId: user?.id, receiverId },
  });

  return message;
}

export async function deleteMessage(messageId, user) {
  const message = await deleteDoc({
    model: messageModel,
    filter: { _id: messageId, receiverId: user.id },
  });

  if (!message.deletedCount) {
    throw notFoundException();
  }
}

export async function getMessageById(messageId, user) {
  const message = await findOneDoc({
    model: messageModel,
    filter: {
      _id: messageId,
      $or: [{ senderId: user.id }, { receiverId: user.id }],
    },
  });

  if (!message) {
    throw notFoundException();
  }

  return message;
}

export async function getAllMessages(user) {
  const messages = await findAllDocs({
    model: messageModel,
    filter: { $or: [{ senderId: user.id }, { receiverId: user.id }] },
  });

  if (!messages) {
    throw notFoundException();
  }

  return messages;
}
