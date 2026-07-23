import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { IRefreshTokenRepository } from "../../../domain/repositories/IRefreshTokenRepository";
import { TokenService } from "../../services/TokenService";
import { UnauthorizedError } from "../../../../../shared/errors/UnauthorizedError";
import { RefreshTokenUseCase } from "../RefreshTokenUseCase";

describe("RefreshTokenUseCase", () => {
  let refreshTokenUseCase: RefreshTokenUseCase;
  let mockRefreshTokenRepository: Mocked<IRefreshTokenRepository>;
  let mockTokenService: Mocked<TokenService>;

  beforeEach(() => {
    mockRefreshTokenRepository = {
      save: vi.fn(),
      find: vi.fn(),
      delete: vi.fn(),
    };

    mockTokenService = {
      generateAccessToken: vi.fn(),
      generateRefreshToken: vi.fn(),
      verifyAccessToken: vi.fn(),
      verifyRefreshToken: vi.fn(),
    };

    refreshTokenUseCase = new RefreshTokenUseCase(
      mockRefreshTokenRepository,
      mockTokenService,
    );
  });

  it("should refresh tokens successfully", async () => {
    const oldToken = "old_refresh_token";
    const userId = "1";

    mockRefreshTokenRepository.find.mockResolvedValue(userId);
    mockTokenService.verifyRefreshToken.mockReturnValue({ userId });
    mockTokenService.generateAccessToken.mockReturnValue("new_access_token");
    mockTokenService.generateRefreshToken.mockReturnValue("new_refresh_token");
    mockRefreshTokenRepository.delete.mockResolvedValue();
    mockRefreshTokenRepository.save.mockResolvedValue();

    const result = await refreshTokenUseCase.execute({
      refreshToken: oldToken,
    });

    expect(mockRefreshTokenRepository.find).toHaveBeenCalledWith(oldToken);
    expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(oldToken);
    expect(mockRefreshTokenRepository.delete).toHaveBeenCalledWith(oldToken);
    expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith(userId);
    expect(mockTokenService.generateRefreshToken).toHaveBeenCalledWith(userId);
    expect(mockRefreshTokenRepository.save).toHaveBeenCalled();

    expect(result).toEqual({
      accessToken: "new_access_token",
      refreshToken: "new_refresh_token",
    });
  });

  it("should throw UnauthorizedError if token not found in repository", async () => {
    const oldToken = "invalid_refresh_token";
    mockRefreshTokenRepository.find.mockResolvedValue(null);

    await expect(
      refreshTokenUseCase.execute({ refreshToken: oldToken }),
    ).rejects.toThrow(UnauthorizedError);
    expect(mockTokenService.verifyRefreshToken).not.toHaveBeenCalled();
  });

  it("should throw UnauthorizedError if token verification fails", async () => {
    const oldToken = "expired_refresh_token";
    const userId = "1";

    mockRefreshTokenRepository.find.mockResolvedValue(userId);
    mockTokenService.verifyRefreshToken.mockImplementation(() => {
      throw new Error("jwt expired");
    });

    await expect(
      refreshTokenUseCase.execute({ refreshToken: oldToken }),
    ).rejects.toThrow(UnauthorizedError);
    expect(mockRefreshTokenRepository.delete).not.toHaveBeenCalled();
  });
});
