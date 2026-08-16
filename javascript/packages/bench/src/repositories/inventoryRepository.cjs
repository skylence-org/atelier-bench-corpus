/** Read side over stock movements. */

/**
 * One stock movement.
 *
 * @typedef {object} StockMovement
 * @property {number} id
 * @property {string} sku
 * @property {number} delta
 */
/**
 * Read side over stock movements.
 *
 * Pins the generic storage contract to concrete types: `Id` is `number` and
 * `Rec` is `StockMovement`.
 *
 * @type {import("@atelier/core/contracts/repository.js").Repository<number, StockMovement>}
 */
class InventoryRepository {
    /** @param {readonly StockMovement[]} [records] */
    constructor(records = []) {
        this.records = records;
    }

    /**
     * @param {number} id
     * @returns {StockMovement | undefined}
     */
    find(id) {
        return this.records.find((record) => record.id === id);
    }

    /** @returns {readonly StockMovement[]} */
    all() {
        return this.records;
    }

    /** @returns {number} */
    count() {
        return this.records.length;
    }

    /**
     * Net movement for one sku.
     *
     * @param {string} sku
     * @returns {number}
     */
    netFor(sku) {
        return this.records
            .filter((movement) => movement.sku === sku)
            .reduce((total, movement) => total + movement.delta, 0);
    }
}

module.exports = { InventoryRepository };
