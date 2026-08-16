/**
 * Reporting-side formatter.
 *
 * Shadow pair: `../billing/formatter.js` exports a class with the same name but
 * an unrelated method set.
 */

import { RepairStatus } from "../support/status.js";

/** Formats lifecycle state for the customer-facing report. */
export class Formatter {
    /** @param {string} [locale] */
    constructor(locale = "en") {
        this.locale = locale;
    }

    /**
     * One-line status sentence, with an optional "since" suffix.
     *
     * @param {import("../support/status.js").RepairStatusValue} status
     * @param {string} [since]
     * @returns {string}
     */
    statusLine(status, since) {
        const label = RepairStatus.label(status);

        return since === undefined ? label : `${label} since ${since}`;
    }

    /**
     * Locale tag echoed into the report footer.
     *
     * @returns {string}
     */
    localeTag() {
        return this.locale;
    }
}
