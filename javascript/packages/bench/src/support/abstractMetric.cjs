/** Base shared by all 16 metrics. */

const { suffix } = require("../contracts/metricContract.cjs");
const { hasLogging } = require("../concerns/hasLogging.cjs");

class AbstractMetric {
    /**
     * @param {string} key
     * @param {import("../contracts/metricContract.cjs").MetricUnitValue} unit
     */
    constructor(key, unit) {
        this.key = key;
        this.unit = unit;
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        throw new TypeError(`${this.key} does not implement compute(${typeof data})`);
    }

    /**
     * Display form with the unit suffix appended.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {string}
     */
    formatted(data) {
        return `${this.compute(data).toFixed(2)}${suffix(this.unit)}`;
    }
}

Object.assign(AbstractMetric.prototype, hasLogging);

module.exports = { AbstractMetric };
