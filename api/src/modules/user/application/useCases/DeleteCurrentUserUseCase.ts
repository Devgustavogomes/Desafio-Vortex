import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { NotFoundError } from "@/shared/errors";

export class DeleteCurrentUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    await this.userRepository.delete(userId);
  }
}
