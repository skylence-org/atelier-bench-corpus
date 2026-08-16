/** Recurrence. */

/** How often a periodic component runs. */
export enum Cadence {
    Hourly = "hourly",
    Daily = "daily",
    Weekly = "weekly",
    Monthly = "monthly",
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Cadence {
    const SECONDS: Readonly<Record<Cadence, number>> = {
        [Cadence.Hourly]: 3600,
        [Cadence.Daily]: 86400,
        [Cadence.Weekly]: 604800,
        [Cadence.Monthly]: 2592000,
    };

    /** Nominal period length in seconds (a month is 30 days here). */
    export function seconds(cadence: Cadence): number {
        return SECONDS[cadence];
    }
}

/** Anything that runs on a cadence. */
export interface ScheduleContract {
    readonly cadence: Cadence;

    /** Next run instant, aligned to the cadence grid. */
    nextRunSeconds(now: number): number;
}
