import { IUserRepository } from "../../../user/domain/repositories/IUserRepository";
import { IRefreshTokenRepository } from "../../domain/repositories/IRefreshTokenRepository";
import { TokenService } from "../services/TokenService";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import bcrypt from "bcryptjs";
import { LoginInput } from "../dtos/AuthDTOs";

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private tokenService: TokenService,
  ) {}

  async execute(input: LoginInput) {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const accessToken = this.tokenService.generateAccessToken(user.id);
    const refreshToken = this.tokenService.generateRefreshToken(user.id);

    const ttlSeconds = 7 * 24 * 60 * 60;
    await this.refreshTokenRepository.save(user.id, refreshToken, ttlSeconds);

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }
}
