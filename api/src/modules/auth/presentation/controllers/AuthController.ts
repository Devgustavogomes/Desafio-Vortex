import { Request, Response, NextFunction } from "express";
import { RegisterUseCase } from "../../application/useCases/RegisterUseCase";
import { LoginUseCase } from "../../application/useCases/LoginUseCase";
import { RefreshTokenUseCase } from "../../application/useCases/RefreshTokenUseCase";

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const result = await this.registerUseCase.execute(req.body);
    res.status(201).json(result);
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const result = await this.loginUseCase.execute(req.body);
    res.status(200).json(result);
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    const result = await this.refreshTokenUseCase.execute(req.body);
    res.status(200).json(result);
  }
}
