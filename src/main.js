import express from "express";
import { PORT } from "./config/config.js";
import { GlobalErrorHandler } from "./middleware/errorHandler.middleware.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import { testDBConnection } from "./DB/db.connection.js";
import { authRouter } from "./module/auth/auth.controller.js";
import { userRouter } from "./module/user/user.controller.js";
import { messageRouter } from "./module/message/message.controller.js";

async function bootstrap() {
  const server = express();
  await testDBConnection();
  server.use(express.json());
  server.use("/assets", express.static("./assets"));
  server.use("/auth", authRouter);
  server.use("/user", userRouter);
  server.use("/message", messageRouter);

  server.use("{/*dummy}", notFoundMiddleware);
  server.use(GlobalErrorHandler);
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap();
