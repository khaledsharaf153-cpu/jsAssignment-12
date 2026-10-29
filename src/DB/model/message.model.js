import { model, Schema, Types } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: function () {
        return !this.attachments;
      },
    },
    attachments: [String],
    senderId: {
      type: Types.ObjectId,
      ref: "Users",
    },
    receiverId: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

export const messageModel = model("Messages", messageSchema);
