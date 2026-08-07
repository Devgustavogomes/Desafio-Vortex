import { User } from "../entities/User";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, user: User): Promise<User | null>;
  delete(id: string): Promise<void>;
}
