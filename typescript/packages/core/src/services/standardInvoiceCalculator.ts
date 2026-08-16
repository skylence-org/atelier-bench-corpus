/** Default binding for {@link import("../contracts/invoiceCalculator").InvoiceCalculator}. */

import type { InvoiceCalculator } from "../contracts/invoiceCalculator";
import type { RepairOrder } from "../models/repairOrder";
import { Money } from "../money";

/** Labour plus parts, no surcharge. */
export class StandardInvoiceCalculator implements InvoiceCalculator {
    /** Labour rate in cents per hour when none is configured. */
    static readonly DEFAULT_RATE_CENTS = 7500;

    readonly name = "standard";
    readonly appliesSurcharge = false;

    constructor(private readonly labourRateCentsPerHour: number = StandardInvoiceCalculator.DEFAULT_RATE_CENTS) {}

    calculate(order: RepairOrder): Money {
        return this.labour(order).plus(order.partsSubtotal());
    }

    private labour(order: RepairOrder): Money {
        return new Money(Math.floor((this.labourRateCentsPerHour * order.laborMinutes) / 60));
    }
}
