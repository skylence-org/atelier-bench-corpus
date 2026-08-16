/** The widest contract in the lane: two dozen implementors. */

import type { Dataset } from "../dataset";

/** One rendered row: a label, a numeric value and its exact cent amount. */
export interface ReportRow {
    readonly label: string;
    readonly value: number;
    readonly cents: number;
}

/** Row whose cent amount is derived from `value`. */
export function reportRow(label: string, value: number): ReportRow {
    return { label, value, cents: Math.round(value * 100) };
}

/** Row built straight from an exact cent amount. */
export function rowFromCents(label: string, cents: number): ReportRow {
    return { label, value: cents / 100, cents };
}

/** Anything that renders rows out of a {@link Dataset}. */
export interface ReportContract {
    /** Stable identifier used in URLs and the report registry. */
    readonly slug: string;

    /** Human title for the report header. */
    readonly title: string;

    /** The rendered body. */
    rows(data: Dataset): ReportRow[];

    /** Sum of every row value. */
    total(data: Dataset): number;

    isEmpty(data: Dataset): boolean;
}
