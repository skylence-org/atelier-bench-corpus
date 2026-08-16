/** Customers at risk of not returning. */

import type { Dataset } from "../dataset";
import { AbstractService } from "../support/abstractService";

/** Customers at risk of not returning. */
export class ChurnRiskService extends AbstractService {
    /** Service name, used as the audit actor. */
    static readonly NAME = "churn-risk";

    constructor() {
        super(ChurnRiskService.NAME);
    }

    /** Customers with no open order at all. */
    atRisk(data: Dataset): number[] {
        return data.customers
            .filter((customer) => data.ordersFor(customer.id).every((order) => !order.isOpen()))
            .map((customer) => customer.id);
    }
}
