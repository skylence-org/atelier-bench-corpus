/** Intake counting. */

import type { Dataset } from "../dataset";
import { AbstractService } from "../support/abstractService";

/** Intake counting. */
export class OrderVolumeService extends AbstractService {
    /** Service name, used as the audit actor. */
    static readonly NAME = "order-volume";

    constructor() {
        super(OrderVolumeService.NAME);
    }

    /** Total orders taken in. */
    total(data: Dataset): number {
        return data.orders.length;
    }

    /** Orders taken in for one customer. */
    forCustomer(data: Dataset, customerId: number): number {
        return data.ordersFor(customerId).length;
    }
}
