/** Customers at risk of leaving. */

const { AbstractService } = require("../support/abstractService.cjs");

/** Customers at risk of leaving. */
class ChurnRiskService extends AbstractService {
    /** Service name, used as the audit actor. */
    static NAME = "churn-risk";

    constructor() {
        super(ChurnRiskService.NAME);
    }

    /**
     * Customers with no open order at all.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number[]}
     */
    atRisk(data) {
        return data.customers
            .filter((customer) => data.ordersFor(customer.id).every((order) => !order.isOpen()))
            .map((customer) => customer.id);
    }
}

module.exports = { ChurnRiskService };
