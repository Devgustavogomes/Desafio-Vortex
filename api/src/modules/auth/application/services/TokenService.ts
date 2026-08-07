import { env } from "@/infra/config/env";
import jwt from "jsonwebtoken";

export class TokenService {
  generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
      expiresIn: Number(env.JWT_ACCESS_EXPIRATION),
    });
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
      expiresIn: Number(env.JWT_REFRESH_EXPIRATION),
    });
  }

  verifyAccessToken(token: string): { userId: string } {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string };
  }

  verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
  }
}
