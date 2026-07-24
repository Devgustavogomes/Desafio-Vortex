import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { NotFoundError } from "@/shared/errors";

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
