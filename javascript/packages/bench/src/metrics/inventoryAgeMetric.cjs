/** Mean stock level, read as shelf age. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Mean stock level, read as shelf age. */
class InventoryAgeMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "inventory-age";

    constructor() {
        super(InventoryAgeMetric.KEY, MetricUnit.Days);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        const stock = data.parts.reduce((total, part) => total + part.stock, 0);

        return stock / Math.max(data.parts.length, 1);
    }
}

module.exports = { InventoryAgeMetric };
