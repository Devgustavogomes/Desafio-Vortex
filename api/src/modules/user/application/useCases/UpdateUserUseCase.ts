import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UpdateUserInput } from "../dtos/UserDTOs";
import { NotFoundError } from "@/shared/errors/NotFoundError";
import { ConflictError } from "@/shared/errors/ConflictError";
import bcrypt from "bcryptjs";

export class UpdateUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(userId: string, input: UpdateUserInput): Promise<User> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (input.name !== undefined) {
      user.changeName(input.name);
    }

    if (input.email !== undefined) {
      const existingUser = await this.repository.findByEmail(input.email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictError("Email already in use");
      }
      user.changeEmail(input.email);
    }

    if (input.password !== undefined) {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      user.changePassword(hashedPassword);
    }

    const updated = await this.repository.update(userId, user);

    if (!updated) {
      throw new NotFoundError("User not found after update");
    }

    return updated;
  }
}
