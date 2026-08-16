/**
 * Technician scheduling.
 *
 * A technician forwards to this class through a Proxy, so
 * `technician.nextSlot()` has no declaration on the technician side. See
 * `../concerns/forwardsToSchedule.js`.
 */

/**
 * Half-hour slot index inside a working day (0 == 08:00).
 *
 * @typedef {number} SlotIndex
 */

export class Schedule {
    /** Slots in a working day when no explicit capacity is given. */
    static DEFAULT_CAPACITY = 16;

    /** @type {Set<SlotIndex>} */
    #booked = new Set();

    /** @type {number} */
    #capacity;

    /** @param {number} [capacity] */
    constructor(capacity = Schedule.DEFAULT_CAPACITY) {
        this.#capacity = capacity;
    }

    /**
     * Slots this day can hold.
     *
     * @returns {number}
     */
    get capacity() {
        return this.#capacity;
    }

    /**
     * Shrinking the day never drops an already booked slot.
     *
     * @param {number} value
     */
    set capacity(value) {
        this.#capacity = Math.max(value, this.#booked.size);
    }

    /**
     * First free slot, or undefined when the day is full.
     *
     * @returns {SlotIndex | undefined}
     */
    nextSlot() {
        for (let slot = 0; slot < this.#capacity; slot += 1) {
            if (!this.#booked.has(slot)) {
                return slot;
            }
        }

        return undefined;
    }

    /**
     * Book `slot`; returns false when it was already taken or out of range.
     *
     * @param {SlotIndex} slot
     * @returns {boolean}
     */
    bookSlot(slot) {
        if (slot >= this.#capacity || this.#booked.has(slot)) {
            return false;
        }

        this.#booked.add(slot);

        return true;
    }

    /** @returns {number} */
    bookedCount() {
        return this.#booked.size;
    }
}
