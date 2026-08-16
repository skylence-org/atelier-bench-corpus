/**
 * Surcharging binding for the invoice-calculator contract.
 *
 * @type {import("../contracts/invoiceCalculator.js").InvoiceCalculator}
 */

import { Priority } from "../support/priority.js";
import { StandardInvoiceCalculator } from "./standardInvoiceCalculator.js";

/** Wraps the standard strategy and adds the priority surcharge on top. */
export class RushInvoiceCalculator {
    /** Feature-flag key; mirrors a runtime flag lookup in the php lane. */
    static FLAG = "rush-surcharge";

    /** @param {StandardInvoiceCalculator} [inner] */
    constructor(inner = new StandardInvoiceCalculator()) {
        this.name = "rush";
        this.appliesSurcharge = true;
        this.inner = inner;
    }

    /**
     * @param {import("../models/repairOrder.js").RepairOrder} order
     * @returns {import("../money.js").Money}
     */
    calculate(order) {
        const base = this.inner.calculate(order);
        if (!Priority.isBillable(order.priority)) {
            return base;
        }

        return base.withSurchargeBp(Priority.surchargeBp(order.priority));
    }
}
