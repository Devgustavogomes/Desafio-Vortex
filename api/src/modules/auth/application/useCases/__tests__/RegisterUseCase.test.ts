import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { IUserRepository } from "../../../../user/domain/repositories/IUserRepository";
import { IRefreshTokenRepository } from "../../../domain/repositories/IRefreshTokenRepository";
import { TokenService } from "../../services/TokenService";
import { ConflictError } from "../../../../../shared/errors/ConflictError";
import bcrypt from "bcryptjs";
import { RegisterUseCase } from "../RegisterUseCase";

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
  },
}));

describe("RegisterUseCase", () => {
  let registerUseCase: RegisterUseCase;
  let mockUserRepository: Mocked<IUserRepository>;
  let mockRefreshTokenRepository: Mocked<IRefreshTokenRepository>;
  let mockTokenService: Mocked<TokenService>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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
    } as any;

    registerUseCase = new RegisterUseCase(
      mockUserRepository,
      mockRefreshTokenRepository,
      mockTokenService,
    );
  });

  it("should register a new user successfully", async () => {
    const input = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };
    const createdUser = {
      id: "1",
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    (bcrypt.hash as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      "hashed_password",
    );
    mockUserRepository.create.mockResolvedValue(createdUser);
    mockTokenService.generateAccessToken.mockReturnValue("access_token");
    mockTokenService.generateRefreshToken.mockReturnValue("refresh_token");
    mockRefreshTokenRepository.save.mockResolvedValue();

    const result = await registerUseCase.execute(input);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      name: input.name,
      email: input.email,
      password: "hashed_password",
    });
    expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith(
      createdUser.id,
    );
    expect(mockTokenService.generateRefreshToken).toHaveBeenCalledWith(
      createdUser.id,
    );
    expect(mockRefreshTokenRepository.save).toHaveBeenCalled();
    expect(result).toEqual({
      user: {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      },
      accessToken: "access_token",
      refreshToken: "refresh_token",
    });
    // Ensure password is not returned
    expect((result.user as any).password).toBeUndefined();
  });

  it("should throw ConflictError if email already exists", async () => {
    const input = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };
    mockUserRepository.findByEmail.mockResolvedValue({
      id: "1",
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(registerUseCase.execute(input)).rejects.toThrow(ConflictError);
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });
});
