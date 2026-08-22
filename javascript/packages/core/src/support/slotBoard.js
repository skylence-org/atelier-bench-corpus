/**
 * Day board for one technician.
 *
 * Three declaration shapes live here, none of them a plain method: the method
 * key is a computed constant, `describe` is a class FIELD holding an arrow (an
 * own property of every instance, never on the prototype), and `load` is
 * installed after the class body with `Object.defineProperty`, so no method
 * syntax declares it anywhere.
 */

/** Method key: the name `refresh` exists only as this constant. */
export const BOARD_REFRESH = "refresh";

/**
 * Drop out-of-range slots and put the rest in order.
 *
 * @param {readonly number[]} slots
 * @param {number} capacity
 * @returns {number[]}
 */
function normalise(slots, capacity) {
    return [...slots].filter((slot) => slot >= 0 && slot < capacity).sort((a, b) => a - b);
}

/** One technician's booked slots for a single day. */
export class SlotBoard {
    /**
     * Own-property arrow, initialised before the constructor body runs. It
     * keeps `this` when handed to a callback, and a lookup on `board.describe`
     * lands on this field, not on any prototype method.
     *
     * @type {() => string}
     */
    describe = () => `${this.technicianName}: ${this.booked.length}/${this.capacity}`;

    /**
     * @param {string} technicianName
     * @param {number} capacity
     * @param {readonly number[]} [slots]
     */
    constructor(technicianName, capacity, slots = []) {
        this.technicianName = technicianName;
        this.capacity = capacity;
        /** @type {number[]} */
        this.booked = normalise(slots, capacity);
    }

    /**
     * Computed method name: the key is {@link BOARD_REFRESH}, so the
     * declaration carries no literal `refresh` token to match on.
     *
     * @param {readonly number[]} slots
     * @returns {SlotBoard}
     */
    [BOARD_REFRESH](slots) {
        this.booked = normalise(slots, this.capacity);

        return this;
    }
}

/**
 * Accessor installed on the prototype after the class body: `board.load`
 * resolves here and nowhere else.
 */
Object.defineProperty(SlotBoard.prototype, "load", {
    enumerable: false,
    /**
     * Share of the day already booked, rounded to two decimals.
     *
     * @this {SlotBoard}
     * @returns {number}
     */
    get() {
        return this.capacity === 0 ? 0 : Math.round((this.booked.length / this.capacity) * 100) / 100;
    },
});
