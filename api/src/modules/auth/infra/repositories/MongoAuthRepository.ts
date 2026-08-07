import { randomUUID } from "crypto";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { AuthUser } from "../../domain/entities/AuthUser";
import { UserModel, IUserDocument } from "@/modules/user/infra/models/UserModel";

export class MongoAuthRepository implements IAuthRepository {
  private toDomain(doc: IUserDocument): AuthUser {
    return {
      id: doc._id,
      name: doc.name,
      email: doc.email,
      password: doc.password,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthUser> {
    const doc = await UserModel.create({
      _id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
    });
    return this.toDomain(doc);
  }
}
