import { IUserRepository } from "../../../user/domain/repositories/IUserRepository";
import { IRefreshTokenRepository } from "../../domain/repositories/IRefreshTokenRepository";
import { TokenService } from "../services/TokenService";
import { ConflictError } from "../../../../shared/errors/ConflictError";
import bcrypt from "bcryptjs";
import { RegisterInput } from "../dtos/AuthDTOs";
export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private tokenService: TokenService,
  ) {}

  async execute(input: RegisterInput) {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

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
