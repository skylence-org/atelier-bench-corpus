/** The contract behind the container binding. */

import type { Money } from "../money";
import type { RepairOrder } from "../models/repairOrder";

/**
 * Total-price strategy. Two implementations live in `../services`; the
 * container decides which one an order sees.
 */
export interface InvoiceCalculator {
    /** Strategy name, used in report footers and logs. */
    readonly name: string;

    /** Does this strategy apply a priority surcharge at all? */
    readonly appliesSurcharge: boolean;

    /** Total payable for `order`, surcharges included. */
    calculate(order: RepairOrder): Money;
}
