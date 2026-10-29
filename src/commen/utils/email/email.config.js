import { createTransport } from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../../../config/config.js";

export const transporter = createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});
