import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserModel, IUserDocument } from "../models/UserModel";

export class MongoUserRepository implements IUserRepository {
  private toDomain(doc: IUserDocument): User {
    return User.restore({
      id: doc._id,
      name: doc.name,
      email: doc.email,
      password: doc.password,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async update(id: string, user: User): Promise<User | null> {
    const doc = await UserModel.findByIdAndUpdate(
      id,
      {
        name: user.name,
        email: user.email,
        password: user.password,
      },
      { new: true },
    );
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }
}
