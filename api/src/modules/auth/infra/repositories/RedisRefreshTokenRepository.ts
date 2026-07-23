import { IRefreshTokenRepository } from "../../domain/repositories/IRefreshTokenRepository";
import { redisClient } from "../../../../infra/database/redis";

export class RedisRefreshTokenRepository implements IRefreshTokenRepository {
  async save(userId: string, token: string, ttlSeconds: number): Promise<void> {
    await redisClient.setex(`refresh_token:${token}`, ttlSeconds, userId);
  }

  async find(token: string): Promise<string | null> {
    return redisClient.get(`refresh_token:${token}`);
  }

  async delete(token: string): Promise<void> {
    await redisClient.del(`refresh_token:${token}`);
  }
}
