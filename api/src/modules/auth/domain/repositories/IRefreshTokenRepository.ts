export interface IRefreshTokenRepository {
  save(userId: string, token: string, ttlSeconds: number): Promise<void>;
  find(userId: string): Promise<string | null>;
  delete(userId: string): Promise<void>;
}
