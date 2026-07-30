import { describe, it, expect } from "vitest";
import { User } from "../User";
import { ValidationError } from "@/shared/errors/ValidationError";

const makeUser = (overrides?: Partial<Parameters<typeof User.create>[0]>) =>
  User.create({
    name: "João Silva",
    email: "joao@example.com",
    password: "hashed-password-123",
    ...overrides,
  });

describe("User", () => {
  // ─── create ───────────────────────────────────────────────────────────────

  describe("create()", () => {
    it("gera um id automaticamente (não vazio)", () => {
      const user = makeUser();
      expect(user.id).toBeTruthy();
      expect(typeof user.id).toBe("string");
    });

    it("gera ids únicos para usuários diferentes", () => {
      const user1 = makeUser();
      const user2 = makeUser();
      expect(user1.id).not.toBe(user2.id);
    });

    it("define createdAt e updatedAt como Date", () => {
      const user = makeUser();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it("atribui corretamente todas as propriedades", () => {
      const user = User.create({
        name: "Maria Souza",
        email: "maria@example.com",
        password: "hashed-pw",
      });

      expect(user.name).toBe("Maria Souza");
      expect(user.email).toBe("maria@example.com");
      expect(user.password).toBe("hashed-pw");
    });
  });

  // ─── restore ──────────────────────────────────────────────────────────────

  describe("restore()", () => {
    it("reconstitui o usuário com todos os campos fornecidos", () => {
      const now = new Date("2024-01-01T00:00:00Z");
      const user = User.restore({
        id: "fixed-id-123",
        name: "Pedro Alves",
        email: "pedro@example.com",
        password: "hashed-pw-abc",
        createdAt: now,
        updatedAt: now,
      });

      expect(user.id).toBe("fixed-id-123");
      expect(user.name).toBe("Pedro Alves");
      expect(user.email).toBe("pedro@example.com");
      expect(user.password).toBe("hashed-pw-abc");
      expect(user.createdAt).toBe(now);
      expect(user.updatedAt).toBe(now);
    });
  });

  // ─── Setters ──────────────────────────────────────────────────────────────

  describe("setters", () => {
    it("atualiza o name via setter", () => {
      const user = makeUser();
      user.name = "Novo Nome";
      expect(user.name).toBe("Novo Nome");
    });

    it("atualiza o email via setter", () => {
      const user = makeUser();
      user.email = "novo@example.com";
      expect(user.email).toBe("novo@example.com");
    });

    it("atualiza o password via setter", () => {
      const user = makeUser();
      user.password = "new-hashed-pw";
      expect(user.password).toBe("new-hashed-pw");
    });
  });

  // ─── changeName() ─────────────────────────────────────────────────────────

  describe("changeName()", () => {
    it("atualiza o nome com valor válido", () => {
      const user = makeUser();
      user.changeName("Carlos Ferreira");
      expect(user.name).toBe("Carlos Ferreira");
    });

    it("faz trim no nome", () => {
      const user = makeUser();
      user.changeName("  Ana Lima  ");
      expect(user.name).toBe("Ana Lima");
    });

    it("atualiza updatedAt ao mudar nome", () => {
      const user = makeUser();
      const before = user.updatedAt;
      user.changeName("Novo Nome");
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });

    it("lança ValidationError se nome for vazio", () => {
      const user = makeUser();
      expect(() => user.changeName("")).toThrow(ValidationError);
    });

    it("lança ValidationError se nome for apenas espaços", () => {
      const user = makeUser();
      expect(() => user.changeName("   ")).toThrow(ValidationError);
    });
  });

  // ─── changeEmail() ────────────────────────────────────────────────────────

  describe("changeEmail()", () => {
    it("atualiza o email com valor válido", () => {
      const user = makeUser();
      user.changeEmail("novo@email.com");
      expect(user.email).toBe("novo@email.com");
    });

    it("atualiza updatedAt ao mudar email", () => {
      const user = makeUser();
      const before = user.updatedAt;
      user.changeEmail("atualizado@email.com");
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });

    it("lança ValidationError se email for vazio", () => {
      const user = makeUser();
      expect(() => user.changeEmail("")).toThrow(ValidationError);
    });
  });

  // ─── changePassword() ─────────────────────────────────────────────────────

  describe("changePassword()", () => {
    it("atualiza a senha com valor válido", () => {
      const user = makeUser();
      user.changePassword("new-hashed-password");
      expect(user.password).toBe("new-hashed-password");
    });

    it("atualiza updatedAt ao mudar senha", () => {
      const user = makeUser();
      const before = user.updatedAt;
      user.changePassword("new-hashed-password");
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });

    it("lança ValidationError se senha for vazia", () => {
      const user = makeUser();
      expect(() => user.changePassword("")).toThrow(ValidationError);
    });

    it("lança ValidationError se senha for apenas espaços", () => {
      const user = makeUser();
      expect(() => user.changePassword("   ")).toThrow(ValidationError);
    });
  });
});
