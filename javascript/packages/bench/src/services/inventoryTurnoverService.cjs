/** Turnover per stock-keeping unit. */

const { AbstractService } = require("../support/abstractService.cjs");

/** Turnover per stock-keeping unit. */
class InventoryTurnoverService extends AbstractService {
    /** Service name, used as the audit actor. */
    static NAME = "inventory-turnover";

    constructor() {
        super(InventoryTurnoverService.NAME);
    }

    /**
     * Turnover for one sku, or undefined when the sku is unknown.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @param {string} sku
     * @returns {number | undefined}
     */
    forSku(data, sku) {
        const part = data.part(sku);
        if (part === undefined) {
            return undefined;
        }

        return part.stock === 0 ? 0 : part.consumedQuantity() / part.stock;
    }
}

module.exports = { InventoryTurnoverService };
