/** Every technician still has a free slot. */

/**
 * Every technician still has a free slot.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class ScheduleGapRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "schedule-gap";

    constructor() {
        this.key = ScheduleGapRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.technicians.every((technician) => technician.nextSlot() !== undefined);
    }
};
