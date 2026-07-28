import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "@/infra/config/env";
import { errorMiddleware } from "@/infra/http/middlewares/errorMiddleware";
import { authRouter } from "@/modules/auth/auth.module";
import { itemRouter } from "@/modules/items/items.module";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(authRouter);
  app.use(itemRouter);

  app.use(errorMiddleware);

  return app;
}
