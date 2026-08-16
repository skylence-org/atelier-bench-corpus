/** Read side over settled payments. */

/**
 * One settled payment.
 *
 * @typedef {object} Payment
 * @property {number} id
 * @property {number} invoiceId
 * @property {number} cents
 */
/**
 * Read side over settled payments.
 *
 * Pins the generic storage contract to concrete types: `Id` is `number` and
 * `Rec` is `Payment`.
 *
 * @type {import("@atelier/core/contracts/repository.js").Repository<number, Payment>}
 */
class PaymentRepository {
    /** @param {readonly Payment[]} [records] */
    constructor(records = []) {
        this.records = records;
    }

    /**
     * @param {number} id
     * @returns {Payment | undefined}
     */
    find(id) {
        return this.records.find((record) => record.id === id);
    }

    /** @returns {readonly Payment[]} */
    all() {
        return this.records;
    }

    /** @returns {number} */
    count() {
        return this.records.length;
    }

    /**
     * Total settled amount in cents.
     *
     * @returns {number}
     */
    settledCents() {
        return this.records.reduce((total, payment) => total + payment.cents, 0);
    }
}

module.exports = { PaymentRepository };
