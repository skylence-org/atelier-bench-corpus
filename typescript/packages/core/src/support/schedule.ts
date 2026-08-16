/**
 * Technician scheduling.
 *
 * {@link import("../models/technician").Technician} forwards to this class
 * through a Proxy, so `technician.nextSlot()` has no declaration on Technician.
 */

/** Half-hour slot index inside a working day (0 == 08:00). */
export type SlotIndex = number;

export class Schedule {
    /** Slots in a working day when no explicit capacity is given. */
    static readonly DEFAULT_CAPACITY = 16;

    readonly #booked = new Set<SlotIndex>();

    constructor(readonly capacity: SlotIndex = Schedule.DEFAULT_CAPACITY) {}

    /** First free slot, or undefined when the day is full. */
    nextSlot(): SlotIndex | undefined {
        for (let slot = 0; slot < this.capacity; slot += 1) {
            if (!this.#booked.has(slot)) {
                return slot;
            }
        }

        return undefined;
    }

    /** Book `slot`; returns false when it was already taken or out of range. */
    bookSlot(slot: SlotIndex): boolean {
        if (slot >= this.capacity || this.#booked.has(slot)) {
            return false;
        }

        this.#booked.add(slot);

        return true;
    }

    bookedCount(): number {
        return this.#booked.size;
    }
}
