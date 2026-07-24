import { describe, it, expect, beforeEach, vi, type Mocked } from "vitest";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { DeleteCurrentUserUseCase } from "../DeleteCurrentUserUseCase";
import { NotFoundError } from "@/shared/errors";

describe("DeleteCurrentUserUseCase", () => {
  let useCase: DeleteCurrentUserUseCase;
  let mockUserRepository: Mocked<IUserRepository>;

  const existingUser = {
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

    useCase = new DeleteCurrentUserUseCase(mockUserRepository);
  });

  it("should delete the user successfully when found", async () => {
    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute("user-123")).resolves.toBeUndefined();

    expect(mockUserRepository.findById).toHaveBeenCalledWith("user-123");
    expect(mockUserRepository.delete).toHaveBeenCalledWith("user-123");
  });

  it("should throw NotFoundError when user does not exist", async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(
      NotFoundError,
    );
    await expect(useCase.execute("non-existent-id")).rejects.toThrow(
      "User not found",
    );
    expect(mockUserRepository.delete).not.toHaveBeenCalled();
  });
});
