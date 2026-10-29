import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: (process.env.NODE_ENV = "DEV"
    ? path.resolve(".env.dev")
    : path.resolve(".env.prod")),
});

export const PORT = Number(process.env.PORT);
export const URI = process.env.URI;
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
export const ENCRYPT_KEY = process.env.ENCRYPT_KEY;
export const JWT_USER_ACCESS_SIGNATURE = process.env.JWT_USER_ACCESS_SIGNATURE;
export const JWT_USER_REFRESH_SIGNATURE =
  process.env.JWT_USER_REFRESH_SIGNATURE;
export const JWT_ADMIN_ACCESS_SIGNATURE =
  process.env.JWT_ADMIN_ACCESS_SIGNATURE;
export const JWT_ADMIN_REFRESH_SIGNATURE =
  process.env.JWT_ADMIN_REFRESH_SIGNATURE;
export const JWT_ACCESS_EXPIRES_IN = Number(process.env.JWT_ACCESS_EXPIRES_IN);
export const JWT_REFRESH_EXPIRES_IN = Number(
  process.env.JWT_REFRESH_EXPIRES_IN,
);
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const REDIS_URI = process.env.REDIS_URI;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
