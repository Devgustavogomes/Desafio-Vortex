export interface IRefreshTokenRepository {
  save(userId: string, token: string, ttlSeconds: number): Promise<void>;
  find(token: string): Promise<string | null>;
  delete(token: string): Promise<void>;
}
