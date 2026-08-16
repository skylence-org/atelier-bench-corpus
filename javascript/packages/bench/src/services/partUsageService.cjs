/** Catalogue consumption. */

const { AbstractService } = require("../support/abstractService.cjs");

/** Catalogue consumption. */
class PartUsageService extends AbstractService {
    /** Service name, used as the audit actor. */
    static NAME = "part-usage";

    constructor() {
        super(PartUsageService.NAME);
    }

    /**
     * Units consumed across the whole catalogue.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    consumedUnits(data) {
        return data.parts.reduce((total, part) => total + part.consumedQuantity(), 0);
    }
}

module.exports = { PartUsageService };
