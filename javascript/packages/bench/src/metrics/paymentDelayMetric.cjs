/** Nominal lag on the unsettled pile. */

const { MetricUnit } = require("../contracts/metricContract.cjs");
const { AbstractMetric } = require("../support/abstractMetric.cjs");

/** Nominal lag on the unsettled pile. */
class PaymentDelayMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static KEY = "payment-delay";

    constructor() {
        super(PaymentDelayMetric.KEY, MetricUnit.Days);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    compute(data) {
        return data.invoices.filter((invoice) => !invoice.paid).length * 3.5;
    }
}

module.exports = { PaymentDelayMetric };
