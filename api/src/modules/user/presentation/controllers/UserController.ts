import type { Request, Response } from "express";
import { GetCurrentUserUseCase } from "../../application/useCases/GetCurrentUserUseCase";
import { UpdateCurrentUserUseCase } from "../../application/useCases/UpdateCurrentUserUseCase";
import { DeleteCurrentUserUseCase } from "../../application/useCases/DeleteCurrentUserUseCase";
import type { UpdateUserInput } from "../../application/dtos/UserDTOs";

export class UserController {
  constructor(
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly updateCurrentUserUseCase: UpdateCurrentUserUseCase,
    private readonly deleteCurrentUserUseCase: DeleteCurrentUserUseCase,
  ) {}

  getUser = async (req: Request, res: Response): Promise<void> => {
    const result = await this.getCurrentUserUseCase.execute(req.userId!);
    res.status(200).json(result);
  };

  updateUser = async (
    req: Request<{}, {}, UpdateUserInput>,
    res: Response,
  ): Promise<void> => {
    const result = await this.updateCurrentUserUseCase.execute(
      req.userId!,
      req.body,
    );
    res.status(200).json(result);
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    await this.deleteCurrentUserUseCase.execute(req.userId!);
    res.status(204).send();
  };
}
