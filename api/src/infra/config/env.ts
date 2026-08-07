import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI é obrigatório"),
  REDIS_URL: z.string().min(1, "REDIS_URL é obrigatório"),
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET é obrigatório"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET é obrigatório"),
  JWT_ACCESS_EXPIRATION: z.string().default("900"),
  JWT_REFRESH_EXPIRATION: z.string().default("604800"),
  CORS_ORIGIN: z.string().default("*"),
});

export type Env = z.infer<typeof envSchema>;

export function createEnv(rawEnv: NodeJS.ProcessEnv): Env {
  const parsed = envSchema.safeParse(rawEnv);

  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `❌ Variáveis de ambiente inválidas ou ausentes:\n${missing}`,
    );
  }

  return parsed.data;
}

export const env: Env = createEnv(process.env);
