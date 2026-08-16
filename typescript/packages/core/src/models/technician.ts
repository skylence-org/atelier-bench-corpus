/** Bench technician. */

import { forwardsToSchedule, type ScheduleForwarded } from "../concerns/forwardsToSchedule";
import { Schedule } from "../support/schedule";

class TechnicianBase {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly schedule: Schedule = new Schedule(),
    ) {}

    /** Load factor between 0 and 1 for the utilisation metric. */
    utilisation(): number {
        return this.schedule.capacity === 0 ? 0 : this.schedule.bookedCount() / this.schedule.capacity;
    }
}

export type Technician = TechnicianBase & ScheduleForwarded;

/**
 * Build a technician whose unknown property reads forward to its Schedule, so
 * `technician.nextSlot()` resolves through the Proxy in
 * `../concerns/forwardsToSchedule`.
 */
export function makeTechnician(id: number, name: string, schedule = new Schedule()): Technician {
    return forwardsToSchedule(new TechnicianBase(id, name, schedule), schedule);
}
