/** There is work to write notes about. */

/**
 * There is work to write notes about.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class NoteRequiredRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "note-required";

    constructor() {
        this.key = NoteRequiredRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.orders.length >= 1;
    }
};
