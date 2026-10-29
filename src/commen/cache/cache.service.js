import { client } from "../../DB/redis.connection.js";

export async function setCacheValue(
  key,
  value,
  options = { expiration: { type: "EX", value: 100 } },
) {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }

  return await client.set(key, value, options);
}

export async function getCacheValue(key) {
  let result;
  try {
    result = await client.get(key);
    return JSON.parse(result);
  } catch (error) {
    return result;
  }
}

export async function ttl(key) {
  return await client.ttl(key);
}

export async function isExists(keys) {
  return await client.exists(keys);
}

export async function updateCacheValue(
  key,
  value,
  options = { expiration: { type: "EX", value: 100 } },
) {
  const isExists = await isExists(key);
  if (!isExists) {
    return 0;
  }
  return await setCacheValue(key, value, options);
}

export async function deleteCacheValue(keys) {
  return await client.del(keys);
}

export function getUserRevokeTokenKey(payload) {
  return `user: ${payload.sub} revokeToken: ${payload.jti}`;
}

export async function getAllKeys(prefix) {
  return await client.keys(`${prefix}*`);
}

export function getUserRevokeTokenKeyPrefix(payload) {
  return `user: ${payload.sub} revokeToken: `;
}

export function getEmailBaseKey(email) {
  return `user: ${email}`;
}

export function getEmailKey(email, subject) {
  return `${getEmailBaseKey(email)} ${subject}`;
}

export function getEmailTrialsKey(email, subject) {
  return `${getEmailBaseKey(email)} ${subject} trials`;
}

export function getEmailBanKey(email, subject) {
  return `${getEmailBaseKey(email)} ${subject} ban`;
}

export async function incrKey(key, value = 1) {
  return await client.incrBy(key, value);
}
