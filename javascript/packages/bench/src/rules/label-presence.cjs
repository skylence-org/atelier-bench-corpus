/** Every part is labelled. */

/**
 * Every part is labelled.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class LabelPresenceRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "label-presence";

    constructor() {
        this.key = LabelPresenceRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.parts.every((part) => part.name.length > 0);
    }
};
