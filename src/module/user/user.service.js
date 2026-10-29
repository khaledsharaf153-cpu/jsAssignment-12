import {
  deleteCacheValue,
  getAllKeys,
  getUserRevokeTokenKeyPrefix,
} from "../../commen/cache/cache.service.js";
import { badRequestException } from "../../commen/exceptions/exceptions.js";
import { decryptValue } from "../../commen/security/encryption.js";
import {
  createLoginTokens,
  revokeToken,
} from "../../commen/security/tokens.js";
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from "../../config/config.js";

export async function rotateToken(payload) {
  const tokenExpiryDate = payload.iat + JWT_ACCESS_EXPIRES_IN;
  if (tokenExpiryDate > Date.now() / 1000) {
    throw badRequestException({ errMsg: "Old token still valid" });
  }

  const tokens = createLoginTokens({
    user: { id: payload.sub, role: payload.aud[0] },
    refreshTokenExpiresIn:
      JWT_REFRESH_EXPIRES_IN - Math.ceil(Date.now() / 1000 - payload.iat),
  });

  await revokeToken(payload);
  return tokens;
}

export function getUserProfile(user) {
  user = user.toObject();
  ["id", "_id", "password", "confirmEmail"].forEach((key) => delete user[key]);
  user.phoneNumber = decryptValue(user.phoneNumber);
  return user;
}

export async function logout(payload) {
  await revokeToken(payload);
}

export async function logoutAll(user, payload) {
  user.changeCredentialTime = Date.now();
  await user.save();
  const userKeys = await getAllKeys(getUserRevokeTokenKeyPrefix(payload));
  await deleteCacheValue(userKeys);
}

export async function uploadProfilePic(user, file) {
  user.profilePicPath = file.path;
  await user.save();
}
