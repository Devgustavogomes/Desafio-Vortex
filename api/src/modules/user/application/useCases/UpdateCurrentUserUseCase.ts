import bcrypt from "bcryptjs";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ConflictError, NotFoundError } from "@/shared/errors";
import { UpdateUserInput } from "../dtos/UserDTOs";

export class UpdateCurrentUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, data: UpdateUserInput) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updatePayload: UpdateUserInput = {};

    if (data.name !== undefined) {
      updatePayload.name = data.name;
    }

    if (data.email !== undefined && data.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictError("Email already in use");
      }
      updatePayload.email = data.email;
    }

    if (data.password !== undefined) {
      updatePayload.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await this.userRepository.update(userId, updatePayload);

    const { password, ...userWithoutPassword } = updatedUser!;
    return userWithoutPassword;
  }
}
