import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { DeleteUserUseCase } from "../DeleteUserUseCase";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { NotFoundError } from "@/shared/errors/NotFoundError";

describe("DeleteUserUseCase", () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let mockUserRepository: Mocked<IUserRepository>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    deleteUserUseCase = new DeleteUserUseCase(mockUserRepository);
  });

  it("should delete the user successfully when found", async () => {
    const userId = "user-id-123";
    const user = { id: userId } as any;

    mockUserRepository.findById.mockResolvedValue(user);
    mockUserRepository.delete.mockResolvedValue();

    await deleteUserUseCase.execute(userId);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
  });

  it("should throw NotFoundError when user is not found", async () => {
    const userId = "non-existent-id";

    mockUserRepository.findById.mockResolvedValue(null);

    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(
      NotFoundError,
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.delete).not.toHaveBeenCalled();
  });
});
