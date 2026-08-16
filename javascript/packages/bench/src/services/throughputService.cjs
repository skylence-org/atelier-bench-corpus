/** Completed work. */

const { AbstractService } = require("../support/abstractService.cjs");

/** Completed work. */
class ThroughputService extends AbstractService {
    /** Service name, used as the audit actor. */
    static NAME = "throughput";

    constructor() {
        super(ThroughputService.NAME);
    }

    /**
     * Orders that reached a billable end state.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    completed(data) {
        return data.completedOrders().length;
    }
}

module.exports = { ThroughputService };
