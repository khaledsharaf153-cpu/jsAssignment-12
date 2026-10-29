import {
  getCacheValue,
  getEmailBanKey,
  getEmailKey,
  getEmailTrialsKey,
  incrKey,
  isExists,
  setCacheValue,
  ttl,
} from "../../cache/cache.service.js";
import { badRequestException } from "../../exceptions/exceptions.js";
import { createOTP } from "../../OTP.js";
import { hashValue } from "../../security/hashing.js";
import { transporter } from "./email.config.js";
import { emailTemplate } from "./email.template.js";

export async function sendEmail({
  from = '"Example Team" <khaledsharaf153@gmail.com>',
  to,
  subject,
  html,
  attachments,
}) {
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      attachments,
      // attachments: [
      //   {
      //     filename: "test.txt",
      //     content: "this for test",
      //     contentType: "text/plain",
      //   },
      // ],
    });
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}

export async function sendOTP({ email, subject }) {
  const otp = createOTP();
  await sendEmail({
    to: email,
    subject,
    html: emailTemplate[subject](otp),
  });

  await setCacheValue(getEmailKey(email, subject), await hashValue(otp), {
    expiration: { type: "EX", value: 180 },
  });

  if (await getCacheValue(getEmailTrialsKey(email, subject))) {
    await incrKey(getEmailTrialsKey(email, subject));
  } else {
    await setCacheValue(getEmailTrialsKey(email, subject), 1, {
      expiration: { type: "EX", value: 15 * 60 },
    });
  }
}

export async function checkOTP(email, subject) {
  const old_OTP_TTL = await ttl(getEmailKey(email, subject));

  if (old_OTP_TTL > 0) {
    throw badRequestException({ errMsg: `Old OTP stil valid ${old_OTP_TTL}s` });
  }

  const isBanned = await isExists(getEmailBanKey(email, subject));
  if (isBanned) {
    throw badRequestException({ errMsg: "Please try again later" });
  }

  const userTrials = await getCacheValue(getEmailTrialsKey(email, subject));
  if (userTrials == 2) {
    await setCacheValue(getEmailBanKey(email, subject), 0, {
      expiration: { type: "EX", value: 15 * 60 },
    });
  }
}
