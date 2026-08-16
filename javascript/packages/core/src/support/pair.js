/**
 * Sibling pair declared in one file.
 *
 * Import-precision edge: a consumer that needs only the failure branch imports
 * `Left` alone, and a tool must not report `Right` as imported with it.
 */

/** The failure branch of a two-sided result. */
export class Left {
    /**
     * @param {string} field
     * @param {string} reason
     */
    constructor(field, reason) {
        this.field = field;
        this.reason = reason;
    }

    /** @returns {boolean} */
    isLeft() {
        return true;
    }

    /**
     * @param {string} field
     * @param {string} reason
     * @returns {Left}
     */
    static of(field, reason) {
        return new Left(field, reason);
    }
}

/** The success branch of a two-sided result. */
export class Right {
    /** @param {unknown} value */
    constructor(value) {
        this.value = value;
    }

    /** @returns {boolean} */
    isLeft() {
        return false;
    }

    /**
     * @param {unknown} value
     * @returns {Right}
     */
    static of(value) {
        return new Right(value);
    }
}
