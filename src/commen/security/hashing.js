import { SALT_ROUNDS } from "../../config/config.js";
import { hash, compare } from "bcrypt";

export async function hashValue(value, saltRounds = SALT_ROUNDS) {
  if (typeof value !== "string") {
    value = String(value);
  }
  return await hash(value, saltRounds);
}

export async function compareValue(value, hashedValue) {
  return await compare(value, hashedValue);
}
