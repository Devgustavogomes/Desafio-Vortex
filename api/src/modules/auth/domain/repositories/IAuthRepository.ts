import { AuthUser } from '../entities/AuthUser';

export interface IAuthRepository {
  findByEmail(email: string): Promise<AuthUser | null>;
  create(data: { name: string; email: string; password: string }): Promise<AuthUser>;
}
