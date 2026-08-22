/**
 * A run of consecutive slots.
 *
 * Default export: this module exports no name at all, so the binding a
 * consumer writes is the consumer's choice and a lookup has to cross the
 * default edge to reach the declaration. The class also answers
 * `Symbol.toPrimitive`, so `${window}` and `+window` resolve to a method whose
 * key is a well-known symbol rather than an identifier.
 */

export default class SlotWindow {
    /**
     * @param {number} start
     * @param {number} length
     */
    constructor(start, length) {
        this.start = start;
        this.length = length;
    }

    /**
     * Symbol-keyed method: string coercion renders the closed range, numeric
     * coercion yields the slot count.
     *
     * @param {"number" | "string" | "default"} hint
     * @returns {number | string}
     */
    [Symbol.toPrimitive](hint) {
        return hint === "number" ? this.length : `${this.start}-${this.start + this.length - 1}`;
    }
}
