import { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';
import { TokenService } from '../services/TokenService';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';

export class RefreshTokenUseCase {
  constructor(
    private refreshTokenRepository: IRefreshTokenRepository,
    private tokenService: TokenService
  ) {}

  async execute(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new UnauthorizedError('No refresh token provided');
    }

    let decoded;
    try {
      decoded = this.tokenService.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const { userId } = decoded;

    const storedToken = await this.refreshTokenRepository.find(userId);
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    await this.refreshTokenRepository.delete(userId);

    const newAccessToken = this.tokenService.generateAccessToken(userId);
    const newRefreshToken = this.tokenService.generateRefreshToken(userId);

    const ttlSeconds = 7 * 24 * 60 * 60; 
    await this.refreshTokenRepository.save(userId, newRefreshToken, ttlSeconds);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
