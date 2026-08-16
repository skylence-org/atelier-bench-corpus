/** Open-order counting. */

import type { Dataset } from "../dataset";
import { AbstractService } from "../support/abstractService";

/** Open-order counting. */
export class BacklogService extends AbstractService {
    /** Service name, used as the audit actor. */
    static readonly NAME = "backlog";

    constructor() {
        super(BacklogService.NAME);
    }

    /** How many orders are still on the bench. */
    depth(data: Dataset): number {
        return data.openOrders().length;
    }
}
