/** Mean booked share across the bench. */

import { MetricUnit } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import { AbstractMetric } from "../support/abstractMetric";

/** Mean booked share across the bench. */
export class TechnicianUtilizationMetric extends AbstractMetric {
    /** Registry key, unique across the lane. */
    static readonly KEY = "technician-utilization";

    constructor() {
        super(TechnicianUtilizationMetric.KEY, MetricUnit.Percent);
    }

    override compute(data: Dataset): number {
        if (data.technicians.length === 0) {
            return 0;
        }

        const total = data.technicians.reduce((sum, technician) => sum + technician.utilisation(), 0);

        return total / data.technicians.length;
    }
}
