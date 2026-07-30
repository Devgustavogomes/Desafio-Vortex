import { describe, it, expect } from "vitest";
import { User } from "../User";
import { ValidationError } from "@/shared/errors/ValidationError";

describe("User Entity", () => {
  it("should create a new user correctly", () => {
    const props = {
      name: "Test User",
      email: "test@example.com",
      password: "hashed_password",
    };

    const user = User.create(props);

    expect(user.id).toBeDefined();
    expect(typeof user.id).toBe("string");
    expect(user.name).toBe(props.name);
    expect(user.email).toBe(props.email);
    expect(user.password).toBe(props.password);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
    expect(user.createdAt.getTime()).toBeLessThanOrEqual(user.updatedAt.getTime());
  });

  it("should restore an existing user correctly", () => {
    const date = new Date("2024-01-01T10:00:00Z");
    const props = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Restored User",
      email: "restored@example.com",
      password: "hashed_password",
      createdAt: date,
      updatedAt: date,
    };

    const user = User.restore(props);

    expect(user.id).toBe(props.id);
    expect(user.name).toBe(props.name);
    expect(user.email).toBe(props.email);
    expect(user.password).toBe(props.password);
    expect(user.createdAt).toBe(props.createdAt);
    expect(user.updatedAt).toBe(props.updatedAt);
  });

  describe("changeName", () => {
    it("should update name successfully", () => {
      const user = User.create({ name: "Old", email: "a@a.com", password: "p" });
      const oldUpdatedAt = user.updatedAt;

      user.changeName("New Name");

      expect(user.name).toBe("New Name");
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });

    it("should throw ValidationError if name is empty", () => {
      const user = User.create({ name: "Old", email: "a@a.com", password: "p" });
      expect(() => user.changeName("   ")).toThrow(ValidationError);
      expect(() => user.changeName("")).toThrow(ValidationError);
    });
  });

  describe("changeEmail", () => {
    it("should update email successfully", () => {
      const user = User.create({ name: "Name", email: "old@a.com", password: "p" });
      const oldUpdatedAt = user.updatedAt;

      user.changeEmail("new@a.com");

      expect(user.email).toBe("new@a.com");
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });

    it("should throw ValidationError if email is empty", () => {
      const user = User.create({ name: "Name", email: "old@a.com", password: "p" });
      expect(() => user.changeEmail("   ")).toThrow(ValidationError);
      expect(() => user.changeEmail("")).toThrow(ValidationError);
    });
  });

  describe("changePassword", () => {
    it("should update password successfully", () => {
      const user = User.create({ name: "Name", email: "a@a.com", password: "old" });
      const oldUpdatedAt = user.updatedAt;

      user.changePassword("new_hashed_password");

      expect(user.password).toBe("new_hashed_password");
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });

    it("should throw ValidationError if password is empty", () => {
      const user = User.create({ name: "Name", email: "a@a.com", password: "old" });
      expect(() => user.changePassword("   ")).toThrow(ValidationError);
      expect(() => user.changePassword("")).toThrow(ValidationError);
    });
  });
});
