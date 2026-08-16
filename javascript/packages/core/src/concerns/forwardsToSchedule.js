/**
 * Proxy-based method forwarding.
 *
 * `technician.nextSlot()` has no textual declaration on the technician: this
 * Proxy forwards unknown property reads to the wrapped Schedule. The
 * JavaScript analogue of PHP `__call` and Rust `Deref`.
 */

/**
 * Wrap `owner` so any property it does not define is looked up on `schedule`.
 *
 * @template {object} T
 * @param {T} owner
 * @param {import("../support/schedule.js").Schedule} schedule
 * @returns {T}
 */
export function forwardsToSchedule(owner, schedule) {
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
    });
}
