import { User } from "@/modules/user/domain/entities/User";
import { IUserRepository } from "@/modules/user/domain/repositories/IUserRepository";
import { NotFoundError } from "@/shared/errors/NotFoundError";

export class GetUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
}
