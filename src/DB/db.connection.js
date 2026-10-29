import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import mongoose from "mongoose";
import { URI } from "../config/config.js";
import { connectRedis } from "./redis.connection.js";

export async function testDBConnection() {
  try {
    await mongoose.connect(URI);
    await mongoose.syncIndexes();
    await connectRedis();
    console.log("DB connected");
  } catch (error) {
    console.log(error);
    console.log("DB connection failed");
  }
}
