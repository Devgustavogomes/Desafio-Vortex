import { env } from "@/infra/config/env";
import { logger } from "@/infra/logger/logger";
import { connectDatabase } from "@/infra/database/database";
import { redisClient } from "@/infra/database/redis";
import { createApp } from "@/infra/http/app";

async function bootstrap() {
  await connectDatabase();
  logger.info("MongoDB conectado");

  logger.info(`Redis status: ${redisClient.status}`);

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Servidor rodando na porta ${env.PORT} [${env.NODE_ENV}]`);
  });

  async function shutdown(signal: string) {
    logger.warn(`⚠️ Sinal ${signal} recebido — encerrando graciosamente...`);

    server.close(async () => {
      logger.info("Servidor HTTP encerrado");
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err: unknown) => {
  logger.fatal({ err }, "❌ Falha crítica no bootstrap");
  process.exit(1);
});
