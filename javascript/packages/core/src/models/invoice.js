/** Invoice issued for a completed order. */

import { Money } from "../money.js";

export class Invoice {
    /**
     * @param {number} id
     * @param {number} repairOrderId
     * @param {Money} total
     */
    constructor(id, repairOrderId, total) {
        this.id = id;
        this.repairOrderId = repairOrderId;
        this.total = total;
        this.paid = false;
    }

    /** @returns {boolean} */
    markPaid() {
        if (this.paid) {
            return false;
        }

        this.paid = true;

        return true;
    }

    /** @returns {Money} */
    outstanding() {
        return this.paid ? Money.ZERO : this.total;
    }
}
