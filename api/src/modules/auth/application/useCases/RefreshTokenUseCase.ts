import { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';
import { TokenService } from '../services/TokenService';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { RefreshTokenInput } from '../dtos/AuthDTOs';

export class RefreshTokenUseCase {
  constructor(
    private refreshTokenRepository: IRefreshTokenRepository,
    private tokenService: TokenService
  ) {}

  async execute(input: RefreshTokenInput) {
    const userId = await this.refreshTokenRepository.find(input.refreshToken);
    if (!userId) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    try {
      this.tokenService.verifyRefreshToken(input.refreshToken);
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    await this.refreshTokenRepository.delete(input.refreshToken);

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
