import { describe, it, expect } from "vitest";
import { Item } from "../Item";
import { ItemType } from "../../enums/ItemType";
import { ItemStatus } from "../../enums/ItemStatus";
import { ItemCondition } from "../../enums/ItemCondition";
import { ItemCategory } from "../../enums/ItemCategory";
import { Price } from "@/shared/domain/valueObjects/Price";

const makeItem = (overrides?: Partial<Parameters<typeof Item.create>[0]>) =>
  Item.create({
    name: "Cadeira Gamer",
    description: "Cadeira ergonômica em ótimo estado",
    price: Price.fromFloat(350.0),
    type: ItemType.SALE,
    condition: ItemCondition.USED,
    category: ItemCategory.FURNITURE,
    owner: "user-abc-123",
    ...overrides,
  });

describe("Item", () => {
  // ─── create ───────────────────────────────────────────────────────────────

  describe("create()", () => {
    it("gera um id automaticamente (não vazio)", () => {
      const item = makeItem();
      expect(item.id).toBeTruthy();
      expect(typeof item.id).toBe("string");
    });

    it("gera ids únicos para itens diferentes", () => {
      const item1 = makeItem();
      const item2 = makeItem();
      expect(item1.id).not.toBe(item2.id);
    });

    it("define status inicial como 'available'", () => {
      const item = makeItem();
      expect(item.status).toBe(ItemStatus.AVAILABLE);
    });

    it("atribui corretamente todas as propriedades", () => {
      const price = Price.fromFloat(350.0);
      const item = Item.create({
        name: "Cadeira Gamer",
        description: "Cadeira ergonômica em ótimo estado",
        price,
        type: ItemType.SALE,
        condition: ItemCondition.USED,
        category: ItemCategory.FURNITURE,
        owner: "user-abc-123",
      });

      expect(item.name).toBe("Cadeira Gamer");
      expect(item.description).toBe("Cadeira ergonômica em ótimo estado");
      expect(item.price.toFloat()).toBe(350.0);
      expect(item.type).toBe(ItemType.SALE);
      expect(item.owner).toBe("user-abc-123");
    });

    it("aceita tipo donation", () => {
      const item = makeItem({ type: ItemType.DONATION });
      expect(item.type).toBe(ItemType.DONATION);
    });
  });

  // ─── restore ──────────────────────────────────────────────────────────────

  describe("restore()", () => {
    it("reconstitui o item com todos os campos fornecidos", () => {
      const price = Price.fromFloat(99.9);
      const item = Item.restore({
        id: "fixed-id-123",
        name: "Livro de TypeScript",
        description: "Livro seminovo",
        price,
        type: ItemType.SALE,
        status: ItemStatus.RESERVED,
        condition: ItemCondition.USED,
        category: ItemCategory.BOOKS,
        owner: "owner-xyz",
      });

      expect(item.id).toBe("fixed-id-123");
      expect(item.name).toBe("Livro de TypeScript");
      expect(item.description).toBe("Livro seminovo");
      expect(item.price.toFloat()).toBe(99.9);
      expect(item.type).toBe(ItemType.SALE);
      expect(item.status).toBe(ItemStatus.RESERVED);
      expect(item.owner).toBe("owner-xyz");
    });

    it("reconstitui corretamente com status selled", () => {
      const item = Item.restore({
        id: "id-abc",
        name: "Mochila",
        description: "Mochila usada",
        price: Price.fromFloat(80.0),
        type: ItemType.SALE,
        status: ItemStatus.SELLED,
        condition: ItemCondition.USED,
        category: ItemCategory.OTHER,
        owner: "owner-1",
      });

      expect(item.status).toBe(ItemStatus.SELLED);
    });
  });

  // ─── Setters ──────────────────────────────────────────────────────────────

  describe("setters", () => {
    it("atualiza o name", () => {
      const item = makeItem();
      item.name = "Novo Nome";
      expect(item.name).toBe("Novo Nome");
    });

    it("atualiza a description", () => {
      const item = makeItem();
      item.description = "Nova descrição";
      expect(item.description).toBe("Nova descrição");
    });

    it("atualiza o price", () => {
      const item = makeItem();
      item.price = Price.fromFloat(200.0);
      expect(item.price.toFloat()).toBe(200.0);
    });

    it("atualiza o type", () => {
      const item = makeItem();
      item.type = ItemType.DONATION;
      expect(item.type).toBe(ItemType.DONATION);
    });
  });

  // ─── reserve() ────────────────────────────────────────────────────────────

  describe("reserve()", () => {
    it("muda status de available para reserved", () => {
      const item = makeItem();
      item.reserve();
      expect(item.status).toBe(ItemStatus.RESERVED);
    });

    it("lança erro ao tentar reservar um item já reserved", () => {
      const item = makeItem();
      item.reserve();
      expect(() => item.reserve()).toThrow();
    });

    it("lança erro ao tentar reservar um item selled", () => {
      const item = Item.restore({
        id: "id-1",
        name: "Item",
        description: "desc",
        price: Price.fromFloat(10),
        type: ItemType.SALE,
        status: ItemStatus.SELLED,
        condition: ItemCondition.NEW,
        category: ItemCategory.OTHER,
        owner: "owner-1",
      });
      expect(() => item.reserve()).toThrow();
    });
  });

  // ─── sell() ───────────────────────────────────────────────────────────────

  describe("sell()", () => {
    it("muda status de reserved para selled", () => {
      const item = makeItem();
      item.reserve();
      item.sell();
      expect(item.status).toBe(ItemStatus.SELLED);
    });

    it("lança erro ao tentar vender um item available", () => {
      const item = makeItem();
      expect(() => item.sell()).toThrow();
    });

    it("lança erro ao tentar vender um item já selled", () => {
      const item = makeItem();
      item.reserve();
      item.sell();
      expect(() => item.sell()).toThrow();
    });
  });

  // ─── markAsAvailable() ────────────────────────────────────────────────────

  describe("markAsAvailable()", () => {
    it("muda status de reserved para available", () => {
      const item = makeItem();
      item.reserve();
      item.markAsAvailable();
      expect(item.status).toBe(ItemStatus.AVAILABLE);
    });

    it("lança erro ao tentar marcar como available um item já available", () => {
      const item = makeItem();
      expect(() => item.markAsAvailable()).toThrow();
    });

    it("lança erro ao tentar marcar como available um item selled", () => {
      const item = makeItem();
      item.reserve();
      item.sell();
      expect(() => item.markAsAvailable()).toThrow();
    });
  });
});
