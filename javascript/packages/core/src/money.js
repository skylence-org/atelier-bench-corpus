/** Integer-cent money value object. */

/**
 * Amount in integer cents. Never a float: bench ground truth must be exact.
 *
 * The amount lives in a `#private` field, so `cents` is a getter and the only
 * way to set one is the constructor. `Money.ZERO` is built in a static
 * initialisation block, not in a field initialiser.
 */
export class Money {
    /** @type {number} */
    #cents;

    /**
     * Zero amount. Declared here, assigned in the static block below.
     *
     * @type {Money}
     */
    static ZERO;

    static {
        Money.ZERO = new Money(0);
    }

    /** @param {number} cents */
    constructor(cents) {
        this.#cents = cents;
    }

    /**
     * Exact amount in cents.
     *
     * @returns {number}
     */
    get cents() {
        return this.#cents;
    }

    /**
     * Whole-euro part, for the rare display that wants no fraction.
     *
     * @returns {number}
     */
    get euros() {
        return Math.trunc(this.#cents / 100);
    }

    /**
     * Apply a basis-point surcharge, rounding half away from zero.
     *
     * @param {number} bp
     * @returns {Money}
     */
    withSurchargeBp(bp) {
        return new Money(this.#cents + Math.floor((this.#cents * bp + 5000) / 10000));
    }

    /**
     * @param {Money} other
     * @returns {Money}
     */
    plus(other) {
        return new Money(this.#cents + other.cents);
    }

    /**
     * @param {Money} other
     * @returns {Money}
     */
    minus(other) {
        return new Money(this.#cents - other.cents);
    }

    /**
     * @param {number} factor
     * @returns {Money}
     */
    times(factor) {
        return new Money(this.#cents * factor);
    }

    /** @returns {boolean} */
    isZero() {
        return this.#cents === 0;
    }

    /**
     * `12.34` style rendering; the currency suffix is the formatter's job.
     *
     * @returns {string}
     */
    toString() {
        const sign = this.#cents < 0 ? "-" : "";
        const abs = Math.abs(this.#cents);

        return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
    }

    /**
     * @param {number} cents
     * @returns {Money}
     */
    static fromCents(cents) {
        return new Money(cents);
    }

    /**
     * Parse `"12.34"`; throws on anything else.
     *
     * @param {string} raw
     * @returns {Money}
     */
    static parse(raw) {
        const trimmed = raw.trim();
        if (!/^-?\d+(\.\d{1,2})?$/.test(trimmed)) {
            throw new TypeError(`malformed money value ${JSON.stringify(raw)}`);
        }

        const [whole, fraction = "0"] = trimmed.split(".");

        return new Money(Number(whole) * 100 + Number(fraction.padEnd(2, "0")));
    }

    /**
     * @param {readonly Money[]} amounts
     * @returns {Money}
     */
    static sum(amounts) {
        return amounts.reduce((total, amount) => total.plus(amount), Money.ZERO);
    }
}
