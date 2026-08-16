/** Warranty intake. */

const { Priority } = require("@atelier/core");
const { AbstractService } = require("../support/abstractService.cjs");

/** Warranty intake. */
class WarrantyClaimService extends AbstractService {
    /** Service name, used as the audit actor. */
    static NAME = "warranty-claim";

    constructor() {
        super(WarrantyClaimService.NAME);
    }

    /**
     * Orders taken in under warranty.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    count(data) {
        return data.orders.filter((order) => order.priority === Priority.Warranty).length;
    }
}

module.exports = { WarrantyClaimService };
