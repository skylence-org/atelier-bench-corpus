/** At least one device is on the bench. */

/**
 * At least one device is on the bench.
 *
 * Nominal half of the rule registry: the module is the class itself, so the
 * implementor has a name a tool can report.
 */
module.exports = class DeviceAgeRule {
    /** Registry key, kebab-case without the Rule suffix. */
    static KEY = "device-age";

    constructor() {
        this.key = DeviceAgeRule.KEY;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    evaluate(data) {
        return data.devices.length >= 1;
    }
};
