import { describe, it, expect, beforeEach, vi, type Mocked } from "vitest";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { NotFoundError, ConflictError } from "@/shared/errors";
import { UpdateCurrentUserUseCase } from "../UpdateCurrentUserUseCase";
import bcrypt from "bcryptjs";

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
  },
}));

describe("UpdateCurrentUserUseCase", () => {
  let useCase: UpdateCurrentUserUseCase;
  let mockUserRepository: Mocked<IUserRepository>;

  const existingUser = {
    id: "user-123",
    name: "Original Name",
    email: "original@example.com",
    password: "hashed_password",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  const updatedUser = {
    ...existingUser,
    updatedAt: new Date("2024-06-01"),
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

    useCase = new UpdateCurrentUserUseCase(mockUserRepository);
  });

  it("should update the user name successfully", async () => {
    const newUser = { ...updatedUser, name: "New Name" };
    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.update.mockResolvedValue(newUser);

    const result = await useCase.execute("user-123", { name: "New Name" });

    expect(mockUserRepository.findById).toHaveBeenCalledWith("user-123");
    expect(mockUserRepository.update).toHaveBeenCalledWith("user-123", {
      name: "New Name",
    });
    expect(result.name).toBe("New Name");
    expect((result as any).password).toBeUndefined();
  });

  it("should hash the password before updating when password is provided", async () => {
    const newUser = { ...updatedUser, password: "new_hashed_password" };
    mockUserRepository.findById.mockResolvedValue(existingUser);
    (bcrypt.hash as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      "new_hashed_password",
    );
    mockUserRepository.update.mockResolvedValue(newUser);

    await useCase.execute("user-123", { password: "newpassword123" });

    expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 10);
    expect(mockUserRepository.update).toHaveBeenCalledWith("user-123", {
      password: "new_hashed_password",
    });
  });

  it("should update the email when the new email is not taken", async () => {
    const newUser = { ...updatedUser, email: "new@example.com" };
    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.update.mockResolvedValue(newUser);

    const result = await useCase.execute("user-123", {
      email: "new@example.com",
    });

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      "new@example.com",
    );
    expect(result.email).toBe("new@example.com");
  });

  it("should throw NotFoundError when user does not exist", async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute("non-existent-id", { name: "New Name" }),
    ).rejects.toThrow(NotFoundError);
    await expect(
      useCase.execute("non-existent-id", { name: "New Name" }),
    ).rejects.toThrow("User not found");
  });

  it("should throw ConflictError when email is already taken by another user", async () => {
    const otherUser = {
      id: "other-user-999",
      name: "Other User",
      email: "taken@example.com",
      password: "hashed",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.findByEmail.mockResolvedValue(otherUser);

    await expect(
      useCase.execute("user-123", { email: "taken@example.com" }),
    ).rejects.toThrow(ConflictError);
    await expect(
      useCase.execute("user-123", { email: "taken@example.com" }),
    ).rejects.toThrow("Email already in use");

    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it("should not check email uniqueness if the email is the same as the current one", async () => {
    const sameEmailUser = {
      ...updatedUser,
      email: "original@example.com",
      name: "Updated Name",
    };
    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.update.mockResolvedValue(sameEmailUser);

    await useCase.execute("user-123", { email: "original@example.com" });

    expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
  });

  it("should return user without password after update", async () => {
    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.update.mockResolvedValue(updatedUser);

    const result = await useCase.execute("user-123", { name: "New Name" });

    expect((result as any).password).toBeUndefined();
  });
});
