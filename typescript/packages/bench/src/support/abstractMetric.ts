/** Base shared by all 16 metrics. */

import { MetricUnit, type MetricContract } from "../contracts/metricContract";
import type { Dataset } from "../dataset";
import type { HasLogging } from "../concerns/hasLogging";

export abstract class AbstractMetric implements MetricContract, HasLogging {
    protected constructor(
        readonly key: string,
        readonly unit: MetricUnit,
    ) {}

    abstract compute(data: Dataset): number;

    formatted(data: Dataset): string {
        return `${this.compute(data).toFixed(2)}${MetricUnit.suffix(this.unit)}`;
    }

    logTarget(): string {
        return this.key;
    }

    logLine(message: string): string {
        return `[${this.logTarget()}] ${message}`;
    }
}
