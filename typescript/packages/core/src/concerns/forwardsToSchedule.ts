/**
 * Proxy-based method forwarding.
 *
 * `technician.nextSlot()` has no textual declaration on Technician: this Proxy
 * forwards unknown property reads to the wrapped Schedule. The TypeScript
 * analogue of PHP `__call` and Rust `Deref`.
 */

import type { Schedule } from "../support/schedule";

/** Methods reachable on the owner once forwarding is installed. */
export type ScheduleForwarded = Pick<Schedule, "nextSlot" | "bookSlot" | "bookedCount">;

/**
 * Wrap `owner` so any property it does not define is looked up on `schedule`.
 */
export function forwardsToSchedule<T extends object>(owner: T, schedule: Schedule): T & ScheduleForwarded {
    return new Proxy(owner, {
        get(target, property, receiver) {
            if (Reflect.has(target, property)) {
                return Reflect.get(target, property, receiver);
            }

            const forwarded = Reflect.get(schedule, property, schedule);

            return typeof forwarded === "function" ? forwarded.bind(schedule) : forwarded;
        },
        has(target, property) {
            return Reflect.has(target, property) || Reflect.has(schedule, property);
        },
    }) as T & ScheduleForwarded;
}
