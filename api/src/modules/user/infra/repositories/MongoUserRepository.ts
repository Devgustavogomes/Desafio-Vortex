import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserModel } from "../database/models/UserModel";

export class MongoUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).lean();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).lean();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async create(
    data: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    const doc = await UserModel.create(data);
    return this.mapToDomain(doc.toObject());
  }

  async update(
    id: string,
    data: Partial<Pick<User, "name" | "email" | "password">>,
  ): Promise<User | null> {
    const doc = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  private mapToDomain(doc: any): User {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
