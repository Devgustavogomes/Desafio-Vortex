import { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';
import { TokenService } from '../services/TokenService';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';

export class LogoutUseCase {
  constructor(
    private refreshTokenRepository: IRefreshTokenRepository,
    private tokenService: TokenService,
  ) {}

  async execute(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      throw new UnauthorizedError('No refresh token provided');
    }

    let decoded: { userId: string };
    try {
      decoded = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const { userId } = decoded;

    const storedToken = await this.refreshTokenRepository.find(userId);
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    await this.refreshTokenRepository.delete(userId);
  }
}
