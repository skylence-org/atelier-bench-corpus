/** Bench depth. */

const { AbstractService } = require("../support/abstractService.cjs");

/** Bench depth. */
class BacklogService extends AbstractService {
    /** Service name, used as the audit actor. */
    static NAME = "backlog";

    constructor() {
        super(BacklogService.NAME);
    }

    /**
     * How many orders are still on the bench.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    depth(data) {
        return data.openOrders().length;
    }
}

module.exports = { BacklogService };
