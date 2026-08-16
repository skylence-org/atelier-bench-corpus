/** Base shared by all 24 reports. */

import type { CacheableContract } from "../contracts/cacheableContract";
import type { ReportContract, ReportRow } from "../contracts/reportContract";
import type { Dataset } from "../dataset";
import { DEFAULT_CACHE_TTL_SECONDS, type HasCache } from "../concerns/hasCache";
import { AbstractComponent } from "./abstractComponent";

export abstract class AbstractReport
    extends AbstractComponent
    implements ReportContract, CacheableContract, HasCache
{
    static readonly DEFAULT_DECIMALS = 2;

    readonly decimals = AbstractReport.DEFAULT_DECIMALS;
    readonly cacheNamespace = "reports";

    /** Every subclass renders its own body; everything else is inherited. */
    abstract rows(data: Dataset): ReportRow[];

    total(data: Dataset): number {
        return this.rows(data).reduce((sum, row) => sum + row.value, 0);
    }

    isEmpty(data: Dataset): boolean {
        return this.rows(data).length === 0;
    }

    cacheKey(): string {
        return this.cacheKeyFor(this.slug);
    }

    cacheKeyFor(suffix: string): string {
        return `${this.cacheNamespace}:${suffix}`;
    }

    cacheTtl(): number {
        return DEFAULT_CACHE_TTL_SECONDS;
    }

    ttlSeconds(): number {
        return this.cacheTtl();
    }

    isCacheable(): boolean {
        return this.ttlSeconds() > 0;
    }
}
