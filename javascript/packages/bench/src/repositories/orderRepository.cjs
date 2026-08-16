/** Read side over repair orders. */

/**
 * Read side over repair orders.
 *
 * Pins the generic storage contract to concrete types: `Id` is `number` and
 * `Rec` is `RepairOrder`.
 *
 * @type {import("@atelier/core/contracts/repository.js").Repository<number, import("@atelier/core").RepairOrder>}
 */
class OrderRepository {
    /** @param {readonly import("@atelier/core").RepairOrder[]} [records] */
    constructor(records = []) {
        this.records = records;
    }

    /**
     * @param {number} id
     * @returns {import("@atelier/core").RepairOrder | undefined}
     */
    find(id) {
        return this.records.find((record) => record.id === id);
    }

    /** @returns {readonly import("@atelier/core").RepairOrder[]} */
    all() {
        return this.records;
    }

    /** @returns {number} */
    count() {
        return this.records.length;
    }

    /**
     * Orders still occupying bench space.
     *
     * @returns {readonly import("@atelier/core").RepairOrder[]}
     */
    open() {
        return this.records.filter((order) => order.isOpen());
    }
}

module.exports = { OrderRepository };
