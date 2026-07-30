import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { GetUserProfileUseCase } from "../GetUserProfileUseCase";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { NotFoundError } from "@/shared/errors/NotFoundError";

describe("GetUserProfileUseCase", () => {
  let getUserProfileUseCase: GetUserProfileUseCase;
  let mockUserRepository: Mocked<IUserRepository>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    getUserProfileUseCase = new GetUserProfileUseCase(mockUserRepository);
  });

  it("should return the user when found", async () => {
    const userId = "user-id-123";
    const user = {
      id: userId,
      name: "Test User",
      email: "test@example.com",
      password: "hashed_password",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    mockUserRepository.findById.mockResolvedValue(user);

    const result = await getUserProfileUseCase.execute(userId);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(result).toEqual(user);
  });

  it("should throw NotFoundError when user is not found", async () => {
    const userId = "non-existent-id";

    mockUserRepository.findById.mockResolvedValue(null);

    await expect(getUserProfileUseCase.execute(userId)).rejects.toThrow(
      NotFoundError,
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
  });
});
