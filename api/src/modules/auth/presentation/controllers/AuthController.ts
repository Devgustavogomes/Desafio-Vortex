import { Request, Response, NextFunction } from "express";
import { RegisterUseCase } from "../../application/useCases/RegisterUseCase";
import { LoginUseCase } from "../../application/useCases/LoginUseCase";
import { RefreshTokenUseCase } from "../../application/useCases/RefreshTokenUseCase";
import { LogoutUseCase } from "../../application/useCases/LogoutUseCase";
import { env } from "@/infra/config/env";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, 
};

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private logoutUseCase: LogoutUseCase,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await this.registerUseCase.execute(req.body);
    const { refreshToken, ...bodyResult } = result;
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(201).json(bodyResult);
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await this.loginUseCase.execute(req.body);
    const { refreshToken, ...bodyResult } = result;
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(200).json(bodyResult);
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    const result = await this.refreshTokenUseCase.execute(refreshToken);
    const { refreshToken: newRefreshToken, ...bodyResult } = result;
    res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(200).json(bodyResult);
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    await this.logoutUseCase.execute(refreshToken);
    res.clearCookie("refreshToken", { path: "/" });
    res.status(204).send();
  };
}
