import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { IRefreshTokenRepository } from "../../../domain/repositories/IRefreshTokenRepository";
import { TokenService } from "../../services/TokenService";
import { UnauthorizedError } from "../../../../../shared/errors/UnauthorizedError";
import { LogoutUseCase } from "../LogoutUseCase";

describe("LogoutUseCase", () => {
  let logoutUseCase: LogoutUseCase;
  let mockRefreshTokenRepository: Mocked<IRefreshTokenRepository>;
  let mockTokenService: Mocked<TokenService>;

  beforeEach(() => {
    vi.clearAllMocks();
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

    logoutUseCase = new LogoutUseCase(
      mockRefreshTokenRepository,
      mockTokenService,
    );
  });

  it("should logout successfully with valid refresh token", async () => {
    const refreshToken = "valid_refresh_token";
    const userId = "1";

    mockTokenService.verifyRefreshToken.mockReturnValue({ userId } as any);
    mockRefreshTokenRepository.find.mockResolvedValue(refreshToken);
    mockRefreshTokenRepository.delete.mockResolvedValue();

    await expect(logoutUseCase.execute(refreshToken)).resolves.toBeUndefined();

    expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
    expect(mockRefreshTokenRepository.find).toHaveBeenCalledWith(userId);
    expect(mockRefreshTokenRepository.delete).toHaveBeenCalledWith(userId);
  });

  it("should throw UnauthorizedError if no token is provided", async () => {
    await expect(logoutUseCase.execute(undefined)).rejects.toThrow(UnauthorizedError);
    expect(mockTokenService.verifyRefreshToken).not.toHaveBeenCalled();
  });

  it("should throw UnauthorizedError if token verification fails", async () => {
    mockTokenService.verifyRefreshToken.mockImplementation(() => {
      throw new Error("jwt expired");
    });

    await expect(logoutUseCase.execute("expired_token")).rejects.toThrow(UnauthorizedError);
    expect(mockRefreshTokenRepository.find).not.toHaveBeenCalled();
  });

  it("should throw UnauthorizedError if token not found in repository", async () => {
    const refreshToken = "valid_token";
    const userId = "1";

    mockTokenService.verifyRefreshToken.mockReturnValue({ userId } as any);
    mockRefreshTokenRepository.find.mockResolvedValue(null);

    await expect(logoutUseCase.execute(refreshToken)).rejects.toThrow(UnauthorizedError);
    expect(mockRefreshTokenRepository.delete).not.toHaveBeenCalled();
  });

  it("should throw UnauthorizedError if stored token does not match", async () => {
    const refreshToken = "my_token";
    const userId = "1";

    mockTokenService.verifyRefreshToken.mockReturnValue({ userId } as any);
    mockRefreshTokenRepository.find.mockResolvedValue("different_token");

    await expect(logoutUseCase.execute(refreshToken)).rejects.toThrow(UnauthorizedError);
    expect(mockRefreshTokenRepository.delete).not.toHaveBeenCalled();
  });
});
