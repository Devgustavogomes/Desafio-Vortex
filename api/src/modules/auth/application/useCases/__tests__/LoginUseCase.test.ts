import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { IAuthRepository } from "../../../domain/repositories/IAuthRepository";
import { IRefreshTokenRepository } from "../../../domain/repositories/IRefreshTokenRepository";
import { TokenService } from "../../services/TokenService";
import { UnauthorizedError } from "../../../../../shared/errors/UnauthorizedError";
import bcrypt from "bcryptjs";
import { LoginUseCase } from "../LoginUseCase";

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}));

describe("LoginUseCase", () => {
  let loginUseCase: LoginUseCase;
  let mockAuthRepository: Mocked<IAuthRepository>;
  let mockRefreshTokenRepository: Mocked<IRefreshTokenRepository>;
  let mockTokenService: Mocked<TokenService>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthRepository = {
      findByEmail: vi.fn(),
      create: vi.fn(),
    };

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

    loginUseCase = new LoginUseCase(
      mockAuthRepository,
      mockRefreshTokenRepository,
      mockTokenService,
    );
  });

  it("should login successfully with correct credentials", async () => {
    const input = { email: "test@example.com", password: "password123" };
    const user = {
      id: "1",
      name: "Test",
      email: "test@example.com",
      password: "hashed_password",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockAuthRepository.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      true,
    );
    mockTokenService.generateAccessToken.mockReturnValue("access_token");
    mockTokenService.generateRefreshToken.mockReturnValue("refresh_token");
    mockRefreshTokenRepository.save.mockResolvedValue();

    const result = await loginUseCase.execute(input);

    expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(input.password, user.password);
    expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith(user.id);
    expect(mockTokenService.generateRefreshToken).toHaveBeenCalledWith(user.id);
    expect(mockRefreshTokenRepository.save).toHaveBeenCalled();
    expect(result).toEqual({
      user: {
        id: "1",
        name: "Test",
        email: "test@example.com",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken: "access_token",
      refreshToken: "refresh_token",
    });
    expect((result.user as any).password).toBeUndefined();
  });

  it("should throw UnauthorizedError if user not found", async () => {
    const input = { email: "test@example.com", password: "password123" };
    mockAuthRepository.findByEmail.mockResolvedValue(null);

    await expect(loginUseCase.execute(input)).rejects.toThrow(
      UnauthorizedError,
    );
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it("should throw UnauthorizedError if password does not match", async () => {
    const input = { email: "test@example.com", password: "wrongpassword" };
    const user = {
      id: "1",
      name: "Test",
      email: "test@example.com",
      password: "hashed_password",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockAuthRepository.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      false,
    );

    await expect(loginUseCase.execute(input)).rejects.toThrow(
      UnauthorizedError,
    );
    expect(mockTokenService.generateAccessToken).not.toHaveBeenCalled();
  });
});
