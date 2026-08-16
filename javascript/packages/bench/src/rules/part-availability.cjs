/** The catalogue holds the four seeded parts. */

/**
 * The catalogue holds the four seeded parts.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class PartAvailabilityRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "part-availability";

    constructor() {
        this.key = PartAvailabilityRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.parts.length >= 4;
    }
};
