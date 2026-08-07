export class Price {
  private readonly cents: number;

  private constructor(value: number) {
    if (value < 0) {
      throw new Error("Price cannot be negative");
    }
    this.cents = Math.round(value * 100);
  }

  static fromFloat(value: number): Price {
    return new Price(value);
  }

  static fromCents(cents: number): Price {
    return new Price(cents / 100);
  }

  toCents(): number {
    return this.cents;
  }

  toFloat(): number {
    return this.cents / 100;
  }

  add(other: Price): Price {
    return Price.fromCents(this.cents + other.cents);
  }

  equals(other: Price): boolean {
    return this.cents === other.cents;
  }
}
