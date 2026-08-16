/** Revenue roll-up and the registry-wide metric sweep. */

import type { Dataset } from "../dataset";
import { METRICS } from "../index";
import { AbstractService } from "../support/abstractService";

/** Revenue roll-up and the registry-wide metric sweep. */
export class RevenueService extends AbstractService {
    /** Service name, used as the audit actor. */
    static readonly NAME = "revenue";

    constructor() {
        super(RevenueService.NAME);
    }

    /** Invoiced revenue in cents. */
    totalCents(data: Dataset): number {
        return data.revenueCents();
    }

    /**
     * Compute every registered metric.
     *
     * The only call site that walks the whole metric registry, so it is also
     * the widest fan-out edge in the lane.
     */
    metricSweep(data: Dataset): Array<[string, number]> {
        return METRICS.map((metric) => [metric.key, metric.compute(data)]);
    }
}
