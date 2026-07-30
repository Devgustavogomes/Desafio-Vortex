import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { NotFoundError } from "@/shared/errors/NotFoundError";

export class DeleteUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    await this.repository.delete(userId);
  }
}
