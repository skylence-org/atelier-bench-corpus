/** Surcharging binding for {@link import("../contracts/invoiceCalculator").InvoiceCalculator}. */

import type { InvoiceCalculator } from "../contracts/invoiceCalculator";
import type { RepairOrder } from "../models/repairOrder";
import type { Money } from "../money";
import { Priority } from "../support/priority";
import { StandardInvoiceCalculator } from "./standardInvoiceCalculator";

/** Wraps the standard strategy and adds the priority surcharge on top. */
export class RushInvoiceCalculator implements InvoiceCalculator {
    /** Feature-flag key; mirrors a runtime flag lookup in the php lane. */
    static readonly FLAG = "rush-surcharge";

    readonly name = "rush";
    readonly appliesSurcharge = true;

    constructor(private readonly inner: StandardInvoiceCalculator = new StandardInvoiceCalculator()) {}

    calculate(order: RepairOrder): Money {
        const base = this.inner.calculate(order);
        if (!Priority.isBillable(order.priority)) {
            return base;
        }

        return base.withSurchargeBp(Priority.surchargeBp(order.priority));
    }
}
