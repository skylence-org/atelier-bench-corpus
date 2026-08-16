/**
 * One `extends`, two `implements`: exercises CompositeContract (a three-parent
 * interface) alongside HasLogging without touching the ReportContract/
 * AbstractReport fan-out (that count is pinned by card-report-contract).
 */

import type { CompositeContract } from "../contracts/compositeContract";
import { reportRow, type ReportRow } from "../contracts/reportContract";
import { Cadence } from "../contracts/scheduleContract";
import type { HasLogging } from "../concerns/hasLogging";
import type { Dataset } from "../dataset";
import { AbstractComponent } from "./abstractComponent";

export class CompositeFixture extends AbstractComponent implements CompositeContract, HasLogging {
    readonly cadence = Cadence.Daily;

    constructor() {
        super("composite-fixture", "Composite fixture");
    }

    rows(data: Dataset): ReportRow[] {
        return [reportRow("orders", data.orders.length)];
    }

    total(data: Dataset): number {
        return this.rows(data).reduce((sum, row) => sum + row.value, 0);
    }

    isEmpty(data: Dataset): boolean {
        return this.rows(data).length === 0;
    }

    cacheKey(): string {
        return `composite:${this.slug}`;
    }

    ttlSeconds(): number {
        return 60;
    }

    isCacheable(): boolean {
        return true;
    }

    nextRunSeconds(now: number): number {
        const period = Cadence.seconds(this.cadence);

        return now - (now % period) + period;
    }
}
