/** Read side over customers. */

/**
 * Read side over customers.
 *
 * Pins the generic storage contract to concrete types: `Id` is `number` and
 * `Rec` is `Customer`.
 *
 * @type {import("@atelier/core/contracts/repository.js").Repository<number, import("@atelier/core").Customer>}
 */
class CustomerRepository {
    /** @param {readonly import("@atelier/core").Customer[]} [records] */
    constructor(records = []) {
        this.records = records;
    }

    /**
     * @param {number} id
     * @returns {import("@atelier/core").Customer | undefined}
     */
    find(id) {
        return this.records.find((record) => record.id === id);
    }

    /** @returns {readonly import("@atelier/core").Customer[]} */
    all() {
        return this.records;
    }

    /** @returns {number} */
    count() {
        return this.records.length;
    }

    /**
     * Customers reachable by phone or email.
     *
     * @returns {readonly import("@atelier/core").Customer[]}
     */
    reachable() {
        return this.records.filter((customer) => customer.isReachable());
    }
}

module.exports = { CustomerRepository };
