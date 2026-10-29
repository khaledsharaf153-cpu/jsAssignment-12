import jwt from "jsonwebtoken";
import { userRoleEnum } from "../enum/user.enum.js";
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ADMIN_ACCESS_SIGNATURE,
  JWT_ADMIN_REFRESH_SIGNATURE,
  JWT_REFRESH_EXPIRES_IN,
  JWT_USER_ACCESS_SIGNATURE,
  JWT_USER_REFRESH_SIGNATURE,
} from "../../config/config.js";
import { tokenTypeEnum } from "../enum/token.enum.js";
import { findDocById } from "../../DB/repo.js";
import { userModel } from "../../DB/model/user.model.js";
import { randomUUID } from "node:crypto";
import {
  getUserRevokeTokenKey,
  setCacheValue,
} from "../cache/cache.service.js";

export function signToken({ payload = {}, signature, options }) {
  return jwt.sign(payload, signature, options);
}

export function verifyToken(token, signature) {
  return jwt.verify(token, signature);
}

export function decodeToken(token) {
  return jwt.decode(token);
}

function getTokensSignatures(userRole = userRoleEnum.USER) {
  let signatures = {};

  switch (userRole) {
    case userRoleEnum.USER:
      signatures.accessSignature = JWT_USER_ACCESS_SIGNATURE;
      signatures.refreshSignature = JWT_USER_REFRESH_SIGNATURE;
      break;
    case userRoleEnum.ADMIN:
      signatures.accessSignature = JWT_ADMIN_ACCESS_SIGNATURE;
      signatures.refreshSignature = JWT_ADMIN_REFRESH_SIGNATURE;
      break;

    default:
      break;
  }

  return signatures;
}

export function createLoginTokens({
  user,
  options,
  refreshTokenExpiresIn = JWT_REFRESH_EXPIRES_IN,
}) {
  const { accessSignature, refreshSignature } = getTokensSignatures(user.role);
  const jwtid = randomUUID();

  const accessToken = signToken({
    signature: accessSignature,
    options: {
      ...options,
      expiresIn: JWT_ACCESS_EXPIRES_IN,
      subject: user.id,
      audience: [user.role],
      jwtid,
    },
  });

  const refreshToken = signToken({
    signature: refreshSignature,
    options: {
      ...options,
      expiresIn: refreshTokenExpiresIn,
      subject: user.id,
      audience: [user.role],
      jwtid,
    },
  });

  return { accessToken, refreshToken };
}

export async function checkToken(token, tokenType) {
  const payload = decodeToken(token);
  const { accessSignature, refreshSignature } = getTokensSignatures(
    payload.aud[0],
  );

  verifyToken(
    token,
    tokenType === tokenTypeEnum.ACCESS ? accessSignature : refreshSignature,
  );

  const user = await findDocById({
    model: userModel,
    id: payload.sub,
    //projection: { password: 0, _id: 0, id: 0 },
  });

  if (!user) {
    throw UnauthorizedException("Invalid email or password");
  }

  return { user, payload };
}

export async function revokeToken(payload) {
  const tokenExpiryDate = payload.iat + JWT_REFRESH_EXPIRES_IN;

  await setCacheValue(getUserRevokeTokenKey(payload), payload.jti, {
    expiration: {
      type: "EX",
      value: Math.ceil(tokenExpiryDate - Date.now() / 1000),
    },
  });
}
