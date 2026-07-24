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

    mockTokenService.verifyRefreshToken.mockReturnValue({ userId } as any);
    mockRefreshTokenRepository.find.mockResolvedValue(oldToken);
    mockTokenService.generateAccessToken.mockReturnValue("new_access_token");
    mockTokenService.generateRefreshToken.mockReturnValue("new_refresh_token");
    mockRefreshTokenRepository.delete.mockResolvedValue();
    mockRefreshTokenRepository.save.mockResolvedValue();

    const result = await refreshTokenUseCase.execute({
      refreshToken: oldToken,
    });

    expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(oldToken);
    expect(mockRefreshTokenRepository.find).toHaveBeenCalledWith(userId);
    expect(mockRefreshTokenRepository.delete).toHaveBeenCalledWith(userId);
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
    const userId = "1";

    mockTokenService.verifyRefreshToken.mockReturnValue({ userId } as any);
    mockRefreshTokenRepository.find.mockResolvedValue(null);

    await expect(
      refreshTokenUseCase.execute({ refreshToken: oldToken }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("should throw UnauthorizedError if stored token does not match", async () => {
    const oldToken = "invalid_refresh_token";
    const userId = "1";

    mockTokenService.verifyRefreshToken.mockReturnValue({ userId } as any);
    mockRefreshTokenRepository.find.mockResolvedValue("different_token");

    await expect(
      refreshTokenUseCase.execute({ refreshToken: oldToken }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("should throw UnauthorizedError if token verification fails", async () => {
    const oldToken = "expired_refresh_token";

    mockTokenService.verifyRefreshToken.mockImplementation(() => {
      throw new Error("jwt expired");
    });

    await expect(
      refreshTokenUseCase.execute({ refreshToken: oldToken }),
    ).rejects.toThrow(UnauthorizedError);
    expect(mockRefreshTokenRepository.find).not.toHaveBeenCalled();
  });
});
