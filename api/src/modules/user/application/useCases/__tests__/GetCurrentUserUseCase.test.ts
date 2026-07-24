import { describe, it, expect, beforeEach, vi, type Mocked } from "vitest";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { GetCurrentUserUseCase } from "../GetCurrentUserUseCase";
import { NotFoundError } from "@/shared/errors";

describe("GetCurrentUserUseCase", () => {
  let useCase: GetCurrentUserUseCase;
  let mockUserRepository: Mocked<IUserRepository>;

  const mockUser = {
    id: "user-123",
    name: "Test User",
    email: "test@example.com",
    password: "hashed_password",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    useCase = new GetCurrentUserUseCase(mockUserRepository);
  });

  it("should return the user without password when found", async () => {
    mockUserRepository.findById.mockResolvedValue(mockUser);

    const result = await useCase.execute("user-123");

    expect(mockUserRepository.findById).toHaveBeenCalledWith("user-123");
    expect(result).toEqual({
      id: "user-123",
      name: "Test User",
      email: "test@example.com",
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    });
    expect((result as any).password).toBeUndefined();
  });

  it("should throw NotFoundError when user does not exist", async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(
      NotFoundError,
    );
    await expect(useCase.execute("non-existent-id")).rejects.toThrow(
      "User not found",
    );
  });
});
