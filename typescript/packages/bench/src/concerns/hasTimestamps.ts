/** Created/updated stamps. */

import { addSeconds } from "date-fns";

export interface HasTimestamps {
    createdAt(): Date;
    updatedAt(): Date | undefined;
    ageSeconds(now: Date): number;
}

/** Wrapper that stamps any payload with a fixed creation instant. */
export class Stamped<T> implements HasTimestamps {
    /** Frozen epoch used across the corpus: 2026-07-16T08:00:00Z. */
    static readonly FROZEN_EPOCH_SECONDS = 1784188800;

    constructor(
        readonly payload: T,
        private readonly created: Date = new Date(Stamped.FROZEN_EPOCH_SECONDS * 1000),
    ) {}

    createdAt(): Date {
        return this.created;
    }

    updatedAt(): Date | undefined {
        return undefined;
    }

    /** Age against an explicit `now`, so tests stay deterministic. */
    ageSeconds(now: Date): number {
        return Math.floor((now.getTime() - this.created.getTime()) / 1000);
    }

    /** Instant this payload expires, `ttl` seconds after creation. */
    expiresAt(ttl: number): Date {
        return addSeconds(this.created, ttl);
    }
}
