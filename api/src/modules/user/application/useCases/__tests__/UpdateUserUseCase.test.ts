import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { UpdateUserUseCase } from "../UpdateUserUseCase";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { NotFoundError } from "@/shared/errors/NotFoundError";
import { ConflictError } from "@/shared/errors/ConflictError";
import bcrypt from "bcryptjs";

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
  },
}));

describe("UpdateUserUseCase", () => {
  let updateUserUseCase: UpdateUserUseCase;
  let mockUserRepository: Mocked<IUserRepository>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    updateUserUseCase = new UpdateUserUseCase(mockUserRepository);
  });

  const getMockUser = (id: string, email: string = "test@example.com") => {
    return {
      id,
      name: "Old Name",
      email,
      password: "hashed_password",
      createdAt: new Date(),
      updatedAt: new Date(),
      changeName: vi.fn(),
      changeEmail: vi.fn(),
      changePassword: vi.fn(),
    } as any;
  };

  it("should update user name successfully", async () => {
    const userId = "user-id-123";
    const mockUser = getMockUser(userId);
    const input = { name: "New Name" };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue(mockUser);

    const result = await updateUserUseCase.execute(userId, input);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUser.changeName).toHaveBeenCalledWith(input.name);
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, mockUser);
    expect(result).toEqual(mockUser);
  });

  it("should update user email successfully", async () => {
    const userId = "user-id-123";
    const mockUser = getMockUser(userId, "old@example.com");
    const input = { email: "new@example.com" };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.findByEmail.mockResolvedValue(null); 
    mockUserRepository.update.mockResolvedValue(mockUser);

    await updateUserUseCase.execute(userId, input);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockUser.changeEmail).toHaveBeenCalledWith(input.email);
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, mockUser);
  });

  it("should update user password successfully", async () => {
    const userId = "user-id-123";
    const mockUser = getMockUser(userId);
    const input = { password: "new_password" };
    const hashedPassword = "new_hashed_password";

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue(mockUser);
    (bcrypt.hash as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      hashedPassword,
    );

    await updateUserUseCase.execute(userId, input);

    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
    expect(mockUser.changePassword).toHaveBeenCalledWith(hashedPassword);
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, mockUser);
  });

  it("should throw NotFoundError if user does not exist", async () => {
    const userId = "non-existent";
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      updateUserUseCase.execute(userId, { name: "Test" }),
    ).rejects.toThrow(NotFoundError);
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it("should throw ConflictError if email is already in use by another user", async () => {
    const userId = "user-id-123";
    const mockUser = getMockUser(userId, "old@example.com");
    const input = { email: "new@example.com" };

    
    const otherUser = getMockUser("other-id", "new@example.com");

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.findByEmail.mockResolvedValue(otherUser);

    await expect(updateUserUseCase.execute(userId, input)).rejects.toThrow(
      ConflictError,
    );
    expect(mockUser.changeEmail).not.toHaveBeenCalled();
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it("should not throw ConflictError if email is the same as the user's own email", async () => {
    const userId = "user-id-123";
    const mockUser = getMockUser(userId, "old@example.com");
    const input = { email: "old@example.com" }; 

    mockUserRepository.findById.mockResolvedValue(mockUser);
    
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue(mockUser);

    await expect(
      updateUserUseCase.execute(userId, input),
    ).resolves.not.toThrow();
    expect(mockUser.changeEmail).toHaveBeenCalledWith(input.email);
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, mockUser);
  });

  it("should throw NotFoundError if repository update fails (returns null)", async () => {
    const userId = "user-id-123";
    const mockUser = getMockUser(userId);
    const input = { name: "New Name" };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue(null); 

    await expect(updateUserUseCase.execute(userId, input)).rejects.toThrow(
      NotFoundError,
    );
  });
});
