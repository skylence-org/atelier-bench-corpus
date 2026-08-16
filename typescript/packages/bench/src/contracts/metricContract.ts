/** Single-number contract. */

import type { Dataset } from "../dataset";

/** What a metric's number means. */
export enum MetricUnit {
    Count = "count",
    Cents = "cents",
    Percent = "percent",
    Days = "days",
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MetricUnit {
    const SUFFIXES: Readonly<Record<MetricUnit, string>> = {
        [MetricUnit.Count]: "",
        [MetricUnit.Cents]: " c",
        [MetricUnit.Percent]: "%",
        [MetricUnit.Days]: " d",
    };

    export function suffix(unit: MetricUnit): string {
        return SUFFIXES[unit];
    }
}

/** One scalar computed over the whole dataset. */
export interface MetricContract {
    /** Registry key, unique across the lane. */
    readonly key: string;

    readonly unit: MetricUnit;

    /** The number itself. */
    compute(data: Dataset): number;

    /** Display form with the unit suffix appended. */
    formatted(data: Dataset): string;
}
