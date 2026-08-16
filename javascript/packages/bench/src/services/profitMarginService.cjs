/** Margin over revenue. */

const { AbstractService } = require("../support/abstractService.cjs");

/** Margin over revenue. */
class ProfitMarginService extends AbstractService {
    /** Service name, used as the audit actor. */
    static NAME = "profit-margin";

    constructor() {
        super(ProfitMarginService.NAME);
    }

    /**
     * Margin as a share of revenue.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    ratio(data) {
        const revenue = data.revenueCents();

        return revenue === 0 ? 0 : (revenue - data.partsCostCents()) / revenue;
    }
}

module.exports = { ProfitMarginService };
