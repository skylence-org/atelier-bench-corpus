/** Completed-order counting. */

import type { Dataset } from "../dataset";
import { AbstractService } from "../support/abstractService";

/** Completed-order counting. */
export class ThroughputService extends AbstractService {
    /** Service name, used as the audit actor. */
    static readonly NAME = "throughput";

    constructor() {
        super(ThroughputService.NAME);
    }

    /** Orders that reached a billable end state. */
    completed(data: Dataset): number {
        return data.completedOrders().length;
    }
}
