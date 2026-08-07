import { Request, Response } from "express";
import { GetUserProfileUseCase } from "../../application/useCases/GetUserProfileUseCase";
import { UpdateUserUseCase } from "../../application/useCases/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../application/useCases/DeleteUserUseCase";
import { User } from "../../domain/entities/User";

export class UserController {
  constructor(
    private getUserProfileUseCase: GetUserProfileUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
  ) {}

  private toResponse(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  getProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const user = await this.getUserProfileUseCase.execute(userId);
    res.status(200).json(this.toResponse(user));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const user = await this.updateUserUseCase.execute(userId, req.body);
    res.status(200).json(this.toResponse(user));
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    await this.deleteUserUseCase.execute(userId);
    res.status(204).send();
  };
}
