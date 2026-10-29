import { EventEmitter } from "node:events";
import { sendOTP } from "./email.service.js";

export const emailEvents = new EventEmitter();

emailEvents.on("send-OTP", async ({ email, subject }) => {
  try {
    await sendOTP({ email, subject });
  } catch (error) {
    console.log(error);
  }
});
