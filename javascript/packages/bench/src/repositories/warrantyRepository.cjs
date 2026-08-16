/** Read side over warranty claims. */

/**
 * One warranty claim.
 *
 * @typedef {object} WarrantyClaim
 * @property {number} id
 * @property {number} repairOrderId
 * @property {boolean} settled
 */
/**
 * Read side over warranty claims.
 *
 * Pins the generic storage contract to concrete types: `Id` is `number` and
 * `Rec` is `WarrantyClaim`.
 *
 * @type {import("@atelier/core/contracts/repository.js").Repository<number, WarrantyClaim>}
 */
class WarrantyRepository {
    /** @param {readonly WarrantyClaim[]} [records] */
    constructor(records = []) {
        this.records = records;
    }

    /**
     * @param {number} id
     * @returns {WarrantyClaim | undefined}
     */
    find(id) {
        return this.records.find((record) => record.id === id);
    }

    /** @returns {readonly WarrantyClaim[]} */
    all() {
        return this.records;
    }

    /** @returns {number} */
    count() {
        return this.records.length;
    }

    /**
     * Claims still awaiting a decision.
     *
     * @returns {readonly WarrantyClaim[]}
     */
    pending() {
        return this.records.filter((claim) => !claim.settled);
    }
}

module.exports = { WarrantyRepository };
