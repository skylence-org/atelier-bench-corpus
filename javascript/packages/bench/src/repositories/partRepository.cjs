/** Read side over the part catalogue. */

/**
 * Read side over the part catalogue.
 *
 * Pins the generic storage contract to concrete types: `Id` is `number` and
 * `Rec` is `Part`.
 *
 * @type {import("@atelier/core/contracts/repository.js").Repository<number, import("@atelier/core").Part>}
 */
class PartRepository {
    /** @param {readonly import("@atelier/core").Part[]} [records] */
    constructor(records = []) {
        this.records = records;
    }

    /**
     * @param {number} id
     * @returns {import("@atelier/core").Part | undefined}
     */
    find(id) {
        return this.records.find((record) => record.id === id);
    }

    /** @returns {readonly import("@atelier/core").Part[]} */
    all() {
        return this.records;
    }

    /** @returns {number} */
    count() {
        return this.records.length;
    }

    /**
     * Catalogue lookup by stock-keeping unit.
     *
     * @param {string} sku
     * @returns {import("@atelier/core").Part | undefined}
     */
    bySku(sku) {
        return this.records.find((part) => part.sku === sku);
    }
}

module.exports = { PartRepository };
