import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "@/infra/config/env";
import { errorMiddleware } from "@/infra/http/middlewares/errorMiddleware";
import { authRouter } from "@/modules/auth/auth.module";
import { itemRouter } from "@/modules/items/items.module";
import { orderRouter } from "@/modules/orders/orders.module";
import { userRouter } from "@/modules/user/user.module";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(authRouter);
  app.use(itemRouter);
  app.use(orderRouter);
  app.use(userRouter);

  app.use(errorMiddleware);

  return app;
}
