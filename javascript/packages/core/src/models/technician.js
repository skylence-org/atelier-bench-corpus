/** Bench technician. */

import { forwardsToSchedule } from "../concerns/forwardsToSchedule.js";
import { Schedule } from "../support/schedule.js";

/** Owner half: everything a technician declares itself. */
class TechnicianBase {
    /**
     * @param {number} id
     * @param {string} name
     * @param {Schedule} [schedule]
     */
    constructor(id, name, schedule = new Schedule()) {
        this.id = id;
        this.name = name;
        this.schedule = schedule;
    }

    /**
     * Load factor between 0 and 1 for the utilisation metric.
     *
     * @returns {number}
     */
    utilisation() {
        return this.schedule.capacity === 0 ? 0 : this.schedule.bookedCount() / this.schedule.capacity;
    }
}

/**
 * Build a technician whose unknown property reads forward to its Schedule, so
 * `technician.nextSlot()` has no declaration on the technician at all: it
 * resolves through the Proxy in `../concerns/forwardsToSchedule.js`.
 *
 * @param {number} id
 * @param {string} name
 * @param {Schedule} [schedule]
 * @returns {TechnicianBase}
 */
export function makeTechnician(id, name, schedule = new Schedule()) {
    return forwardsToSchedule(new TechnicianBase(id, name, schedule), schedule);
}

export { TechnicianBase };
