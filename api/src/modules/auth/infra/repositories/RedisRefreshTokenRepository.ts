import { IRefreshTokenRepository } from "../../domain/repositories/IRefreshTokenRepository";
import { redisClient } from "../../../../infra/database/redis";

export class RedisRefreshTokenRepository implements IRefreshTokenRepository {
  async save(userId: string, token: string, ttlSeconds: number): Promise<void> {
    await redisClient.setex(`refresh_token:${userId}`, ttlSeconds, token);
  }

  async find(userId: string): Promise<string | null> {
    return redisClient.get(`refresh_token:${userId}`);
  }

  async delete(userId: string): Promise<void> {
    await redisClient.del(`refresh_token:${userId}`);
  }
}
