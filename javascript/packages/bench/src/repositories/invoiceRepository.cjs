/** Read side over invoices. */

/**
 * Read side over invoices.
 *
 * Pins the generic storage contract to concrete types: `Id` is `number` and
 * `Rec` is `Invoice`.
 *
 * @type {import("@atelier/core/contracts/repository.js").Repository<number, import("@atelier/core").Invoice>}
 */
class InvoiceRepository {
    /** @param {readonly import("@atelier/core").Invoice[]} [records] */
    constructor(records = []) {
        this.records = records;
    }

    /**
     * @param {number} id
     * @returns {import("@atelier/core").Invoice | undefined}
     */
    find(id) {
        return this.records.find((record) => record.id === id);
    }

    /** @returns {readonly import("@atelier/core").Invoice[]} */
    all() {
        return this.records;
    }

    /** @returns {number} */
    count() {
        return this.records.length;
    }

    /**
     * Invoices still carrying a balance.
     *
     * @returns {readonly import("@atelier/core").Invoice[]}
     */
    unpaid() {
        return this.records.filter((invoice) => !invoice.paid);
    }
}

module.exports = { InvoiceRepository };
