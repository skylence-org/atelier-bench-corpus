/**
 * Reporting-side formatter.
 *
 * Shadow pair: `../billing/formatter` exports a class with the same name but an
 * unrelated method set.
 */

import { RepairStatus } from "../support/status";

/** Formats lifecycle state for the customer-facing report. */
export class Formatter {
    constructor(private readonly locale = "en") {}

    /** One-line status sentence, with an optional "since" suffix. */
    statusLine(status: RepairStatus, since?: string): string {
        const label = RepairStatus.label(status);

        return since === undefined ? label : `${label} since ${since}`;
    }

    /** Locale tag echoed into the report footer. */
    localeTag(): string {
        return this.locale;
    }
}
