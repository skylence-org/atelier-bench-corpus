/** Repeat-business share. */

import type { Dataset } from "../dataset";
import { AbstractService } from "../support/abstractService";

/** Repeat-business share. */
export class CustomerRetentionService extends AbstractService {
    /** Service name, used as the audit actor. */
    static readonly NAME = "customer-retention";

    constructor() {
        super(CustomerRetentionService.NAME);
    }

    /** Share of customers with more than one order. */
    rate(data: Dataset): number {
        if (data.customers.length === 0) {
            return 0;
        }

        const repeat = data.customers.filter((customer) => data.ordersFor(customer.id).length > 1).length;

        return repeat / data.customers.length;
    }
}
