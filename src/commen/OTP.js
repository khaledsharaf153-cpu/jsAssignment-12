import { randomInt } from "node:crypto";

export function createOTP() {
  return randomInt(100000, 999999);
}
