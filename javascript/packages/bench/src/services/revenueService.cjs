/** Revenue roll-up and the registry-wide metric sweep. */

const { AbstractService } = require("../support/abstractService.cjs");

/** Revenue roll-up and the registry-wide metric sweep. */
class RevenueService extends AbstractService {
    /** Service name, used as the audit actor. */
    static NAME = "revenue";

    constructor() {
        super(RevenueService.NAME);
    }

    /**
     * Invoiced revenue in cents.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    totalCents(data) {
        return data.revenueCents();
    }

    /**
     * Compute every registered metric.
     *
     * The registry is required lazily, inside the method: the module graph
     * would otherwise close a cycle through `../index.cjs`, which requires
     * every metric before this file is ready.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {Array<[string, number]>}
     */
    metricSweep(data) {
        const { METRICS } = require("../index.cjs");

        return METRICS.map((metric) => [metric.key, metric.compute(data)]);
    }
}

module.exports = { RevenueService };
