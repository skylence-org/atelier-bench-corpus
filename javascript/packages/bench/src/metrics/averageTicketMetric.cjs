/** Mean invoiced value per order. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Mean invoiced value per order. */
class AverageTicketMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "average-ticket";

    constructor() {
        super(AverageTicketMetric.KEY, MetricUnit.Cents);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        return data.orders.length === 0 ? 0 : data.revenueCents() / data.orders.length;
    }
}

module.exports = { AverageTicketMetric };
