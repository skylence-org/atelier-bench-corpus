/**
 * Recurrence.
 *
 * The third parent of `CompositeContract`, mixed in the same way as
 * `cacheableContract`.
 */

/**
 * How often a periodic component runs.
 *
 * @typedef {"hourly" | "daily" | "weekly" | "monthly"} CadenceValue
 */

/**
 * @typedef {object} ScheduleContract
 * @property {CadenceValue} cadence
 * @property {(now: number) => number} nextRunSeconds Next run instant, aligned to the cadence grid.
 */

/** @type {Readonly<Record<string, number>>} */
const SECONDS = Object.freeze({
    hourly: 3600,
    daily: 86400,
    weekly: 604800,
    monthly: 2592000,
});

const Cadence = Object.freeze({
    Hourly: /** @type {CadenceValue} */ ("hourly"),
    Daily: /** @type {CadenceValue} */ ("daily"),
    Weekly: /** @type {CadenceValue} */ ("weekly"),
    Monthly: /** @type {CadenceValue} */ ("monthly"),

    /**
     * Nominal period length in seconds (a month is 30 days here).
     *
     * @param {CadenceValue} cadence
     * @returns {number}
     */
    seconds(cadence) {
        return SECONDS[cadence] ?? 0;
    },
});

/** @type {ScheduleContract} */
const scheduleContract = {
    cadence: Cadence.Daily,

    /**
     * @param {number} now
     * @returns {number}
     */
    nextRunSeconds(now) {
        const period = Cadence.seconds(this.cadence);

        return now - (now % period) + period;
    },
};

module.exports = { Cadence, scheduleContract };
