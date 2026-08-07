import { describe, it, expect } from "vitest";
import { Price } from "../Price";

describe("Price", () => {
  describe("fromFloat (constructor via factory)", () => {
    it("converte float para centavos corretamente", () => {
      expect(Price.fromFloat(10.99).toCents()).toBe(1099);
    });

    it("converte valor inteiro corretamente", () => {
      expect(Price.fromFloat(10).toCents()).toBe(1000);
    });

    it("arredonda o valor para o centavo mais próximo", () => {
      expect(Price.fromFloat(0.005).toCents()).toBe(1);
    });

    it("aceita preço zero", () => {
      expect(Price.fromFloat(0).toCents()).toBe(0);
    });

    it("lança erro para preço negativo", () => {
      expect(() => Price.fromFloat(-1)).toThrow("Price cannot be negative");
    });
  });

  describe("fromCents", () => {
    it("cria Price a partir de centavos corretamente", () => {
      expect(Price.fromCents(1099).toFloat()).toBe(10.99);
    });

    it("cria Price com zero centavos", () => {
      expect(Price.fromCents(0).toCents()).toBe(0);
    });

    it("lança erro para centavos negativos", () => {
      expect(() => Price.fromCents(-1)).toThrow("Price cannot be negative");
    });
  });

  describe("toFloat", () => {
    it("retorna o valor em float", () => {
      expect(Price.fromFloat(10.99).toFloat()).toBe(10.99);
    });

    it("retorna zero para preço zero", () => {
      expect(Price.fromFloat(0).toFloat()).toBe(0);
    });
  });

  describe("add", () => {
    it("soma dois preços sem erro de ponto flutuante", () => {
      expect(Price.fromFloat(0.1).add(Price.fromFloat(0.2)).toFloat()).toBe(
        0.3,
      );
    });

    it("soma corretamente valores maiores", () => {
      expect(Price.fromFloat(10.99).add(Price.fromFloat(5.01)).toFloat()).toBe(
        16.0,
      );
    });

    it("soma com zero retorna o mesmo valor", () => {
      expect(Price.fromFloat(9.99).add(Price.fromFloat(0)).toFloat()).toBe(
        9.99,
      );
    });
  });

  describe("equals", () => {
    it("retorna true para preços iguais", () => {
      expect(Price.fromFloat(10.99).equals(Price.fromFloat(10.99))).toBe(true);
    });

    it("retorna false para preços diferentes", () => {
      expect(Price.fromFloat(10.99).equals(Price.fromFloat(11.0))).toBe(false);
    });

    it("Price criado via fromCents é igual ao criado via fromFloat", () => {
      expect(Price.fromCents(1099).equals(Price.fromFloat(10.99))).toBe(true);
    });
  });
});
