/** Settlement lag. */

const { AbstractService } = require("../support/abstractService.cjs");

/** Settlement lag. */
class PaymentLatencyService extends AbstractService {
    /** Service name, used as the audit actor. */
    static NAME = "payment-latency";

    constructor() {
        super(PaymentLatencyService.NAME);
    }

    /**
     * Nominal days of lag on the unsettled pile.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    days(data) {
        return data.invoices.filter((invoice) => !invoice.paid).length * 3.5;
    }
}

module.exports = { PaymentLatencyService };
