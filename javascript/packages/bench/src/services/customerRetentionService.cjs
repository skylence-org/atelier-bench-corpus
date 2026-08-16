/** Return rate of the customer base. */

const { AbstractService } = require("../support/abstractService.cjs");

/** Return rate of the customer base. */
class CustomerRetentionService extends AbstractService {
    /** Service name, used as the audit actor. */
    static NAME = "customer-retention";

    constructor() {
        super(CustomerRetentionService.NAME);
    }

    /**
     * Share of customers with more than one order.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    rate(data) {
        if (data.customers.length === 0) {
            return 0;
        }

        const repeat = data.customers.filter((customer) => data.ordersFor(customer.id).length > 1).length;

        return repeat / data.customers.length;
    }
}

module.exports = { CustomerRetentionService };
