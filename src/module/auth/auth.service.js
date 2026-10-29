import {
  deleteCacheValue,
  getAllKeys,
  getCacheValue,
  getEmailKey,
  getUserRevokeTokenKeyPrefix,
} from "../../commen/cache/cache.service.js";
import { emailSubjectEnum } from "../../commen/enum/email.enum.js";
import {
  badRequestException,
  conflictExceptions,
  notFoundException,
  unauthorizedException,
} from "../../commen/exceptions/exceptions.js";
import { encryptValue } from "../../commen/security/encryption.js";
import { compareValue, hashValue } from "../../commen/security/hashing.js";
import { createLoginTokens } from "../../commen/security/tokens.js";
import { emailEvents } from "../../commen/utils/email/email.event.js";
import { checkOTP } from "../../commen/utils/email/email.service.js";
import { GOOGLE_CLIENT_ID } from "../../config/config.js";
import { userModel } from "../../DB/model/user.model.js";
import { createDoc, findOneDoc } from "../../DB/repo.js";

export async function signup(data) {
  const { email } = data;
  const user = await findOneDoc({ model: userModel, filter: { email } });

  if (user) {
    throw conflictExceptions({ errmsg: "Email already exists" });
  }

  data.password = await hashValue(data.password);
  if (data.phoneNumber) {
    data.phoneNumber = encryptValue(data.phoneNumber);
  }

  await createDoc({ model: userModel, data });

  emailEvents.emit("send-OTP", {
    email,
    subject: emailSubjectEnum.CONFIRM_EMAIL,
  });
}

export async function confirmEmail(bodyData) {
  const { email, otp } = bodyData;

  const user = await findOneDoc({
    model: userModel,
    filter: { email, confirmEmail: false },
  });

  if (!user) {
    throw notFoundException();
  }

  const hashedOTP = await getCacheValue(
    getEmailKey(email, emailSubjectEnum.CONFIRM_EMAIL),
  );

  if (!hashedOTP) {
    throw badRequestException();
  }

  const isOTPValid = await compareValue(otp, hashedOTP);
  if (!isOTPValid) {
    throw badRequestException();
  }

  user.confirmEmail = true;
  await user.save();
  await deleteCacheValue(getEmailKey(email, emailSubjectEnum.CONFIRM_EMAIL));
}

export async function resendConfirmEmail(email) {
  const user = await findOneDoc({
    model: userModel,
    filter: { email, confirmEmail: false },
  });

  if (!user) {
    throw notFoundException();
  }

  await checkOTP(email, emailSubjectEnum.CONFIRM_EMAIL);

  emailEvents.emit("send-OTP", {
    email,
    subject: emailSubjectEnum.CONFIRM_EMAIL,
  });
}

export async function sendOTPForgotPassword(email) {
  const user = await findOneDoc({
    model: userModel,
    filter: { email, confirmEmail: true },
  });

  if (!user) {
    return;
  }

  await checkOTP(email, emailSubjectEnum.FORGOT_PASSWORD);

  emailEvents.emit("send-OTP", {
    email,
    subject: emailSubjectEnum.FORGOT_PASSWORD,
  });
}

export async function verifyForgotPasswordOTP(bodyData) {
  const { email, otp } = bodyData;

  const user = await findOneDoc({
    model: userModel,
    filter: { email, confirmEmail: true },
  });

  if (!user) {
    throw notFoundException();
  }

  const hashedOTP = await getCacheValue(
    getEmailKey(email, emailSubjectEnum.FORGOT_PASSWORD),
  );

  if (!hashedOTP) {
    throw badRequestException();
  }

  const isOTPValid = await compareValue(otp, hashedOTP);
  if (!isOTPValid) {
    throw badRequestException();
  }

  return user;
}

export async function resetPassword(bodyData) {
  const { email, otp, newPassword } = bodyData;

  const user = await verifyForgotPasswordOTP({ email, otp });

  user.password = await hashValue(newPassword);
  user.changeCredentialTime = Date.now();
  await user.save();

  const result = await Promise.all([
    getAllKeys(getUserRevokeTokenKeyPrefix(user.id)),
    getAllKeys(getEmailKey(email, emailSubjectEnum.FORGOT_PASSWORD)),
  ]);

  await deleteCacheValue([...result[0], ...result[1]]);
}

//////////////////////////
export async function login(data) {
  const { email, password } = data;
  const user = await findOneDoc({ model: userModel, filter: { email } });

  if (!user) {
    throw unauthorizedException({ errMsg: "Invalid email or password" });
  }

  if (!user.confirmEmail) {
    throw unauthorizedException();
  }

  const isMatch = await compareValue(password, user.password);
  if (!isMatch) {
    throw unauthorizedException({ errMsg: "Invalid email or password" });
  }

  return createLoginTokens({ user });
}

/////////////////////////////////
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client();
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
}

export async function signupOrLoginWithGoogle(idToken) {
  const result = await verify(idToken);

  if (!result.email_verified) {
    throw unauthorizedException();
  }

  const user = findOneDoc({
    model: userModel,
    filter: { email: result.email },
  });
  if (user) {
    if (user.provider === userProviderEnum.SYSTEM) {
      throw badRequestException({ errmsg: "you need to login using password" });
    }
    if (user.provider === userProviderEnum.GOOGLE) {
      return { statusCode: 200, tokens: createLoginTokens({ user }) };
    }
  }

  const [newUser] = await createDoc({
    model: userModel,
    insertData: {
      username: `${result.given_name} ${result.family_name}`,
      email: result.email,
      provider: userProviderEnum.GOOGLE,
      confirmEmail: true,
    },
  });

  return { statusCode: 201, tokens: createLoginTokens({ newUser }) };
}
