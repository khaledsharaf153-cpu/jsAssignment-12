import { createClient } from "redis";
import { REDIS_URI } from "../config/config.js";

export const client = createClient({ url: REDIS_URI });

export async function connectRedis() {
  try {
    await client.connect();
    console.log("Redis connected");
  } catch (error) {
    console.log("Redis connection failed");
    console.log(error);
  }
}
