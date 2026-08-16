/** Nothing is overbooked in the seed. */

/**
 * Nothing is overbooked in the seed.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class SlotOverbookingRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "slot-overbooking";

    constructor() {
        this.key = SlotOverbookingRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.technicians.every((technician) => technician.bookedCount() === 0);
    }
};
