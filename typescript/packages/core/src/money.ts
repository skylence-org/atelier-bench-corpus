/** Integer-cent money value object. */

/** Amount in integer cents. Never a float: bench ground truth must be exact. */
export class Money {
    constructor(readonly cents: number) {}

    /** Apply a basis-point surcharge, rounding half away from zero. */
    withSurchargeBp(bp: number): Money {
        return new Money(this.cents + Math.floor((this.cents * bp + 5000) / 10000));
    }

    plus(other: Money): Money {
        return new Money(this.cents + other.cents);
    }

    minus(other: Money): Money {
        return new Money(this.cents - other.cents);
    }

    times(factor: number): Money {
        return new Money(this.cents * factor);
    }

    isZero(): boolean {
        return this.cents === 0;
    }

    /** `12.34` style rendering; the currency suffix is the formatter's job. */
    toString(): string {
        const sign = this.cents < 0 ? "-" : "";
        const abs = Math.abs(this.cents);

        return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
    }
}

/**
 * Class/namespace declaration merging: `Money.ZERO` and `new Money(1)` resolve
 * to two different declarations that share one name.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Money {
    export const ZERO = new Money(0);

    export function fromCents(cents: number): Money {
        return new Money(cents);
    }

    /** Parse `"12.34"`; throws on anything else. */
    export function parse(raw: string): Money {
        const trimmed = raw.trim();
        if (!/^-?\d+(\.\d{1,2})?$/.test(trimmed)) {
            throw new TypeError(`malformed money value ${JSON.stringify(raw)}`);
        }

        const [whole, fraction = "0"] = trimmed.split(".");

        return new Money(Number(whole) * 100 + Number(fraction.padEnd(2, "0")));
    }

    export function sum(amounts: readonly Money[]): Money {
        return amounts.reduce((total, amount) => total.plus(amount), ZERO);
    }
}
