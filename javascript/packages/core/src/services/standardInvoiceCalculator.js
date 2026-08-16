/**
 * Default binding for the invoice-calculator contract.
 *
 * @type {import("../contracts/invoiceCalculator.js").InvoiceCalculator}
 */

import { Money } from "../money.js";

/** Labour plus parts, no surcharge. */
export class StandardInvoiceCalculator {
    /** Labour rate in cents per hour when none is configured. */
    static DEFAULT_RATE_CENTS = 7500;

    /** @param {number} [labourRateCentsPerHour] */
    constructor(labourRateCentsPerHour = StandardInvoiceCalculator.DEFAULT_RATE_CENTS) {
        this.name = "standard";
        this.appliesSurcharge = false;
        this.labourRateCentsPerHour = labourRateCentsPerHour;
    }

    /**
     * @param {import("../models/repairOrder.js").RepairOrder} order
     * @returns {Money}
     */
    calculate(order) {
        return this.labour(order).plus(order.partsSubtotal());
    }

    /**
     * @param {import("../models/repairOrder.js").RepairOrder} order
     * @returns {Money}
     */
    labour(order) {
        return new Money(Math.floor((this.labourRateCentsPerHour * order.laborMinutes) / 60));
    }
}
