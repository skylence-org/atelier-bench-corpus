/** Intake volume. */

const { AbstractService } = require("../support/abstractService.cjs");

/** Intake volume. */
class OrderVolumeService extends AbstractService {
    /** Service name, used as the audit actor. */
    static NAME = "order-volume";

    constructor() {
        super(OrderVolumeService.NAME);
    }

    /**
     * Total orders taken in.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    total(data) {
        return data.orders.length;
    }

    /**
     * Orders taken in for one customer.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @param {number} customerId
     * @returns {number}
     */
    forCustomer(data, customerId) {
        return data.ordersFor(customerId).length;
    }
}

module.exports = { OrderVolumeService };
